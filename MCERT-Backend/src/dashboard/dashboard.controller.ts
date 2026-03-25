import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(
    @Query('userId') userId?: string,
    @Query('formType') formType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getStats(userId, formType, startDate, endDate);
  }

  @Get('recent-inspections')
  async getRecentInspections(
    @Query('userId') userId?: string,
    @Query('formType') formType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardService.getRecentInspectionsPaginated(
      userId,
      formType,
      startDate,
      endDate,
      parseInt(page || '1', 10),
      parseInt(limit || '10', 10),
    );
  }
}
