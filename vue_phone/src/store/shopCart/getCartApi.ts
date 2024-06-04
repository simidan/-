import { getCartApi } from "@/api";
import { defineStore } from "pinia";

interface pageLimit{
  page:number,
  limit:number
}

const getCartControl = defineStore('getCart',()=>{
  
  const getCart = async(info:pageLimit)=>{
    const res = await getCartApi(info)
    return res.data
  }

  return { getCart, }
})

export default getCartControl