<template>
  <div>
    <h1>Znajomi</h1>

    <transition name="fade" mode="out-in">
      <div v-if="isLoading">
        <h4>Wczytywanie graczy</h4>
        <div class="text-center">
          <b-spinner variant="primary"/>
        </div>
      </div>
      <div v-else>
        <b-table striped hover :fields="fields" :items="players"/>
      </div>
    </transition>

    <b-button variant="primary"><router-link to="/" tag="span">Strona główna</router-link></b-button> &nbsp;
    <b-button variant="danger"><router-link to="/" tag="span">Wyloguj</router-link></b-button>
  </div>
</template>

<script>
export default {
  name: 'protected-friends',
  data(){
    return {
      // players: [], - jest w computed
      isLoading: true,
      fields: [
        {
          key: 'friend.firstName',
          label: 'Imię'
        },
        {
          key: 'friend.lastName',
          label: 'Nazwisko'
        }
      ]
    };
  },
  computed: {
    players() {
      console.log(this.$store.state.friends);
      return this.$store.state.friends;
    }
  },
  async created(){
    await this.$store.dispatch('getFriends');
    this.isLoading = false;
  }
};
</script>

<style scoped>
</style>