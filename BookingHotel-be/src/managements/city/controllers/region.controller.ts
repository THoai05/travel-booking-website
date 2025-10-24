import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { CityService } from "../services/city.service";

@Controller('regions')
export class RegionController{
    constructor(
        private readonly cityService:CityService
    ) { }
    
    @Get(':id/hotels')
    async getHotelForAccByRegionId(@Param('id',ParseIntPipe)id:number) {
        return this.cityService.getDataCitiesHotelForAccByRegionId(id)
    }
}