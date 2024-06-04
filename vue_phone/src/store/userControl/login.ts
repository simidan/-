import { loginApi, } from "@/api";
import { defineStore } from "pinia";

interface loginInfo {
  phone: string;
  password: string;
}

const loginControl = defineStore('login',()=>{
  const login = async(info:loginInfo)=>{
    const res = await loginApi(info)
    return res.data
  }

  return { login, }
})

export default loginControl