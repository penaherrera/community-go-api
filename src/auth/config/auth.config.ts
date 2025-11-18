import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'nestjs-is-awesome',
  jwtExpiration: process.env.JWT_EXPIRATION || '3600',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '86400',
}));
