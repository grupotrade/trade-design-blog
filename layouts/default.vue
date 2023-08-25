<template>
<v-app>
    <LayoutHeader :user="user" />
    <confirm-dialog />
    <snackbar />
    <v-container fluid class="container-default" :class="($vuetify.breakpoint.xs)? 'px-0' : ''">
        <nuxt />
    </v-container>
   <LayoutFooter />
</v-app>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    computed: {
        user() {
            return this.$store.state.authUser;
        }
    }
}
</script>
