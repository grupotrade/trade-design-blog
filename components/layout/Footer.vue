<template>
     <v-footer class="pt-6 mt-4" elevation="0">
            <v-container class="footer-default pa-0">
                <v-row dense>
                    <v-col cols="12" lg="3">
                        <CommonTDLogo  /> 
                    </v-col>
                   <v-col cols="12" lg="6">
                       <p class="text-center pt-3 secondary_text--text">© 2024 Trade Design</p>
                    </v-col>
                    <v-col cols="12" lg="3" :class="$vuetify.breakpoint.xs ? 'text-center' : 'text-right'">
                        <v-btn color="black" icon small
                        href="mailto:mariana.ferraro@trade-design.com.ar" target="_blank">
                            <v-icon>mdi-email</v-icon>
                        </v-btn>
                        <v-btn color="black" icon small
                            href="https://www.linkedin.com/company/trade-design/" target="_blank">
                            <v-icon>mdi-linkedin</v-icon>
                        </v-btn>
                        <v-btn color="black" icon small
                            href="https://www.instagram.com/tradedesignok" target="_blank">
                            <v-icon>mdi-instagram</v-icon>
                        </v-btn>
                        <v-btn color="black" icon small
                            href="https://www.facebook.com/tradedesignok" target="_blank">
                            <v-icon>mdi-facebook</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>

</template>
