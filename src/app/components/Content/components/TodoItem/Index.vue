<template>
  <div
    class="todo-item"
    :class="{
      'not-edit': !isEdit,
      'over-due': todo.status == StatusModel.已过期未完成,
    }"
    @click.right="showMenu"
  >
    <div class="show-item" v-if="!isEdit">
      <n-checkbox
        v-if="check"
        :checked="todo.status == StatusModel.已完成 || todo.lastComplateDate == moment().format('YYYY-MM-DD')"
        :on-update:checked="complateClick"
      />
      <n-popover to="#popover" trigger="hover" raw :show-arrow="false" width="trigger">
        <template #trigger>
          <div
            @dblclick.left="dbClickItem"
            class="text"
            :class="{
              'check-text': todo.status == StatusModel.已完成 || todo.lastComplateDate == moment().format('YYYY-MM-DD'),
            }"
          >{{ todo?.content }}</div>
        </template>
        <!-- <div class="todo-popover-info" v-if="todo.remind">
          <div>{{ RemindWayModel[todo.remind.way] }}</div>
        </div>-->
      </n-popover>
      <div class="icons">
        <span v-if="todo.remind" class="icon-time" @click="showCycleSettingClick" />
      </div>
    </div>
    <AddTodoInfo v-else :todo="todo" @close="closeClick" @ok="okClick" />
    <CycleSetting :remind="remind" v-model:show="showCycleSetting" @ok="remindOkClick" />
  </div>
</template>

<script setup lang="ts">
import { NPopover } from 'naive-ui'
import { playComplateAudio, playRemoveAudio } from "@/app/utils/audio";
import { getTodoItemMenu, MenuCallbackType } from "@/app/utils/menu";
import remote from "@/app/utils/render";
import { cancelComplateTodo, complateTodo, editTodo, remTodo } from "@/app/utils/send";
import { RemindModel, StatusModel, TodoModel, RemindWayModel } from "@/common/interface";
import { NCheckbox, useMessage } from "naive-ui";
import { getCurrentInstance, inject, Ref, ref, toRaw, watch } from "vue";
import AddTodoInfo from "../AddTodoInfo";
import CycleSetting from "../CycleSetting/Index.vue";
import moment from 'moment';

const message = useMessage();

const remind: Ref<RemindModel> = ref(null)

interface Props {
  todo: TodoModel;
  check?: boolean;
  menu?: (todo: TodoModel) => void;
}
const props = withDefaults(defineProps<Props>(), {
  todo: null,
  check: true,
  menu: null,
});

const emits = defineEmits<{
  (e: "refresh"): void;
}>();

// 循环设置（提醒设置）
const showCycleSetting = ref(false);
const remindOkClick = (v: RemindModel) => {
  let model = toRaw(props.todo)
  model.status = StatusModel.未完成;
  model.remind = v;
  okClick(model)
}

// 是否是编辑
const isEdit = ref(false);
// 双击进入编辑
const dbClickItem = (e: MouseEvent) => {
  if (!props.check) return;
  e.stopPropagation();
  isEdit.value = true;
};
// 完成
const complateClick = (check) => {
  if (check) {
    // 变成已完成
    complateTodo(props.todo.id);
    playComplateAudio();
  } else {
    // 变成未完成
    cancelComplateTodo(props.todo.id);
  }
};
// 没修改关闭
const closeClick = () => {
  isEdit.value = false;
};
// 已修改
const okClick = (model: TodoModel) => {
  model.id = props.todo.id;
  const result = editTodo(model);
  closeClick();
};
// 修改显示提醒
const showCycleSettingClick = () => {
  remind.value = props.todo.remind;
  showCycleSetting.value = true;
}
// 显示菜单
const menuItemClick = (id: MenuCallbackType, todo: TodoModel) => {
  switch (id) {
    case MenuCallbackType.删除:
      let result = remTodo(todo.id);
      if (result.code == 1) {
        playRemoveAudio();
      } else {
        message.error("删除失败");
      }
      break;
    case MenuCallbackType.编辑:
      isEdit.value = true;
      break;
    case MenuCallbackType.完成:
    case MenuCallbackType.撤销完成:
      complateClick(id == MenuCallbackType.完成 ? true : false);
      break;
    case MenuCallbackType.复制:
      remote.clipboard.writeText(todo.content);
      message.success("复制成功");
      break;
    case MenuCallbackType.添加提醒:
      showCycleSettingClick()
      break;
    case MenuCallbackType.删除提醒:
      remindOkClick(null)
      break;
  }
};
const showMenu = () => {
  if (props.menu) {
    props.menu(props.todo)
    return;
  }
  if (isEdit.value) return;
  getTodoItemMenu(menuItemClick, props.todo);
};
</script>

<style lang="less" scoped>
.todo-popover-info {
  width: 100%;
  height: 100%;
  background: red;
  color: white;
  border: 10px;
}
.active {
  background: rgba(70, 70, 70, 0.8);
}

.not-edit {
  &:hover {
    background: rgba(70, 70, 70, 0.5);
  }
}

.todo-item {
  padding: 5px;

  .show-item {
    display: flex;
    align-items: center;
  }

  .icons {
    display: flex;
    justify-content: center;
    align-items: center;

    [class*="icon-"] {
      font-size: 12px;
      margin-left: 5px;
    }
  }

  :deep(.n-checkbox) {
    --n-color: transparent !important;
    --n-border: 1px solid @base-color !important;
    --n-border-focus: 1px solid @base-color !important;
    --n-box-shadow-focus: 1px solid @base-color !important;
    --n-border-checked: 1px solid @base-color-3 !important;
    --n-color-checked: transparent !important;
    --n-check-mark-color: @base-color-3 !important;
    --n-text-color: @base-color !important;
  }

  .check-text {
    text-decoration: line-through;
    text-decoration-color: red;
    color: @base-color-5;
  }
  .text {
    width: 80%;
    margin-left: 10px;
    margin-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
  }
}

.over-due {
  :deep(.n-checkbox) {
    --n-border: 1px solid red !important;
  }
  .show-item {
    color: red;
  }
}
</style>
