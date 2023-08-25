<template>
<v-dialog v-model="show" :width="(!$vuetify.breakpoint.xs) ? '550px' : ''">
    <v-card class="text-center" color="white" flat light tile>
        <v-card-text class="px-8 pb-4">
            <CommonTHLogo class="ma-4" />
            <v-form v-model="valid">
                <v-text-field label="Email" :rules="rulesGlobal.email" outlined color="primary" name="login" prepend-inner-icon="mdi-account" type="text" v-model="auth.email"></v-text-field>
                <v-text-field label="Contraseña" :rules="rulesGlobal.password" outlined color="primary" name="password" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" prepend-inner-icon="mdi-lock" :type="showPass ? 'text' : 'password'" @click:append="showPass = !showPass" v-model="auth.password"></v-text-field>
                <v-btn color="primary" @click="login" depressed large block :disabled="!valid">Entrar</v-btn>
            </v-form>
            <v-btn color="primary" class="my-4" text @click="forgotPassword" small :disabled="auth.email == ''">¿Olvidaste tu contraseña?</v-btn>
            <p class="mb-0">¿No tenés código de acceso?</p>
            <v-btn color="black" text @click="openRegister" depressed small >
                Pedilo aquí</v-btn>
        </v-card-text>

    </v-card>
    <v-snackbar :timeout="4000" v-model="snackbar" absolute bottom center>
        {{ snackbarText }}
    </v-snackbar>

</v-dialog>
</template>

<script>
export default {
    name: 'loginDialog',
    props: {
        value: {
            type: Boolean
        },
    },
    model: {
        event: `modified`
    },
    data() {
        return {
            valid: false,
            snackbar: false,
            snackbarText: 'No error message',
            showPass: false,
            auth: {
                email: '',
                password: ''
            }
        }
    },
    computed: {
        show: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("modified", val);
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
                    this.show = false
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
                    that.snackbarText = 'Revise su casilla de email' + that.auth.email + '.'
                    that.snackbar = true
                })
                .catch(function (error) {
                    that.snackbarText = error.message
                    that.snackbar = true
                })
        },
        openRegister() {
            this.$emit('openRegister')
        }
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
