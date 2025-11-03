'use client'

import api from "@/axios/axios"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const PaymentCheck = ()=>{

    const params = useSearchParams()

    const router = useRouter()
    
    
    useEffect(() => {
        const verifyPayment = async () => {
            const queryParam = new URLSearchParams(params.toString())
            const gateway = queryParam.get('gateway')
            let paymentVerifyEndpoint = ''
            queryParam.delete('gateway')
            const cleanQueryString = queryParam ? queryParam.toString() : ''
            const finalQueryString = cleanQueryString ? `?${cleanQueryString}` : ''
            switch (gateway) {
                case "vnpay":
                    paymentVerifyEndpoint = `payment-gate/verify/vnpay${finalQueryString}`
                    break
                case "momo":
                    paymentVerifyEndpoint = `payment-gate/verify/momo${finalQueryString}`
                    break
                case "zalopay":
                    paymentVerifyEndpoint = `payment-gate/verify/zalopay${finalQueryString}`
                    break
                case "stripe": 
                    paymentVerifyEndpoint = `payment-gate/verify/stripe${finalQueryString}`
                    break
            }

            console.log(paymentVerifyEndpoint)

            try {
                const response = await api.get(paymentVerifyEndpoint)

                console.log(response.data)

                if (response.data.message === "success") {
                    router.replace('/payment/done')
                }
            } catch (error) {
                console.log(error)   
            }

        }
        if (params.toString()) {
            verifyPayment()
        }
    },[params,router])

    return (
        <div>Day la trang check</div>
    )
}

export default PaymentCheck