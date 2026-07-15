import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

// Only 1-8, unlike the full 1-10 SemesterEnum elsewhere - only Architecture runs to 10.
const UPDATABLE_SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
type UpdatableSemester = (typeof UPDATABLE_SEMESTERS)[number];

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  programId?: number;

  @IsOptional()
  @IsIn(UPDATABLE_SEMESTERS)
  semester?: UpdatableSemester;

  @IsOptional()
  @IsString()
  college?: string;
}
