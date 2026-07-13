import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitWizardDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() phone: string;
  @ApiProperty() @IsOptional() @IsString() email?: string;
  @ApiProperty() @IsOptional() @IsString() whatsapp?: string;
  
  @ApiProperty() @IsOptional() @IsString() purpose?: string;
  @ApiProperty() @IsOptional() @IsString() type?: string;
  @ApiProperty() @IsOptional() @IsString() budgetRange?: string;
  @ApiProperty() @IsOptional() @IsString() location?: string;
  @ApiProperty() @IsOptional() @IsString() timeline?: string;
  
  @ApiProperty() @IsOptional() @IsString() loanRequired?: string;
  @ApiProperty() @IsOptional() @IsString() occupation?: string;
  @ApiProperty() @IsOptional() @IsString() income?: string;
  @ApiProperty() @IsOptional() @IsString() cibil?: string;
  
  @ApiProperty() @IsOptional() @IsArray() preferences?: string[];
  @ApiProperty() @IsOptional() @IsString() notes?: string;
  
  @ApiProperty() @IsOptional() @IsString() contactTime?: string;
  @ApiProperty() @IsOptional() @IsString() source?: string;
  
  @ApiProperty() @IsOptional() @IsString() orgId?: string;
}
