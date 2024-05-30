import { IsNumber, IsOptional, IsPositive, Min } from "class-validator"

export class PagingDto {

  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  limit?:number

  @IsOptional()
  @IsNumber()
  @IsPositive()
  offset?:number
}