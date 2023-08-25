<template>
<v-row class="pa-md-4" justify="space-between">
    <v-col cols="12">
        <h3 class="primary--text text-center agenda">
            Agenda
        </h3>
        <v-sheet class="my-5 text-center">
            <v-btn rounded depressed class="ma-2 py-5 primary--text btn-color" target="_blank" href="https://www.google.com/calendar/render?action=TEMPLATE&amp;text=II%20Simposio%20para%20Industrias%20Reguladas%20-%20Annar%202020&amp;dates=20201124T110000Z/20201127T200000Z&amp;details=Invitamos%20a%20participar%20de%20este%20simposio%20a%20todos%20los%20profesionales%20de%20las%20industrias%20altamente%20reguladas%20que%20tienen%20laboratorio%20de%20control%20de%20calidad%20en%20los%20sectores%20farmacosm%C3%A9tico,%20alimentos%20y%20bebidas,%20an%C3%A1lisis%20a%20terceros,%20entes%20regulatorios%20y%20centros%20de%20investigaci%C3%B3n.&amp;location=https://simposioannarindustria.com/&amp;sprop=&amp;sprop=name:">
                <img src="/img/google-cal.png" class="mr-3 pa-1" /> Agregar a Calendar
            </v-btn>
            <v-btn rounded depressed class="ma-2 py-5 primary--text btn-color" target="_blank" href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0AURL:http://carlsednaoui.github.io/add-to-calendar-buttons/generator/generator.html%0ADTSTART:20201124T110000Z%0ADTEND:20201127T200000Z%0ASUMMARY:II%20Simposio%20para%20Industrias%20Reguladas%20-%20Annar%202020%0ADESCRIPTION:Invitamos%20a%20participar%20de%20este%20simposio%20a%20todos%20los%20profesionales%20de%20las%20industrias%20altamente%20reguladas%20que%20tienen%20laboratorio%20de%20control%20de%20calidad%20en%20los%20sectores%20farmacosm%C3%A9tico,%20alimentos%20y%20bebidas,%20an%C3%A1lisis%20a%20terceros,%20entes%20regulatorios%20y%20centros%20de%20investigaci%C3%B3n.%0ALOCATION:https://simposioannarindustria.com/%0AEND:VEVENT%0AEND:VCALENDAR">
                <img src="/img/ical.png" class="mr-3 pa-1" />Agregar a iCal
            </v-btn>
            <v-btn rounded depressed class="ma-2 py-5 primary--text btn-color" target="_blank" href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0AURL:http://carlsednaoui.github.io/add-to-calendar-buttons/generator/generator.html%0ADTSTART:20201124T110000Z%0ADTEND:20201127T200000Z%0ASUMMARY:II%20Simposio%20para%20Industrias%20Reguladas%20-%20Annar%202020%0ADESCRIPTION:Invitamos%20a%20participar%20de%20este%20simposio%20a%20todos%20los%20profesionales%20de%20las%20industrias%20altamente%20reguladas%20que%20tienen%20laboratorio%20de%20control%20de%20calidad%20en%20los%20sectores%20farmacosm%C3%A9tico,%20alimentos%20y%20bebidas,%20an%C3%A1lisis%20a%20terceros,%20entes%20regulatorios%20y%20centros%20de%20investigaci%C3%B3n.%0ALOCATION:https://simposioannarindustria.com/%0AEND:VEVENT%0AEND:VCALENDAR">
                <img src="/img/oulook-cal.png" class="mr-3 pa-1" />Agregar a Outlook
            </v-btn>
        </v-sheet>
    </v-col>
    <v-col cols="12">
        <v-card tile color="transparent" class="pa-2">
            <v-tabs v-model="agenda" centered>
                <v-tab>Día 1</v-tab>
                <v-tab>Día 2</v-tab>
            </v-tabs>
            <v-tabs-items v-model="agenda" class="mt-2">
                <v-tab-item>
                    <v-timeline :dense="$vuetify.breakpoint.xsOnly">
                        <v-timeline-item primary small right>
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5>08:00</h5>
                                    </v-col>
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Apertura.</h5>
                                        <p> Trade House</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Conferencia genérica.</h5>
                                        <p> Juan Pérez</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">08:20</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small right>
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5>10:00</h5>
                                    </v-col>
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Video lanzamiento.</h5>
                                        <p> Trade Design Technologies</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Exposición importante.</h5>
                                        <p>Juana González</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">10:05</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small right>
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5>11:40</h5>
                                    </v-col>
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5>Temática del evento.</h5>
                                        <p>Gabriel Sánchez</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5>Disertación a cargo de un especialista.</h5>
                                        <p>Alejandro Gómez</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">14:00</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item color="#9432FB" small right>
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5>14:00</h5>
                                    </v-col>
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Título de conferencia principal.</h5>
                                        <p>Florencia Martínez</p>
                                        <v-chip pill class="sala2" href="/conferencias/sala2">Sala 2</v-chip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right ">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5>Espacio Promocional.</h5>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">15:35</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right ">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5>Demo Software.</h5>
                                        <p>Trade House</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">16:05</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                    </v-timeline>
                </v-tab-item>
                <!-- DIA 2 -->
                <v-tab-item>
                    <v-timeline :dense="$vuetify.breakpoint.xsOnly">
                        <v-timeline-item primary small right>
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5>08:00</h5>
                                    </v-col>
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Apertura.</h5>
                                        <p> Trade House</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Conferencia genérica.</h5>
                                        <p> Juan Pérez</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">08:20</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small right>
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5>10:00</h5>
                                    </v-col>
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Video lanzamiento.</h5>
                                        <p> Trade Design Technologies</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Exposición importante.</h5>
                                        <p>Juana González</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">10:05</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small right>
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5>11:40</h5>
                                    </v-col>
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5>Temática del evento.</h5>
                                        <p>Gabriel Sánchez</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5>Disertación a cargo de un especialista.</h5>
                                        <p>Alejandro Gómez</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">14:00</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item color="#9432FB" small right>
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5>14:00</h5>
                                    </v-col>
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5> Título de conferencia principal.</h5>
                                        <p>Florencia Martínez</p>
                                        <v-chip pill class="sala2" href="/conferencias/sala2">Sala 2</v-chip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right ">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5>Espacio Promocional.</h5>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">15:35</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                        <v-timeline-item primary small left class="text-md-right ">
                            <v-container>
                                <v-row class="pt-1">
                                    <v-col cols="12" md="10" class="pa-0">
                                        <h5>Demo Software.</h5>
                                        <p>Trade House</p>
                                        <v-chip pill color="primary--text btn-color" href="/conferencias/sala1">Sala 1</v-chip>
                                    </v-col>
                                    <v-col cols="12" md="2" class="pa-0">
                                        <h5 class="text-md-right">16:05</h5>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-timeline-item>
                    </v-timeline>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-col>
</v-row>
</template>

<script>
export default {
    data() {
        return {
            agenda: null,
        }
    }
}
</script>
