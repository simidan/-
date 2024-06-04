import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import { tokenCheckApi } from '@/api'

import indexVue from '@/components/index.vue'
import loginVue from '@/components/login/index.vue'
import registerVue from '@/components/register/index.vue'
import productVue from '@/components/product/index.vue'
import searchVue from '@/components/product/Search.vue'
import productShowVue from '@/components/product/productShow.vue'

import indexMainVue from '@/components/indexMain/main/index.vue'
import classifyVue from '@/components/indexMain/classify/index.vue'
import shopCartVue from '@/components/indexMain/shopCart/index.vue'
import personalVue from '@/components/indexMain/personal/index.vue'
import payVue from '@/components/pay/index.vue'

import userMessageVue from '@/components/indexMain/personal/userMessage.vue'
import orderListVue from '@/components/indexMain/personal/orderList.vue'

import { throttle } from '@/utils/throttle'

const routes: Array<RouteRecordRaw> = [
  {
    path:'/',
    name:'index',
    component:indexVue,
    children:[
      {
        path:'',
        name:'indexMain',
        component:indexMainVue,
      },
      {
        path:'classify',
        name:'classify',
        component:classifyVue,
      },
      {
        path:'shopCart',
        name:'shopCart',
        component:shopCartVue,
      },
      {
        path:'personal',
        name:'personal',
        component:personalVue,
      },
    ]
  },
  {
    path:'/login',
    name:'login',
    component:loginVue,
  },
  {
    path:'/register',
    name:'register',
    component:registerVue,
  },
  {
    path:'/userMessage',
    name:'userMessage',
    component:userMessageVue,
  },
  {
    path:'/orderList',
    name:'orderList',
    component:orderListVue,
  },
  {
    path:'/product',
    name:'product',
    component:productVue,
  },
  {
    path:'/Search',
    name:'Search',
    component:searchVue,
  },
  {
    path:'/pay',
    name:'pay',
    component:payVue,
  },
  {
    path:'/productShow',
    name:'productShow',
    component:productShowVue,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
})

// 假设你已经有了一个异步的tokenCheckApi函数

const throttledTokenCheck = throttle(async (next: Function) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const res = await tokenCheckApi(token);
      if (res.data.statusCode !== 200) {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      next('/login');
      return;
    }
  } else {
    next('/login');
    return;
  }
  next();
}, 1000); // 在这里，我们设置了1秒钟的时间间隔

router.beforeEach((to, from, next) => {
  if (from.path && from.path !== '/login' && from.path !== '/register') {
    sessionStorage.setItem('previousPath', from.fullPath);
  }
  if (!['/', '/login','/register'].includes(to.path)) {
    throttledTokenCheck(next);
  } else {
    next();
  }
});


// router.beforeEach(async (to, from, next) => {
//   if (from.path && from.path !== '/login' && from.path !== '/register') {
//     sessionStorage.setItem('previousPath', from.fullPath);
//   }
//   if (from.path && !['/', '/login'].includes(from.path)) {
//     sessionStorage.setItem('previousPath', from.fullPath);
//   }
//   if (!['/', '/login'].includes(to.path)) {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       next('/login');
//     } else {
//       try {
//         const res = await tokenCheckApi(token);
//         if (res.data.statusCode === 200) {
//           localStorage.setItem('user', JSON.stringify(res.data.data));
//           next();
//         } else {
//           throw new Error('Authentication failed');
//         }
//       } catch (error) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         next('/login');
//       }
//     }
//   } else {
//     next();
//   }
// });

export default router