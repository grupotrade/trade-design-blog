<template>
     <v-footer color="white" class="pt-4 mt-1" elevation="0">
            <v-container class="footer pa-0">
                <v-row dense>
                    <v-col cols="12" lg="2">
                        <CommonTDLogo  /> 
                    </v-col>
                    <v-col cols="12" lg="7" v-if="!$vuetify.breakpoint.xs">
                        <v-btn text
                            href="https://api.whatsapp.com/send?phone=5491126117588&text=Hola,%20estoy%20visitando%20Trade%20Design,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20acerca%20de%20sus%20productos%20y%20servicios"
                            target="_blank">
                            <v-icon small>mdi-whatsapp</v-icon>+54 9 11 2 611 7588
                        </v-btn>
                        <v-btn text href="mailto:produccion@trade-design.com.ar" class="text-lowercase">
                            <v-icon small>mdi-email</v-icon>produccion@trade-design.com.ar
                        </v-btn>
                        <span class="ml-3">
                            <v-icon small>mdi-map-marker</v-icon>Buenos Aires, Argentina
                        </span>
                    </v-col>
                    <v-col cols="12" lg="7" v-else>
                        <v-btn text
                            href="https://api.whatsapp.com/send?phone=5491126117588&text=Hola,%20estoy%20visitando%20Trade%20Design,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20acerca%20de%20sus%20productos%20y%20servicios"
                            target="_blank">
                            <v-icon small>mdi-whatsapp</v-icon>+54 9 11 2 611 7588
                        </v-btn>
                        <v-btn text href="mailto:produccion@trade-design.com.ar" class="text-lowercase">
                            <v-icon small>mdi-email</v-icon>produccion@trade-design.com.ar
                        </v-btn>
                        <v-btn text>
                            <v-icon small>mdi-map-marker</v-icon>Buenos Aires, Argentina
                        </v-btn>
                    </v-col>
                    <v-col cols="12" lg="3" :class="$vuetify.breakpoint.xs ? '' : 'text-right'">
                        <v-btn color="black" icon small
                            href="https://www.linkedin.com/company/trade-design/" target="_blank">
                            <v-icon small>mdi-linkedin</v-icon>
                        </v-btn>
                        <v-btn color="black" icon small
                            href="https://www.instagram.com/tradedesignok" target="_blank">
                            <v-icon small>mdi-instagram</v-icon>
                        </v-btn>
                        <v-btn color="black" icon small
                            href="https://www.facebook.com/tradedesignok" target="_blank">
                            <v-icon small>mdi-facebook</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>

</template>
