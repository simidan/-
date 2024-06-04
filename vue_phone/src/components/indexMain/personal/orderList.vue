<template>
<div class="index">
  <van-row class="index_page">
    <van-col span="24">
      <headerVue>
        <template v-slot>
          <p style="font-size: 1.2rem;font-weight: 600;color: rgba(87, 87, 87, 0.8);">订单</p>
        </template>
      </headerVue>
    </van-col>
    <van-col span="24">
      <div class="shopCart" @scroll="">
        <ul>
          <li v-for="item in orderList" :key="item.order_id">
            <div class="cart_item_two">
              <img crossorigin="anonymous" v-if="item.product_image" :src="item.product_image" class="product-image">
            </div>
            <div class="cart_item_three">
              <div class="name">{{ item.product_name }}</div>
              <div class="delete">
                订单号：{{ item.order_id }}
              </div>
              <div class="count">
                <div class="stepper">
                  x{{ item.quantity }}
                </div>
                <div class="total">
                  ￥{{ item.total_amount }}
                </div>
              </div>
            </div>
            <div class="cart_item_forth">
              <van-button type="danger" v-if="item.payment_status==='unpaid'" @click="goPay(item.order_id)">去支付</van-button>
              <P v-else-if="item.payment_status==='success'">已支付</P>
              <P v-else-if="item.payment_status==='failed'">失败</P>
            </div>
          </li>
        </ul>
      </div>
    </van-col>
  </van-row>
</div>
</template>

<script lang="ts" setup>
import headerVue from '@/components/header/index.vue'
import messageBox from '@/utils/messageBox';
import { onMounted, ref } from 'vue';

import locationControl from '@/store/location';
import orderGetControl from '@/store/order/orderGet'
import router from '@/router';

const locationStore = locationControl();
const orderGetStore = orderGetControl()

const orderList = ref<any>([])
const pageLimit = ref({
  page:1,
  limit:10
})
const totalPages = ref(1)

const getOrder = async()=>{
  try{
    const res = await orderGetStore.orderGet(pageLimit.value)
    if (res.statusCode === 200) {
      const newData = res.data.map(product => ({
        ...product,
        product_image: product.product_image ? product.product_image.replace('http://localhost:9000', locationStore.location) : undefined,
      }))
      console.log(newData);
      
      orderList.value = [...orderList.value, ...newData];
      totalPages.value = res.pagination.totalPages;
      messageBox(res.message);
    }else{
      messageBox(res.message);
    }
  }catch{
    messageBox('订单获取失败')
  }
}

const goPay = (order_id:number)=>{
  router.replace({path:'/pay',query:{order_id}})
}

onMounted(()=>{
  getOrder()
})
</script>

<style lang="scss" scoped>
.shopCart{
  width: calc(100 * var(--vw));
  height: calc(92 * var(--vh));
  overflow: auto;

  ul{
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: center;

    li{
      position: relative;
      height: calc(20 * var(--vh));
      width: calc(98 * var(--vw));
      background-color: #fff;
      margin-top: 10px;
      border-radius: 10px;

      display: flex;
      align-content: center;

      
      .delete{
        position: absolute;
        top: 0;
        left: 0;
        color: rgba(88, 88, 88, 0.518);
        font-size: 1rem;
        height: calc(8 * var(--vh));
        width: calc(40 * var(--vw));
      }

      .cart_item_two,
      .cart_item_three,
      .cart_item_forth{
        height: 100%;

        img{
          height: 60%;
          aspect-ratio: 1 / 1;
          border-radius: 10px;
        }
      }

      .cart_item_two{
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;

        margin-left: calc(2 * var(--vw));
      }

      .cart_item_three{
        width: calc(50 * var(--vw));
        height: calc(20 * var(--vh));
        margin-left: calc(2 * var(--vw));

        .name{
          margin-top: calc(2 * var(--vh));
          height: calc(6 * var(--vh));
          width: calc(50 * var(--vw));
          font-weight: 600;
          color: rgba(65, 65, 65, 0.8);

          display: flex;
          line-height: calc(8 * var(--vh));
        }

        .count{
          height: calc(12 * var(--vh));
          width: calc(50 * var(--vw));

          display: flex;
          
          .total{
            width: calc(20 * var(--vw));
            line-height: calc(12 * var(--vh));
            margin-left: calc(10 * var(--vw));
          }

          .stepper{
            line-height: calc(12 * var(--vh));
            
            .item{
              margin-top: calc(4 * var(--vh));
            }
          }
        }
      }

      .cart_item_forth{
        width: calc(20 * var(--vw));
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;

        color: red;
      }
    }
  }
}
</style>