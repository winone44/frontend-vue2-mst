<template>
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
        <b-col>Tiktoker roku</b-col>
      </b-row>
<!--  Filmy-->
      <b-row>
        <b-col>Filmy</b-col>
      </b-row>
    </b-card>
  </b-container>
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
  async created() {
    await this.$store.dispatch('getPerson', {
      id: this.id
    })
    this.user = this.$store.state.person
  }
}
</script>

<style scoped>
/*div{*/
/*    border: 1px solid black;*/
/*    padding: 1px;*/
/*}*/
</style>