import { Request, Response } from "express";
import { UserService } from "../../services/user/userService";
import { parseId } from "../../utils/parseId";

interface UserParams {
  id: string;
}

export class UserController {
  private userService = new UserService();

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.findAll();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch users",
      });
    }
  }

  async findById(req: Request<UserParams>, res: Response): Promise<void> {
    try {
      const id = parseId(req.params.id);
      const user = await this.userService.findById(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "User not found",
      });
    }
  }
}
