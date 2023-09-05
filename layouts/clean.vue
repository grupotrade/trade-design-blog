<template>
<v-app class="bg-image">
    <Nuxt />
    <snackbar />
</v-app>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    created() {
        if(process.client) {
        const theme = localStorage.getItem("useDarkTheme");
        if (theme) {
            if (theme == "true") {
                setTimeout(() => {
                    this.toggleThemeDark()
                }, 500)
            }
        }}
    },
    methods: {
        toggleThemeDark() {
            this.$vuetify.theme.dark = true
        },
    }
}
</script>
<style>

.bg-image {
  background: var(--v-background-base)  !important;
}
</style>

