<template>
  <van-row>
    <van-col span="24">
      <div class="shopCart" @scroll="debouncedHandleScroll">
        <ul>
          <li v-for="item in shopCartList" :key="item.order_id">
            <div class="cart_item_one">
              <van-checkbox v-model="item.isSelected"></van-checkbox>
            </div>
            <div class="cart_item_two">
              <img crossorigin="anonymous" v-if="item.image" :src="item.image" class="product-image">
            </div>
            <div class="cart_item_three">
              <div class="name">{{ item.name }}</div>
              <div class="delete" @click="check(item.productId,'delete')">
                删除
              </div>
              <div class="count">
                <div class="total">
                  ￥{{ (item.quantity * item.price).toFixed(2) }}
                </div>
                <div class="stepper">
                  <van-stepper v-model="item.quantity" @change="debounceUpdateShopCart(item.productId,item.quantity)" class="item"/>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="footer">
        <div class="box">
          <van-checkbox v-model="selectAll" @change="toggleSelectAll">全选</van-checkbox>
        </div>
        <div class="total" >
          <P>合计:</P>
          ￥{{ totalPrice }}
        </div>
        <div class="button">
          <van-button type="success" v-show="selectAll" @click="clearShopCart(0,'clear')">清空</van-button>
          <van-button type="danger" class="submit" @click="settlement">结算</van-button>
        </div>
      </div>
    </van-col>
  </van-row>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';

import locationControl from '@/store/location';
import getCartControl from '@/store/shopCart/getCartApi';
import updateCartControl from '@/store/shopCart/updateCart'
import manageCartControl from '@/store/shopCart/manageCart'

import { showConfirmDialog } from 'vant';
import messageBox from '@/utils/messageBox';
import { debounce } from '@/utils/debounce';
import router from '@/router';

interface PageLimit {
  page: number;
  limit: number;
}

interface manageCart {
  productId:number|number[],
  action:string,
}

const locationStore = locationControl();
const getCartStore = getCartControl();
const updateCartStore = updateCartControl()
const manageCartStore = manageCartControl()

const pageLimit = ref<PageLimit>({
  page: 1,
  limit: 10,
});
const totalPages = ref(0);
const shopCartList = ref<any[]>([]);

const selectAll = computed({
  get: () => shopCartList.value.every(item => item.isSelected),
  set: (newValue) => {
    shopCartList.value.forEach(item => item.isSelected = newValue);
  },
});

const totalPrice = computed(() => {
  const total = shopCartList.value
    .filter(item => item.isSelected)
    .reduce((sum, item) => sum + item.quantity * item.price, 0 )
  return parseFloat(total.toFixed(2));
});

const toggleSelectAll = (newValue: boolean) => {
  selectAll.value = newValue;
};

const getShopCart = async () => {
  try {
    const res = await getCartStore.getCart(pageLimit.value);
    if (res.statusCode === 200) {
      const newData = res.data.map(product => ({
        ...product,
        isSelected: false, // Initialize isSelected as false
        image: product.image ? product.image.replace('http://localhost:9000', locationStore.location) : undefined,
      }));
      shopCartList.value = [...shopCartList.value, ...newData];
      totalPages.value = res.pagination.totalPages;
      messageBox(res.message);
    }else{
      messageBox(res.message);
    }
  } catch {
    messageBox('加载失败请刷新');
  }
};

const updateShopCart = async(productId:number,quantity:number)=>{
  try{
    const info = { 'productId': productId, 'quantity': quantity }
    const res = await updateCartStore.updateCart(info)
    if(res.statusCode === 200){
      messageBox(res.message)
    }else{
      messageBox(res.message)
    }
  }catch{
    messageBox('数据修改失败')
  }
}

async function clearShopCart(productId: number | number[], action: string){
  const info:manageCart = {productId,action}
  try{
    const res = await manageCartStore.manageCart(info)
    if(res.statusCode = 200){
      shopCartList.value = []
      messageBox(res.message)
      getShopCart()
    }else{
      messageBox(res.message)
    }
  }catch{
    messageBox('清空失败')
  }
}

function check(productId: number | number[], action: string) {
  // 首先显示测试消息
  showConfirmDialog({
    title: '清空购物车',
    message:'确认清空购物车吗？',
  })
    .then(() => {
      clearShopCart(productId,action)
    })
    .catch(() => {
    });
}

const debounceUpdateShopCart = debounce(updateShopCart, 1000);

const settlement = ()=>{
  const idGroup =  shopCartList.value.filter(product => product.isSelected).map(product => product.productId)
  const idGroupStr = idGroup.join(',');
  router.replace({path:'/pay',query:{product_id:idGroupStr}})
}

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const { scrollTop, offsetHeight, scrollHeight } = target;
  if (scrollHeight - (scrollTop + offsetHeight) < 100) {
    console.log(totalPages.value);
    if (pageLimit.value.page < totalPages.value) {
        pageLimit.value.page += 1;
        getShopCart()
      }
  }
};

const debouncedHandleScroll = debounce(handleScroll, 300);

onMounted(() => {
  getShopCart();
});
</script>


<style scoped lang="scss">
.shopCart{
  width: calc(100 * var(--vw));
  height: calc(76 * var(--vh));
  overflow: auto;

  ul{
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: center;

    li{
      height: calc(20 * var(--vh));
      width: calc(98 * var(--vw));
      background-color: #fff;
      margin-top: 10px;
      border-radius: 10px;

      display: flex;
      align-content: center;

      .cart_item_one,
      .cart_item_two,
      .cart_item_three{
        height: 100%;

        img{
          height: 60%;
          aspect-ratio: 1 / 1;
          border-radius: 10px;
        }
      }

      .cart_item_one{
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        width: calc(10 * var(--vw));
      }

      .cart_item_two{
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
      }

      .cart_item_three{
        position: relative;
        width: calc(65 * var(--vw));
        height: calc(20 * var(--vh));
        margin-left: calc(2 * var(--vw));

        .name{
          height: calc(8 * var(--vh));
          width: calc(50 * var(--vw));
          font-weight: 600;
          color: rgba(65, 65, 65, 0.8);

          display: flex;
          line-height: calc(8 * var(--vh));
        }

        .delete{
          position: absolute;
          top:10%;
          left: 80%;
          color: red;
          font-size: 1rem;
          font-weight: 600;
        }

        .count{
          height: calc(12 * var(--vh));
          width: calc(60 * var(--vw));

          display: flex;
          
          .total{
            width: calc(20 * var(--vw));
            line-height: calc(12 * var(--vh));
          }

          .stepper{
            margin-left: calc(10 * var(--vw));
            
            .item{
              margin-top: calc(4 * var(--vh));
            }
          }
        }
      }
    }
  }
}

.footer{
  width: calc(100 * var(--vw));
  height: calc(8 * var(--vh));
  background-color: rgba(255, 255, 255, 0.427);
  margin-top: auto;

  display: flex;
  flex-wrap: wrap;
  align-content: center;

  .box{
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    margin-left: calc(2 * var(--vw));
  }

  .total{
    display: flex;
    width: calc(30 * var(--vw));
    margin-left: calc(5 * var(--vw));
    text-align: center;
    line-height: calc(8 * var(--vh));
  }

  .button{
    width: calc(40 * var(--vw));
    height: calc(8 * var(--vh));

    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    align-content: center;

    .submit{
      margin-left: calc(1 * var(--vw));
    }
  }
}
</style>