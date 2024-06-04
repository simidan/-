import { orderGetApi } from "@/api";
import { defineStore } from "pinia";

interface pageLimit{
  page:number,
  limit:number
}

const orderGetControl = defineStore('orderGet',()=>{
  
  const orderGet = async(info:pageLimit)=>{
    const res = await orderGetApi(info)
    return res.data
  }

  return { orderGet, }
})

export default orderGetControl