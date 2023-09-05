<template>
<v-app>
    <LayoutHeader :user="user" />
    <confirm-dialog />
    <snackbar />
    <v-container fluid class="container-default" :class="($vuetify.breakpoint.xs)? 'px-0' : ''">
        <nuxt />
    </v-container>
   <LayoutFooter />
   <v-btn class="fab mb-6" :size="mobile ? 'small' : 'large'" color="primary" icon to="#top">
    <v-icon>mdi-arrow-up-thick</v-icon>
        </v-btn>
        <v-btn class="fab whatsapp mb-8" :size="mobile ? 'small' : 'large'" icon
            href="https://api.whatsapp.com/send?phone=5491126117588&text=Hola,%20estoy%20visitando%20Trade%20Design,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20acerca%20de%20sus%20productos%20y%20servicios"
            target="_blank">
            <v-icon>mdi-whatsapp</v-icon>
        </v-btn>
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
