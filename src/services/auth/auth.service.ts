import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserRepository } from "../../repositories/user/user.repository";
import { Role } from "../../types/role";
import { User } from "../../models/user/userModel";
import { AppError } from "../../errors/app-errors";

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
}
