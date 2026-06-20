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
      throw new Error("User not found");
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async update(id: number, data: UpdateUserData): Promise<PublicUser> {
    if (data.name !== undefined && data.name.trim().length < 2) {
      throw new Error("User name must have at least 2 characters");
    }

    if (data.email !== undefined && !data.email.includes("@")) {
      throw new Error("Invalid email");
    }

    if (
      data.role !== undefined &&
      data.role !== Role.ADMIN &&
      data.role !== Role.USER
    ) {
      throw new Error("Invalid role");
    }

    const updatedUser = await this.userRepository.update(id, data);

    if (!updatedUser) {
      throw new Error("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async delete(id: number, authenticatedUserId: number): Promise<void> {
    if (id === authenticatedUserId) {
      throw new Error("You cannot delete your own account");
    }

    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new Error("User not found");
    }
  }
}
