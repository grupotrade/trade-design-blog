export const states = {
    list: []
}

export const actions = {
    async registerUser({commit}, payload) {
        return new Promise((resolve, reject) => {
            this.$fire.auth.createUserWithEmailAndPassword(payload.email, payload.password).then(data => {
                    const collection = this.$fire.firestore.collection('users')
                    const mailcollection = this.$fire.firestore.collection('mails')
                    collection.doc(data.user.uid).set({
                        displayName: payload.name +' '+ payload.lastName,
                        name: payload.name,
                        lastName: payload.lastName,
                        state: payload.email,
                        city: payload.city,
                        group: payload.group,
                        email: payload.email,
                        role: 'public',
                        enable: false,
                        deleted_at: "",
                    })
                    mailcollection.add({
                        to: payload.email,
                        message: {
                          subject: 'Bienvenido a Trade House',
                          html: 'This is an <code>HTML</code> email body.',
                        }
                      })
                      this.$fire.auth().currentUser.sendEmailVerification()
                        .then(() => {
                            // Email verification sent!
                            // ...
                        });
                    resolve("Usuario registrado con éxito.")
                  }, error => {
                    reject('Error al registrarse')
                });        
        })
    },
    async createUser({commit}, payload) {
        return new Promise((resolve, reject) => {
            this.$fire.auth.createUserWithEmailAndPassword(payload.email, payload.password).then(data => {
                    const collection = this.$fire.firestore.collection('users')
                    const mailcollection = this.$fire.firestore.collection('mails')
                    collection.doc(data.user.uid).set({
                        displayName: payload.name +' '+ payload.lastName,
                        name: payload.name,
                        lastName: payload.lastName,
                        email: payload.email,
                        group: payload.group,
                        role: 'admin',
                        enable: true,
                        deleted_at: "",
                    })
                    mailcollection.add({
                        to: payload.email,
                        message: {
                          subject: 'Nuevo usuario de gestión de contenidos',
                          html: 'Usted ya puede ingresar al sistema de gestión de contenidos.',
                        }
                      })
                    resolve("Usuario creado con éxito.")
                  }, error => {
                    reject('Error al crear usuario')
                });        
        })
    },
    listUsers({commit}) {
        return new Promise((resolve, reject) => {
            let users = []
            const ref = this.$fire.firestore.collection('users')
            ref.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let item = doc.data()
                    item.id = doc.id
                    users.push(item)
                })
                    
                commit('setUser', users)
                resolve(users)
            }, error => {
                reject('Error al listar los usuarios')
            })
            
        })
    }
}

export const mutations = {
    setUser (state, payload) {
        state.list = JSON.parse(JSON.stringify(payload))
    }
}

export const getters = {
    getUsers: (state) => {
        return state.list
    }
}