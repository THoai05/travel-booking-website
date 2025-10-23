import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { GetAllDataCitiesParams } from '../interfaces/GetAllDataCityParams.interface';
import { GetDataCitiesFilterParam } from '../interfaces/GetDataCityFilterParam.interface';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {
  }
  @Get('')
  async handleGetAllDataCities(@Query() queryParam: GetAllDataCitiesParams): Promise<any> {
    return await this.cityService.getAllDataCities(queryParam)
  }

  @Get('title-only')
  async handleGetDataCitiesByTitle(@Query() queryParam: GetDataCitiesFilterParam): Promise<any> {
    return await this.cityService.getDataCitiesByFilter(queryParam);
  }
}
