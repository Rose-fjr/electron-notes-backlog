<template>
  <transition name="slide-fade">
    <div class="cycle-setting" v-if="show">
      <NCard class="content">
        <n-tabs default-value="setting" size="large" justify-content="space-evenly">
          <n-tab-pane name="select" tab="选择"></n-tab-pane>
          <n-tab-pane name="setting" tab="设置">
            <n-form
              ref="formRef"
              size="small"
              label-width="auto"
              label-placement="left"
              :model="model"
              :rules="formRules"
            >
              <n-form-item label="循环方式" path="way">
                <n-select
                  :on-update:value="changeSelectWay"
                  :options="selectWayOptions"
                  placeholder="请选择循环方式"
                  :value="model.way"
                />
              </n-form-item>
              <n-form-item
                label="循环设置"
                path="waySetting.ms"
                v-if="model.way > -1 && model.way != RemindWayModel.每天"
              >
                <!-- 日期(年月日) -->
                <n-date-picker
                  v-if="model.way == RemindWayModel.仅一次"
                  to="#date"
                  type="date"
                  placeholder="请选择年月日"
                  :on-update:value="selectDate"
                  :value="model.waySetting.ms"
                />
                <!-- 日期（月日） -->
                <n-date-picker
                  v-if="model.way == RemindWayModel.每年"
                  to="#date"
                  type="date"
                  format="MM-dd"
                  placeholder="请选择月日"
                  :on-update:value="selectDate"
                  :value="model.waySetting.ms"
                />
                <!-- 周选择器 -->
                <n-select
                  v-if="model.way == RemindWayModel.每周"
                  :on-update:value="selectWeek"
                  :options="weekOptions"
                  placeholder="请选择周几"
                  :value="model.waySetting?.week"
                />
                <!-- 日选择器 -->
                <n-select
                  v-if="model.way == RemindWayModel.每月"
                  :on-update:value="selectDay"
                  :options="dayOptions"
                  :value="model.waySetting?.day"
                  placeholder="请选择哪日"
                />
              </n-form-item>
              <n-form-item label="提醒时间" path="ms">
                <n-time-picker
                  style="width: 100%;"
                  format="HH:mm"
                  :on-update:value="selectTimer"
                  :value="model.ms"
                />
              </n-form-item>
            </n-form>
          </n-tab-pane>
        </n-tabs>
        <template #footer>
          <n-button type="error" @click="cancelClick">取消</n-button>
          <n-button type="success" @click="sureClick">确认</n-button>
        </template>
      </NCard>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, Ref, toRaw, watch } from "vue";
import {
  NButton,
  NTabs,
  NTabPane,
  NCard,
  NForm,
  NFormItem,
  NSelect,
  SelectOption,
  NTimePicker,
  NDatePicker,
  FormRules,
  FormInst,
  NCalendar
} from "naive-ui";
import { RemindModel, RemindWayModel, TodoModel, WeekModel } from "@/common/interface";
import moment from 'moment'

interface Props {
  show: boolean;
  remind: RemindModel
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  remind: null
})


// 表单设置
const formRef: Ref<FormInst> = ref(null)
const formRules: FormRules = {
  way: {
    required: true,
    message: "循环方式必填"
  },
  ms: {
    required: true,
    message: "提醒时间必填"
  },
  waySetting: {
    ms: {
      required: true,
      message: "循环设置必填"
    }
  }
}
let model: Ref<RemindModel> = ref({
  waySetting: {}
})

// if (props.remind) {
//   model.value = props.remind;
// }
watch(() => props.remind, (newV, oldV) => {
  model.value = newV;
})

const emits = defineEmits<{
  (e: "close"): void;
  (e: "ok", todo: RemindModel): void,
  (e: 'update:show', v: boolean): void;
}>()

// 循环方式
const selectWayOptions: Ref<SelectOption[]> = ref([]);
for (let key in RemindWayModel) {
  if (typeof RemindWayModel[key] == "string") {
    selectWayOptions.value.push({
      label: RemindWayModel[key],
      value: Number(key) as RemindWayModel,
    });
  }
}

// 周
const weekOptions: Ref<SelectOption[]> = ref([]);
for (let key in WeekModel) {
  if (typeof WeekModel[key] == "string") {
    weekOptions.value.push({
      label: WeekModel[key],
      value: key,
    });
  }
}

// 日
const dayOptions: Ref<SelectOption[]> = ref([{
  label: "最后一天",
  value: 0,
}]);
for (let i = 1; i < 32; i++) {
  dayOptions.value.push({
    label: i + "号",
    value: i,
  });
}

// 循环方式改变
const changeSelectWay = (value: RemindWayModel) => {
  model.value.way = value;
  model.value.waySetting = {
    ms: undefined
  }
};
// 提醒时间改变
const selectTimer = (value) => {
  let time = moment(value);
  model.value.hour = time.hour();
  model.value.minute = time.minute();
  model.value.seconds = time.second();
  model.value.ms = value;
}
// 日期
const selectDate = (value) => {
  let date = moment(value);
  model.value.waySetting.year = date.year();
  model.value.waySetting.month = date.month() + 1;
  model.value.waySetting.day = date.date();
  model.value.waySetting.ms = value;
}
// 周几
const selectWeek = (value) => {
  model.value.waySetting.week = value as WeekModel;
  model.value.waySetting.ms = 0;
}
// 日
const selectDay = (value) => {
  model.value.waySetting.day = value as number;
  model.value.waySetting.ms = 0;
}
// 确认点击
const sureClick = () => {
  formRef.value.validate((errors) => {
    if (!errors) {
      emits('ok', toRaw(model.value))
      emits('update:show', false)
    }
  })
}
// 取消点击
const cancelClick = () => {
  emits('update:show', false)
}


// 日历
const today = ref(moment().milliseconds())
</script>

<style lang="less">
#date {
  .n-date-panel--date {
    transform: translateX(33px);
  }
}
</style>

<style lang="less" scoped>
/* 可以为进入和离开动画设置不同的持续时间和动画函数 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(500px);
}

.cycle-setting {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    border-radius: 10px;
    width: 85%;
    // height: 50%;
    background: white;

    --n-padding-bottom: 0px !important;

    :deep(.n-card__footer) {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
