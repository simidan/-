import { manageCartApi } from "@/api";
import { defineStore } from "pinia";

interface manageCart {
  productId:number|number[],
  action:string,
}

const manageCartControl = defineStore('manageCart',()=>{
  
  const manageCart = async(info:manageCart)=>{
    const res = await manageCartApi(info)
    return res.data
  }

  return { manageCart, }
})

export default manageCartControl