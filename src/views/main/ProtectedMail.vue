<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="isLoading" class="padding-y">
        <h4>Wczytywanie</h4>
        <div class="text-center">
          <b-spinner variant="primary"/>
        </div>
      </div>
      <div v-else>
        <h1>Lista użytkowników</h1>
        <ul>
          <li v-for="user in users" :key="user.id">
            <router-link :to="{ name: 'protected-mail-conversations', params: {id:user.id, friendFirstName: user.firstName, friendLastName:user.lastName}}">{{user.firstName}} {{ user.lastName }}</router-link>
          </li>
        </ul>

        <h1>Skrzynka odbiorcza</h1>
        <ul>
          <li v-for="conversation in conversations" :key="conversation.id">
            <router-link :to="{ name: 'protected-mail-conversations', params: {id:conversation.sender.id, friendFirstName: conversation.sender.firstName, friendLastName:conversation.sender.lastName}}">{{conversation.sender.firstName}} {{conversation.sender.lastName}} - {{ conversation.text }}</router-link>
          </li>
        </ul>

        <router-view></router-view>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: "ProtectedMail",
  data () {
    return {
      selectedItem: null,
      isLoading: true,
      users: [],
      conversations: null,
    }
  },
  methods: {
    async getMessage() {
      await this.$store.dispatch('getPeople');
      this.users = this.$store.state.people;
      console.log(this.users)
      await this.$store.dispatch("getInBoxMessages", {
        receiver: this.$store.state.userId
      });
      this.conversations = this.$store.state.messages;
    },
  },
  created () {
    this.getMessage();
    this.intervalId = setInterval(this.getMessage, 5000);
    this.isLoading = false;
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.intervalId);
    next();
  },
}
</script>

<style scoped>

</style>