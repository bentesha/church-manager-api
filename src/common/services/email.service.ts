// src/services/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { promisify } from 'util';
import { Config } from 'src/config';

const readFile = promisify(fs.readFile);

export enum EmailTemplate {
  ONBOARD = 'onboard',
  NEW_USER = 'new-user',
  PASSWORD_RESET = 'password-reset',
  VERIFICATION_CODE = 'verification-code',
  PASSWORD_CHANGED = 'password-changed',
}

export interface SendEmailInfo {
  to: string;
  subject: string;
  template: EmailTemplate;
  context: Record<string, any>;
}

export interface SendOnboardEmailInfo {
  to: string;
  name: string;
  churchName: string;
  email: string;
  password: string;
  domain: string;
  loginLink: string;
}

export interface SendNewUserEmailInfo {
  to: string;
  name: string;
  churchName: string;
  email: string;
  password: string;
  loginLink: string;
}

export interface SendPasswordResetEmailInfo {
  to: string;
  name: string;
  resetLink: string;
}

export interface SendVerificationCodeEmailInfo {
  to: string;
  name: string;
  churchName: string;
  verificationCode: string;
}

export interface SendPasswordUpdatedEmailInfo {
  to: string;
  name: string;
  churchName: string;
  email: string;
  password: string;
  loginLink: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly templatesDir: string;

  constructor(private config: Config) {
    // Templates are in the project root directory
    this.templatesDir = path.join(process.cwd(), 'email-templates');
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const { host, port, user, password, secure } = this.config.email;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass: password,
      },
    });

    // Verify connection
    this.transporter
      .verify()
      .then(() => this.logger.log('Email service connected'))
      .catch((err) =>
        this.logger.error(`Email service connection error: ${err}`),
      );
  }

  async sendOnboardEmail(info: SendOnboardEmailInfo): Promise<boolean> {
    return this.sendEmail({
      to: info.to,
      subject: 'Welcome to Church Management System',
      template: EmailTemplate.ONBOARD,
      context: {
        name: info.name,
        churchName: info.churchName,
        email: info.email,
        password: info.password,
        domain: info.domain,
        loginLink: info.loginLink,
      },
    });
  }

  async sendNewUserEmail(info: SendNewUserEmailInfo): Promise<boolean> {
    return this.sendEmail({
      to: info.to,
      subject: 'Your Church Management System Account',
      template: EmailTemplate.NEW_USER,
      context: {
        name: info.name,
        churchName: info.churchName,
        email: info.email,
        password: info.password,
        loginLink: info.loginLink,
      },
    });
  }

  async sendPasswordResetEmail(
    info: SendPasswordResetEmailInfo,
  ): Promise<boolean> {
    return this.sendEmail({
      to: info.to,
      subject: 'Reset Your Password',
      template: EmailTemplate.PASSWORD_RESET,
      context: {
        name: info.name,
        email: info.to,
        resetLink: info.resetLink,
      },
    });
  }

  async sendVerificationCodeEmail(
    info: SendVerificationCodeEmailInfo,
  ): Promise<boolean> {
    return this.sendEmail({
      to: info.to,
      subject: 'Verify Your Account',
      template: EmailTemplate.VERIFICATION_CODE,
      context: {
        name: info.name,
        churchName: info.churchName,
        email: info.to,
        verificationCode: info.verificationCode,
      },
    });
  }

  async sendPasswordUpdatedEmail(
    info: SendPasswordUpdatedEmailInfo,
  ): Promise<boolean> {
    return this.sendEmail({
      to: info.to,
      subject: 'Your New Password - Church Management System',
      template: EmailTemplate.PASSWORD_CHANGED,
      context: {
        name: info.name,
        churchName: info.churchName,
        email: info.email,
        password: info.password,
        loginLink: info.loginLink,
      },
    });
  }

  async sendEmail(info: SendEmailInfo): Promise<boolean> {
    try {
      const html = await this.compileTemplate(info.template, info.context);

      const mailOptions = {
        from: this.config.email.from,
        to: info.to,
        subject: info.subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  private async compileTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    try {
      // Add the current year to all templates
      const contextWithYear = {
        ...context,
        currentYear: new Date().getFullYear(),
      };

      // Read the template file
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
      const templateContent = await readFile(templatePath, 'utf8');

      // Compile the template
      const template = handlebars.compile(templateContent);
      return template(contextWithYear);
    } catch (error) {
      this.logger.error(
        `Failed to compile template ${templateName}: ${error.message}`,
      );
      throw error;
    }
  }
}
