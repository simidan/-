<template>
  <van-row>
    <van-col span="24">
      <div class="index_main">
        <router-view/>
      </div>
    </van-col>
  </van-row>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.index_main{
  background-color: rgba(214, 214, 214, 0.3);
  height: calc(84 * var(--vh));
}
</style>