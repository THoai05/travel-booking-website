import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';

export class CreateCouponDto {
    @IsString({ message: 'Mã giảm giá không được để trống.' })
    code: string;

    @IsEnum(['active', 'expired'], { message: 'Trạng thái phải là active hoặc expired.' })
    status: string;

    @IsEnum(['fixed', 'percent'], { message: 'Loại giảm giá phải là fixed hoặc percent.' })
    discountType: string;

    @IsNumber({}, { message: 'Giá trị giảm phải là số.' })
    @Min(0, { message: 'Giá trị giảm phải lớn hơn hoặc bằng 0.' })
    discountValue: number;

    @IsOptional()
    @IsNumber({}, { message: 'Giá trị đơn hàng tối thiểu phải là số.' })
    minOrderValue?: number;

    @IsOptional()
    @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ.' })
    startDate?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ.' })
    endDate?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Giới hạn sử dụng phải là số.' })
    usageLimit?: number;
}
