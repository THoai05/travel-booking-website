import { BadRequestException, Body, Controller, Get, NotFoundException, Query,Req } from '@nestjs/common';
import { PaymentGateService } from '../services/paymentGate.service';
// import { OrderStatus } from 'src/common/enums/order-status.enum';
// import { BookingsService } from 'src/managements/bookings/services/bookings.service';

@Controller('payment-gate')
export class PaymentGateController {
  constructor(private readonly paymentGateService: PaymentGateService,
    //   private readonly bookingService: BookingsService,
  ) {
  }
  @Get('vnpay')
  async createPayment(@Query() body: {
        orderAmount: number,
        orderCode:string
    },
                      @Req() req
  ) {
      const { orderAmount,orderCode } = body
       let ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress ||
      '127.0.0.1';

    if (Array.isArray(ipAddr)) {
      ipAddr = ipAddr[0];
    }

    // Chuẩn hoá IPv6 "::ffff:127.0.0.1" -> "127.0.0.1"
      ipAddr = ipAddr.replace('::ffff:', '');
      return await this.paymentGateService.createPaymentUrl(orderCode,orderAmount,ipAddr)
    }
    


  @Get('verify/vnpay')
  async verifyMomoPayment(@Query() query:Record<string,string>) {
    const bookingData = await this.paymentGateService.verifyVnPay(query)
    return {
      message: "success",
      data:bookingData
    }
  }

    
    
    //============================Momo=====================================//

    @Get('momo')
    async handleCreateMomoUrl(@Query() body: {
        orderAmount: number,
        orderCode:string
    }) {
        const { orderAmount,orderCode } = body
        return await this.paymentGateService.createMomoUrl(orderAmount,orderCode)
    }
  

  
  @Get('verify/momo')
  async verifyVnPayPayment(@Query() query:Record<string,string>) {
    const isValid = this.paymentGateService.verifyMomo(query)

    if (!isValid) {
      throw new BadRequestException('Giao dịch không hợp lệ')
    }
       return {
      message:"success"
    }
  }


  //=============================ZaloPay===============================//
   @Get('zalopay')
    async handleCreateZalopayUrl(@Query() body: {
        orderAmount: number,
        orderCode:string
    }) {
        const { orderAmount,orderCode } = body
        return await this.paymentGateService.createZaloPayUrl(orderAmount,orderCode)
  }
  

  //=============================Stripe=============================//
  @Get('stripe')
  async handleCreateStripeUrl(@Query() body: {
    orderAmount: number,
    orderCode:string
  }) {
     const { orderAmount,orderCode } = body
     return await this.paymentGateService.createStripeUrl(orderAmount,orderCode)
  }
}
