import { User } from "../../models/user/userModel";
import { UserRepository } from "../../repositories/user/userRepository";

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
}
