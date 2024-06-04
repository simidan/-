<template>
  <van-row>
    <van-col span="24">
      <div class="classify">
        <div class="aside">
          <ul>
            <li v-for="(item,index) in categoriesGroup" :class="liIndex ===index?'li_active':''" @click="selectIndex(index)">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="main">
          <div class="main_block">
            <ul>
              <li v-for="(item,index) in sub_categoriesGroup[liIndex]" :key="index" @click="searchCategories(index)">
                <img :src="item.image" alt="">
                <p>
                  {{ item.name }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </van-col>
  </van-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import banner1 from "@/assets/蔬菜.jpg";
import banner2 from "@/assets/水果.jpeg";
import banner3 from "@/assets/肉类.jpeg";
import banner4 from '@/assets/谷类.jpeg';
import banner5 from '@/assets/食用油.jpg';
import banner6 from '@/assets/冷冻肉类.jpeg';
import banner7 from '@/assets/干果坚果.jpg';

import router from '@/router';

const categoriesGroup = ref([
  '新鲜农产品',
  '粮油副食',
  '冷冻冷藏食品',
  '休闲食品'
])
const sub_categoriesGroup = ref([
  [{ name: '蔬菜', image: banner1 }, { name: '水果', image: banner2 }, { name: '肉类', image: banner3 }],
  [{ name: '谷类', image: banner4 }, { name: '食用油', image:banner5 }],
  [{ name: '冷冻肉类', image: banner6 }],
  [{ name: '干果坚果', image: banner7 }]
]);

const liIndex = ref<number>(0)

const selectIndex = (index:number)=>{
  liIndex.value = index
}

const sub_categorie = ref(0)

const searchCategories = (index:number)=>{
  sub_categorie.value = index
  if(liIndex.value === 0){
    sub_categorie.value = sub_categorie.value+1
  }
  if(liIndex.value === 1){
    sub_categorie.value = sub_categorie.value+4
  }
  if(liIndex.value === 2){
    sub_categorie.value = sub_categorie.value+6
  }
  if(liIndex.value === 3){
    sub_categorie.value = sub_categorie.value+7
  }
  router.push({ path: '/product',query: { 'category_id': liIndex.value+1, 'sub_category_id': sub_categorie.value } })
}
</script>

<style scoped lang="scss">
.classify{
  display: flex;
  height: calc(84 * var(--vh));

  .aside{
    width: calc(30 * var(--vw));
    height: calc(84 * var(--vh));

    ul{
      width: calc(30 * var(--vw));
      height: calc(84 * var(--vh));

      li{
        position: relative;
        height: calc(5 * var(--vh));
        margin-bottom: calc(7 * var(--vh));
        margin-top: calc(3 * var(--vh));
        font-weight: 600;
        color: rgba(85, 85, 85, 0.8);;
        text-align: center;
        line-height: calc(5 * var(--vh));

        transition: all .2s;
      }

      .li_active{
        color: red;
        font-size: 1.1rem;
      }
    }
  }

  .main{
    width: calc(70 * var(--vw));
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .main_block{
      width: calc(65 * var(--vw));

      ul{
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        width: calc(60 * var(--vw));
        padding: 10px;
        background-color: #fff;
        margin-top: 10px;
        border-radius: 10px;
  
        li{
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
          align-content: center;
  
          width: calc(20 * var(--vw));

          img{
            width: calc(18 * var(--vw));
            aspect-ratio: 1 / 1;
          }

          p{
            margin: 10px auto 0 auto;
          }
        }
      }
    }
  }
}
</style>