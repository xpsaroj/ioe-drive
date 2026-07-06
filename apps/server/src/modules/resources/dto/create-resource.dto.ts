import { Type } from "class-transformer";
import { IsIn, IsInt, IsPositive, IsString, MinLength } from "class-validator";

import { ResourceTypeEnum, type ResourceType } from "../../../database/schema";

export class CreateResourceDto {
  @IsString()
  @MinLength(3, { message: "Title must be at least 3 characters long" })
  title!: string;

  @IsString()
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  description!: string;

  @IsIn(ResourceTypeEnum.enumValues)
  type!: ResourceType;

  @Type(() => Number)
  @IsInt()
  @IsPositive({ message: "Subject Offering ID must be a positive integer" })
  offeringId!: number;
}
