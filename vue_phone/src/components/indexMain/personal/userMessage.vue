<template>
  <div class="index">
    <van-row class="index_page">
      <van-col span="24">
        <headerVue>
          <template v-slot>
            <p style="font-size: 1.2rem;font-weight: 600;color: rgba(87, 87, 87, 0.8);">账户管理</p>
          </template>
        </headerVue>
      </van-col>
      <van-col span="24">
        <div class="user">
          <div class="user_border">
            <div :class="avatarUpdate? 'update_active':''" class="update" @click="avatatChange" @transitionend="handleAnimationEnd">
              <p>修改头像</p>
              <van-icon name="arrow" class="icon"/>
            </div>
            <div class="update_after" @click="avatatChange">
              <van-uploader v-model="fileList" multiple :max-count="1" class="avatar" @click.stop=""/>
              <van-button plain type="primary" @click.stop="uploadAvatar" class="button">确认</van-button>
            </div>
          </div>
          <div class="user_border" :class="messageUpdate? 'user_border_after':''" >
            <div class="message_before" :class="messageUpdate? 'message_before_active':''" @click="messageChange">
              <p>修改信息</p>
              <van-icon name="arrow-down" class="icon"/>
            </div>
            <div class="message_after" @click.stop="messageChange" v-show="messageUpdate">
              <van-cell-group inset>
                <van-field v-model="userInfo.username" label="用户名" class="userInfo" @click.stop=""/>
                <van-field v-model="userInfo.full_name" label="真实姓名" class="userInfo" @click.stop=""/>
                <van-field v-model="userInfo.email" label="邮箱" class="userInfo" @click.stop=""/>
                <van-field v-model="userInfo.phone" label="电话" class="userInfo" @click.stop=""/>
                <van-radio-group v-model="userInfo.gender" direction="horizontal" class="userInfo_gender" @click.stop="">
                  <van-radio name="0">男</van-radio>
                  <van-radio name="1">女</van-radio>
                </van-radio-group>
                <van-field v-model="userInfo.default_address" label="地址" class="userInfo" @click.stop="defaultAddressPopup"/>
                <van-field v-model="userInfo.birthday" label="生日" class="registerInfo" v-show="userInfo.birthday !== '' "@click.stop="birthdayPopup"/>
                <van-button round block type="danger" native-type="submit" class="userInfoBottom" @click.stop="messageCancel">
                  取消
                </van-button>
                <van-button round block type="primary" native-type="submit" class="userInfoBottom" @click.stop="userUpdate">
                  确认
                </van-button>
              </van-cell-group>
              <van-popup
                v-model:show="birthday"
                position="bottom"
                :style="{ height: '50%' }"
                @click.stop=""
              >
              <van-date-picker
                v-model="currentDate"
                title="选择日期"
                :min-date="minDate"
                :max-date="maxDate"
                @confirm="confirm"
                @cancel="cancel"
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
            </div>
          </div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script setup lang="ts">
import headerVue from '@/components/header/index.vue'
import { onMounted, ref } from 'vue';

import avatarControl from '@/store/userControl/avatar'
import locationControl from '@/store/location';
import userUpdateControl from '@/store/userControl/userUpdate'

import { areaList } from '@vant/area-data';
import messageBox from '@/utils/messageBox';
import { userMessage } from '@/utils/interface';

const avatarStore = avatarControl()
const locationStore = locationControl()
const userUpdateStore = userUpdateControl()

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

const fileList = ref<any>([
]);

const avatarUpdate = ref(false)

const uploadAvatar = async () => {
  if (!fileList.value[0]) {
    setTimeout(() => {
      messageBox('请先选择一个文件。')
    }, 600);
    return;
  }
  const formData = new FormData();
  formData.append('file', fileList.value[0].file);
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  
  try{
    const res = await avatarStore.avatar(userInfo.value.user_id,formData)
    if(res.statusCode === 200){
      let fullPath = "http://localhost:9000" + res.filePath.replace(/\\/g, "/");
      userInfo.value.avatar = fullPath
      console.log(fullPath);
      
      localStorage.setItem('user',JSON.stringify(userInfo.value))
      avatarUpdate.value = !avatarUpdate.value
      setTimeout(() => {
        messageBox(res.message)
      }, 600);
    }
    else{
      messageBox(res.message)
    }
  }catch{
    messageBox('头像上传失败')
  }
};

//头像修改
const avatatChange = ()=>{
  avatarUpdate.value = !avatarUpdate.value
}

const handleAnimationEnd = () => {
  const element:any = document.querySelector('.update_active');
  if (element) {
    element.style.display = 'none';
  }
  if (element) {
    element.style.display = 'flex';
  }
};

//信息修改
const messageUpdate = ref(false)

const messageChange = ()=>{
  messageUpdate.value = !messageUpdate.value
}

//生日选择
const birthday = ref(false);
const birthdayPopup = () => {
  birthday.value = true;
};

const now = new Date();

const year = now.getFullYear().toString();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');

const currentDate = ref([year, month, day]);
const minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
const maxDate = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());

const confirm = ()=>{
  birthday.value = false
  userInfo.value.birthday =  currentDate.value.join('-')
}
const cancel = ()=>{
  birthday.value = false
  userInfo.value.birthday =  ''
}

