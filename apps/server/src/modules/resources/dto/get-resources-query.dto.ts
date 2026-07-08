import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";

import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";

export class GetResourcesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive({ message: "Subject Offering ID must be a positive integer" })
  offeringId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive({ message: "User ID must be a positive integer" })
  userId?: number;
}
