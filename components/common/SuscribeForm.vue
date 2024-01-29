<template>
    <v-container fluid class="pa-0">
        <v-row no-gutters dense>
            <v-col class="px-0">
                <v-sheet class="background text-center pa-8 pa-lg-16 fill-height">
                    <v-row justify="center" align="center">
                        <v-col cols="12" lg="9" class="fill-height d-flex flex-column">
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

                </v-sheet>
            </v-col>
            <v-col cols="12" lg="5">
                <v-img src="/img/suscribePic.png"></v-img>
            </v-col>
        </v-row>
    </v-container>
</template>