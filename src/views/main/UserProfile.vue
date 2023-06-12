<template>
  <transition name="fade" mode="out-in">
    <div v-if="isLoading" class="padding-y">
      <h4>Wczytywanie</h4>
      <div class="text-center">
        <b-spinner variant="primary"/>
      </div>
    </div>
    <div v-else>
  <b-container>
    <b-card>
<!--  Cofnij | Imię i nazwisko | Udostępnij-->
      <b-row>
        <b-col>
          <BackButton />
        </b-col>
        <b-col cols="8">
          <h1>{{user.firstName}} {{user.lastName}}</h1>
        </b-col>
        <b-col>
          <ShareButton />
        </b-col>
      </b-row>
<!--  Awatar-->
      <b-row>
        <b-col>
          <b-avatar size="8rem" :src="'/media/photos/' + user.profile_picture"></b-avatar>
        </b-col>
      </b-row>
<!--  Obserwuje | Obserwujący | Polubienia-->
      <b-row>
        <b-col><b>{{user.number_of_following}}</b></b-col>
        <b-col><b>{{user.number_of_followers}}</b></b-col>
        <b-col><b>{{user.number_of_likes}}</b></b-col>
      </b-row>
      <b-row>
        <b-col>Obserwuje</b-col>
        <b-col>Obserwujący</b-col>
        <b-col>Polubienia</b-col>
      </b-row>
<!--  Opis-->
      <b-row>
        <b-col>Opis</b-col>
      </b-row>
      <b-row>
        <b-col v-if="!showTextArea" style="white-space: pre-line">{{user.description}}</b-col>
        <b-col v-else>
          <b-form @submit.prevent="onSubmit">
            <b-form-textarea v-model="description"></b-form-textarea>
            <b-button type="submit" variant="primary">Wyślij</b-button>
          </b-form>
        </b-col>
        <b-col cols="1" v-if="!showTextArea && user.id === Number($store.state.userId)"><b-icon icon="pencil-square" @click="showTextArea = !showTextArea"></b-icon> </b-col>
      </b-row>
<!--  Przyciski-->
      <b-row>
        <b-col>
          <router-link class="messages-btn" style="width: 100%" :to="{ name: 'protected-mail-conversations', params: {id:user.id, friendFirstName: user.firstName, friendLastName:user.lastName}}" tag="b-button">Wiadomość</router-link>
        </b-col>
        <b-col>
          <router-link class="friends-btn" style="width: 100%" :to="{name: 'protected-friends', params: {userId:user.id}}" tag="b-button">Znajomi</router-link>
        </b-col>
        <b-col>
          <router-link class="video-btn" style="width: 100%" :to="'/protected-tiktok/' + user.id + '/'" tag="b-button" >Filmy</router-link>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
    </div>
  </transition>
</template>

<script>
import ShareButton from "@/components/ShareButton";
import BackButton from "@/components/BackButton";
export default {
  name: "UserProfile",
  components: {BackButton, ShareButton},
  props: {
    id: [String, Number]
  },
  data() {
    return {
      isLoading: true,
      description: '',
      showTextArea: false,
      user: {
        id: 1,
        firstName: "",
        lastName: "",
        email: "",
        age: 0,
        is_company: true,
        profile_picture: "",
        person_ExternalContact: []
      },
    }
  },
  watch: {
    $route(to, from) {
      // Reagowanie na zmianę parametru routera
      if (to.params.id !== from.params.id) {
        this.isLoading = true;
        this.userId = to.params.id;
        // Wywołanie metody, która pobiera dane użytkownika
        this.fetchUserData(this.userId);
      }
    },
  },
  async created() {
    await this.fetchUserData(this.id);
  },
  methods: {
    async fetchUserData(userId) {
      await this.$store.dispatch('getPerson', {
        id: userId
      })
      this.user = this.$store.state.person
      this.description = this.user.description
      this.isLoading = false;
    },
    async onSubmit() {
      try {
        const newData = {description: this.description}
        const id = this.$store.state.userId
        await this.$store.dispatch('patchPersonDescription', {
          id, newData
        })

        console.log(this.description);
        this.user.description = this.description;
        this.showTextArea = false;
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.messages-btn {
  background-color: #5d5d5d;
}
.friends-btn {
  background-color: #0972a9;
}
.video-btn {
  background-color: black;
}
</style>