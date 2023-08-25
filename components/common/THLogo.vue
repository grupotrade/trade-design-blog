<template>
<img class="THLogo" alt="Trade House" :src="$vuetify.theme.dark || dark ? '/img/THLogo_dark.svg' : '/img/THLogo.svg'">
</template>

<script>
export default {
    name: 'logo-th',
    props: {
        dark: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style>
.THLogo {
    width: 180px;
}
</style>
