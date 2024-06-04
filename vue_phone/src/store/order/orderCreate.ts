import { orderCreateApi } from "@/api";
import { defineStore } from "pinia";

interface OrderItem {
  productId: number;
  quantity: number;
}
interface orderCreate {
  productId?:number,
  payment_method:string,
  shippingAddress:string,
  quantity?:number
  items?: OrderItem[];
}

const orderCreateControl = defineStore('orderCreate',()=>{
  
  const orderCreate = async(info:orderCreate)=>{
    const res = await orderCreateApi(info)
    return res.data
  }

  return { orderCreate, }
})

export default orderCreateControl