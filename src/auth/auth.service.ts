import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { isValidObjectId, Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { RefreshToken } from './schemas/refresh-token.schema.js';

const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000;
const REFRESH_DAYS = 30;
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
// compared against when the email does not exist, so response time doesn't reveal it
const DUMMY_HASH = bcrypt.hashSync('dummy-password-1', 10);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    @InjectModel(RefreshToken.name) private readonly tokens: Model<RefreshToken>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    if (await this.users.exists({ email: dto.email })) throw new ConflictException('Email is already registered');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    try {
      const user = await this.users.create({ name: dto.name, email: dto.email, passwordHash, preferredLocale: dto.preferredLocale });
      return this.issueTokens(user);
    } catch (e: any) {
      if (e?.code === 11000) throw new ConflictException('Email is already registered'); // race on unique index
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ email: dto.email }).select('+passwordHash +failedLoginCount +lockedUntil');

    if (!user) {
      await bcrypt.compare(dto.password, DUMMY_HASH);
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new HttpException('Account temporarily locked. Try again later.', HttpStatus.LOCKED);
    }

    if (!(await bcrypt.compare(dto.password, user.passwordHash))) {
      const failed = user.failedLoginCount + 1;
      const lock = failed >= MAX_FAILED;
      await this.users.updateOne({ _id: user._id }, { failedLoginCount: lock ? 0 : failed, lockedUntil: lock ? new Date(Date.now() + LOCK_MS) : null });
      throw new UnauthorizedException('Invalid email or password'); // same message as unknown email
    }

    if (user.failedLoginCount || user.lockedUntil) await this.users.updateOne({ _id: user._id }, { failedLoginCount: 0, lockedUntil: null });
    return this.issueTokens(user);
  }

  /** Rotation: every refresh revokes the old token and returns a new pair. Re-use of a revoked token revokes all sessions. */
  async refresh(raw: string) {
    const [id, secret] = raw.split('.');
    const bad = new UnauthorizedException('Invalid refresh token');
    if (!id || !secret || !isValidObjectId(id)) throw bad;
    const row = await this.tokens.findById(id);
    if (!row) throw bad;

    const a = Buffer.from(sha256(secret)), b = Buffer.from(row.tokenHash);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw bad;

    if (row.revokedAt) { // stolen / replayed token
      await this.tokens.updateMany({ userId: row.userId, revokedAt: null }, { revokedAt: new Date() });
      throw bad;
    }
    if (row.expiresAt < new Date()) throw bad;

    const user = await this.users.findById(row.userId);
    if (!user) throw bad;
    await this.tokens.updateOne({ _id: row._id }, { revokedAt: new Date() });
    return this.issueTokens(user);
  }

  async logout(userId: string, raw: string) {
    const [id] = raw.split('.');
    if (!id || !isValidObjectId(id)) return;
    await this.tokens.updateOne({ _id: id, userId, revokedAt: null }, { revokedAt: new Date() });
  }

  private async issueTokens(user: UserDocument) {
    const userId = String(user._id);
    const accessToken = await this.jwt.signAsync({ sub: userId, email: user.email });
    const secret = randomBytes(48).toString('base64url');
    const row = await this.tokens.create({
      userId: user._id, tokenHash: sha256(secret), expiresAt: new Date(Date.now() + REFRESH_DAYS * 86_400_000), revokedAt: null,
    });
    return {
      accessToken, refreshToken: `${row._id}.${secret}`, tokenType: 'Bearer',
      expiresIn: this.config.get<number>('JWT_ACCESS_TTL_SECONDS', 900),
      visitor: {
        id: userId, name: user.name, email: user.email, preferredLocale: user.preferredLocale,
        visitorCategory: user.visitorCategory ?? null, defaultInterests: user.defaultInterests ?? [], createdAt: user.createdAt,
      },
    };
  }
}
