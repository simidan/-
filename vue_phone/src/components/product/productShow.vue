<template>
  <div class="index">
    <van-row class="index_page">
      <van-col span="24">
        <headerVue>
          <template v-slot>
            <p style="font-size: 1.2rem;font-weight: 600;color: rgba(87, 87, 87, 0.8);">商品页面</p>
          </template>
        </headerVue>
      </van-col>
      <van-col span="24">
        <div class="product">
          <div class="image">
            <img crossorigin="anonymous" :src="productInfo.image" alt="">
          </div>
          <div class="price">
            <p class="one">
              价格：
            </p>
            <p class="two">
              ￥
            </p>
            <p class="three">
              {{ productInfo.price }}
            </p>
            <p class="four">
              /{{ productInfo.unit }}
            </p>
          </div>
          <div class="name">
            <p>
              {{ productInfo.name }}
            </p>
          </div>
          <div class="description">
            <p class="one">
              介绍:
            </p>
            <p class="two">
              {{ productInfo.description }}
            </p>
          </div>
          <div class="origin">
            <p class="one">
              产地:
            </p>
            <p class="two">
              {{ productInfo.origin }}
            </p>
          </div>
          <div class="harvest_date">
            <p class="one">
              采摘日期:
            </p>
            <p class="two">
              {{ productInfo.harvest_date }}
            </p>
          </div>
          <div class="shelf_life">
            <p class="one">
              保质期:
            </p>
            <p class="two">
              {{ productInfo.shelf_life }}天
            </p>
          </div>
          <div class="certification">
            <p class="one">
              认证：
            </p>
            <p class="two">
              {{ productInfo.certification }}
            </p>
          </div>
          <div class="season">
            <p class="one">
              应季：
            </p>
            <p class="two">
              {{ productInfo.season }}
            </p>
          </div>
          <div class="safety_standards">
            <p class="one">
              安全标准：
            </p>
            <p class="two">
              {{ productInfo.safety_standards }}
            </p>
          </div>
          <div class="storage_conditions">
            <p class="one">
              保存条件：
            </p>
            <p class="two">
              {{ productInfo.storage_conditions }}
            </p>
          </div>
          <div class="grade">
            <p class="one">
              级别：
            </p>
            <p class="two">
              {{ productInfo.grade }}
            </p>
          </div>
        </div>
        <div class="footer">
          <van-button plain type="success" class="one" @click="showPopup">加入购物车</van-button>
          <van-button type="danger" class="two" @click="goPay">去购买</van-button>
        </div>
        <van-popup v-model:show="show"
          position="bottom"
          :style="{ height: '30%' }">
          <div class="popup">
            <p class="name">
              {{ productInfo.name }}
            </p>
            <div class="stepper">
              <van-stepper v-model="quantity"/>
            </div>
            <van-button type="danger" class="two" @click="updateCart">加入购物车</van-button>
          </div>
        </van-popup>
        <van-popup
          
        />
      </van-col>
    </van-row>
  </div>
</template>

<script setup lang="ts">
import headerVue from '@/components/header/index.vue'
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

import locationControl from '@/store/location'
import productDetailControl from '@/store/product/productDetail'
import updateCartControl from '@/store/shopCart/updateCart'
import messageBox from '@/utils/messageBox';
import router from '@/router';

const locationStore = locationControl()
const productDetailStore = productDetailControl()
const updateCartSrore = updateCartControl()

const route = useRoute()
const productId = Number(route.query.productId)
const productInfo = ref<any>({})
const quantity = ref(1)

const show = ref(false);
const showPopup = () => {
  show.value = true;
};

const getProductDetail = async()=>{
  try {
    const res = await productDetailStore.productDetail(productId)
    if(res.statusCode === 200){
      res.data.image = res.data.image.replace('http://localhost:9000', locationStore.location);
      productInfo.value = {...res.data}
      messageBox(res.message)
    }else{
      messageBox(res.message)
    }
  } catch (error) {
    messageBox('商品信息获取失败')
  }
}

const updateCart = async()=>{
  const info = {
    productId:productId,
    quantity:quantity.value,
  }
  try {
    const res = await updateCartSrore.updateCart(info)
    if(res.statusCode === 200){
      messageBox(res.message)
    }else{
      messageBox(res.message)
    }
  } catch (error) {
    messageBox('添加失败')
  }
}

const goPay = ()=>{
  router.push({path:'/pay',query:{product_id:productId}})
}

onMounted(()=>{
  getProductDetail()
})
</script>

<style lang="scss" scoped>

