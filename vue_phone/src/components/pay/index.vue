<template>
  <div class="index">
    <van-row class="index_page">
      <div class="userMessage">
        <div class="info">
          <div class="name">{{userInfo.username}}</div>
          <div class="phone">{{userInfo.phone}}</div>
        </div>
        <div class="adress">
          <van-field v-model="orderMessage.shipping_address" label="地址" class="adressIn" readonly v-if="order_id"/>
          <van-field v-model="userInfo.defaultAddress" label="地址" class="adressIn" @click="defaultAddressPopup" placeholder="请选择地址" v-else/>
        </div>
      </div>
      <div class="productMessage">
        <div class="title">
          <div class="title_name">
            商品信息:
          </div>
          <div class="title_count">
            共{{ productList.length }}件
          </div>
        </div>
        <ul>
          <li v-for="item in productList" :key="item.product_id">
            <div class="image">
              <img crossorigin="anonymous" :src="item.image" alt="">
            </div>
            <div class="product">
              <div class="product_name">
                {{ item.name }}
              </div>
              <div class="product_number">
                <div class="price">
                  ￥{{ item.price }}
                </div>
                <div class="quantity" v-if="order_id">
                  {{ orderMessage.quantity }}{{ item.unit }}
                </div>
                <div class="quantity" v-if="product_id">
                  <van-stepper v-model="item.quantity" />{{ item.unit }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="countMessage">
        <div class="payment_method">
          <van-radio-group v-model="orderMessage.payment_method" direction="horizontal" disabled v-if="order_id">
            <van-radio name="credit_card">信用卡</van-radio>
            <van-radio name="alipay">支付宝</van-radio>
            <van-radio name="wechat">微信支付</van-radio>
            <van-radio name="paypal">贝宝</van-radio>
          </van-radio-group>
          <van-radio-group v-model="createinfo.payment_method" direction="horizontal" v-if="product_id">
            <van-radio name="credit_card">信用卡</van-radio>
            <van-radio name="alipay">支付宝</van-radio>
            <van-radio name="wechat">微信支付</van-radio>
            <van-radio name="paypal">贝宝</van-radio>
          </van-radio-group>
        </div>
        <div class="total" v-if="order_id">
          总计：{{ orderMessage.total_amount }}
        </div>
        <div class="total" v-if="product_id">
          总计：{{ totalPrice.toFixed(2) }}
        </div>
      </div>
      <div class="footer">
        <van-button type="danger" class="button" @click="check" v-if="order_id">支付</van-button>
        <van-button type="danger" class="button" @click="checkCreate" v-if="product_id">支付</van-button>
      </div>
      <van-popup
        v-model:show="defaultAddress"
        position="bottom"
        :style="{ height: '50%' }"
        @click.stop=""
      >
      <van-area title="标题" :area-list="areaList" @confirm="defaultAddressConfirm" @cancel="defaultAddressCancel"/>
      </van-popup>
    </van-row>
  </div>
</template>

<script setup lang="ts">
import locationControl from '@/store/location'
import orderDetailControl from '@/store/order/orderDetail'
import productDetailControl from '@/store/product/productDetail'
import orderUpdateControl from '@/store/order/orderUpdate'
import orderCreateControl from '@/store/order/orderCreate'
import manageCartControl from '@/store/shopCart/manageCart'

import { areaList } from '@vant/area-data';
import { showConfirmDialog } from 'vant';

import messageBox from '@/utils/messageBox';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import goBack from '@/utils/routerBack';
import router from '@/router'

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

const locationStore = locationControl()
const orderDetailStore = orderDetailControl()
const productDetailStore = productDetailControl()
const orderUpdateStore = orderUpdateControl()
const orderCreateStore = orderCreateControl()
const manageCartStore = manageCartControl()

const route = useRoute()
const order_id = route.query.order_id
const product_id = route.query.product_id

const userInfo = ref<any>({})
const orderMessage = ref<any>({})
const productList = ref<any[]>([]);

const createinfo = ref({
  payment_method:'',
})

const totalPrice = computed(() => {
  return productList.value.reduce((total, product) => {
    const price = parseFloat(product.price);
    const quantity = parseInt(product.quantity, 10);
    return total + price * quantity;
  }, 0); 
});

//获取订单信息
const getOrderDetail = async(order_id:number)=>{
  try {
    const res = await orderDetailStore.orderDetail(order_id)
    if(res.statusCode === 200){
      orderMessage.value = {...res.data}
      messageBox(res.message)
    }else{
      messageBox(res.message)
    }
  } catch (error) {
    messageBox('订单信息获取失败')
  }
}

//获取商品信息
const getProductDetail = async (product_id: string) => {
  try {
    const res = await productDetailStore.productDetail(product_id);
    if (res.statusCode === 200) {
      let data;
      if (typeof product_id === 'string' && product_id.includes(',')) {
        data = Array.isArray(res.data) ? res.data : [res.data];
      } else {
        data = [res.data];
      }

      data.forEach(product => {
        product.image = product.image.replace('http://localhost:9000', locationStore.location);
        product.quantity = 1;
      });

      productList.value = data;
      messageBox(res.message);
    } else {
      messageBox(res.message);
    }
  } catch (error) {
    messageBox('商品信息获取失败');
  }
};

//获取地址选择
const defaultAddress = ref(false)
const defaultAddressPopup = () => {
  defaultAddress.value = true;
};

const defaultAddressConfirm =(value: any)=>{
  userInfo.value.defaultAddress = value.selectedOptions[0].text+'-'+value.selectedOptions[1].text+'-'+value.selectedOptions[2].text
  defaultAddress.value = false
}

const defaultAddressCancel =()=>{
  defaultAddress.value = false;
}

//订单状态更新
const orderUpdate = async()=>{
  try {
    const info = {  'orderId':orderMessage.value.order_id,'paymentStatus': 'success'}
    const res = await orderUpdateStore.orderUpdate(info)
    if(res.statusCode === 200){
      goBack()
      messageBox(res.message)
    }else{
      messageBox(res.message)
    }
  } catch (error) {
    messageBox('支付失败请重试')
  }
}

function check() {
  // 首先显示测试消息
  showConfirmDialog({
    title: '支付',
    message:'确认支付吗？',
  })
    .then(() => {
      orderUpdate()
    })
    .catch(() => {
    });
}

const manageCart = async()=>{
  const idGroup = productList.value.map(product => product.product_id);
  const info = {
    productId:idGroup,
    action:'delete',
  }
  try {
    const res = await manageCartStore.manageCart(info)
    if(res.statusCode === 200){
      messageBox(res.message)
    }else{
      messageBox(res.message)
    }
  } catch (error) {
    messageBox('删除购物车失败')
  }
}

const orderCreate = async()=>{
  let info: orderCreate = {} as orderCreate;
  if(productList.value.length===1){
    const data = productList.value
    info = {
      productId:data[0].product_id,
      payment_method:createinfo.value.payment_method,
      shippingAddress:userInfo.value.defaultAddress,
      quantity:data[0].quantity
    }
  }else{
    const orderItems = productList.value.map(product => ({
      productId: product.product_id,
      quantity: product.quantity
    }));
    info = {
      payment_method:createinfo.value.payment_method,
      shippingAddress:userInfo.value.defaultAddress,
      items:orderItems
    }
  }
  const isInfoValid = info.payment_method && info.shippingAddress && (info.productId || info.items) && (info.productId ? info.quantity : true);

  if (!isInfoValid) {
    messageBox('订单信息不完整，请检查后再试');
    return;
  }
  try {
    const res = await orderCreateStore.orderCreate(info)
    if(res.statusCode === 200){
      messageBox(res.message)
      if(productList.value.length!==1){
        setTimeout(() => {
          manageCart()
        }, 1000);
      }
      goBack()
    }else{
      messageBox(res.message)
    }
  } catch (error) {
    messageBox('支付失败请重试')
  }
}

function checkCreate() {
  // 首先显示测试消息
  showConfirmDialog({
    title: '支付',
    message:'确认支付吗？',
  })
    .then(() => {
      orderCreate()
    })
    .catch(() => {
    });
}

onMounted(()=>{
  const userString = localStorage.getItem('user')
  if(userString){
    userInfo.value = { ...JSON.parse(userString) }
  }
  if(order_id){
    const id = Number(order_id)
    getOrderDetail(id).then(()=>{
      setTimeout(() => {
        getProductDetail(orderMessage.value.product_id)
      }, 1000);
    })
  }
  if(product_id){
    getProductDetail(product_id)
  }
})
</script>

<style lang="scss" scoped>
.userMessage{
  width: calc(100*var(--vw));
  height: calc(20*var(--vh));
  background-color: #fff;
  margin-top: calc(1*var(--vh));
  border-radius: 10px;
  
  .info{
    width: calc(100*var(--vw));
    height: calc(10*var(--vh));

    display: flex;

    .name{
      width: calc(30*var(--vw));
      margin-left: calc(10*var(--vw));
      line-height: calc(10*var(--vh));
      font-size: 1.5rem;
    }
    .phone{
      width: calc(60*var(--vw));
      text-align: center;
      line-height: calc(10*var(--vh));
      font-size: 1.5rem;
      font-weight: 600;
    }
  }

  .adress{
    width: calc(90*var(--vw));
    height: calc(10*var(--vh));
    margin-left: calc(10*var(--vw));

    display: flex;

    .adressIn{
      font-size: 1.2rem;
    }
    :deep(.van-field__label){
        width: calc(15*var(--vw));
    }
  }
}

.productMessage{
  width: calc(100*var(--vw));
  height: calc(40*var(--vh));
  background-color: #fff;
  margin-top: calc(1*var(--vh));
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;

  .title{
    width: calc(100*var(--vw));
    height: calc(5*var(--vh));

    border-bottom: 1px solid rgba(174, 174, 174, 0.5);

    display: flex;

    .title_name{
      width: calc(100*var(--vw));
      line-height: calc(5*var(--vh));
    }

    .title_count{
      width: calc(100*var(--vw));
      line-height: calc(5*var(--vh));
    }
  }

  ul{
    width: calc(98*var(--vw));
    height: calc(35*var(--vh));
    overflow: scroll;
    margin: 10px auto 0 auto;

    li{
      width: calc(98*var(--vw));
      height: calc(30*var(--vh));
      margin-bottom: calc(1*var(--vh));
      border-radius: 10px;
      border: 1px solid rgba(174, 174, 174, 0.5);
      display: flex;

      .image{
        width: calc(40*var(--vw));
        height: calc(29*var(--vh));

        display: flex;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;

        img{
          height: calc(20*var(--vh));
          aspect-ratio: 1 / 1;
        }
      }

      .product{
        width: calc(50*var(--vw));
        height: calc(30*var(--vh));

        .product_name{
          width: calc(50*var(--vw));
          height: calc(14*var(--vh));
          line-height: calc(14*var(--vh));
          font-size: 1.2rem;
        }

        .product_number{
          display: flex;
          width: calc(58*var(--vw));
          height: calc(14*var(--vh));

          .price{
            width: 40%;
            height: calc(14*var(--vh));
            line-height: calc(14*var(--vh));
            font-size: 1.2rem;
            color: red;
          }

          .quantity{
            width: 60%;
            height: calc(14*var(--vh));
            line-height: calc(14*var(--vh));
            font-size: 1.2rem;

            display: flex;
          }
        }
      }
    }
  }
}

.countMessage{
  width: calc(100*var(--vw));
  height: calc(25*var(--vh));
  background-color: #fff;
  margin-top: calc(1*var(--vh));
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: 10px;

  .payment_method{
    width: calc(100*var(--vw));
    height: calc(15*var(--vh));
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    border-bottom: 1px solid rgba(174, 174, 174, 0.5);
  }

  .total{
    width: calc(100*var(--vw));
    height: calc(10*var(--vh));
    line-height: calc(10*var(--vh));
    display: flex;
    justify-content: end;
    margin-right: calc(10*var(--vw));
    font-size: 1.3rem;
    color: red;
  }
}

.footer{
  width: calc(100*var(--vw));
  height: calc(11*var(--vh));
  background-color: #fff;
  margin-top: calc(1*var(--vh));
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  align-content: center;
  border-radius: 10px 10px 0 0;

  .button{
    margin-right: calc(5*var(--vw));
  }
}
</style>
