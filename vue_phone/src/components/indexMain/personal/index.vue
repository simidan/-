<template>
  <van-row>
    <van-col span="24">
      <div class="personal">
        <div class="user">
          <img crossorigin="anonymous" :src="userInfo.avatar" alt="">
          <p>
            {{ userInfo.username }}
          </p>
        </div>
        <div class="message" @click="router.push('/userMessage')">
          <p>
            账户
          </p>
          <van-icon name="arrow"/>
        </div>
        <div class="message" @click="router.push('/orderList')">
          <p>
            订单
          </p>
          <van-icon name="arrow" />
        </div>
        <div class="message_buttton">
          <van-button type="danger" size="large" class="button" @click="loginOut">退出登录</van-button>
        </div>
      </div>
    </van-col>
  </van-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import locationControl from '@/store/location';
import { userMessage } from '@/utils/interface';
import router from '@/router';

const locationStore = locationControl()

type UserInfoType = Omit<userMessage, 'password'> & { user_id: number };
const userInfo = ref<UserInfoType>({
  avatar: "",
  birthday: "",
  default_address: "",
  email: "",
  gender: "",
  full_name: "",
  phone: "",
  username: "",
  user_id: 0
});

const loginOut = ()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.replace('/')
}

onMounted(() => {
  const userString = localStorage.getItem('user');
  if (userString) {
    const userObject = JSON.parse(userString);
    if (userObject.avatar.includes('http://localhost:9000')) {
      userObject.avatar = userObject.avatar.replace('http://localhost:9000', locationStore.location);
    }
    userInfo.value = {
      ...userInfo.value,
      ...userObject
    };
  }
});
</script>

<style scoped lang="scss">
.personal{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;

  position: relative;

  background-color: rgba(214, 214, 214, 0.3);
  height: calc(84 * var(--vh));

  .user{
    display: flex;
    flex-wrap: wrap;
    align-content: center;

    width: calc(95 * var(--vw));
    background-color: white;
    height: calc(15 * var(--vh));
    border-radius: 10px;
    margin-top: calc(2 * var(--vh));
    padding: 0 calc(1 * var(--vw));

    img{
      height: 60%;
      aspect-ratio: 1 / 1;
      border-radius: 10px;
      margin: auto 0 auto calc(10 * var(--vw));
    }
    p{
      line-height: calc(15 * var(--vh));
      font-size: 1.2rem;
      margin-left: calc(10 * var(--vw));
      color: rgba(82, 82, 82, 0.6);
      font-weight: 600;
    }
  }

  .message{
    display: flex;
    flex-wrap: wrap;
    align-content: center;

    position: relative;

    width: calc(95 * var(--vw));
    background-color: white;
    height: calc(10 * var(--vh));
    border-radius: 10px;
    margin-top: calc(2 * var(--vh));
    padding: 0 calc(1 * var(--vw));
    
    p{
      line-height: calc(10 * var(--vh));
      font-size: 1.2rem;
      margin-left: calc(8 * var(--vw));
      color: rgba(82, 82, 82, 0.6);
      font-weight: 600;
    }

    i{
      position: absolute;
      line-height: calc(10 * var(--vh));
      font-size: 1.2rem;
      color: rgba(82, 82, 82, 0.6);
      left: 90%;
    }

    &:active {
      transition: all .5s;
      filter: brightness(80%); /* 点击时降低亮度到80% */
    }
  }

  .message_buttton{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 90%;
      
    .button{
      width: calc(90 * var(--vw));
      border-radius: 10px;
    }
  }
}
</style>