.product{
  width: calc(100*var(--vw));
  height: calc(84*var(--vh));
  overflow: scroll;
  
  .image{
    width: calc(100*var(--vw));
    height: calc(40*var(--vh));
    display: flex;
    justify-content: center;
    border-bottom: 1px solid gray;
    border-top: 1px solid gray;
    background-color: #fff;

    img{
      height: calc(40*var(--vh));
      aspect-ratio: 1 / 1;
    }
  }

  .price{
    width: calc(100*var(--vw));
    height: calc(10*var(--vh));
    background-image: linear-gradient(to right, rgba(2, 202, 26, 0.81), rgba(2, 202, 26, 0.2));
    color: #fff;
    font-size: 1.5rem;

    display: flex;
    flex-wrap: wrap;
    align-content: center;

    .one,
    .two,
    .three,
    .four{
      font-size: 1rem;
      color: #fff;
      line-height: calc(10*var(--vh));
    }
    .one{
      margin-left: calc(10*var(--vw));
    }

    .three{
      font-size: 2rem;
    }
    .four{
      font-size: 1.2rem;
    }
  }

  .name{
    width: calc(100*var(--vw));
    height: calc(7*var(--vh));
    background-color: #fff;

    p{
      font-size: 1rem;
      line-height: calc(6*var(--vh));
      margin-left: calc(10*var(--vw));
      font-size: 1.5rem;
      color: red;
      font-weight: 600;
    }
  }

  .description{
    width: calc(100*var(--vw));
    background-color: #fff;
    padding-bottom: calc(2*var(--vh));
    display: flex;
    border-radius: 0 0 10px 10px ;

    .one{
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: calc(5*var(--vw));
    }

    .two{
      margin-top: calc(.5*var(--vh));
    }
  }

  .origin{
    width: calc(100*var(--vw));
    background-color: #fff;
    padding-bottom: calc(2*var(--vh));
    display: flex;
    margin-top: calc(1*var(--vh));
    border-radius: 10px 10px 0 0;

    .one{
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: calc(5*var(--vw));
    }

    .two{
      margin-top: calc(.5*var(--vh));
    }
  }

  .harvest_date{
    width: calc(100*var(--vw));
    background-color: #fff;
    padding-bottom: calc(2*var(--vh));
    display: flex;

    .one{
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: calc(5*var(--vw));
    }

    .two{
      margin-top: calc(.5*var(--vh));
    }
  }

  .shelf_life{
    width: calc(100*var(--vw));
    background-color: #fff;
    padding-bottom: calc(2*var(--vh));
    display: flex;

    .one{
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: calc(5*var(--vw));
    }
  }

  .certification{
    width: calc(100*var(--vw));
    background-color: #fff;
    padding-bottom: calc(2*var(--vh));
    display: flex;

    .one{
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: calc(5*var(--vw));
    }
  }

  .season{
    width: calc(100*var(--vw));
    background-color: #fff;
    padding-bottom: calc(2*var(--vh));
    display: flex;

    .one{
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: calc(5*var(--vw));
    }
  }

  .safety_standards{
    width: calc(100*var(--vw));
    background-color: #fff;
    padding-bottom: calc(2*var(--vh));
    display: flex;

    .one{
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: calc(5*var(--vw));
    }
  }

  .storage_conditions{
    width: calc(100*var(--vw));
    background-color: #fff;
    padding-bottom: calc(2*var(--vh));
    display: flex;

    .one{
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: calc(5*var(--vw));
    }
  }

  .grade{
    width: calc(100*var(--vw));
    background-color: #fff;
    padding-bottom: calc(2*var(--vh));
    display: flex;
    border-radius: 0 0 10px 10px ;
    margin-bottom: calc(2*var(--vh));

    .one{
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: calc(5*var(--vw));
    }
  }
}

.footer{
  width: calc(100*var(--vw));
  height: calc(8*var(--vh));
  background-color: #eeeeee;
  border-top: 1px solid gray;

  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: end;

  .stepper{
    margin-right: calc(10*var(--vw));
  }

  .two{
    margin-right: calc(5*var(--vw));
  }

  .one{
    margin-right: calc(10*var(--vw));
  }
}

.popup{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;

  .name{
    text-align: center;
    margin-top: calc(5*var(--vh));
    font-size: 1rem;
  }

  .stepper{
    display: flex;
    justify-content: center;
    width: calc(100*var(--vw));
    height: calc(10*var(--vh));
    margin-top: calc(5*var(--vh));
  }
}
</style>
