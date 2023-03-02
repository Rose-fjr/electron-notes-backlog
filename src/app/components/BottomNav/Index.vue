<template>
  <div class="bottom-nav">
    <div class="left">
      <span class="icon-complate" @click="showModal(1)" />
      <span class="icon-future" @click="showModal(2)" />
      <span class="icon-del" @click="showModal(3)" />
      <span class="icon-overdue" @click="showModal(4)" />
    </div>
    <div class="right"></div>
  </div>
  <todo-list-modal v-model:show="show" v-model:type="type" />
</template>

<script setup lang="ts">
import moment from "moment";
import { NPopover, NBadge, NSpace } from "naive-ui";
import { reactive, ref } from "vue";
import TodoListModal from "../TodoListModal";

const show = ref(false)
const type = ref(-1);

const showModal = (t: number) => {
  type.value = t;
  show.value = true;
}

</script>

<style lang="less" scoped>
.bottom-nav {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  display: flex;
  border-top: 1px solid rgba(59, 59, 59, 0.8);

  [class*="icon-"] {
    -webkit-app-region: no-drag;
    cursor: pointer;

    &:hover {
      color: @base-active-color;
    }
  }

  & > div {
    width: 50%;
  }

  .left,
  .right {
    [class*="icon-"] {
      margin: 0 5px;
    }
  }

  .custom-dot {
    :deep(.n-badge-sup) {
      left: 70%;
      bottom: 60%;
    }
  }
  // 左侧标题
  .left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
    & > div {
      color: @base-color;
    }
  }
  // 右侧信息
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
  }
}
</style>
