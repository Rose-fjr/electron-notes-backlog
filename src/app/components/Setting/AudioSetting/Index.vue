<template>
    <div class="audio-item" v-for="(item, index) in audioSettingTips" :key="index">
        <div class="top">
            <span>{{ item.label }}</span>
            <n-switch class="switch" v-if="!item.other" v-model:value="item.value" />
        </div>
        <div class="bottom" v-if="item.other && item.value">
            <n-radio-group v-model:value="item.other.value">
                <n-space>
                    <n-radio value="1">系统提示音</n-radio>
                    <n-radio value="2">自定义</n-radio>
                </n-space>
            </n-radio-group>
            <div class="select-btn" v-if="item.other.value == '2'">
                <div>{{ item.other.custom }}</div>
                <n-button style="margin-left: 15%;" type="success" @click="selectAudio(item)">选择</n-button>
            </div>
        </div>
    </div>
    <div style="text-align: center;">
        <n-button type="success" @click="saveAudio">保存</n-button>
    </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NRadio, NRadioGroup, NSwitch, NSpace, NButton, useMessage } from 'naive-ui'
import CustomTopNav from '@/app/components/CustomTopNav';
import remote from '@/app/utils/render';
import { Ref, ref, toRaw } from 'vue';
import { AudioSetting } from '@/common/setting';
import { changeAudioSetting } from '@/app/utils/send';

const message = useMessage();

interface IProps {
    setting?: AudioSetting;
}
const props = defineProps<IProps>()

interface AudioSettingModel {
    label: string;
    key: string;
    value: any;
    other?: any;
}
// 提示音
let audioSettingTips: Ref<Array<AudioSettingModel>> = ref([{
    label: "添加提示音",
    key: "haveAdd",
    value: props.setting.haveAdd
}, {
    label: "删除提示音",
    key: "haveRemove",
    value: props.setting.haveRemove
}, {
    label: "完成提示音",
    key: "haveComplate",
    value: props.setting.haveComplate
}, {
    label: "清空提示音",
    key: "haveClear",
    value: props.setting.haveClear
}, {
    label: "清空提示音",
    key: "haveTip",
    value: props.setting.haveTip,
    other: {
        value: props.setting.custom ? "2" : '1',
        custom: props.setting.custom
    }
},])
// 提醒音频
// let tipAudio
const selectAudio = (item: AudioSettingModel) => {
    const result = remote.dialog.showOpenDialogSync({
        title: "选择音频文件",
        filters: [{
            name: "音频文件",
            extensions: ['wav', 'mp3',]
        }],
        buttonLabel: "确认"
    })
    item.other.custom = result[0];
}
// 保存声音设置
const saveAudio = () => {
    // @ts-ignore
    let audioSetting: AudioSetting = toRaw(props.setting)
    audioSettingTips.value.forEach(item => {
        audioSetting[item.key] = item.value;
        if (item.other && item.value) {
            if (item.other.value == "2") {
                audioSetting['custom'] = item.other.custom;
            }
            else {
                audioSetting['custom'] = ''
            }
        }
    })
    changeAudioSetting(audioSetting)
    message.success("保存成功")
}

</script>

<style lang="less" scoped>
.audio-item {
    padding: 10px;
    margin-left: 25%;

    .top {
        display: flex;
        align-items: center;
    }
    .bottom {
        margin-top: 5px;
        margin-left: 20px;

        .select-btn {
            margin-top: 5px;
        }
    }

    .switch {
        margin-left: 20%;
    }
}
</style>