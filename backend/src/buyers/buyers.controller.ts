import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, UseGuards, Request, Res, HttpStatus, ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BuyersService } from './buyers.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { QueryBuyerDto } from './dto/query-buyer.dto';

@ApiTags('Buyers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  // ─── LIST ──────────────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'List buyers with search, filter, sort, pagination' })
  findAll(@Request() req, @Query(new ValidationPipe({ transform: true })) query: QueryBuyerDto) {
    return this.buyersService.findAll(req.user.orgId, query);
  }

  // ─── GET ONE ───────────────────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Get full buyer profile' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.buyersService.findOne(id, req.user.orgId);
  }

  // ─── CREATE ────────────────────────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Create a new buyer' })
  @ApiResponse({ status: 201, description: 'Buyer created' })
  create(
    @Request() req,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateBuyerDto,
  ) {
    return this.buyersService.create(req.user.orgId, dto, req.user.sub);
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  @Put(':id')
  @ApiOperation({ summary: 'Update buyer' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateBuyerDto,
  ) {
    return this.buyersService.update(id, req.user.orgId, dto, req.user.sub);
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  @Delete(':id')
  @ApiOperation({ summary: 'Delete buyer' })
  remove(@Request() req, @Param('id') id: string) {
    return this.buyersService.remove(id, req.user.orgId, req.user.sub);
  }

  // ─── BULK DELETE ───────────────────────────────────────────────────────────
  @Post('bulk/delete')
  @ApiOperation({ summary: 'Bulk delete buyers' })
  bulkDelete(@Request() req, @Body('ids') ids: string[]) {
    return this.buyersService.bulkDelete(ids, req.user.orgId, req.user.sub);
  }

  // ─── BULK STATUS UPDATE ────────────────────────────────────────────────────
  @Post('bulk/status')
  @ApiOperation({ summary: 'Bulk update buyer status' })
  bulkUpdateStatus(
    @Request() req,
    @Body('ids') ids: string[],
    @Body('status') status: string,
  ) {
    return this.buyersService.bulkUpdateStatus(ids, status, req.user.orgId);
  }

  // ─── EXPORT CSV ────────────────────────────────────────────────────────────
  @Get('export/csv')
  @ApiOperation({ summary: 'Export all buyers as CSV' })
  async exportCsv(@Request() req, @Res() res: Response) {
    const csv = await this.buyersService.exportCsv(req.user.orgId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="buyers_${Date.now()}.csv"`);
    res.status(HttpStatus.OK).send(csv);
  }

  // ─── IMPORT CSV ────────────────────────────────────────────────────────────
  @Post('import/csv')
  @ApiOperation({ summary: 'Import buyers from CSV text body' })
  importCsv(@Request() req, @Body('csv') csv: string) {
    return this.buyersService.importCsv(csv, req.user.orgId, req.user.sub);
  }
}
