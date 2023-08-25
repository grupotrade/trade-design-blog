<template>
<v-footer :class="(!$vuetify.breakpoint.xs) ? 'footer-default py-6' : 'py-6'">
    <v-row dense align="center">
        <v-col cols="6" lg="4">
            <img src="/img/THLogo.svg" width="180" />
        </v-col>
        <v-col cols="6"  lg="4" class="d-flex align-center justify-center" v-if="!$vuetify.breakpoint.xs">
            <v-btn text href="http://www.trade-design.com.ar" target="_blank" style="text-transform: none">Powered by </v-btn>
            <a href="http://www.trade-design.com.ar" target="_blank">
                <img src="/img/TDLogo.svg" style="width:160px; vertical-align: middle;" />
            </a>
        </v-col>
        <v-col cols="6"  lg="4" class="text-right">

        </v-col>
        <v-col cols="12" class="d-flex align-center justify-center" v-if="$vuetify.breakpoint.xs">
            <v-btn text href="http://www.trade-design.com.ar" target="_blank" style="text-transform: none">Powered by </v-btn>
            <a href="http://www.trade-design.com.ar" target="_blank">
                <img src="/img/TDLogo.svg" style="width:160px; vertical-align: middle;" />
            </a>
        </v-col>
    </v-row>
</v-footer>
</template>
