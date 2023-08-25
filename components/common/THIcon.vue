<template>
<img class="THIcon" alt="Trade House" :src="$vuetify.theme.dark || dark ? '/img/THIcon_dark.svg' : '/img/THIcon.svg'">
</template>

<script>
export default {
    name: 'icon-th',
    props: {
        dark: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style>
.THIcon {
    width: 50px;
}
</style>
