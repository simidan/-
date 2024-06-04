export interface userMessage{
    username: string,
    password:string,
    email: string,
    phone: string,
    avatar:string,
    full_name: string,
    gender: string,
    birthday: string,
    default_address: string
}

export interface businessMessage{
  business_id:number,
  businessName: string,
  password: string,
  address: string,
  phone: string,
  email: string,
  image:string
}

export interface productMessage{
  product_id:number,
  sub_category_id: number,
  business_id: number,
  name: string,
  price: number,
  unit: string,
  stock_quantity: number,
  description: string,
  image: string,
  origin: string,
  harvest_date: string,
  shelf_life: number,
  certification: string,
  season: string,
  safety_standards: string,
  storage_conditions: string,
  grade:string
}

export interface orderMessage{
  order_id:number,
  user_id:number,
  business_id:number,
  product_id:number,
  quantity:number
  total_amount: number,
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  payment_method: 'credit_card' | 'alipay' | 'wechat' | 'paypal';
  payment_status: 'unpaid' | 'success' | 'failed';
  shipping_name:string
  shipping_phone:string,
  shipping_address:string
}