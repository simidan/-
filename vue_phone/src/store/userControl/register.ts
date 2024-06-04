import { registerApi, } from "@/api";
import { userMessage } from "@/utils/interface";
import { defineStore } from "pinia";

interface registerInfo extends Omit<userMessage, 'avatar'|'full_name'|'default_address'> {}

const registerControl = defineStore('register',()=>{
  const register = async(info:registerInfo)=>{
    const res = await registerApi(info)
    return res.data
  }

  return { register, }
})

export default registerControl