<template>
  <van-row>
    <van-col span="24">
      <div class="header" v-show="showTarget === 0">
        <div class="header_main" v-if="route.path === '/'">
          <img src="@/assets/logo.png" alt="">
          <van-search
              v-model="searchKey"
              shape="round"
              placeholder="请输入搜索关键词"
              @search="goSearch"
            />
        </div>
        <div class="header_main_one" v-else>
          <van-icon name="arrow-left" class="icon" @click="goBack()"/>
          <van-search
              v-model="searchKey"
              shape="round"
              placeholder="请输入搜索关键词"
              @search="goSearch"
            />
        </div>
      </div>
      <div class="header" v-show="showTarget === 1">
        <div class="header_main_one">
          <van-icon name="arrow-left" class="icon"  @click="goBack()"/>
          <slot></slot>
        </div>
      </div>
    </van-col>
  </van-row>
</template>

<script setup lang="ts">
import router from '@/router';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const searchKey = ref<string>('')

const route = useRoute()

const showTarget = ref(0)

watch(() => route.path, (newPath) => {
  if (newPath === '/login' || newPath === '/shopCart' || newPath === '/personal') {
    showTarget.value = 1;
  } else {
    showTarget.value = 0;
  }
});

const goSearch = ()=>{
  router.push({path:'/Search',query:{'name':searchKey.value}})
}

const goBack = ()=>{
  router.go(-1)
}

onMounted(()=>{
  if (route.path === '/login' || route.path === '/shopCart' || route.path === '/personal' || route.path === '/register' || route.path === '/userMessage' || route.path === '/orderList' || route.path === '/productShow') {
    showTarget.value = 1;
  } else {
    showTarget.value = 0;
  }
})
</script>

<style scoped lang="scss">
.header{
  height: calc(8 * var(--vh));
  background-color: #fff;

  img{
    height: calc(8 * var(--vh));
  }

  .header_main{
    display: flex;
    width: calc(100 * var(--vw));

    .van-search{
      width: calc(86 * var(--vw));;
    }
  }

  .header_main_one{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    width: calc(100 * var(--vw));
    height: calc(8 * var(--vh));

    .icon{
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);

      font-size: calc(6 * var(--vh));
      color: rgba(161, 161, 161, 0.8);
    }
  }
}
</style>