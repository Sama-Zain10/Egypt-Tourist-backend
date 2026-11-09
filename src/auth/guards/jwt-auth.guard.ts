import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Put on every "action" endpoint (planner, transport, assistant...). Browsing endpoints stay without it. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
