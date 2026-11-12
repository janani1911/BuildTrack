import { IsIn, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  client: string;

  @IsString()
  @MinLength(2)
  location: string;

  @IsIn(['Planning', 'In Progress', 'Completed'])
  status: string;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsOptional()
  @IsString()
  description?: string;
}
