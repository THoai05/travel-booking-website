import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { HotelsService } from '../services/hotels.service';
import { GetAllHotelRequest } from '../dtos/req/GetAllHotelRequest.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {

  }
  @Get('')
  async handleGetAllDataHotel(@Query() queryParam: GetAllHotelRequest) {
    console.log("o controller" + queryParam.amenities)
    return await this.hotelsService.getAllDataHotel(queryParam)
  }

  @Get(':id')
  async handleGetDataHotelById(@Param('id',ParseIntPipe) id:number) {
    const hotel = await this.hotelsService.getHotelDataById(id)
    return {
      data:hotel
    }
  }

  @Get(':id/similar')
  async handleGetSimilarHotelByCityId(@Param('id', ParseIntPipe) id: number) {
    const hotels = await this.hotelsService.getSimilarHotelByCityId(id)
    return hotels
  }

}
