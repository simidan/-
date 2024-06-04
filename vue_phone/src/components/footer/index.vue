<template>
  <van-row>
    <van-col span="24">
      <div class="footer">
        <van-row>
          <van-col span="6">
            <div :class="{ 'active-footer-item': currentPath === '/' }" class="footer_index" @click="pushRouter('/')">
              <img src="@/assets/logo.png" alt="">
              <p>首页</p>
            </div>
          </van-col>
          <van-col span="6">
            <div :class="{ 'active-footer-item': currentPath === '/classify' }" class="footer_index" @click="pushRouter('/classify')">
              <van-icon class="footer_icon" name="list-switching" />
              <p>分类</p>
            </div>
          </van-col>
          <van-col span="6">
            <div :class="{ 'active-footer-item': currentPath === '/shopCart' }" class="footer_index" @click="pushRouter('/shopCart')">
              <van-icon class="footer_icon" name="cart-o" />
              <p>购物车</p>
            </div>
          </van-col>
          <van-col span="6">
            <div :class="{ 'active-footer-item': currentPath === '/personal' }" class="footer_index" @click="pushRouter('/personal')">
              <van-icon class="footer_icon" name="contact-o" />
              <p>我的</p>
            </div>
          </van-col>
        </van-row>
      </div>
    </van-col>
  </van-row>
</template>
<script setup lang="ts">
import router from '@/router';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const pushRouter = (path:string)=>{
  router.push(path)
}

const currentPath = computed(() => route.path);
</script>

<style scoped lang="scss">
.footer{
  background-color: #fff;
  height: calc(8 * var(--vh));

  .footer_index{
    height: calc(8 * var(--vh));;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    text-align: center;

    img{
      height: calc(4 * var(--vh));;
    }

    p{
      font-weight: 600;
    }

    .footer_icon{
      font-size: 1.5rem
    }

    &:active{
      color: red;
    }
  }

  .active-footer-item {
    color: red;
  }
}
</style>