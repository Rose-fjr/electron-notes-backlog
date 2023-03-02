<template>
    <div class="custom-top-nav drag">
        <div class="left">
            <span class="icon-setting" />
            <span>{{ title }}</span>
        </div>
        <div class="right">
            <span class="icon-close" @click="closeClick" />
        </div>
    </div>
</template>

<script setup lang="ts">

interface IProps {
    title?: string;
}
const props = withDefaults(defineProps<IProps>(), {
    title: ''
})
const emits = defineEmits<{
    (e: 'close'): void
}>();

const closeClick = () => {
    emits('close')
}
</script>

<style lang="less" scoped>
.drag {
    -webkit-app-region: drag;
}
.custom-top-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40px;
    display: flex;
    align-items: center;
    background: #dddddd;
    border-radius: 10px 10px 0px 0px;
    padding: 0 10px;
    color: black;

    & > div {
        width: 50%;
        display: flex;
        align-items: center;
    }

    & span {
        margin: 0 5px;
    }

    .icon-setting,
    .icon-close {
        color: black;
    }

    .right {
        display: flex;
        justify-content: right;
    }
}
</style>