<template>
  <van-row>
    <van-col span="24">
      <div class="register">
        <headerVue>
          <template v-slot>
            <p style="font-size: 1.2rem;font-weight: 600;color: rgba(87, 87, 87, 0.8);">注册商城账号</p>
          </template>
        </headerVue>
        <div class="main">
          <van-cell-group inset>
            <van-field v-model="registerInfo.username" label="用户名" class="registerInfo"/>
            <van-field v-model="registerInfo.password" type="password" label="密码" class="registerInfo"/>
            <van-field v-model="registerInfo.email" label="邮箱" class="registerInfo"/>
            <van-field v-model="registerInfo.phone" label="电话" class="registerInfo"/>
            <van-field v-model="registerInfo.birthday" label="生日" class="registerInfo" v-show="registerInfo.birthday !== ''"/>
            <van-radio-group v-model="registerInfo.gender" direction="horizontal" class="registerInfo_gender">
              <van-radio name="0">男</van-radio>
              <van-radio name="1">女</van-radio>
            </van-radio-group>
            <van-button round block type="primary" native-type="submit" class="registerBottom" @click="showPopup" v-show="registerInfo.birthday === ''">
              选择生日
            </van-button>
            <van-button round block type="primary" native-type="submit" class="registerBottom" @click="registerIn">
              提交
            </van-button>
            <p @click="goLogin">
              已有账号？立即登录！
            </p>
          </van-cell-group>
          <van-popup
            v-model:show="show"
            position="bottom"
            :style="{ height: '50%' }"
          >
          <van-date-picker
            v-model="currentDate"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="confirm"
            @cancel="cancel"
          />
          </van-popup>
        </div>
      </div>
    </van-col>
  </van-row>
</template>

<script setup lang="ts">
import headerVue from '@/components/header/index.vue'
import { userMessage } from '@/utils/interface';
import messageBox from '@/utils/messageBox';
import { ref } from 'vue';

import registerControl from '@/store/userControl/register'

import router from '@/router';
import { validateRegisterInfo } from '@/utils/messageCheck';

const registerStore = registerControl()

interface registerInfo extends Omit<userMessage, 'avatar'|'full_name'|'default_address'> {}

const registerInfo = ref<registerInfo>({
    username: '',
    password: '',
    email: '',
    phone: '',
    gender: '',
    birthday: ''
});

//生日选择
const show = ref(false);
const showPopup = () => {
  show.value = true;
};

const now = new Date();

const year = now.getFullYear().toString();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');

const currentDate = ref([year, month, day]);
const minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
const maxDate = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());


const confirm = ()=>{
  show.value = false
  registerInfo.value.birthday =  currentDate.value.join('-')
}
const cancel = ()=>{
  show.value = false
  registerInfo.value.birthday =  ''
}

const registerIn = async()=>{
  const msg = validateRegisterInfo(registerInfo.value)
  if(!msg.isValid){
    return messageBox(msg.errorMessage)
  }
  try{
    const res = await registerStore.register(registerInfo.value)
    if(res.statusCode === 200){
      messageBox(res.message)
      router.push('/login')
    }
  }catch{
    messageBox('注册失败请重试')
  }
}

const goLogin = ()=>{
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.register{
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

    .registerInfo{
      margin-top: calc(2 * var(--vh));
      border-bottom: 1px solid rgba(214, 214, 214, 0.5);
    }

    .registerInfo_gender{
      margin-top: calc(2 * var(--vh));
      margin-left: calc(15 * var(--vw));
    }

    :deep(.van-field__label){
      width: calc(20 * var(--vw));
    }
    
    .registerBottom{
      margin-top: calc(5 * var(--vh));
    }
    
    p{
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
      color: rgba(0, 255, 4, 0.5);
      margin-top: calc(5 * var(--vw));
    }
  }
}
</style>