import { Request, Response } from "express";
import { UserService } from "../../services/user/user.service";
import { parseId } from "../../utils/parse-id";
import { AuthenticatedRequest } from "../../types/authenticated.request";

export class UserController {
  private userService = new UserService();

  async findAll(req: Request, res: Response): Promise<void> {
    const { page, limit, search, role } = res.locals.query;

    const result = await this.userService.findAll({
      page,
      limit,
      search,
      role,
    });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    const user = await this.userService.findById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    const user = await this.userService.update(id, req.body);

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
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
  }
}
