import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto'
import * as qs from 'qs'
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'
import axios from 'axios';

dayjs.extend(utc)
dayjs.extend(timezone)

@Injectable()
export class PaymentGateService {
    private readonly tmnCode = 'O6BLWB77'
    private readonly secretKey = '0Q0XRG2HIAVOKZCPPKFPR3NN3K4HOC7D'
    private readonly vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'


    async createPaymentUrl(orderCode: string, amount: number, ipAddr: string) {
        function sortObject(obj: Record<string, any>): Record<string, string> {
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
        console.log(orderCode)

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
        const sortedParams = sortObject(vnp_Params)
        const signData = qs.stringify(sortedParams, { encode: false })
        console.log("Chuoi sighData: "+signData)
        const hmac = crypto.createHmac(`sha512`, secretKey)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
        sortedParams[`vnp_SecureHash`] = signed

        
        const paymentUrl = vnpUrl + '?' + qs.stringify(sortedParams, { encode: false}) 
        
        return paymentUrl
    }

    async createMomoUrl(orderAmount: number, orderCode: string) {

        console.log(orderAmount,orderCode)
        
        const orderAmoutString = orderAmount.toString()

        let partnerCode = "MOMO";
        let accessKey = "F8BBA842ECF85";
        let secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        let requestId = partnerCode + new Date().getTime();
        let orderId = orderCode;
        let orderInfo = "pay with MoMo";
        let redirectUrl = "https://momo.vn/return";
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


    async verifyVnPay(params:Record<string,string>) {
        const { vnp_SecureHash, ...rest } = params
         function sortObject(obj: Record<string, any>): Record<string, string> {
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

        const sortedParams = sortObject(rest)
        const signData = qs.stringify(sortedParams, { encode: false })
        const hmac = crypto.createHmac('sha512', this.secretKey)
        const signed = hmac.update(Buffer.from(signData,'utf-8')).digest('hex')
        
        return signed === vnp_SecureHash
    }

    
}




