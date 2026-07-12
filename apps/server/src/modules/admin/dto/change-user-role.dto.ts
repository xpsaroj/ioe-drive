import { IsEmail, IsIn } from "class-validator";

export class ChangeUserRoleDto {
  @IsEmail()
  email!: string;

  // ADMIN is deliberately not one of the allowed values here - granting/revoking it
  // always stays a direct database change, never something reachable through the app.
  @IsIn(["USER", "MODERATOR"])
  role!: "USER" | "MODERATOR";
}
