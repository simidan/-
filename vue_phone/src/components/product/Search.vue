<template>
  <div class="index">
    <van-row class="index_page">
      <van-col span="24">
        <headerVue>
        </headerVue>
      </van-col>
      <van-col span="24">
        <div class="splite">
          <van-dropdown-menu class="menu">
            <van-dropdown-item v-model="SearchInfo.order" :options="sortByOptions"/>
            <van-field v-model="SearchInfo.origin" label="产地" class="item" @click="defaultAddressPopup"/>
            <van-field v-model="harvestDate" label="采摘日期" @click="harvestDateStartPopup" v-show="!harvestDate" class="item"/>
            <p>{{ harvestDate }}</p>
          </van-dropdown-menu> 
        </div>
        <div class="product" @scroll="debouncedHandleScroll">
          <ul>
            <li v-for="(item) in productList" :key="item.product_id" @click="goProduct(item.product_id)">
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
          </ul>
        </div>
        <van-popup
          v-model:show="harvestDateStartTarget"
          position="bottom"
          :style="{ height: '50%' }"
          @click.stop=""
        >
          <van-date-picker
            v-model="harvestDateStart"
            title="选择起始日期"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="harvestDateStartconfirm"
            @cancel="harvestDateStartcancel"
          />
        </van-popup>
        <van-popup
          v-model:show="harvestDateEndTarget"
          position="bottom"
          :style="{ height: '50%' }"
        >
          <van-date-picker
            v-model="harvestDateEnd"
            title="选择结束日期"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="harvestDateEndconfirm"
            @cancel="harvestDateEndcancel"
            @click.stop=""
          />
        </van-popup>
        <van-popup
          v-model:show="defaultAddress"
          position="bottom"
          :style="{ height: '50%' }"
          @click.stop=""
        >
        <van-area title="标题" :area-list="areaList" @confirm="defaultAddressConfirm" @cancel="defaultAddressCancel"/>
        </van-popup>
      </van-col>
    </van-row>
  </div>
</template>

<script setup lang="ts">
import headerVue from '@/components/header/index.vue'
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { areaList } from '@vant/area-data';

import locationControl from '@/store/location'
import productSearchControl from '@/store/product/productSear'
import messageBox from '@/utils/messageBox';
import { debounce } from '@/utils/debounce';
import router from '@/router';

const locationStore = locationControl()
const productSearchStore = productSearchControl()

const route = useRoute()

const SearchInfo = ref({
    name:'',
    limit: 10,
    page: 1,
    sortBy:'',
    order: '',
    origin: '',
    harvestDateStart: '',
    harvestDateEnd: '',
})
const totalPages = ref(0)

const productList = ref<any>([]);

const sortByOptions = [
  {
    value: '',
    text: '价格排序',
  },
  {
    value: 'asc',
    text: '从低到高',
  },
  {
    value: 'desc',
    text: '从高到低',
  }
]

//采摘日期

const harvestDateStartTarget = ref(false);
const harvestDateEndTarget = ref(false);
const harvestDateStartPopup = () => {
  harvestDateStartTarget.value = true;
};
const harvestDate = ref('')
const now = new Date();

const year = now.getFullYear().toString();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');

const harvestDateStart = ref([year, month, day]);
const harvestDateEnd = ref([year, month, day]);
const minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
const maxDate = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());

const harvestDateStartconfirm = ()=>{
  harvestDateStartTarget.value = false
  harvestDateEndTarget.value = true
  SearchInfo.value.harvestDateStart =  harvestDateStart.value.join('-')
}
const harvestDateStartcancel = ()=>{
  harvestDateStartTarget.value = false
  SearchInfo.value.harvestDateStart =  ''
}

const harvestDateEndconfirm = ()=>{
  harvestDateEndTarget.value = false
  SearchInfo.value.harvestDateEnd =  harvestDateEnd.value.join('-')
  harvestDate.value = SearchInfo.value.harvestDateStart + ' - ' + SearchInfo.value.harvestDateEnd
  productList.value = []
  getProcuct()
}
const harvestDateEndcancel = ()=>{
  harvestDateEndTarget.value = false
  SearchInfo.value.harvestDateEnd =  ''
}

//产地
const defaultAddress = ref(false)
const defaultAddressPopup = () => {
  defaultAddress.value = true;
};

const defaultAddressConfirm =(value: any)=>{
  SearchInfo.value.origin = value.selectedOptions[0].text+'-'+value.selectedOptions[1].text+'-'+value.selectedOptions[2].text
  productList.value = []
  getProcuct()
  defaultAddress.value = false
}

const defaultAddressCancel =()=>{
  SearchInfo.value.origin = ''
  defaultAddress.value = false;
  getProcuct()
}

//触底加载
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const { scrollTop, offsetHeight, scrollHeight } = target;
  if (scrollHeight - (scrollTop + offsetHeight) < 100) {
    console.log(totalPages.value);
    if (SearchInfo.value.page < totalPages.value) {
        SearchInfo.value.page += 1;
        getProcuct()
      }
  }
};

const debouncedHandleScroll = debounce(handleScroll, 300);

const getProcuct = async()=>{
  try{
      const res = await productSearchStore.productSearch(SearchInfo.value)
      if(res.statusCode === 200){
        if(res.data){
          res.data.forEach(product => {
          if (product.image && typeof product.image === 'string') {
              product.image = product.image.replace('http://localhost:9000', locationStore.location);
            }
          });
          productList.value = [...productList.value, ...res.data];
          totalPages.value = res.pagination.totalPages
          console.log(productList.value);
          
          if(SearchInfo.value.page === 1){
            messageBox(res.message)
          }
        }else{
          messageBox('暂无对应产品')
        }
      }else{
        messageBox(res.message)
      }
    }catch{
      messageBox('加载失败请刷新')
    }
}

watch(() => SearchInfo.value.order, ()=>{
  SearchInfo.value.sortBy = 'price'
  productList.value = []
  getProcuct()
});

const goProduct = (productId:number)=>{
  router.push({path:'/productShow',query:{productId}})
}

onMounted(async()=>{
  if(route.query.name){
    SearchInfo.value.name = route.query.name.toString()
    getProcuct()
  }
})
</script>

<style lang="scss" scoped>
.splite{
  width: calc(100 * var(--vw));
  height: calc(8 * var(--vh));

  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  .menu{
    display: flex;

    :deep(.van-field__label){
      width: calc(10 * var(--vw));
    }
    
    :deep(.van-dropdown-menu__bar){
      height: calc(8 * var(--vh));
    }

    .item{
      height: calc(8 * var(--vh));
    }

    p{
      background-color: #fff;
      line-height: calc(8 * var(--vh));
      text-align: center;
    }
  }
}

.product{
  width: calc(100 * var(--vw));
  height: calc(84 * var(--vh));
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