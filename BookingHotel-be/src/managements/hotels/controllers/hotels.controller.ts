import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query ,DefaultValuePipe} from '@nestjs/common';
import { HotelsService } from '../services/hotels.service';
import { GetAllHotelRequest } from '../dtos/req/GetAllHotelRequest.dto';
import { HotelManageService } from '../services/hotels_manage.service';
import { CreateHotelDto } from '../dtos/req/create-hotel.dto';
import { UpdateHotelDto } from '../dtos/req/update-hotel.dto';


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
  constructor(private readonly hotelManageService: HotelManageService) {}

  @Post()
  create(@Body() dto: CreateHotelDto) {
    return this.hotelManageService.create(dto);
  }

  @Get()
  findAll(
    // Dùng ParseIntPipe để đảm bảo page/limit là số. 
    // DefaultValuePipe để nếu ko gửi thì mặc định là 1 và 10
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.hotelManageService.findAll(page, limit);
  }

  @Get(':id')
  // ParseIntPipe sẽ chặn ngay nếu id="abc" -> Trả về 400 Bad Request luôn
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hotelManageService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateHotelDto
  ) {
    return this.hotelManageService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hotelManageService.remove(id);
  }
}
