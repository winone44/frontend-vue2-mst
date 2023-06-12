<template>
  <div>
    <h1>Znajomi</h1>

    <transition name="fade" mode="out-in">
      <div v-if="isLoading">
        <h4>Wczytywanie</h4>
        <div class="text-center">
          <b-spinner variant="primary"/>
        </div>
      </div>
      <div v-else>
        <b-table striped hover :fields="fields" :items="players">

          <template #cell(delBtn)="row">
            <b-button variant="danger" size="sm" @click="delFriend(row.item.friend.id)"  class="mr-1">
              Usuń
            </b-button>
          </template>
        </b-table>
      </div>
    </transition>

    <b-button variant="primary"><router-link to="/" tag="span">Strona główna</router-link></b-button> &nbsp;
    <b-button variant="danger"><router-link to="/" tag="span">Wyloguj</router-link></b-button>
  </div>
</template>

<script>
export default {
  name: 'protected-friends',
  props: {
    userId: [String, Number]
  },
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
        },
        { key: 'delBtn', label: '' }
      ]
    };
  },
  computed: {
    players() {
      console.log(this.$store.state.friends);
      return this.$store.state.friends;
    }
  },
  methods: {
    async delFriend(id) {
      await this.$store.dispatch('delFriend', {
        person: this.$store.state.userId,
        friend: id
      })
      await this.$store.dispatch('getFriends', {
        id: this.$store.state.userId
      });
    },
  },
  async created(){
    await this.$store.dispatch('getFriends', {
      id: this.userId
    });

    this.isLoading = false;
  }
};
</script>

<style scoped>
</style>