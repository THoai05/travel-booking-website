import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto'
import * as qs from 'qs'
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'
import axios from 'axios';
import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import { BookingsService } from 'src/managements/bookings/services/bookings.service';
import { UpdateBookingRequest } from 'src/managements/bookings/dtos/req/UpdateBookingRequest.dto';

dotenv.config()


dayjs.extend(utc)
dayjs.extend(timezone)

@Injectable()
export class PaymentGateService {
    private readonly tmnCode = 'O6BLWB77'
    private readonly secretKey = '0Q0XRG2HIAVOKZCPPKFPR3NN3K4HOC7D'
    private readonly vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
    private readonly momo_secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz' 
    private readonly zaloPay_key1 = "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q"
    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)


    constructor(
        private readonly bookingService:BookingsService
    ){}

      sortObject(obj: Record<string, any>): Record<string, string> {
        const sorted: Record<string, string> = {};
            const keys: string[] = Object.keys(obj).map(k => encodeURIComponent(k));
            
            keys.sort();
            
            for (const k of keys) {
                // lấy value gốc, encode, replace space bằng '+'
                const value = obj[decodeURIComponent(k)]; 
                sorted[k] = encodeURIComponent(value).replace(/%20/g, "+");
            }
            
            return sorted;
        }


    async createPaymentUrl(orderCode: string, amount: number, ipAddr: string) {
       

        const vnp_TmnCode = this.tmnCode
        const secretKey = this.secretKey
        const vnpUrl = this.vnp_Url

       
        const returnUrl = `http://localhost:3000/payment/check?gateway=vnpay`
        const date = new Date()

        const vnTime = dayjs().tz('Asia/Ho_Chi_Minh')
        const createDate = vnTime.format('YYYYMMDDHHmmss')
        const expireDate =vnTime.add(15,'minute').format('YYYYMMDDHHmmss')
        
        const vnp_Params:Record<string, string> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnp_TmnCode,
            vnp_Amount: (amount*100).toString(),
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: ipAddr,
            vnp_Locale: 'vn',
            vnp_OrderInfo:`Thanh toan cho don hang ${orderCode}`,
            vnp_OrderType: 'billpayment',
            vnp_ReturnUrl:returnUrl,
            vnp_ExpireDate:expireDate,
            vnp_TxnRef: orderCode,
        }
        const sortedParams = this.sortObject(vnp_Params)
        const signData = qs.stringify(sortedParams, { encode: false })
        console.log("Chuoi sighData: "+signData)
        const hmac = crypto.createHmac(`sha512`, secretKey)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
        sortedParams[`vnp_SecureHash`] = signed

        
        const paymentUrl = vnpUrl + '?' + qs.stringify(sortedParams, { encode: false}) 
        
        return paymentUrl
    }

    async createMomoUrl(orderAmount: number, orderCode: string) {

        
        const orderAmoutString = orderAmount.toString()

        let partnerCode = "MOMO";
        let accessKey = "F8BBA842ECF85";
        let secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        let requestId = partnerCode + new Date().getTime();
        let orderId = orderCode;
        let orderInfo = "pay with MoMo";
        let redirectUrl = "http:/localhost:3000/payment/check?gateway=momo";
        let ipnUrl = "https://callback.url/notify";
        // let ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
        let amount = orderAmoutString;
        let requestType = "captureWallet"
        let extraData = ""; 

        let rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
        const crypto = require('crypto');
        let signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
            lang: 'en'
        });
        try {
            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', 
                requestBody,
                 { headers: { 'Content-Type': 'application/json' } }
            )
            return response.data.payUrl
        } catch (error) {
            console.log(error)
        }
    }


    async createZaloPayUrl(orderAmount:number ,orderCode:string) {
        const key1 = this.zaloPay_key1
        const config = {
            appid: "553",
            key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
            endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
        };

        const embeddata = {
            merchantinfo: "embeddata123",
            redirecturl:'http://localhost:3000/payment/check?gateway=zalopay'
        };

        const vnTime = dayjs().tz('Asia/Ho_Chi_Minh')
        const createDate = vnTime.format('YYMMDD')
        const formatOrderCode = `${createDate}_${orderCode}`
        const items = [{
            itemid: 1234,
            itemname: "John Doe",
            itemprice: 11111,
            itemquantity: 1
        }];
        const order = {
            appid: config.appid,
            apptransid: formatOrderCode,
            appuser: "demo",
            apptime: Date.now(),
            item: JSON.stringify(items),
            embeddata: JSON.stringify(embeddata), 
            amount: orderAmount,
            description: "Demo",
            bankcode: "zalopayapp",
            mac:''
        }
        const data =
            config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
        order.mac = crypto.createHmac('sha256', key1)
            .update(data)
            .digest('hex')
        try {
            const response = await axios.post(config.endpoint, null, {
                params:order
            })
            if (response.data.returncode === 1) {
                return response.data.orderurl
            }
        } catch (error) {
            console.log(error)
        }

           
    }


    async createStripeUrl(orderAmonut: number, orderCode: string) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name:`Order_${orderCode}`
                        },
                        unit_amount: Math.floor(orderAmonut / 25000) * 100
                    },
                    quantity:1
                }
            ],
            mode: 'payment',
            success_url:'http://localhost:3000/payment/check?gateway=stripe'
        }) 
        return session.url
    }

    async verifyVnPay(params:Record<string,string>):Promise<UpdateBookingRequest> {
        const { vnp_SecureHash, ...rest } = params
        const sortedParams = this.sortObject(rest)
        const signData = qs.stringify(sortedParams, { encode: false })
        const hmac = crypto.createHmac('sha512', this.secretKey)
        const signed = hmac.update(Buffer.from(signData,'utf-8')).digest('hex')
        
        const isValid = signed === vnp_SecureHash
        if (!isValid) {
            throw new BadRequestException("Giao dich khong hop le")
        }

        const { vnp_ResponseCode } = params
        if (vnp_ResponseCode !== '00') {
            throw new BadRequestException("Giao dich that bai")
        }
        
        const { vnp_TxnRef } = params
        const updateBookingData = await this.bookingService.updateBookingForGuests(Number(vnp_TxnRef), { status: "confirmed" })
        return updateBookingData
    }

    async verifyMomo(parmas: Record<string, string>): Promise<any> {
        const momoSecretKey = this.momo_secretKey
        const { signature, ...rest } = parmas
        const sortedParams = this.sortObject(rest)
        const signData = qs.stringify(sortedParams, { encode: false })
        const hmac = crypto.createHmac('sha256', momoSecretKey)
        const signed = hmac.update(Buffer.from(signData, 'utf8')).digest('hex')
        
        return signed === signature
    }
}




