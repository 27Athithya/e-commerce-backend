import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  Min,
  MinLength,
} from "class-validator";
import {
  DEFAULT_PRODUCT_STATUS,
  PRODUCT_STATUSES,
  type ProductStatus,
} from "../../../database/schemas/product.schema";

const trimString = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

const trimToUndefined = ({ value }: { value: unknown }) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toOptionalNumber = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return Number(value);
};

export class CreateProductDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(1000)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @Transform(trimToUndefined)
  @IsString()
  @IsOptional()
  @MaxLength(500000)
  @Matches(/^(https?:\/\/|data:image\/)/i, {
    message: "image must be a valid URL or base64 image data",
  })
  image?: string;

  @Transform(trimToUndefined)
  @IsString()
  @IsOptional()
  @MaxLength(60)
  category?: string;

  @Transform(toOptionalNumber)
  @IsNumber()
  @IsOptional()
  @Min(0)
  stockQuantity?: number;

  @Transform(trimToUndefined)
  @IsString()
  @IsOptional()
  @IsEnum(PRODUCT_STATUSES)
  status?: ProductStatus = DEFAULT_PRODUCT_STATUS;
}
