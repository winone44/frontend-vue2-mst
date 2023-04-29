<template>
    <b-nav tabs fill>
        <router-link to="/" tag="b-nav-item" class="nav-item" v-if="!auth" :active="$route.name === 'home'">Home</router-link>
        <router-link to="/register" tag="b-nav-item" class="nav-item" v-if="!auth" :active="$route.name === 'register'"> Dołącz do nas</router-link>
        <router-link to="/login" tag="b-nav-item" class="nav-item" v-if="!auth" :active="$route.name === 'login'">Zaloguj się</router-link>
        <router-link to="/protected" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'protected'">Dla zalogowanych</router-link>
        <router-link to="/protectedSearchFriend" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'protected-search-friend'">Szukaj znajomych</router-link>
        <router-link to="/protected-tiktok" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'protected-tiktok'">Dla zalogowanych tiktok</router-link>
        <router-link to="/protected-mail" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'protected-mail'">Dla zalogowanych wiadomości</router-link>
        <router-link to="/add-new-video" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'add-new-video'">Dla zalogowanych dodaj nowy film</router-link>
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