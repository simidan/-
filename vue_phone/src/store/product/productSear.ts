import { productSearchApi, } from "@/api";
import { defineStore } from "pinia";

interface SearchInfo0 {
  name: string;
  limit: number;
  page: number;
  sortBy: string;
  order: string;
  origin: string;
  harvestDateStart: string;
  harvestDateEnd: string;
}

const productSearchControl = defineStore('productSearch',()=>{
  
  const productSearch = async(info:SearchInfo0)=>{
    const res = await productSearchApi(info)
    return res.data
  }

  return { productSearch, }
})

export default productSearchControl