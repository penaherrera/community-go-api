import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Patch,
  UseFilters,
  Get,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PassportLocalGuard } from '../guards/passport-local.guard';
import { CreateUserDto } from '../../users/dtos/requests/create-user.dto';
import { JwtResponseDto } from '../dtos/responses/jwt-response.dto';
import { ResetPasswordDto } from '../../auth/dtos/requests/reset-password.dto';
import { EmailDto } from '../dtos/requests/email.dto';
import { PasswordService } from '../services/password.service';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';

@UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('login')
  @UseGuards(PassportLocalGuard)
  login(@Request() request): Promise<JwtResponseDto> {
    return this.authService.logIn(request.user);
  }

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('refresh')
  refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<JwtResponseDto> {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('forgot-password')
  sendEmail(@Body() emailDto: EmailDto): Promise<void> {
    return this.passwordService.forgotPassword(emailDto.email);
  }

  @Patch('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    return this.passwordService.resetPassword(resetPasswordDto);
  }

  @Get('google-login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req) {
    return await this.authService.handleGoogleResponse(req.user);
  }

  // sign out missing
}
