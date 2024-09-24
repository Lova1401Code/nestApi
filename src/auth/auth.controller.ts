import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SignupDto } from 'src/dto/signup.dto';
import { SinginDto } from 'src/dto/signin.dto';
import { AuthService } from './auth.service';
import { ResetPasswordDemandDto } from 'src/dto/passwordDemand.dto';
import { ResetPasswordConfirmationDto } from 'src/dto/resetPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from 'src/dto/deleteAccount.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
  @Post('signin')
  signin(@Body() signinDto: SinginDto) {
    return this.authService.signin(signinDto);
  }
  @Post('reset-password')
  resetPaswordDemand(@Body() resetPaswordDemand: ResetPasswordDemandDto) {
    return this.authService.resetPasswordDemand(resetPaswordDemand);
  }
  @Post('reset-password-confirmation')
  resetPasswordConfirmation(
    @Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    return this.authService.resetPasswordConfirmation(
      resetPasswordConfirmationDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  deleteAccount(
    @Req() request: Request,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    const userId = request.user['userId'];
    return this.authService.deleteAccount(userId, deleteAccountDto);
  }
}
