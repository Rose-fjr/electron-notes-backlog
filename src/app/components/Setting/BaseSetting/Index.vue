<template>
    <div class="base-setting">
        <div class="item-checkbox" v-for="(item, index) in baseSettings" :key="index">
            <n-checkbox v-model:checked="item.value">{{ item.label }}</n-checkbox>
        </div>
    </div>
    <div style="text-align: center;">
        <n-button type="success" @click="saveBase">保存</n-button>
    </div>
</template>

<script setup lang="ts">
import { changeBaseSetting } from '@/app/utils/send';
import { BaseSetting } from '@/common/setting';
import { NCheckbox, useMessage, NButton } from 'naive-ui'
import { Ref, ref, toRaw } from 'vue';
const message = useMessage()

interface IProps {
    setting: BaseSetting
}
const props = defineProps<IProps>()

interface BaseSettingInfo {
    label: string,
    key: string;
    value: boolean;
}

const baseSettings: Ref<BaseSettingInfo[]> = ref([{
    label: "窗口置顶",
    key: "alwaystop",
    value: props.setting.alwaystop,
}, {
    label: "开机时自动启动",
    key: "autostart",
    value: props.setting.autostart,
}])

const saveBase = () => {
    // @ts-ignore
    let setting: BaseSetting = toRaw(props.setting)
    baseSettings.value.forEach(item => {
        setting[item.key] = item.value
    })
    console.log(setting)
    changeBaseSetting(setting)
    message.warning("修改成功，下次启动有效")
}

</script>

<style lang="less" scoped>
.base-setting {
    padding: 10px;
    margin-left: 25%;

    .item-checkbox {
        margin-top: 5px;
    }
}
</style>