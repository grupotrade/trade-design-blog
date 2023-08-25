<template>
    
</template>
<script>
export default {
    middleware: 'auth',
    name: "logout",
    layout: 'clean',
    mounted () {
        this.$store.dispatch('signOut', null).then(result => {
            this.$snackbar.show({
                text: result,
                color: 'success'
            })
            localStorage.removeItem('TOKEN')
        }, error => {
            this.$snackbar.show({
                text: error,
                color: 'error'
            })
        })
    }
}
</script>