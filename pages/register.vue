<template>
<v-container class="fill-height">
    <v-row align="center" justify="center" dense>
        <v-col cols="12" sm="8" md="5" align="center">
            <v-card class="elevation-4 text-center" color="white" light tile>
                <v-card-text class="px-8 pb-4">
                    <img src="/THLogo.svg" width="250" class="mt-4">
                    <h3 class="primary--text mb-8 mt-4">Registrate</h3>
                    <v-form v-model="validRegister" v-on:submit.prevent="onSubmitRegister">
                        <v-row dense>
                            <v-col cols="12" md="6">
                                <v-text-field label="Nombre" outlined color="primary" name="name" type="text" v-model="form.name" required :rules="rulesGlobal.required"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Apellido" outlined color="primary" name="lastname" type="text" v-model="form.lastname" required :rules="rulesGlobal.required"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field label="Email" outlined color="primary" name="email" type="text" v-model="form.email" required :rules="rulesGlobal.email"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Repetir email" outlined color="primary" name="email_repeat" type="text" v-model="form.email_repeat" required :rules="rulesGlobal.email"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field label="Empresa/Farmacia" outlined color="primary" name="group" type="text" v-model="form.group"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Código de Farmacia" outlined color="primary" name="group_code" type="text" v-model="form.group_code"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-select :items="provincias" item-text="nombre" item-value="nombre" label="Provincia" outlined color="primary" name="state" type="text" v-model="form.state"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Ciudad" outlined color="primary" name="city" type="text" v-model="form.city"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field label="Contraseña" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" counter outlined color="primary" name="password" prepend-inner-icon="mdi-lock" v-model="form.password" required :rules="rulesGlobal.password" @click:append="showPass = !showPass"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Repetir Contraseña" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" counter outlined color="primary" name="re_password" prepend-inner-icon="mdi-lock" v-model="form.password_confirmation" :rules="rulesGlobal.passwordConfirm" @click:append="showPass = !showPass"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-btn color="primary" type="submit" :disabled="!validRegister" depressed large block>Enviar</v-btn>
                    </v-form>
                    <v-btn color="black" class="mt-5" text @click="$router.push('/login')" depressed small>
                        Volver</v-btn>
                </v-card-text>
            </v-card>
            <v-sheet color="transparent" class="mt-6 login-logos">
                <img src="/THLogo_dark.svg" width="150" /> <span class="body-2 secondary_text_dark--text">by</span> <img src="/TDLogo_dark.svg" width="150" />
            </v-sheet>
            <v-snackbar :timeout="4000" v-model="snackbar" absolute bottom center>
                {{ snackbarText }}
            </v-snackbar>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
