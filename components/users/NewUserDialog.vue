<template>
<v-dialog v-model="show" width="750px" persistent>
    <v-toolbar dense flat color="primary" dark>
        <v-toolbar-title>{{$t('users.new_user')}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click="minimizeNewUserDialog()">
                    <v-icon>mdi-window-minimize</v-icon>
                </v-btn>
            </template>
            <span>{{ $t("minimize") }}</span>
        </v-tooltip>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click="cancelUserDialog()">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </template>
            <span>{{ $t("cancel") }}</span>
        </v-tooltip>
    </v-toolbar>
    <v-card flat tile class="card-surface pt-2">
        <v-form v-model="validUser" v-on:submit.prevent="saveUser">
            <v-card-text>
                <v-container>
                    <v-row dense>
                        <v-col>
                            <v-text-field dense outlined class="body-1" background-color="foreground" required :rules="rulesGlobal.required" v-model="user.name" label="Nombre" color="secondary"></v-text-field>
                            <v-text-field dense outlined class="body-1" background-color="foreground" v-model="user.lastname" label="Apellido"></v-text-field>
                            <v-text-field dense outlined class="body-1" background-color="foreground" v-model="user.group" label="Empresa" color="secondary"></v-text-field>

                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field dense outlined class="body-1" background-color="foreground" v-model="user.email" label="Email" color="secondary"></v-text-field>
                                <v-text-field dense outlined label="Contraseña" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" counter  color="primary" name="password" prepend-inner-icon="mdi-lock" v-model="user.password" required :rules="rulesGlobal.passwordUser" @click:append="showPass = !showPass"></v-text-field>
                                <v-text-field dense outlined label="Repetir Contraseña" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" counter  color="primary" name="re_password" prepend-inner-icon="mdi-lock" v-model="user.password_confirmation" :rules="rulesGlobal.passwordConfirmUser" @click:append="showPass = !showPass"></v-text-field>
                            </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions class="justify-center background">
                <v-btn large color="primary" type="submit" :disabled="!validUser || processing" depressed>{{$t('save')}}</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean
        },
    },
    model: {
        event: `modified`
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit("modified", val);
            }
        },
    },
    data() {
        return {
            validUser: false,
            showPass: false,
            user: {
                name: '',
                lastname: '',
                group: '',
                password: '',
                password_confirmation: '',
                email: '',
                email_repeat: ''
            }

        }
    },
    methods: {
        minimizeNewUserDialog() {
            this.$emit("minimize");
            this.show = false;
        },
        cancelUserDialog() {
            this.$dialog.show({
                name: 'Cancelar nuevo usuario',
                text: '¿Confirma cancelar la creación de nuevo usuario?',
                buttons: [{
                    text: this.$t("accept"),
                    color: "primary",
                    handle: () => {
                        this.$dialog.hide();
                        this.show = false;
                        this.$emit("cancel");
                    },
                }, ],
            });
        },
        saveUser: function (e) {
            const payload = {
                email: this.user.email,
                password: this.user.password,
                name: this.user.name,
                lastName: this.user.lastname,
                group: this.user.group
            }
            this.$store.dispatch('users/createUser', payload)
                .then(result => {
                    this.show = false
                    this.$toasted.success(result, {
                            duration: 1500
                        })
                        setTimeout(() => {
                    this.show = false
                }, 1500)
                    

                })
                .catch(err => {
                    this.$toasted.error(err, {
                        duration: 1500
                    })
                })
        }
    }
}
</script>
