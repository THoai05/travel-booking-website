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
    


//   @Get('verify')
//   async verifyVnPayPayment(@Query() query:Record<string,string>) {
//     const isValid = this.paymentService.verifyVnPay(query)

//     if (!isValid) {
//       throw new BadRequestException('Giao dịch không hợp lệ')
//     }

//     const { vnp_ResponseCode, vnp_TxnRef } = query
//     const order = await this.orderService.getOrderByOrderCode(vnp_TxnRef)
//     if (!order) {
//       throw new NotFoundException('Không tìm thấy đơn hàng ')
//     }

//     const updateDtoSucceeded: UpdateOrderDto = { status: OrderStatus.SUCCEEDED }
//     const updateDtoWaitForPaid : UpdateOrderDto = {status:OrderStatus.WAITFORPAID}
//     console.log(order)

//     if (vnp_ResponseCode === '00') {
//       console.log('hahahahaha')
//       await this.orderService.updateOrder(order.id, updateDtoSucceeded)
//       order.status = updateDtoSucceeded.status
//       console.log('hahahha')
//       console.log(order.items.map(item=>item.id))
//       await this.cartService.deleteItems(order.user.id, order.items.map(item => item.originalCartItemId))
//       console.log('hahahah')
//     } else {
//       await this.orderService.updateOrder(order.id, updateDtoWaitForPaid)
//       order.status = updateDtoWaitForPaid.status
//     }
//     console.log(order.status)
//     return {status:order.status}
//   }

    
    
    //============================Momo=====================================//

    @Get('momo')
    async handleCreateMomoUrl(@Query() body: {
        orderAmount: number,
        orderCode:string
    }) {
        const { orderAmount,orderCode } = body
        return await this.paymentGateService.createMomoUrl(orderAmount,orderCode)
    }
}
