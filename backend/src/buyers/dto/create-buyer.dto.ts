import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsBoolean, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum BuyerStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  SITE_VISIT = 'SITE_VISIT',
  NEGOTIATION = 'NEGOTIATION',
  BOOKED = 'BOOKED',
  LOST = 'LOST',
}

export enum BuyerPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum LeadSource {
  REFERRAL = 'REFERRAL',
  PORTAL = 'PORTAL',
  WALKIN = 'WALKIN',
  SOCIAL = 'SOCIAL',
  WHATSAPP = 'WHATSAPP',
  COLD_CALL = 'COLD_CALL',
  OTHER = 'OTHER',
}

export class CreateBuyerDto {
  @ApiProperty({ example: 'Rajiv Sharma' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'rajiv@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @ApiPropertyOptional({ example: 15000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @ApiPropertyOptional({ example: '["Dwarka", "Noida"]' })
  @IsOptional()
  @IsString()
  preferredLocations?: string;

  @ApiPropertyOptional({ example: '["APARTMENT", "VILLA"]' })
  @IsOptional()
  @IsString()
  propertyTypes?: string;

  @ApiPropertyOptional({ example: '2,3' })
  @IsOptional()
  @IsString()
  bedrooms?: string;

  @ApiPropertyOptional({ example: '1,2' })
  @IsOptional()
  @IsString()
  bathrooms?: string;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaMin?: number;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaMax?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  loanRequired?: boolean;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ example: 'Infosys Ltd' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 1200000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  annualIncome?: number;

  @ApiPropertyOptional({ enum: LeadSource })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedBrokerId?: string;

  @ApiPropertyOptional({ enum: BuyerPriority, default: BuyerPriority.MEDIUM })
  @IsOptional()
  @IsEnum(BuyerPriority)
  priority?: string;

  @ApiPropertyOptional({ enum: BuyerStatus, default: BuyerStatus.NEW })
  @IsOptional()
  @IsEnum(BuyerStatus)
  status?: string;

  @ApiPropertyOptional({ example: '["urgent","loan-ready"]' })
  @IsOptional()
  @IsString()
  tags?: string;
}
