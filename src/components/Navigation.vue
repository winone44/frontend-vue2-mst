<template>
  <div>
  <b-button variant="info" v-b-toggle.sidebar-right>Menu</b-button>
  <b-sidebar id="sidebar-right" title="Menu" right shadow>
    <b-nav vertical fill>
        <router-link :to="{ name: 'home'}" tag="b-nav-item" class="nav-item" v-if="!auth" :active="$route.name === 'home'">Home</router-link>
        <router-link :to="{ name: 'register'}" tag="b-nav-item" class="nav-item" v-if="!auth" :active="$route.name === 'register'"> Dołącz do nas</router-link>
        <router-link :to="{ name: 'login'}" tag="b-nav-item" class="nav-item" v-if="!auth" :active="$route.name === 'login'">Zaloguj się</router-link>
        <router-link :to="{ name: 'protected-search-friend'}" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'protected-search-friend'">Szukaj</router-link>
        <router-link :to="{ name: 'protected-tiktok' }" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'protected-tiktok'">Filmy</router-link>
        <router-link :to="{ name: 'protected-mail' }" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'protected-mail'">Wiadomości</router-link>
        <router-link :to="{ name: 'add-new-video' }" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'add-new-video'">Dodaj nowy film</router-link>
        <router-link :to="{ name: 'user', params: { id: this.$store.state.userId }}" tag="b-nav-item" class="nav-item" v-if="auth" :active="$route.name === 'user'">Twój profil</router-link>
        <li @click="logout" class="nav-item" v-if="auth"><b-nav-item>Wyloguj</b-nav-item></li>
    </b-nav>
  </b-sidebar>
  </div>
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