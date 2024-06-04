import { avatarUpdateApi } from "@/api";
import { defineStore } from "pinia";

const avatarControl = defineStore('avatar',()=>{
  const avatar = async(userId:number,fromData:any)=>{
    const res = await avatarUpdateApi(userId,fromData)
    return res.data
  }

  return { avatar, }
})

export default avatarControl