import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserRepository } from "../../repositories/user/user.repository";
import { Role } from "../../types/role";
import { User } from "../../models/user/userModel";
import { AppError } from "../../errors/app-errors";

import crypto from "crypto";
import { PasswordResetTokenRepository } from "../../repositories/auth/password-reset-token.repository";

import { EmailService } from "../email/email.service";

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

interface LoginUserData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
}

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: RegisterUserData): Promise<AuthResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new AppError("User already exists", 201);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? Role.USER,
    });

    const token = this.generateToken(user);

    return {
      user: this.removePassword(user),
      token,
    };
  }

  async updateProfile(userId: number, data: UpdateProfileData) {
    const updatedUser = await this.userRepository.update(userId, data);

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async changePassword(
    userId: number,
    data: {
      currentPassword: string;
      newPassword: string;
    },
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new AppError("Current password is incorrect", 400);
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await this.userRepository.updatePassword(userId, hashedPassword);
  }

  async login(data: LoginUserData): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or password", 200);
    }

    const passwordIsValid = await bcrypt.compare(data.password, user.password);

    if (!passwordIsValid) {
      throw new AppError("Invalid email or password", 200);
    }

    const token = this.generateToken(user);

    return {
      user: this.removePassword(user),
      token,
    };
  }

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN ||
      "1d") as SignOptions["expiresIn"];

    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secret,
      {
        expiresIn,
      },
    );
  }

  private removePassword(user: User): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 200);
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  private passwordResetTokenRepository = new PasswordResetTokenRepository();

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return;
    }

    await this.passwordResetTokenRepository.invalidateUserTokens(user.id);

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    await this.passwordResetTokenRepository.create(user.id, token, expiresAt);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.emailService.sendPasswordResetEmail({
      to: user.email,
      resetUrl,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("Password reset URL:", resetUrl);
    }
  }

  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    const resetToken = await this.passwordResetTokenRepository.findValidToken(
      data.token,
    );

    if (!resetToken) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await this.userRepository.updatePassword(
      resetToken.user_id,
      hashedPassword,
    );

    await this.passwordResetTokenRepository.markAsUsed(resetToken.id);
  }

  private emailService = new EmailService();
}
