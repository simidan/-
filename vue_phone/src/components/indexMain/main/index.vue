<template>
<van-row class="main" @scroll="debouncedHandleScroll">
  <van-col span="24">
    <ul>
      <li v-for="(item) in productInfos" :key="item.product_id" @click="goProduct(item.product_id)">
        <div class="show">
          <div class="image">
            <img crossorigin="anonymous" :src="item.image" alt="">
          </div>
          <div class="name van-multi-ellipsis--l2">
            <p>{{ item.name }}</p>
          </div>
          <div class="price">
            ￥<p>{{ item.price }}</p>
          </div>
        </div>
      </li>
      <van-loading right="60vw" bottom="40px"/>
    </ul>
  </van-col>
  <van-back-top />
</van-row>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import messageBox from '@/utils/messageBox'

import locationControl from '@/store/location'
import productShowControl from '@/store/product/productShow'

import { debounce } from '@/utils/debounce';
import router from '@/router';

const locationStore = locationControl()
const productShowStore = productShowControl()

interface Product {
  business_id: number;
  certification: string;
  created_at: string; // Could potentially be represented as Date or string depending on usage
  description: string;
  grade: string;
  harvest_date: string; // Could potentially be represented as Date or string depending on usage
  image: string;
  name: string;
  origin: string;
  price: number;
  product_id: number;
  safety_standards: string;
  season: string;
  shelf_life: number;
  status: number;
  stock_quantity: number;
  storage_conditions: string;
  sub_category_id: number;
  unit: string;
  updated_at: string; // Could potentially be represented as Date or string depending on usage
}

const load = ref(true)
const pageLimit = ref({
  page:1,
  limit:10,
})
const totalPages = ref(0)
const productInfos = ref<Product[]>([]);

const getProduct = async() => {
  load.value = true
  try {
    const res = await productShowStore.productShow(pageLimit.value)
    if (res.statusCode === 200) {
      res.data.forEach(product => {
        if (product.image && typeof product.image === 'string') {
          product.image = product.image.replace('http://localhost:9000', locationStore.location);
        }
      });
      // 将新加载的产品数据添加到原有的 productInfos 数组中
      productInfos.value.push(...res.data);
      totalPages.value = res.pagination.totalPages
    }
  } catch {
    messageBox('加载失败')
  }
};

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const { scrollTop, offsetHeight, scrollHeight } = target;

  if (scrollHeight - (scrollTop + offsetHeight) < 100) {
    if(pageLimit.value.page<5){
      if (pageLimit.value.page < totalPages.value) {
        pageLimit.value.page += 1;
        getProduct();
      }
    }
  }
};

const debouncedHandleScroll = debounce(handleScroll, 300);

const goProduct = (productId:number)=>{
  router.push({path:'/productShow',query:{productId}})
}

onMounted(()=>{
  setTimeout(() => {
    getProduct()
  }, 1000);
})
</script>

<style scoped lang="scss">
.main{
  background-color: white;
  height: 100%;
  width: 100%;
  overflow: auto;

  ul{
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-around;

    width: 100%;
    background-color: rgba(214, 214, 214, 0.3);

    li{
      width: 48%;
      margin-top: 5px;
      margin-bottom: 5px;

      .show{
        height: calc(40 * var(--vh));
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;

        .image{
          width: 100%;

          img{
            width: 100%;
            aspect-ratio: 1 / 1;
          }
        }

        .name{
          padding: 5px 10px 5px 10px;
          height: calc(6 * var(--vh));
        }

        .price{
          display: flex;
          color: red;

          p{
            font-size: 1.5rem;
          }
        }
      }
    }
  }
}
</style>