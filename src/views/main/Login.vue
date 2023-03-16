<template>
  <div class="padding">
    <div class="white-card">
      <h1>Logowanie</h1>
      <b-row>
        <b-col sm="6" offset-sm="3">
          <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
                    label="Email:"
                    label-for="email"
            >
              <b-form-input
                      id="email"
                      type="email"
                      v-model="email"
                      @input="$v.email.$model = $event.trim()"
                      :state="!$v.email.$dirty ? null : !$v.email.$error"
                      required
                      placeholder="Podaj adres email" />
              <b-form-invalid-feedback>
                <span v-if="!$v.email.required">To pole jest wymagane. </span>
                <span v-if="!$v.email.email">Błędny adres email. </span>
              </b-form-invalid-feedback>
              <b-form-valid-feedback>
                <span>Wszystko jest okej. </span>
              </b-form-valid-feedback>
            </b-form-group>
            <b-form-group
                    label="Hasło:"
                    label-for="password"
            >
              <b-form-input
                      id="password"
                      type="password"
                      v-model="password"
                      @input="$v.password.$model = $event.trim()"
                      :state="!$v.password.$dirty ? null : !$v.password.$error"
                      required
                      placeholder="Podaj hasło" />

              <b-form-invalid-feedback>
                <span v-if="!$v.password.required">To pole jest wymagane. </span>
                <span v-if="!$v.password.minLength">Hasło musi posiadać conajmniej 8 znaków. </span>
              </b-form-invalid-feedback>
              <b-form-valid-feedback>
                <span>Wszystko jest okej. </span>
              </b-form-valid-feedback>
            </b-form-group>

            <transition name="fade">
              <b-alert :show="error !== null" variant="danger">{{ error }}</b-alert>
            </transition>

            <b-button type="submit" variant="primary" :disabled="$v.$invalid">Zaloguj</b-button> &nbsp;
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-form>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import { required, minLength, email } from 'vuelidate/lib/validators'
  // import authAxios from "@/auth-axios";

  export default {
    name: 'login-main',
    data(){
      return {
        email: '',
        password: ''
      }
    },
    validations: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      }
    },
    methods: {
      async onSubmit(event){
        event.preventDefault();
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
          // returnSecureToken: true
        })
        this.$router.push({name: 'protected'})
      },
      onReset(event){
        event.preventDefault();
        this.email = '';
        this.password = '';
        this.$v.$reset();
      }
    },
    computed: {
      error(){
        return this.$store.state.response;
      }
    }
  };
</script>