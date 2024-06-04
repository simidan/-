import { productSearchOtherApi } from "@/api";
import { defineStore } from "pinia";

interface SearchInfo1 {
  category_id: number;
  sub_category_id: number;
  limit: number;
  page: number;
  sortBy: string;
  order: string;
  origin: string;
  harvestDateStart: string;
  harvestDateEnd: string;
}

const productSearchOtherControl = defineStore('productSearchOther',()=>{
  const SearchInfoOther = {
    category_id: 0,
    sub_category_id: 0,
    limit: 10,
    page: 1,
    sortBy:'',
    order: '',
    origin: '',
    harvestDateStart: '',
    harvestDateEnd: '',
  }
  
  const productSearchOther = async(info:SearchInfo1)=>{
    const res = await productSearchOtherApi(info)
    return res.data
  }

  return { productSearchOther, SearchInfoOther, }
})

export default productSearchOtherControl