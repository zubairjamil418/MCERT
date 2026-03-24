import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { thirdFormsService } from './third-forms.service';
import { 
  CreatethirdFormDto, 
  UpdatethirdFormDto, 
  thirdFormSubmissionDto,
  thirdFormQueryDto,
  BulkUpdatethirdFormDto,
  BulkDeletethirdFormDto,
  PaginationDto
} from './dto/third-forms.dto';
import { 
  InspectionListQueryDto, 
  InspectionListResponseDto 
} from './dto/inspection-list.dto';
import { Public } from '../iam/decorators/auth.decorator';
import { AuthGuard } from '../iam/guards/auth/auth.guard';

@Public()
@Controller('third-forms')
export class thirdFormsController {
  constructor(private readonly thirdFormsService: thirdFormsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createthirdFormDto: CreatethirdFormDto, @Req() req: any) {
    // If @Body() returns empty object, use raw body as fallback
    if (!createthirdFormDto || Object.keys(createthirdFormDto).length === 0) {
      createthirdFormDto = req.body as CreatethirdFormDto;
    }
    
    // Extract userId from authorization header if not in body
    if (!createthirdFormDto.userId && req.user?.id) {
      createthirdFormDto.userId = req.user.id;
    }
    
    // Validate request size early to prevent processing oversized payloads
    const requestSize = JSON.stringify(createthirdFormDto).length;
    const maxRequestSize = 50 * 1024 * 1024; // 50MB limit
    
    if (requestSize > maxRequestSize) {
      return {
        success: false,
        error: 'Request payload too large',
        message: `Request size (${(requestSize / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (50MB)`
      };
    }
    
    return this.thirdFormsService.create(createthirdFormDto);
  }

  @Post('submit')
  @UseGuards(AuthGuard)
  submitForm(@Body() formSubmissionDto: thirdFormSubmissionDto) {
    console.log('Submit third form endpoint - received data:', JSON.stringify(formSubmissionDto, null, 2));
    return this.thirdFormsService.submitForm(formSubmissionDto);
  }

  @Get()
  async findAll(@Query() query: thirdFormQueryDto) {
    // If any pagination parameters are provided, use inspection list format
    if (
      query &&
      (query.page ||
        query.limit ||
        query.status ||
        query.inspector ||
        query.siteName)
    ) {
      console.log('Using inspection list format with params:', query);
      const inspectionQuery: InspectionListQueryDto = {
        page: query.page || 1,
        limit: query.limit || 5,
        status: query.status,
        inspector: query.inspector,
        siteName: query.siteName,
        sortBy: query.sortBy || 'createdAt',
        sortOrder: query.sortOrder || 'desc'
      };
      return this.thirdFormsService.getInspectionList(inspectionQuery);
    }
    
    // Otherwise, return all forms (backwards compatibility)
    console.log('Using non-paginated findAll for third forms');
    return this.thirdFormsService.findAll();
  }

  @Get('paginated')
  async findAllPaginated(@Query() paginationDto: PaginationDto) {
    try {
      return await this.thirdFormsService.findAllPaginated(paginationDto);
    } catch (error) {
      console.error('Controller: Error in findAllPaginated for third forms:', error);
      throw error;
    }
  }

  @Get(':id/data')
  findOneWithData(@Param('id') id: string) {
    return this.thirdFormsService.findOneWithData(id);
  }

  @Post('migrate-to-files')
  @UseGuards(AuthGuard)
  async migrateToFileStorage() {
    return this.thirdFormsService.migrateToFileStorage();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string, @Query() query: any) {
    // If any pagination parameters are provided, use paginated version
    if (
      query &&
      (query.page ||
        query.limit ||
        query.sortBy ||
        query.search ||
        query.status)
    ) {
      console.log('Using paginated findByUserId with params for third forms:', query);
      const paginationDto = new PaginationDto();

      // Map query parameters to DTO with proper type conversion
      paginationDto.page = query.page ? parseInt(query.page) : 1;
      paginationDto.limit = query.limit ? parseInt(query.limit) : 10;
      paginationDto.sortBy = query.sortBy || 'createdAt';
      paginationDto.sortOrder = query.sortOrder || 'desc';
      paginationDto.search = query.search;
      paginationDto.status = query.status;
      paginationDto.includeFormData = query.includeFormData === 'true';

      return this.thirdFormsService.findByUserIdPaginated(userId, paginationDto);
    }
    // Otherwise, return all forms for the user (backwards compatibility)
    console.log('Using non-paginated findByUserId for third forms');
    return this.thirdFormsService.findByUserId(userId);
  }

  @Get('user/:userId/paginated')
  findByUserIdPaginated(
    @Param('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.thirdFormsService.findByUserIdPaginated(userId, paginationDto);
  }

  // New query endpoint (must be before :id route)
  @Get('query')
  @UseGuards(AuthGuard)
  getFormsByQuery(@Query() queryDto: thirdFormQueryDto) {
    return this.thirdFormsService.getFormsByQuery(queryDto);
  }

  // New bulk operation endpoints
  @Patch('bulk/update')
  @UseGuards(AuthGuard)
  bulkUpdate(@Body() bulkUpdateDto: BulkUpdatethirdFormDto) {
    return this.thirdFormsService.bulkUpdateForms(bulkUpdateDto);
  }

  @Delete('bulk/delete')
  @UseGuards(AuthGuard)
  bulkDelete(@Body() bulkDeleteDto: BulkDeletethirdFormDto) {
    return this.thirdFormsService.bulkDeleteForms(bulkDeleteDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thirdFormsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updatethirdFormDto: UpdatethirdFormDto) {
    return this.thirdFormsService.update(id, updatethirdFormDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.thirdFormsService.remove(id);
  }
}

