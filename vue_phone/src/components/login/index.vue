<template>
  <van-row>
    <van-col span="24">
      <div class="login">
        <headerVue>
          <template v-slot>
            <p style="font-size: 1.2rem;font-weight: 600;color: rgba(87, 87, 87, 0.8);">欢迎登录好农物商城</p>
          </template>
        </headerVue>
        <div class="main">
          <van-cell-group inset>
            <van-field v-model="loginInfo.phone" label="手机号" class="loginInfo"/>
            <van-field v-model="loginInfo.password" type="password" label="密码" class="loginInfo"/>
            <van-button round block type="primary" native-type="submit" class="loginBottom" @click="loginIn">
              提交
            </van-button>
          </van-cell-group>
          <p @click="goRegister">
            没有账号？立刻注册！
          </p>
        </div>
      </div>
    </van-col>
  </van-row>
</template>

<script setup lang="ts">
import headerVue from '@/components/header/index.vue'
import { ref } from 'vue';

import loginControl from '@/store/userControl/login'
import messageBox from '@/utils/messageBox';
import router from '@/router';
import { validateLoginInfo } from '@/utils/messageCheck';

const loginStore = loginControl()

const loginInfo = ref({
  phone:'13610095104',
  password:'testUser8'
})

const loginIn = async()=>{
  const msg = validateLoginInfo(loginInfo.value)
  if(!msg.isValid){
    return messageBox(msg.errorMessage)
  }
  try{
    const res = await loginStore.login(loginInfo.value)
    if(res.statusCode === 200){
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.userMessage));
      messageBox('登录成功')
      router.push('/')
    }else{
      messageBox(res.message)
    }
  }catch(err){
    messageBox('登录失败请重试')
    console.log(err);
    
  }
}

const goRegister = ()=>{
  router.push('/register')
}
</script>

<style scoped lang="scss">
.login{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  background-color: white;
  height: calc(100 * var(--vh));

  .main{
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: center;

    width: calc(90*var(--vw));
    height: calc(80 * var(--vh));
    margin: 0 auto;

    .loginInfo{
      margin-top: calc(2 * var(--vh));
      border-bottom: 1px solid rgba(214, 214, 214, 0.5);
    }

    :deep(.van-field__label){
      width: calc(20 * var(--vw));
    }
    
    .loginBottom{
      margin-top: calc(2 * var(--vh));
    }
    
    p{
      text-align: center;
      font-size: 1rem;
      color: rgba(255, 0, 0, 0.5);
      margin-top: calc(5 * var(--vw));
    }
  }
}
</style>