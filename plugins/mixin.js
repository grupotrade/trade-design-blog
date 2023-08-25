import Vue from 'vue'
import moment from 'moment';

Vue.mixin({
    data() {
        return {
            rulesGlobal: {
                user: [
                    v => !!v || this.$t('rules.type_user'),
                    v => !!v || this.$t('rules.type_email'),
                    v => /.+@.+\..+/.test(v) || this.$t('rules.valid_email'),
                ],
                password: [
                    v => !!v || this.$t('rules.type_password'),
                    v => v.length >= 5 || '5 ' + this.$t('rules.min_chars')
                ],
                passwordConfirm: [
                    v => !!v || this.$t('rules.type_password'),
                    v => v === this.form.password || this.$t('rules.password_not_match')
                ],
                passwordConfirmUser: [
                    v => !!v || this.$t('rules.type_password'),
                    v => v === this.user.password || this.$t('rules.password_not_match')
                ],
                email: [
                    v => !!v || this.$t('rules.type_email'),
                    v => /.+@.+\..+/.test(v) || this.$t('rules.valid_email'),
                ],
                dni: [
                    v => !!v || this.$t('rules.type_dni'),
                    v => /^\d{8}(?:[-\s]\d{4})?$/.test(v) || this.$t('rules.valid_dni'),
                ],
                name: [
                    v => !!v || this.$t('rules.type_name'),
                ],
                surname: [
                    v => !!v || this.$t('rules.type_surname'),
                ],
                phone: [
                    v => !!v || this.$t('rules.phone'),
                ],
                address: [
                    v => !!v || this.$t('rules.address'),
                ],
                country: [
                    v => !!v || this.$t('rules.country'),
                ],
                role: [
                    v => !!v || this.$t('rules.select_role'),
                ],
                required: [
                    v => !!v || this.$t('rules.required'),
                ],
                terms: [
                    v => !!v || this.$t('rules.terms'),
                ],
                url: [{
                    require_protocol: true
                } || this.$t('rules.url')],
                comment: [
                    v => !!v || '',
                ],
                category: [
                    v => !!v || this.$t('rules.category'),
                ],
                description: [
                    v => !!v || this.$t('rules.description'),
                ],
            },
            itemsPerPageOrderList: [3, 5],
            itemsPerPageSetter: [10, 25, 50, -1],
            itemsPerPageSetterDialogs: [5, 7],
        }
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.xsOnly
        }
    },
    methods: {
        cleanObject(obj) {
            Object.keys(obj).forEach(key => (obj[key] === null || obj[key] === undefined) && delete obj[key])
        },
        getYears() {
            return [...Array(3).keys()].map(i => i + 2019)
        },
        getDate(text) {

            if (text) {
                const [year, month, day] = text.substring(0, 10).split('-')
                return `${day}/${month}/${year}`
            }

            return null
        },
        getTime(time) {
            return time.substring(0, 5)
        },
        getDateTime(text) {

            if (text) {
                const data = text.split(' ')
                const [year, month, day] = data[0].split('-')
                return `${day}/${month}/${year} ${data[1]}`
            }

            return null
        },
        parseDate(date) {
            if (!date) return null

            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        getUrl(url) {
            return `${this.$axios.defaults.baseURL.substring(0,this.$axios.defaults.baseURL.length-3)}${url}`
        },
        generateUrl(url) {
            if (url.includes('http:') || url.includes('https:')) return url

            return `https://${url}`
        },
        copyObject(obj) {
            return JSON.parse(JSON.stringify(obj))
        },
        resetForm() {
            this.$refs.createForm.resetValidation()
        },
        getStatusColor(status) {
            switch (status) {
                case 'active':
                case true:
                case 1:
                    return 'success'
                case 'new':
                case 'pending':
                    return 'lightgrey'
                case 'in_progress':
                    return 'orange'
                case 'canceled':
                case false:
                case 0:
                    return 'error'
            }
        },
        copyToClipboard(text) {
            navigator.clipboard.writeText(text)
            this.$toasted.info(this.$t('copied'), { theme: "outline", duration: 600, position: 'bottom-right', })
        },
        scrollToId(id) {
            document
                .getElementById(id).scrollIntoView({
                    behavior: "smooth"
                });
        },
        deepCopy(value) {
            return JSON.parse(JSON.stringify(value))
        },
        async saveNotification(text,userId, module, type, action) {
            const date = Date.now()
            const notificationRef = this.$fire.database.ref('notifications/' + userId + '/' + date)
            try {
                await notificationRef.set({
                    date: date,
                    text: text,
                    module: module,
                    type: type,
                    status: 'new',
                    action: action,
                    user: userId,
                    deleted: false
                })

            } catch (e) {
                console.log(e)
            }
        },
        async incrementIssueId(issueid) {
            const issueIdRef = this.$fire.database.ref('issueid')
            try {
                await issueIdRef.set({                    
                    current: issueid
                })

            } catch (e) {
                console.log(e)
            }
        },
    },
    filters: {
        //todo en mayúsculas
        uppercase(value) {
            if (!value) {
                return ""
            }
            return value.toUpperCase();
        },
        //todo en minúsculas
        lowercase(value) {
            if (!value) {
                return ""
            }
            return value.toLowerCase();
        },
        //la primera letra de cada palabra en mayúscula
        titlecase(value) {
            if (!value) {
                return ""
            }
            return value.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase());
        },
        //la primera letra de toda la oración en mayúscula
        sentence(value) {
            if(!value) {
                return ""
            }
            return value.toLowerCase().replace(/(?:^\w)/g, x => x.toUpperCase());
        },
        moment(date) {
            return moment(date).format('DD MMMM YYYY hh:mm');
        },
        momentDay(date) {
            return moment(date).format('ddd, DD MMM YYYY');
        },
        percent(value, lang) {
            if (typeof value !== "number") {
                return value;
            }
            if(value != null) {
                const formatter = new Intl.NumberFormat(lang, {
                    style: 'percent', 
                    minimumFractionDigits: 2
                })
                return formatter.format(value);
            }
        },
        dotNotation(value) {
            if (typeof value !== "number") {
                return value;
            }
            if(value != null) {
                const formatter = new Intl.NumberFormat("es-ES")
                return formatter.format(value);
            }
        }
    },
})