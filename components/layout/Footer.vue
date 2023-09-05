<template>
<v-footer :class="(!$vuetify.breakpoint.xs) ? 'footer-default py-6' : 'py-6'">
    <v-row dense align="center">
        <v-col cols="6" lg="4">
                <img src="/img/TDLogo.svg" style="width:160px; vertical-align: middle;" />
        </v-col>
        <v-col cols="6"  lg="4" class="d-flex align-center justify-center" v-if="!$vuetify.breakpoint.xs">
           
        </v-col>
        <v-col cols="6"  lg="4" class="text-right">

        </v-col>
        <v-col cols="12" class="d-flex align-center justify-center" v-if="$vuetify.breakpoint.xs">
           
        </v-col>
    </v-row>
</v-footer>
</template>
