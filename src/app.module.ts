import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PlacesModule } from './places/places.module.js';
import { GovernoratesModule } from './governorates/governorates.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { AttractionModule } from './attraction/attraction.module.js';
import { ServicesModule } from './services/services.module.js';
import { MapsModule } from './maps/maps.module.js';
import { RoutesModule } from './routes/routes.module.js';
import { ItinerariesModule } from './itineraries/itineraries.module.js';
import { TransportModule } from './transport/transport.module.js';
import { AdminModule } from './admin/admin.module.js';
import { VerificationModule } from './verification/verification.module.js';
import { AuditLogsModule } from './audit-logs/audit-logs.module.js';
import { CommonModule } from './common/common.module.js';
import { DatabaseModule } from './database/database.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'tourism-backend',
    }),

    // reads .env and makes ConfigService available everywhere
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: 'config/dev.env',
      }),
    // MongoDB connection (MONGODB_URI from .env)
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ uri: c.getOrThrow<string>('MONGODB_URI') }),
    }),

    UsersModule,
    AuthModule,
    PlacesModule,
    GovernoratesModule,
    CategoriesModule,
    ReviewsModule,
    BookingsModule,
    AttractionModule,
    ServicesModule,
    MapsModule,
    RoutesModule,
    ItinerariesModule,
    TransportModule,
    AdminModule,
    VerificationModule,
    AuditLogsModule,
    CommonModule,
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}