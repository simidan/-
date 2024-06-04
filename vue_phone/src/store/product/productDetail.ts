
import { productDetailApi } from "@/api";
import { defineStore } from "pinia";

const productDetailControl = defineStore('productDetail',()=>{
  
  const productDetail = async(product_id:number|string)=>{
    const res = await productDetailApi(product_id)
    return res.data
  }

  return { productDetail, }
})

export default productDetailControl