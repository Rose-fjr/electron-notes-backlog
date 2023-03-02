<template>
  <div class="todo-list">
    <AddTodo @refresh="refresh" />
    <div class="item-list">
      <TodoItem v-for="(item, index) in list" :todo="item" @refresh="refresh" :key="index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TodoItem from "../TodoItem";
import AddTodo from "../AddTodo";
import { provide, ref, toRaw } from "vue";
import { TodoModel } from "@/common/interface";
import { ipcRenderer } from "@/app/utils/render";
import { refresh as refreshApi } from '@app/utils/event'
import { getTodo } from "@/app/utils/send";
import moment from "moment";

refreshApi(() => {
  refresh();
})

const list = ref<Array<TodoModel>>([]);
// 刷新数据
const refresh = () => {
  list.value = getTodo().msg;
  console.log(list.value)
};
refresh();
</script>

<style lang="less" scoped>
.todo-list {
  margin: 13px 5px;
  height: calc(100% - 80px - 26px);
  overflow: hidden;

  .item-list {
    height: calc(100% - 120px);
    margin-top: 15px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    &:hover {
      &::-webkit-scrollbar {
        display: block;
        background: transparent;
        width: 5px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 10px;
      }
    }
  }
}
</style>
