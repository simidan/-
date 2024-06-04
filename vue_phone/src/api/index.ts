import request from "@/api/request";
import { userMessage } from "@/utils/interface";
import requestFrom from "@/api/requestFrom";

//token验证
//==========================================================================================================================
export const tokenCheckApi = (token:string)=>{
  return request.post('GAPshop/users/checkToken',{'token':token})
}

//用户操作
//==========================================================================================================================
interface loginInfo {
  phone: string;
  password: string;
}
export const loginApi = (loginInfo:loginInfo)=>{
  return request.post('GAPshop/users/login',loginInfo)
}

interface registerInfo extends Omit<userMessage, 'avatar'|'full_name'|'default_address'> {}
export const registerApi = (registerInfo:registerInfo)=>{
  return request.post('GAPshop/users/register',registerInfo)
}

interface userUpdate extends Omit<userMessage, 'password'>{
  user_id:number
}
export const userUpdateApi = (userInfo:userUpdate)=>{
  return request.put('GAPshop/users/userUpdate',userInfo)
}

export const avatarUpdateApi = (userId:number,fromData:any)=>{
  return requestFrom.post(`GAPshop/admin/userControl/avatarUpdate/${userId}`,fromData)
}

//应节好物
//==========================================================================================================================
export const productSeasonApi = (month: number) => {
  return request.get('GAPshop/shopSmall/product/productSeason', {
    params: { month }
  })
}

//产品
//==========================================================================================================================
interface pageLimit{
  page:number,
  limit:number
}
export const productShowApi = (info:pageLimit) => {
  return request.get('GAPshop/shopSmall/product/productShow', {
    params: info
  })
}

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

export const productSearchApi = (info:SearchInfo0)=>{
  return request.get('GAPshop/shopSmall/product/productSearch', {
    params: info
  })
}

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

export const productSearchOtherApi = (info:SearchInfo1)=>{
  return request.get('GAPshop/shopSmall/product/productSearchByCategory', {
    params: info
  })
}

export const productDetailApi = (product_id:number|string)=>{
  return request.get('GAPshop/shopSmall/product/productDetail', {
    params: {product_id}
  })
}

//购物车
//==========================================================================================================================
export const getCartApi = (info:pageLimit)=>{
  return request.get('GAPshop/shopSmall/shopCart/getCart',{
    params:info
  })
}
interface Cart {
  productId:number,
  quantity:number
}
export const updateCartApi = (info:Cart)=>{
  return request.post('GAPshop/shopSmall/shopCart/updateCart',info)
}
interface manageCart {
  productId:number|number[],
  action:string,
}
export const manageCartApi = (info:manageCart)=>{
  return request.post('GAPshop/shopSmall/shopCart/manageCart',info)
}

//订单
//==========================================================================================================================
export const orderGetApi = (info:pageLimit)=>{
  return request.get('GAPshop/shopSmall/order/orderGet',{
    params: info
  })
}
export const orderDetailApi = (order_id:number)=>{
  return request.get('GAPshop/shopSmall/order/orderDetail',{
    params: {orderId:order_id}
  })
}
interface orderUpdate {
  orderId:number,
  paymentStatus:string
}
export const orderUpdateApi = (info:orderUpdate)=>{
  return request.post('GAPshop/shopSmall/order/orderUpdate',info)
}

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

export const orderCreateApi = (info:orderCreate)=>{
  return request.post('GAPshop/shopSmall/order/orderCreate',info)
}