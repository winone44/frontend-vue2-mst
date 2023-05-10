<template>
  <transition name="fade" mode="out-in">
    <div v-if="isLoading" class="padding-y">
      <h4>Wczytywanie graczy</h4>
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
        <b-col><b>226.2M</b></b-col>
      </b-row>
      <b-row>
        <b-col>Obserwuje</b-col>
        <b-col>Obserwujący</b-col>
        <b-col>Polubienia</b-col>
      </b-row>
<!--  Button Obserwuj-->
      <b-row>
        <b-col>Obserwuj</b-col>
      </b-row>
<!--  Opis-->
      <b-row>
        <b-col></b-col>
      </b-row>
<!--  Filmy-->
      <b-row>
        <b-col></b-col>
        <b-col>
          <router-link style="width: 100%" to="/protected-friends" tag="b-button" >Znajomi</router-link>
        </b-col>
        <b-col>
          <router-link :to="'/protected-tiktok/' + user.id + '/'" tag="b-button" >Filmy</router-link>
        </b-col>
        <b-col></b-col>
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
      this.isLoading = false;
    }
  }
}
</script>

<style scoped>
/*div{*/
/*    border: 1px solid black;*/
/*    padding: 1px;*/
/*}*/
</style>