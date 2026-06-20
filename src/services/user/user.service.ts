import { AppError } from "../../errors/app-errors";
import { User } from "../../models/user/userModel";
import { UserRepository } from "../../repositories/user/user.repository";
import { Role } from "../../types/role";

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: Role;
}

type PublicUser = Omit<User, "password">;

export class UserService {
  private userRepository = new UserRepository();

  async findAll(): Promise<PublicUser[]> {
    const users = await this.userRepository.findAll();

    return users.map(({ password, ...user }) => user);
  }

  async findById(id: number): Promise<PublicUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async update(id: number, data: UpdateUserData): Promise<PublicUser> {
    if (data.name !== undefined && data.name.trim().length < 2) {
      throw new AppError("User name must have at least 2 characters", 400);
    }

    if (data.email !== undefined && !data.email.includes("@")) {
      throw new AppError("Invalid email", 400);
    }

    if (
      data.role !== undefined &&
      data.role !== Role.ADMIN &&
      data.role !== Role.USER
    ) {
      throw new AppError("Invalid role", 400);
    }

    const updatedUser = await this.userRepository.update(id, data);

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async delete(id: number, authenticatedUserId: number): Promise<void> {
    if (id === authenticatedUserId) {
      throw new AppError("You cannot delete your own account", 403);
    }

    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new AppError("User not found");
    }
  }
}
