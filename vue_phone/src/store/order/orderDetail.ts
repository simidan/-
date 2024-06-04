import { orderDetailApi } from "@/api";
import { defineStore } from "pinia";

const orderDetailControl = defineStore('orderDetail',()=>{
  
  const orderDetail = async(order_id:number)=>{
    const res = await orderDetailApi(order_id)
    return res.data
  }

  return { orderDetail, }
})

export default orderDetailControl