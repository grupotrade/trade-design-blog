<template>
    <v-container fluid class="pa-0">
        <v-row dense class="fill-height background py-0 flex-wrap">
            <v-col class="px-0 align-center d-flex justify-center">
                <v-card tile flat class="transparent text-center pa-8 pa-lg-10">
                    <v-row justify="center" align="center">
                        <v-col cols="12" lg="11">
                            <h3 class="mb-10 mt-6 white--text">Suscribite al Newsletter</h3>
                    <v-text-field rounded solo label="Email"></v-text-field>
                    <v-row justify="center">
                        <v-col cols="6"><v-text-field rounded solo label="Nombre"></v-text-field></v-col>
                        <v-col cols="6"><v-text-field rounded solo label="Apellido"></v-text-field></v-col>
                        <v-col cols="8"> <v-btn depressed rounded block class="primary">Enviar</v-btn>
                        </v-col>
                    </v-row>

                        </v-col>
                    </v-row>

                </v-card>
            </v-col>
            <v-col cols="12" lg="5" class="pa-0 fill-height d-flex align-strech">
               <v-img src="/img/suscribePic.png" cover class="fill-height"></v-img>
            </v-col>
        </v-row>
    </v-container>
</template>