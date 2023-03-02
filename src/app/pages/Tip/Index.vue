<template>
    <div class="tip">
        <div style="height: 3%;flex-shrink: 0;"></div>
        <tip-item
            v-for="(item, index) in list"
            :key="index"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
            :todo="item"
            @close="closeTip"
            @enter="itemEnter"
            @check-clear="checkClear"
        />
        <div style="height: 6%;flex-shrink: 0;"></div>
    </div>
</template>

<script setup lang="ts">
import TipItem from '@/app/components/TipItem';
import { playTipAudio } from '@/app/utils/audio';
import { needTip } from '@/app/utils/event';
import remote from '@/app/utils/render';
import { TodoModel } from '@/common/interface';
import { IpcRendererEvent } from 'electron';
import { Ref, ref } from 'vue';

let list: Ref<TodoModel[]> = ref([])

// 监听需要
needTip((e: IpcRendererEvent, todo: TodoModel) => {
    let index = list.value.findIndex(m => m.id == todo.id)
    if (index >= 0) {
        list.value[index] = todo;
    } else {
        list.value.push(todo)
    }
})

// 鼠标进入移出
const mouseEnter = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(false);
}
const mouseLeave = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true })
}

// 关闭按钮
const closeTip = (id: number) => {
    let todo = list.value.find(m => m.id == id);
    if (!todo._extend) todo._extend = {};
    todo._extend.remove = true;
    const have = list.value.filter(m => m._extend.remove != true)
    if (have.length <= 0) {
        // 说明都没有了
        audio.pause();
        audio.src = "";
        audio = null;
    }
}
// 动画离开了
const checkClear = () => {
    if (!audio) {
        list.value = [];
        remote.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true })
    }
}
// 当进入动画完成后播放音频
let audio: HTMLAudioElement;
let playComplate: boolean = false;
const itemEnter = () => {
    if (!audio) {
        audio = playTipAudio();
        audio.addEventListener('ended', () => {
            playComplate = true;
        })
    } else {
        if (playComplate) {
            playComplate = false;
            audio.currentTime = 0;
            audio.play();
        }
    }
}

</script>

<style lang="less" scoped>
.tip {
    overflow-y: auto;
    overflow-x: hidden;
    width: 48%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;

    & > :deep(div:first-child) {
        margin-top: auto !important;
    }

    &::-webkit-scrollbar {
        width: 5px;
        background: transparent;
    }

    &:hover {
        &::-webkit-scrollbar {
            display: block;
            background: transparent;
            width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            background: #18a058;
            border-radius: 10px;
        }
    }
}
</style>