<template>
<div>
    <v-navigation-drawer v-model="menuMobile" dark color="primary" clipped app disable-resize-watcher>
        <CommonTHLogo dark class="ma-16" />
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
    <v-app-bar app fixed color="app-bar-site" height="78" dark v-if="!$vuetify.breakpoint.xs">
        <a href="/">
            <CommonTHLogo dark class="mr-16" /></a>
        <v-btn text dark class="mx-2" href="/">Blog</v-btn>
        <v-spacer />
        <v-tooltip bottom content-class="bottom" v-if="!this.$vuetify.theme.dark">
            <template v-slot:activator="{ on }">
                <v-btn icon @click.stop="toggleTheme" v-on="on">
                    <v-icon color="secondary_text_dark" dark>dark_mode</v-icon>
                </v-btn>
            </template>
            <span>{{ $t('change_to_theme_dark')}}</span>
        </v-tooltip>
        <v-tooltip bottom content-class="bottom" v-else>
            <template v-slot:activator="{ on }">
                <v-btn icon @click.stop="toggleTheme" v-on="on">
                    <v-icon color="secondary_text" dark>light_mode</v-icon>
                </v-btn>
            </template>
            <span>{{ $t('change_to_theme_light')}}</span>
        </v-tooltip>
        <!-- <v-btn fab class="body-2 mr-3 primary--text" depressed @click="userDrawer = !userDrawer" v-if="user.displayName">
            <v-badge bordered bottom color="success" class="float-right" dot offset-x="10" offset-y="10">
                <CommonAvatar :alt="user.displayName" size="40" />
            </v-badge>
        </v-btn>
        <v-btn text @click="openLogin" v-else>
            Ingresar
        </v-btn> -->
        <v-app-bar-nav-icon @click.stop="menuMobile = !menuMobile" class="d-xs-block d-md-none" />
    </v-app-bar>
    <v-app-bar app fixed color="app-bar-site" height="78" dark v-else>
        <CommonTHIcon dark />
        <v-spacer></v-spacer>
        <v-tooltip bottom content-class="bottom" v-if="!this.$vuetify.theme.dark">
            <template v-slot:activator="{ on }">
                <v-btn icon @click.stop="toggleTheme" v-on="on">
                    <v-icon color="secondary_text_dark" dark>dark_mode</v-icon>
                </v-btn>
            </template>
            <span>{{ $t('change_to_theme_dark')}}</span>
        </v-tooltip>
        <v-tooltip bottom content-class="bottom" v-else>
            <template v-slot:activator="{ on }">
                <v-btn icon @click.stop="toggleTheme" v-on="on">
                    <v-icon color="secondary_text" dark>light_mode</v-icon>
                </v-btn>
            </template>
            <span>{{ $t('change_to_theme_light')}}</span>
        </v-tooltip>
        <!-- <v-btn text @click="openLogin" v-if="!user.displayName">
            <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn fab class="body-2 mr-3 primary--text" depressed @click="userDrawer = !userDrawer" v-if="user.displayName">
            <v-badge bordered bottom color="success" class="float-right" dot offset-x="10" offset-y="10">
                <CommonAvatar :alt="user.displayName" size="40" />
            </v-badge>
        </v-btn> -->
        <v-app-bar-nav-icon @click.stop="menuMobile = !menuMobile" class="d-xs-block d-md-none" />
    </v-app-bar>
    <DialogsLogin v-model="loginDialog" @openRegister="openRegister" />
    <DialogsRegister v-model="registerDialog" />
    <LayoutNotificationsDrawer v-model="notificationDrawer" :notifications="notifications" />
    <LayoutUserOptionsDrawer v-model="userDrawer" :user="user" :userName="user.displayName" :userRole="user.role" v-if="user.displayName" />
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
