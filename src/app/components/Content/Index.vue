<template>
  <div class="content">
    <div class="zw" />
    <TodoList />
    <div class="zw" />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, provide } from "vue";
import TodoList from "./components/TodoList";
</script>

<style lang="less" scoped>
.content {
  // position: absolute;
  // left: 0;
  // top: 40px;
  // bottom: 0px;
  // width: 100%;
  width: 100%;
  height: 100%;
  .zw {
    height: 40px;
  }
}
</style>
