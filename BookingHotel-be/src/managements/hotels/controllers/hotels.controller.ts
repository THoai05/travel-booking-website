import { Controller, Get, Query } from '@nestjs/common';
import { HotelsService } from '../services/hotels.service';
import { GetAllHotelRequest } from '../dtos/req/GetAllHotelRequest.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {

  }
  @Get('')
  async handleGetAllDataHotel(@Query() queryParam:GetAllHotelRequest) {
    return await this.hotelsService.getAllDataHotel(queryParam)
  }
}
