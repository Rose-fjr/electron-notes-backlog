<template>
    <div class="home" :class="{
        leave: leave
    }">
        <NMessageProvider>
            <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
                <TopNav v-model:lock="lock" />
                <Content />
                <BottomNav />
            </NConfigProvider>
        </NMessageProvider>
    </div>
</template>

<script setup lang="ts">
import { NMessageProvider, NConfigProvider, zhCN, dateZhCN } from "naive-ui";
import TopNav from "@app/components/TopNav";
import Content from "@app/components/Content";
import BottomNav from "@app/components/BottomNav";
import { onMounted, Ref, ref, watch } from "vue";
import { leaveToZero, moveToZero } from "@/app/utils/event";
import remote from "@/app/utils/render";
const win = remote.getCurrentWindow();
win.setIgnoreMouseEvents(false);
// 锁定
const lock = ref(false);
watch(lock, (newV) => {
    if (newV) {
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null;
        }
    } else {
        if (win.getPosition()[1] <= 0) {
            initInfo();
        }
    }
})

// 隐藏
const leave = ref(false)
let intervalId;
const checkShowOrHidden = () => {
    const cursorPos = remote.screen.getCursorScreenPoint();
    if (!leave.value) {
        if ((cursorPos.x < posXMin || cursorPos.x > posXMax) || (cursorPos.y > posYMax)) {
            leave.value = true;
            win.setIgnoreMouseEvents(true, { forward: true })
        }
    } else {
        if (cursorPos.x >= posXMin && cursorPos.x <= posXMax && cursorPos.y < posYMaxHidden) {
            leave.value = false;
            remote.getCurrentWindow().setIgnoreMouseEvents(false)
        }
    }
}

// 是否可以贴边隐藏
const canHidden = ref(true);
let posXMin = 0
let posXMax = 0
let posYMin = win.getPosition()[1]
let posYMax = 0
let posYMaxHidden = 2;
const initInfo = () => {
    let size = win.getSize();
    posXMin = win.getPosition()[0];
    posXMax = posXMin + size[0];
    posYMin = 0;
    posYMax = size[1]
    canHidden.value = true;
    win.setResizable(false)
    if (!intervalId)
        intervalId = setInterval(checkShowOrHidden, 300);
}
if (posYMin <= 0) initInfo();
moveToZero(initInfo)
leaveToZero(() => {
    win.setResizable(true)
    canHidden.value = false;
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
})

</script>

<style lang="less" scoped>
.leave {
    transform: translateY(-100%);
}
.home {
    position: relative;
    width: 100%;
    height: 100%;
    background: fade(#414141, 50%);
    transition: all 0.3s ease-out;
}
.show {
    height: 9px;
    width: 100%;
    position: absolute;
    bottom: -9px;
    left: 0;
    background: white;
}
</style>
