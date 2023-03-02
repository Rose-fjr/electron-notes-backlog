<template>
  <div class="add-todo">
    <n-button class="add-todo-btn" v-if="!isEdit" ghost @click="addClick"
      >新增待办</n-button
    >
    <AddTodoInfo @close="closeClick" @ok="okClick" v-else />
  </div>
</template>

<script setup lang="ts">
import { playAddAudio } from "@/app/utils/audio";
import { addTodo } from "@/app/utils/send";
import { TodoModel } from "@/common/interface";
import { NButton } from "naive-ui";
import { ref } from "vue";
import AddTodoInfo from "../AddTodoInfo";

const emits = defineEmits<{
  (e: "refresh"): void;
}>();
const isEdit = ref(false);
// 新增按钮
const addClick = () => {
  isEdit.value = true;
};
// 关闭
const closeClick = () => {
  isEdit.value = false;
};
// 确认新增按钮
const okClick = (todo: TodoModel) => {
  const data = addTodo(todo);
  // if (data.code == 1) emits("refresh");
  closeClick();
  playAddAudio()
};
</script>

<style lang="less" scoped>
.add-todo {
  padding: 0 5px;

  .add-todo-btn {
    width: 100%;
    color: @base-color;
    --n-border: 1px solid @base-color-5 !important;
    --n-border-hover: 1px solid @base-color !important;
    --n-border-pressed: 1px solid @base-color-5 !important;
    --n-border-focus: none !important;
    --n-ripple-color: 1px solid @base-color !important;
    --n-text-color-hover: @base-color !important;
    --n-text-color-pressed: @base-color !important;
    --n-text-color-focus: @base-color !important;
  }
}
</style>
