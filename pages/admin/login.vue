<template>
<v-container class="fill-height">
    <v-row align="center" justify="center" dense>
        <v-col cols="12" sm="8" md="4" align="center">
            <CommonTHLogo />

            <v-card  class="elevation-4 text-center" color="white" light tile>
                <v-card-text class="px-8 pb-4">
                    <h3 class="primary--text mb-8 mt-4">Bienvenidos</h3>
                    <v-form>
                        <v-text-field label="Email" outlined color="primary" name="login" prepend-inner-icon="mdi-account" type="text" v-model="auth.email"></v-text-field>
                        <v-text-field label="Contraseña" outlined color="primary" name="password" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" prepend-inner-icon="mdi-lock" :type="showPass ? 'text' : 'password'" @click:append="showPass = !showPass" v-model="auth.password"></v-text-field>
                        <v-btn color="primary" @click="login" depressed large block>Entrar</v-btn>
                    </v-form>
                    <v-btn color="primary" class="my-4" text @click="forgotPassword" small>¿Olvidaste tu contraseña?</v-btn>
                    <!-- <p class="mb-0">¿No tenés código de acceso?</p>
                    <v-btn color="black" text @click="$router.push('/register')" depressed small>
                        Pedilo aquí</v-btn> -->
                </v-card-text>

            </v-card>
            <v-sheet color="transparent" class="mt-6 login-logos">
                <img src="/img/THLogo_dark.svg" width="150" /> <span class="body-2 secondary_text_dark--text">by</span> <img src="/img/TDLogo_dark.svg" width="150" />
            </v-sheet>
            <v-snackbar :timeout="4000" v-model="snackbar" absolute bottom center>
                {{ snackbarText }}
            </v-snackbar>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
export default {
    layout: 'clean',
    middleware: 'noauth',
    data() {
        return {
            snackbar: false,
            snackbarText: 'No error message',
            showPass: false,
            auth: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
     async login() {
            this.loading = true
            const payload = {
                email: this.auth.email,
                password: this.auth.password
            }
           await this.$store.dispatch('auth/signInWithEmailAndPassword', payload).then(
                result => {
                    this.$snackbar.show({
                        text: result,
                        color: 'success'
                    })
                    this.loading = false
                    this.$router.push('/admin')
                    this.$fire.analytics.logEvent("login", 1);
                }, error => {
                    this.loading = false
                    this.$snackbar.show({
                        text: error,
                        color: 'error'
                    })
                })
        },
        forgotPassword() {
            let that = this
            this.$fire.auth.sendPasswordResetEmail(this.auth.email)
                .then(function () {
                    that.snackbarText = 'Enviamos un email para recuperar contraseña a la casilla: ' + that.auth.email + '. Por favor revise su carpeta de SPAM si no visualiza el email. Gracias'
                    that.snackbar = true
                })
                .catch(function (error) {
                    that.snackbarText = error.message
                    that.snackbar = true
                })
        },
    }
}
</script>

<style>
.login-logos img,
.login-logos span {
    opacity: .5;
    vertical-align: middle;
}
</style>
