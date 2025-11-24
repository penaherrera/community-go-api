import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { AuthCredentialsDto } from '../dtos/requests/auth-credentials.dto';
import { LogInData } from '../interfaces/sign-in-data.interface';
import { JwtResponseDto } from '../dtos/responses/jwt-response.dto';
import { CreateUserDto } from '../../users/dtos/requests/create-user.dto';
import { AuthResponseDto } from '../dtos/responses/auth-response.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtPayloadAuth } from '../interfaces/jwt-payload-auth.interface';
import { compare } from 'bcryptjs';
import { JwtSignOptions } from '@nestjs/jwt';
import { hasExpired } from '../../common/utils/has-expired';
import authConfig from '../config/auth.config';
import type { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';
import { Auth, User } from '@prisma/client';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);
  private readonly FIXED_EXPIRES_IN = '1h';

  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) { }

  async create(userId: string): Promise<Auth> {
    const { jwtExpiration, jwtRefreshExpiration } = this.authConfiguration;

    const now = new Date();
    const refreshExpiresAt = new Date(
      now.setMinutes(
        now.getMinutes() +
        (parseInt(jwtExpiration) + parseInt(jwtRefreshExpiration)),
      ),
    );

    const jti = crypto.randomUUID();
    const refreshToken = crypto.randomUUID();

    const auth = await this.prismaService.auth.create({
      data: {
        createdAt: now,
        userId,
        refreshExpiresAt,
        jti,
        refreshToken,
      },
    });

    return auth;
  }

  async validateUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<LogInData> {
    const { email, password } = authCredentialsDto;

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      userId: user.id,
      email: user.email,
    };
  }

  async logIn(loginData: LogInData): Promise<JwtResponseDto> {
    const token = await this.createAccessToken(loginData.userId);
    return token;
  }

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.create(createUserDto);
  }

  async createAccessToken(id: string): Promise<AuthResponseDto> {
    const auth = await this.create(id);
    return this.generateJwt(auth);
  }
  h;
  async handleGoogleResponse(
    googleUser: GoogleUser,
  ): Promise<{ access_token: string; user: any }> {
    if (!googleUser) {
      throw new UnauthorizedException('No user from Google');
    }

    this.logger.debug(`Google user received: ${JSON.stringify(googleUser)}`);

    let user: User;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    if (existingUser) {
      user = existingUser;
      this.logger.debug(`Existing user found: ${user.email}`);
    } else {
      this.logger.debug(`Creating new user for email: ${googleUser.email}`);

      const createUserDto: CreateUserDto = {
        email: googleUser.email,
        password: crypto.randomBytes(16).toString('hex'),
        firstName: googleUser.firstName || googleUser.given_name || '',
        lastName: googleUser.lastName || googleUser.family_name || '',
      };

      try {
        await this.usersService.create(createUserDto);
        user = await this.usersService.findUserByEmail(googleUser.email);
        this.logger.debug(`New user created: ${user.id}`);
      } catch (error) {
        this.logger.error(`Error creating user: ${error.message}`);

        user = await this.usersService.findUserByEmail(googleUser.email);
        if (!user) {
          throw new ConflictException('Could not create or find user');
        }
      }
    }

    const tokenResponse = await this.createAccessToken(user.id);

    return {
      access_token: tokenResponse.accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  private generateJwt(auth: Auth): JwtResponseDto {
    const payload: JwtPayloadAuth = {
      jti: auth.jti,
    };

    const options: JwtSignOptions = { expiresIn: this.FIXED_EXPIRES_IN };
    const accessToken = this.jwtService.sign(payload, options);
    const { refreshToken, refreshExpiresAt } = auth;

    return {
      accessToken,
      refreshToken,
      refreshExpiresAt: refreshExpiresAt.getTime(),
    };
  }

  async refreshToken(refreshToken: string): Promise<JwtResponseDto> {
    const auth = await this.refreshAuthToken(refreshToken);
    return this.generateJwt(auth);
  }

  async refreshAuthToken(refreshToken: string): Promise<Auth> {
    const auth = await this.prismaService.auth.findFirst({
      where: { refreshToken },
      include: { user: true },
    });

    if (!auth) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (hasExpired(auth.refreshExpiresAt)) {
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.prismaService.auth.delete({
      where: { id: auth.id },
    });

    const response = await this.create(auth.userId);

    return response;
  }


  async signOut(jti: string): Promise<{ message: string }> {
    try {
      await this.prismaService.auth.delete({
        where: { jti }
      });

      return { message: 'User signed out successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }
}
