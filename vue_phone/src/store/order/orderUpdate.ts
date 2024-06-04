import { orderUpdateApi } from "@/api";
import { defineStore } from "pinia";

interface orderUpdate {
  orderId:number,
  paymentStatus:string
}

const orderUpdateControl = defineStore('orderUpdate',()=>{
  
  const orderUpdate = async(info:orderUpdate)=>{
    const res = await orderUpdateApi(info)
    return res.data
  }

  return { orderUpdate, }
})

export default orderUpdateControl