import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private async transporter() {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transport;
  }
  async sendSingupConfiramtion(userEmail: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'Inscription',
      html: '<h3>Confiramation of inscription</h3>',
    });
  }

  async sendResetPasword(userEmail: string, url: string, code: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'reset Password',
      html: `<a href="${url}">Reset Password</a>
      <p>secret code ${code}</p>
      <p>code will expire in 15 minutes</p>`,
    });
  }

  async sendResetPasswordConfirmation(userEmail: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'reset password confirmation',
      html: '<h3>reset password successfull</h3>',
    });
  }
}
