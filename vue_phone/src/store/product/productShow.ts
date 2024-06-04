import { productShowApi } from "@/api";
import { defineStore } from "pinia";

interface pageLimit{
  page:number,
  limit:number
}

const productShowControl = defineStore('productShow',()=>{
  const productShow = async(info:pageLimit)=>{
    const res = await productShowApi(info)
    return res.data
  }

  return { productShow, }
})

export default productShowControl