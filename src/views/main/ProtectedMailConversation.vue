<template>
  <b-container>
    <transition name="fade" mode="out-in">
      <div v-if="isLoading" class="padding-y">
        <h4>Wczytywanie</h4>
        <div class="text-center">
          <b-spinner variant="primary"/>
        </div>
      </div>
      <div v-else>
        <b-icon-arrow-left @click="$router.go(-1)"></b-icon-arrow-left>
        <h1 v-if="friendFirstName !== undefined">Wyślij wiadomość do: {{ friendFirstName }} {{ friendLastName }}</h1>
        <b-form @submit.prevent="sendMessage">
          <b-form-textarea v-model="newMessageText"></b-form-textarea>
          <b-button type="submit">Wyślij</b-button>
        </b-form>
        <div v-for="(message, index) in this.$store.state.messages" :key="index">
          <p><b>{{ message.text }}</b></p>
          <p>{{message.sender.firstName}} {{message.sender.lastName}} {{ message.created_at }}</p>
        </div>


      </div>
    </transition>
  </b-container>
</template>

<script>

export default {
  name: "ProtectedMailConversation",
  props: {
    id: [String, Number],
    friendFirstName: String,
    friendLastName: String,
  },
  data () {
    return {
      intervalId: null,
      conversation: null,
      isLoading: true,
      newMessageText: ''
    }
  },
  methods: {
    async getMessage() {
      await this.$store.dispatch("getMessages", {
        sender: this.$store.state.userId, receiver: this.id
      });
      this.conversation = this.$store.state.messages;
    },
    async sendMessage() {
        await this.$store.dispatch('sendMessages', {
        sender: this.$store.state.userId,
        receiver: this.id,
        text: this.newMessageText
      })
      this.newMessageText = '';
      this.conversation = this.$store.state.messages
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