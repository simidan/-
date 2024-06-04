<template>
  <div class="index">
    <van-row class="index_page">
      <van-col span="24">
        <headerVue>
          <template v-slot>
            <p style="font-size: 1.2rem;font-weight: 600;color: rgba(87, 87, 87, 0.8);" v-if="path ==='/shopCart'">购物车</p>
            <p style="font-size: 1.2rem;font-weight: 600;color: rgba(87, 87, 87, 0.8);" v-if="path ==='/personal'">账户设置</p>
          </template>
        </headerVue>
      </van-col>
      <van-col span="24">
        <indexMainVue></indexMainVue>
      </van-col>
      <van-col span="24" class="footer">
        <footerVue></footerVue>
      </van-col>
    </van-row>
  </div>
</template>

<script setup lang="ts">
import headerVue from '@/components/header/index.vue'
import indexMainVue from '@/components/indexMain/index.vue'
import footerVue from '@/components/footer/index.vue'
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';

const route = useRoute()

const path = ref('')

watch(() => route.path, (newPath) => {
  path.value = newPath
});

onMounted(()=>{
  path.value = route.path
})
</script>

<style lang="scss" scoped>
.index{
  height: calc(100 * var(--vh));;
  width: calc(100 * var(--vw));;

  .index_page{
    height: 100%;
    width: 100%;

    .footer{
      margin-top: auto;
    }
  }
}
</style>
