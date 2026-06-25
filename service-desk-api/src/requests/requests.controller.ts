import { Controller, Get, Post, Put, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
  ) {}

  @Get()
  findAll() {
    return this.requestsService.findAll();
  }

  @Get('client/:clientId')
  findByClientId(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.requestsService.findByClientId(clientId);
  }

  @Get('engineer/:engineerId')
  findByEngineerId(@Param('engineerId', ParseIntPipe) engineerId: number) {
    return this.requestsService.findByEngineerId(engineerId);
  }

  @Get('completed/engineer/:engineerId')
  getCompletedWorks(@Param('engineerId', ParseIntPipe) engineerId: number) {
    return this.requestsService.getCompletedWorks(engineerId);
  }

  @Post()
  create(@Body() body: any) {
    return this.requestsService.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.requestsService.update(id, body);
  }

  @Patch(':id')
  patch(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.requestsService.patch(id, body);
  }
}