import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from 'src/dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { SinginDto } from 'src/dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDemandDto } from 'src/dto/passwordDemand.dto';
import * as speakeasy from 'speakeasy';
import { ResetPasswordConfirmationDto } from 'src/dto/resetPasswordConfirmation.dto';
import { DeleteAccountDto } from 'src/dto/deleteAccount.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaServie: PrismaService,
    private readonly mailerService: MailerService,
    private readonly JWTService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signin(singinDto: SinginDto) {
    const { email, password } = singinDto;
    // on vérifie si l'utilisateur est déjà inscrit
    const user = await this.prismaServie.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('user not found');
    // comparer le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Password does not match');
    }
    // Retourner un token jwt
    const payload = {
      sub: user.userId,
      email: user.email,
    };
    const token = this.JWTService.sign(payload, {
      expiresIn: '2h',
      secret: this.configService.get('SECRET_KEY'),
    });

    return {
      token,
      user: {
        email: user.email,
        username: user.username,
      },
    };
  }
  async signup(signupDto: SignupDto) {
    const { email, username, password } = signupDto;
    //vérifie si l'utilisateur est déjà inscrit
    const user = await this.prismaServie.user.findUnique({ where: { email } });
    if (user) {
      throw new ConflictException('user déjà définit');
    }
    //Hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    //Enregistrer l'utilisateur dans la base de données
    await this.prismaServie.user.create({
      data: { email, username, password: hash },
    });
    // Envoyer un email de confirmation
    await this.mailerService.sendSingupConfiramtion(email);
    // Retourner une réponse des succès
    return { data: 'user créer avec succès' };
  }
  async resetPasswordDemand(resetPaswordDemandDto: ResetPasswordDemandDto) {
    const { email } = resetPaswordDemandDto;
    const user = await this.prismaServie.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('email not found');
    }
    const code = speakeasy.totp({
      secret: this.configService.get('OTP_CODE'),
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    const url = 'http://localhost:3000/auth/reset-password-confirmation';
    await this.mailerService.sendResetPasword(user.email, url, code);
    return {
      data: 'reset password mail has been',
    };
  }

  async resetPasswordConfirmation(
    resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    const { email, code, password } = resetPasswordConfirmationDto;
    const user = this.prismaServie.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('email not found');
    }
    const match = speakeasy.totp.verify({
      secret: this.configService.get('OTP_CODE'),
      token: code,
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    if (!match) {
      throw new UnauthorizedException('Invalid/expired token');
    }
    const hash = await bcrypt.hash(password, 10);
    await this.prismaServie.user.update({
      where: { email },
      data: { password: hash },
    });
    await this.mailerService.sendResetPasswordConfirmation(email);
    return {
      data: 'password update',
    };
  }
  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
    // vérifier si l'user existe
    const { password } = deleteAccountDto;
    const user = await this.prismaServie.user.findUnique({ where: { userId } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // Compare le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Unauthorization');
    }
    // Supprimer l'user
    await this.prismaServie.user.delete({ where: { userId } });
    return { data: 'User successfully deleted' };
  }
}
