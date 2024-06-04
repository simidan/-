<script setup lang="ts">
import locationControl from '@/store/location'
import { onMounted } from 'vue';

const locationStore = locationControl()

onMounted(()=>{
  locationStore.location = window.location.origin.replace(/:\d+/, ":9000")
})
</script>

<template>
  <router-view/>
</template>

<style lang="scss" scoped>
@import "./baseStyle.css";
</style>