//地址选择
const defaultAddress = ref(false)
const defaultAddressPopup = () => {
  defaultAddress.value = true;
};

const defaultAddressConfirm =(value: any)=>{
  userInfo.value.default_address = value.selectedOptions[0].text+'-'+value.selectedOptions[1].text+'-'+value.selectedOptions[2].text
  defaultAddress.value = false
}

const defaultAddressCancel =()=>{
  defaultAddress.value = false;
}

//取消
const messageCancel = ()=>{
  const userString = localStorage.getItem('user');
  if (userString) {
    const userObject = JSON.parse(userString);
    userObject.default_address = userObject.defaultAddress
    if (userObject.avatar.includes('http://localhost:9000')) {
      userObject.avatar = userObject.avatar.replace('http://localhost:9000', locationStore.location);
    }
    userInfo.value = {
      ...userInfo.value,
      ...userObject
    };
    messageUpdate.value = !messageUpdate.value
  }
}

const userUpdate = async()=>{
  try{
    const res = await userUpdateStore.userUpdate(userInfo.value)
    if(res.statusCode){
      let newInfo:any = userInfo.value
      newInfo.defaultAddress = newInfo.default_address
      delete newInfo.default_address
      localStorage.setItem('user',JSON.stringify(newInfo))
      messageUpdate.value = !messageUpdate.value
      setTimeout(() => {
        messageBox(res.message)
      }, 600);
    }else{
      messageBox(res.message)
    }
  }catch{
    messageBox('信息修改失败')
  }
}

onMounted(() => {
  const userString = localStorage.getItem('user');
  if (userString) {
    const userObject = JSON.parse(userString);
    userObject.default_address = userObject.defaultAddress
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

<style lang="scss" scoped>
.user{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;

  .user_border{
    position: relative;
    transition: 0.5s all;

    display: flex;
    flex-wrap: wrap;
    align-content: center;
  
    width: calc(95 * var(--vw));
    height: calc(15 * var(--vh));
    background-color: white;
  
    border-radius: 10px;
    margin-top: calc(2 * var(--vh));
    padding: 0 calc(1 * var(--vw));

    .update{
      position: absolute;
      width: calc(90 * var(--vw));
      height: calc(15 * var(--vh));
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      z-index: 99;
      background-color: #fff;

      transition: 0.5s all;

      p{
        font-size: 1.5rem;
        font-weight: 600;
        margin-left: calc(10 * var(--vw));
        color: rgba(86, 86, 86, 0.8);
        line-height: calc(15 * var(--vh));
      }

      .icon{
        font-size: 1.5rem;
        color: rgba(86, 86, 86, 0.8);
        line-height: calc(15 * var(--vh));
        margin-left: calc(45 * var(--vw));
      }

      .avatar{
        margin-left: calc(20 * var(--vw));
      }
  
      .button{
        margin: auto 0 auto calc(20 * var(--vw));
      }
    }

    .update_active{
      transform: translate(100%);
    }

    .update_after{
      width: calc(90 * var(--vw));
      height: calc(15 * var(--vh));
      display: flex;
      flex-wrap: wrap;
      align-content: center;

      transition: 0.5s all;

      p{
        font-size: 1.5rem;
        font-weight: 600;
        margin-left: calc(10 * var(--vw));
        color: rgba(86, 86, 86, 0.8);
        line-height: calc(15 * var(--vh));
      }

      .icon{
        font-size: 1.5rem;
        color: rgba(86, 86, 86, 0.8);
        line-height: calc(15 * var(--vh));
        margin-left: calc(45 * var(--vw));
      }

      .avatar{
        margin-left: calc(20 * var(--vw));
      }
  
      .button{
        margin: auto 0 auto calc(20 * var(--vw));
      }
    }

    .update_after_active{
      transform: translate(0);
    }

    .message_before{
      position: absolute;
      width: calc(90 * var(--vw));
      height: calc(15 * var(--vh));
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      z-index: 99;
      background-color: #fff;
      transition: 0.5s all;

      p{
        font-size: 1.5rem;
        font-weight: 600;
        margin-left: calc(10 * var(--vw));
        color: rgba(86, 86, 86, 0.8);
        line-height: calc(15 * var(--vh));
      }

      .icon{
        font-size: 1.5rem;
        color: rgba(86, 86, 86, 0.8);
        line-height: calc(15 * var(--vh));
        margin-left: calc(45 * var(--vw));
      }
    }

    .message_before_active{
      transform: translateY(500%);
    }

    .message_after{
      width: calc(90 * var(--vw));
      height: 100%;
      margin: 0 auto;

      .userInfo{
        margin-top: calc(1 * var(--vh));
      }

      .userInfo_gender{
        margin-top: calc(1 * var(--vh));
        margin-left: calc(15 * var(--vw));
      }

      :deep(.van-field__label){
        width: calc(15 * var(--vw));
      }

      .userInfoBottom{
        margin-top: calc(2 * var(--vh));
      }
    }
  }
  
  .user_border_after{
    overflow: hidden;
    height: calc(70 * var(--vh));
  }
}
</style>
