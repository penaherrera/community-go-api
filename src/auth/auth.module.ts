import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/services/users.service';
import { PasswordService } from './services/password.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      inject: [authConfig.KEY],
      useFactory: (config: ConfigType<typeof authConfig>) => ({
        global: true,
        secret: config.jwtSecret,
      }),
    }),
    ConfigModule.forFeature(authConfig),
  ],
  providers: [
    AuthService,
    PasswordService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
    UsersService,
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
