import { userUpdateApi } from "@/api";
import { userMessage } from "@/utils/interface";
import { defineStore } from "pinia";

interface userUpdate extends Omit<userMessage, 'password'>{
  user_id:number
}

const userUpdateControl = defineStore('userUpdate',()=>{
  const userUpdate = async(userInfo:userUpdate)=>{
    const res = await userUpdateApi(userInfo)
    return res.data
  }

  return { userUpdate, }
})

export default userUpdateControl