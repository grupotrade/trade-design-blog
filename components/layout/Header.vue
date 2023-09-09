<template>
<div>
    <v-navigation-drawer v-model="menuMobile" dark color="background" clipped app disable-resize-watcher>
        <CommonTDLogoDark class="ma-8" />
        <v-list>
            <v-list-item exact to="/">
                <v-list-item-content>
                    <v-list-item-title>
                        Blog
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        
        </v-list>
    </v-navigation-drawer>
    <v-sheet color="secondary" elevation="0" id="top">
                <v-container class="header pa-0">
                    <v-row dense>
                        <v-col>
                            <v-btn text class="white--text" 
                                href="https://api.whatsapp.com/send?phone=5491126117588&text=Hola,%20estoy%20visitando%20Trade%20Design,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20acerca%20de%20sus%20productos%20y%20servicios"
                                target="_blank">
                                <v-icon size="small">mdi-whatsapp</v-icon><span v-show="!$vuetify.breakpoint.xs ">+54 9 11 2 611
                                    7588</span>
                            </v-btn>
                            <v-btn text class="white--text" href="mailto:produccion@trade-design.com.ar">
                                <v-icon size="small">mdi-email</v-icon><span
                                    v-show="!$vuetify.breakpoint.xs ">produccion@trade-design.com.ar</span>
                            </v-btn>
                        </v-col>
                        <v-col class="text-right pt-2">
                            <v-btn color="white" depressed small icon
                                href="https://calendar.app.google/7eXef26YJMmbWw4n7" target="_blank">
                                <v-icon small>mdi-calendar</v-icon>
                            </v-btn>
                            <v-btn color="white" depressed small icon
                                href="https://www.linkedin.com/company/trade-design/" target="_blank">
                                <v-icon>mdi-linkedin</v-icon>
                            </v-btn>
                            <v-btn color="white" depressed small icon
                                href="https://www.instagram.com/tradedesignok" target="_blank">
                                <v-icon>mdi-instagram</v-icon>
                            </v-btn>
                            <v-btn color="white" depressed small icon
                                href="https://www.facebook.com/tradedesignok" target="_blank">
                                <v-icon>mdi-facebook</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-sheet>
            <v-app-bar class="menu-bar mt-10" absolute v-if="!$vuetify.breakpoint.xs    ">
                <v-container class="header pa-0 mt-n6">
                    <v-row dense>
                        <v-col cols="3">
                            <CommonTDLogoDark />
                        </v-col>
                        <v-col class="text-right">
                            <v-btn text class="white--text" href="https://trade-design.com.ar/#eventos">Eventos</v-btn>
                            <v-btn text class="white--text" href="https://trade-design.com.ar/#viajes">Viajes</v-btn>
                            <v-btn text class="white--text" href="https://trade-design.com.ar/#plataforma">Plataforma</v-btn>
                            <v-btn text class="white--text" href="https://trade-design.com.ar/#diseño">Diseño</v-btn>
                            <v-btn text class="white--text" href="https://trade-design.com.ar/#nosotros">Nosotros</v-btn>
                            <v-btn depressed rounded color="secondary" href="https://trade-design.com.ar/#contacto">Contacto</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-app-bar>
            <v-app-bar class="menu-bar mt-11" fixed absolute v-else>
                <v-container class="mt-4">
                    <v-row dense>
                        <v-col cols="6">
                            <CommonTDLogoDark class="ml-3" />
                        </v-col>
                        <v-col class="text-right">
                            <v-app-bar-nav-icon text @click.stop="menuMobile = !menuMobile"
                                color="white"></v-app-bar-nav-icon>
                        </v-col>
                    </v-row>
                </v-container>

            </v-app-bar>

    
</div>
</template>

<script>
import {
    mapGetters
} from "vuex";
export default {
    props: {
        user: {
            type: Object,
            required: true,
            default: null
        },
    },
    data() {
        return {
            menuMobile: false,
            userDrawer: false,
            loginDialog: false,
            registerDialog: false,
            notificationDrawer: false,
            notifications: [],
            search: false,
        }
    },
    methods: {
        openRegister() {
            this.registerDialog = true
        },
        openLogin() {
            this.loginDialog = true
        },
        toggleTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem("useDarkTheme", this.$vuetify.theme.dark.toString())
        },
        toggleThemeDark() {
            this.$vuetify.theme.dark = true
        },
        logout() {
            this.$store.dispatch('users/logout').then(result => {
                window.location.href = '/'
            }, error => {
                //    console.log(error)
            })
        }
    }
}
</script>
