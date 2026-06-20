import { Role } from "../../types/role";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
