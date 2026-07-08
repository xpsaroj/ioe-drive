import { IsIn, IsOptional } from "class-validator";

export class GetFileDownloadUrlQueryDto {
  // Not a boolean-coerced field - "false" as a string is still truthy if naively
  // coerced, so this is validated as one of the two literal strings instead.
  @IsOptional()
  @IsIn(["true", "false"])
  download?: "true" | "false";
}
