<template>
    <v-dialog v-model="show" width="750px">
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
            <v-form v-model="validUser" v-on:submit.prevent="saveEdit">
                <v-card-text>
                    <v-container>
                        <v-row dense>
                            <v-col>
                                <v-text-field dense outlined class="body-1" background-color="foreground" required :rules="rulesGlobal.required" v-model="user.name" label="Nombre" color="secondary"></v-text-field>
                                <v-text-field dense outlined class="body-1" background-color="foreground" v-model="user.lastName" label="Apellido"></v-text-field>
                                <v-text-field dense outlined class="body-1" background-color="foreground" v-model="user.group" label="Empresa"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-center background">
                    <v-btn large color="primary" type="submit" :disabled="!validUser" depressed>{{$t('save')}}</v-btn>
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
            user: {
                type: Object,
                required: true
            }
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
    
            }
        },
        methods: {
            minimizeNewUserDialog() {
                this.$emit("minimize");
                this.show = false;
            },
            cancelUserDialog() {
                this.$dialog.show({
                    name: `${this.$t("confirm_dialog.cancel_new_user")}`,
                    text: `${this.$t("confirm_dialog.confirm_cancel")} ${this.$t(
                  "confirm_dialog.new_user"
                )}`,
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
            saveEdit() {
                this.$fire.firestore.collection('users').doc(this.user.id).update({
                    name: this.user.name,
                    lastName: this.user.lastName,
                    displayName: this.user.name + ' ' + this.user.lastName,
                    group: this.user.group
                }).then(result => {
                    this.$emit("finish");
                    this.show = false
                    this.$snackbar.show({
                        text: 'Usuario actualizado',
                        color: 'success'
                    })
                }, error => [
                    this.$snackbar.show({
                        text: error,
                        color: 'error'
                    })
                ])
            },
        }
    }
    </script>
    