import { Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { PRODUCT_STATUSES, type ProductStatus } from "../../../database/schemas/product.schema";

const trimToUndefined = ({ value }: { value: unknown }) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export class ListProductsQueryDto {
  @Transform(trimToUndefined)
  @IsString()
  @IsOptional()
  search?: string;

  @Transform(trimToUndefined)
  @IsString()
  @IsOptional()
  category?: string;

  @Transform(trimToUndefined)
  @IsString()
  @IsOptional()
  @IsEnum(PRODUCT_STATUSES)
  status?: ProductStatus;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  minPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1000000)
  minStock?: number;
}