export default {
    layout: 'clean',
    middleware: 'noauth',
    data() {
        return {
            snackbar: false,
            snackbarText: 'No error message',
            form: {
                name: 'Produccion',
                lastname: 'Admin',
                password: 'Trade2022$',
                group: 'TD',
                group_code: 'TD',
                state: 'CABA',
                city: 'CABA',
                password_confirmation: 'Trade2022$',
                email: 'produccion@trade-design.com.ar',
                email_repeat: 'produccion@trade-design.com.ar'
            },
            showPass: false,
            validRegister: false,
            provincias: [{
                    "nombre_completo": "Provincia de Misiones",
                    "fuente": "IGN",
                    "iso_id": "AR-N",
                    "nombre": "Misiones",
                    "id": "54",
                    "categoria": "Provincia",
                    "iso_nombre": "Misiones",
                    "centroide": {
                        "lat": -26.8753965086829,
                        "lon": -54.6516966230371
                    }
                },
                {
                    "nombre_completo": "Provincia de San Luis",
                    "fuente": "IGN",
                    "iso_id": "AR-D",
                    "nombre": "San Luis",
                    "id": "74",
                    "categoria": "Provincia",
                    "iso_nombre": "San Luis",
                    "centroide": {
                        "lat": -33.7577257449137,
                        "lon": -66.0281298195836
                    }
                },
                {
                    "nombre_completo": "Provincia de San Juan",
                    "fuente": "IGN",
                    "iso_id": "AR-J",
                    "nombre": "San Juan",
                    "id": "70",
                    "categoria": "Provincia",
                    "iso_nombre": "San Juan",
                    "centroide": {
                        "lat": -30.8653679979618,
                        "lon": -68.8894908486844
                    }
                },
                {
                    "nombre_completo": "Provincia de Entre Ríos",
                    "fuente": "IGN",
                    "iso_id": "AR-E",
                    "nombre": "Entre Ríos",
                    "id": "30",
                    "categoria": "Provincia",
                    "iso_nombre": "Entre Ríos",
                    "centroide": {
                        "lat": -32.0588735436448,
                        "lon": -59.2014475514635
                    }
                },
                {
                    "nombre_completo": "Provincia de Santa Cruz",
                    "fuente": "IGN",
                    "iso_id": "AR-Z",
                    "nombre": "Santa Cruz",
                    "id": "78",
                    "categoria": "Provincia",
                    "iso_nombre": "Santa Cruz",
                    "centroide": {
                        "lat": -48.8154851827063,
                        "lon": -69.9557621671973
                    }
                },
                {
                    "nombre_completo": "Provincia de Río Negro",
                    "fuente": "IGN",
                    "iso_id": "AR-R",
                    "nombre": "Río Negro",
                    "id": "62",
                    "categoria": "Provincia",
                    "iso_nombre": "Río Negro",
                    "centroide": {
                        "lat": -40.4057957178801,
                        "lon": -67.229329893694
                    }
                },
                {
                    "nombre_completo": "Provincia del Chubut",
                    "fuente": "IGN",
                    "iso_id": "AR-U",
                    "nombre": "Chubut",
                    "id": "26",
                    "categoria": "Provincia",
                    "iso_nombre": "Chubut",
                    "centroide": {
                        "lat": -43.7886233529878,
                        "lon": -68.5267593943345
                    }
                },
                {
                    "nombre_completo": "Provincia de Córdoba",
                    "fuente": "IGN",
                    "iso_id": "AR-X",
                    "nombre": "Córdoba",
                    "id": "14",
                    "categoria": "Provincia",
                    "iso_nombre": "Córdoba",
                    "centroide": {
                        "lat": -32.142932663607,
                        "lon": -63.8017532741662
                    }
                },
                {
                    "nombre_completo": "Provincia de Mendoza",
                    "fuente": "IGN",
                    "iso_id": "AR-M",
                    "nombre": "Mendoza",
                    "id": "50",
                    "categoria": "Provincia",
                    "iso_nombre": "Mendoza",
                    "centroide": {
                        "lat": -34.6298873058957,
                        "lon": -68.5831228183798
                    }
                },
                {
                    "nombre_completo": "Provincia de La Rioja",
                    "fuente": "IGN",
                    "iso_id": "AR-F",
                    "nombre": "La Rioja",
                    "id": "46",
                    "categoria": "Provincia",
                    "iso_nombre": "La Rioja",
                    "centroide": {
                        "lat": -29.685776298315,
                        "lon": -67.1817359694432
                    }
                },
                {
                    "nombre_completo": "Provincia de Catamarca",
                    "fuente": "IGN",
                    "iso_id": "AR-K",
                    "nombre": "Catamarca",
                    "id": "10",
                    "categoria": "Provincia",
                    "iso_nombre": "Catamarca",
                    "centroide": {
                        "lat": -27.3358332810217,
                        "lon": -66.9476824299928
                    }
                },
                {
                    "nombre_completo": "Provincia de La Pampa",
                    "fuente": "IGN",
                    "iso_id": "AR-L",
                    "nombre": "La Pampa",
                    "id": "42",
                    "categoria": "Provincia",
                    "iso_nombre": "La Pampa",
                    "centroide": {
                        "lat": -37.1315537735949,
                        "lon": -65.4466546606951
                    }
                },
                {
                    "nombre_completo": "Provincia de Santiago del Estero",
                    "fuente": "IGN",
                    "iso_id": "AR-G",
                    "nombre": "Santiago del Estero",
                    "id": "86",
                    "categoria": "Provincia",
                    "iso_nombre": "Santiago del Estero",
                    "centroide": {
                        "lat": -27.7824116550944,
                        "lon": -63.2523866568588
                    }
                },
                {
                    "nombre_completo": "Provincia de Corrientes",
                    "fuente": "IGN",
                    "iso_id": "AR-W",
                    "nombre": "Corrientes",
                    "id": "18",
                    "categoria": "Provincia",
                    "iso_nombre": "Corrientes",
                    "centroide": {
                        "lat": -28.7743047046407,
                        "lon": -57.8012191977913
                    }
                },
                {
                    "nombre_completo": "Provincia de Santa Fe",
                    "fuente": "IGN",
                    "iso_id": "AR-S",
                    "nombre": "Santa Fe",
                    "id": "82",
                    "categoria": "Provincia",
                    "iso_nombre": "Santa Fe",
                    "centroide": {
                        "lat": -30.7069271588117,
                        "lon": -60.9498369430241
                    }
                },
                {
                    "nombre_completo": "Provincia de Tucumán",
                    "fuente": "IGN",
                    "iso_id": "AR-T",
                    "nombre": "Tucumán",
                    "id": "90",
                    "categoria": "Provincia",
                    "iso_nombre": "Tucumán",
                    "centroide": {
                        "lat": -26.9478001830786,
                        "lon": -65.3647579441481
                    }
                },
                {
                    "nombre_completo": "Provincia del Neuquén",
                    "fuente": "IGN",
                    "iso_id": "AR-Q",
                    "nombre": "Neuquén",
                    "id": "58",
                    "categoria": "Provincia",
                    "iso_nombre": "Neuquén",
                    "centroide": {
                        "lat": -38.6417575824599,
                        "lon": -70.1185705180601
                    }
                },
                {
                    "nombre_completo": "Provincia de Salta",
                    "fuente": "IGN",
                    "iso_id": "AR-A",
                    "nombre": "Salta",
                    "id": "66",
                    "categoria": "Provincia",
                    "iso_nombre": "Salta",
                    "centroide": {
                        "lat": -24.2991344492002,
                        "lon": -64.8144629600627
                    }
                },
                {
                    "nombre_completo": "Provincia del Chaco",
                    "fuente": "IGN",
                    "iso_id": "AR-H",
                    "nombre": "Chaco",
                    "id": "22",
                    "categoria": "Provincia",
                    "iso_nombre": "Chaco",
                    "centroide": {
                        "lat": -26.3864309061226,
                        "lon": -60.7658307438603
                    }
                },
                {
                    "nombre_completo": "Provincia de Formosa",
                    "fuente": "IGN",
                    "iso_id": "AR-P",
                    "nombre": "Formosa",
                    "id": "34",
                    "categoria": "Provincia",
                    "iso_nombre": "Formosa",
                    "centroide": {
                        "lat": -24.894972594871,
                        "lon": -59.9324405800872
                    }
                },
                {
                    "nombre_completo": "Provincia de Jujuy",
                    "fuente": "IGN",
                    "iso_id": "AR-Y",
                    "nombre": "Jujuy",
                    "id": "38",
                    "categoria": "Provincia",
                    "iso_nombre": "Jujuy",
                    "centroide": {
                        "lat": -23.3200784211351,
                        "lon": -65.7642522180337
                    }
                },
                {
                    "nombre_completo": "Ciudad Autónoma de Buenos Aires",
                    "fuente": "IGN",
                    "iso_id": "AR-C",
                    "nombre": "Ciudad Autónoma de Buenos Aires",
                    "id": "02",
                    "categoria": "Ciudad Autónoma",
                    "iso_nombre": "Ciudad Autónoma de Buenos Aires",
                    "centroide": {
                        "lat": -34.6144934119689,
                        "lon": -58.4458563545429
                    }
                },
                {
                    "nombre_completo": "Provincia de Buenos Aires",
                    "fuente": "IGN",
                    "iso_id": "AR-B",
                    "nombre": "Buenos Aires",
                    "id": "06",
                    "categoria": "Provincia",
                    "iso_nombre": "Buenos Aires",
                    "centroide": {
                        "lat": -36.6769415180527,
                        "lon": -60.5588319815719
                    }
                },
                {
                    "nombre_completo": "Provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur",
                    "fuente": "IGN",
                    "iso_id": "AR-V",
                    "nombre": "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
                    "id": "94",
                    "categoria": "Provincia",
                    "iso_nombre": "Tierra del Fuego",
                    "centroide": {
                        "lat": -82.52151781221,
                        "lon": -50.7427486049785
                    }
                }
            ]

        }
    },
    methods: {
        onSubmitRegister() {
            const payload = {
                email: this.form.email,
                password: this.form.password,
                displayName: this.form.name +' '+ this.form.lastname,
                group: this.form.group,
                state: this.form.state,
                city: this.form.city
            }
            this.$store.dispatch('users/registerUser', payload)
                .then(result => {
                    this.$toasted.success(result, {
                            duration: 1500
                        })
                        setTimeout(() => {
                    location.replace('/login')
                }, 1500)
                    

                })
                .catch(err => {
                    this.$toasted.error(err, {
                        duration: 1500
                    })
                })
        }
    }
}
</script>

<style>
.login-logos img,
.login-logos span {
    opacity: .5;
    vertical-align: middle;
}
</style>
