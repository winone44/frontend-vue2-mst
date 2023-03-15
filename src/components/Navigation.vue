<template>
    <b-nav fill tabs>
        <router-link to="/" tag="li" class="nav-item"><b-nav-item :active="$route.name === 'home'">Home</b-nav-item></router-link>
        <router-link to="/register" tag="li" class="nav-item" v-if="!auth"><b-nav-item :active="$route.name === 'register'">Dołącz do nas</b-nav-item></router-link>
        <router-link to="/login" tag="li" class="nav-item" v-if="!auth"><b-nav-item :active="$route.name === 'login'">Zaloguj się</b-nav-item></router-link>
        <router-link to="/protected" tag="li" class="nav-item" v-if="auth"><b-nav-item :active="$route.name === 'protected'">Dla zalogowanych</b-nav-item></router-link>
        <router-link to="/protected-tiktok" tag="li" class="nav-item" v-if="auth"><b-nav-item :active="$route.name === 'protected-tiktok'">Dla zalogowanych tiktok</b-nav-item></router-link>
        <li @click="logout" class="nav-item" v-if="auth"><b-nav-item>Wyloguj</b-nav-item></li>
    </b-nav>
</template>

<script>
  export default {
    name: 'navigation-bar',
    computed: {
      auth() {
        return this.$store.getters.isAuth;
      }
    },
    methods: {
      logout() {
        this.$store.dispatch('logout');
      }
    }
  };
</script>

<style scoped>

</style>