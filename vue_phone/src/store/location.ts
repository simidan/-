import { defineStore } from "pinia";

const locationControl = defineStore('location',()=>{
  let location = ''
  return { location, }
})

export default locationControl