import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { HotelsService } from '../services/hotels.service';
import { GetAllHotelRequest } from '../dtos/req/GetAllHotelRequest.dto';
import { CreateHotelDto } from '../dtos/res/create-hotel.dto';
import { UpdateHotelDto } from '../dtos/res/update-hotel.dto';
import { HotelManageService } from '../services/hotels_manage.service';


@Controller('hotels')
export class HotelsController { 
  constructor(private readonly hotelsService: HotelsService) {

  }

  @Get('')
  async handleGetAllDataHotel(@Query() queryParam: GetAllHotelRequest) {
    return await this.hotelsService.getAllDataHotel(queryParam)
  }
  @Get('random-hotels')
  async handleGetRandom6Hotels(){
    const data = await this.hotelsService.getRandom6Hotels()
    return {
      data
    }
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

  @Get(':id/room-options')
  async handleGetDataRoomTypeAndRatePlan(
    @Param('id', ParseIntPipe) id: number,
    @Query('maxGuests',ParseIntPipe) maxGuests:number
  ) {
    const data = await this.hotelsService.findRoomTypeAndRatePlanByHotelId(id,maxGuests)
    return {
      data
    }

  }
  

}

//  ADMIN / MANAGEMENT HOTEL API //
@Controller('admin/hotels')
export class HotelsManageController {
  constructor(private readonly hotelManageService: HotelManageService) { }

  @Post()
  create(@Body() dto: CreateHotelDto) {
    return this.hotelManageService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.hotelManageService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.hotelManageService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateHotelDto) {
    return this.hotelManageService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.hotelManageService.remove(id);
  }
}
