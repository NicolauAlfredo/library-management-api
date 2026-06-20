import { Request, Response } from "express";
import { UserService } from "../../services/user/user.service";
import { parseId } from "../../utils/parseId";
import { AuthenticatedRequest } from "../../types/authenticated.request";
import { Role } from "../../types/role";

interface UserParams {
  id: string;
}

interface UpdateUserBody {
  name?: string;
  email?: string;
  role?: Role;
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

  async update(
    req: Request<UserParams, {}, UpdateUserBody>,
    res: Response,
  ): Promise<void> {
    try {
      const id = parseId(req.params.id);

      const user = await this.userService.update(id, req.body);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update user",
      });
    }
  }

  async delete(
    req: AuthenticatedRequest<UserParams>,
    res: Response,
  ): Promise<void> {
    try {
      const id = parseId(req.params.id);
      const authenticatedUserId = req.user?.id;

      if (!authenticatedUserId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });

        return;
      }

      await this.userService.delete(id, authenticatedUserId);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete user",
      });
    }
  }
}
