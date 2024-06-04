import { updateCartApi } from "@/api";
import { defineStore } from "pinia";

interface Cart {
  productId:number,
  quantity:number
}

const updateCartControl = defineStore('updateCart',()=>{
  
  const updateCart = async(info:Cart)=>{
    const res = await updateCartApi(info)
    return res.data
  }

  return { updateCart, }
})

export default updateCartControl