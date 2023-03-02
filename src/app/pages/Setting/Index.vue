<template>
    <div class="setting">
        <NMessageProvider>
            <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
                <CustomTopNav title="系统设置" @close="closeClick" />
                <div class="content">
                    <div class="zw"></div>
                    <n-tabs default-value="base" justify-content="space-evenly" type="line">
                        <n-tab-pane name="base" tab="基本设置">
                            <BaseSetting :setting="userSetting.base" />
                        </n-tab-pane>
                        <n-tab-pane name="audio" tab="声音设置">
                            <AudioSettingCom :setting="userSetting.audio" />
                        </n-tab-pane>
                        <!-- <n-tab-pane name="tip" tab="提醒设置"></n-tab-pane> -->
                    </n-tabs>
                </div>
            </NConfigProvider>
        </NMessageProvider>
    </div>
</template>

<script setup lang="ts">
import { NMessageProvider, NConfigProvider, zhCN, dateZhCN } from "naive-ui";
import { NTabs, NTabPane, NRadio, NRadioGroup, NSwitch, NSpace, NButton } from 'naive-ui'
import CustomTopNav from '@/app/components/CustomTopNav';
import remote from '@/app/utils/render';
import { Ref, ref } from 'vue';
import { AudioSetting } from '@/common/setting';
import AudioSettingCom from '@/app/components/Setting/AudioSetting';
import BaseSetting from '@app/components/Setting/BaseSetting'
import { getUserSetting } from '@/app/utils/send';
import { refreshSetting } from '@/app/utils/event';

const userSetting = ref(getUserSetting());

refreshSetting(() => {
    userSetting.value = getUserSetting();
})

// 关闭按钮
const closeClick = () => {
    remote.getCurrentWindow().close();
}

</script>

<style lang="less" scoped>
.setting {
    background: white;
    width: 100%;
    height: 100%;

    .content {
        padding: 15px;
        .zw {
            height: 40px - 15px;
        }

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
    }
}
</style>