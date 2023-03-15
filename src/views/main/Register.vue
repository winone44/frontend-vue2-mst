<template>
  <div class="padding">
    <div class="white-card">
      <h1>Rejestracja</h1>
      <b-row>
        <b-col sm="6" offset-sm="3">
          <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
                    label="Nazwa użytkownika:"
                    label-for="username"
            >
              <b-form-input
                      id="username"
                      type="text"
                      v-model="username"
                      @input="$v.username.$model = $event.trim()"
                      :state="!$v.username.$dirty ? null : !$v.username.$error"
                      required
                      placeholder="Podaj adres email" />
              <b-form-invalid-feedback>
                <span v-if="!$v.username.required">To pole jest wymagane. </span>
              </b-form-invalid-feedback>
              <b-form-valid-feedback>
                <span>Wszystko jest okej. </span>
              </b-form-valid-feedback>
            </b-form-group>
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
                label="date_of_birth:"
                label-for="date_of_birth"
            >
              <b-form-input
                  id="date_of_birth"
                  type="text"
                  v-model="date_of_birth"
                  @input="$v.date_of_birth.$model = $event.trim()"
                  :state="!$v.date_of_birth ? null : !$v.date_of_birth.$error"
                  required
                  placeholder="RRRR-MM-DD" />
              <b-form-invalid-feedback>
                <span v-if="!$v.date_of_birth.required">To pole jest wymagane. </span>
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

            <b-form-group
                    label="Powtórz Hasło:"
                    label-for="password2"
            >
              <b-form-input
                      id="password2"
                      type="password"
                      v-model="password2"
                      @input="$v.password2.$model = $event.trim()"
                      :state="!$v.password2.$dirty ? null : !$v.password2.$error"
                      required
                      placeholder="Podaj hasło" />

              <b-form-invalid-feedback>
                <span v-if="!$v.password2.required">To pole jest wymagane. </span>
                <span v-if="!$v.password2.minLength">Hasło musi posiadać conajmniej 8 znaków. </span>
              </b-form-invalid-feedback>
              <b-form-valid-feedback>
                <span>Wszystko jest okej. </span>
              </b-form-valid-feedback>
            </b-form-group>

            <transition name="fade">
            <b-alert :show="error !== null" variant="danger">{{ error }}</b-alert>
            </transition>

            <b-button type="submit" variant="primary" :disabled="$v.$invalid">Wyślij</b-button> &nbsp;
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
    name: 'register-main',
    data(){
      return {
        username: '',
        email: '',
        password: '',
        password2: '',
        date_of_birth: ''
      }
    },
    validations: {
      username: {
        required
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      },
      password2: {
        required,
        minLength: minLength(8)
      },
      date_of_birth: {
        required
      }
    },
    methods: {
      async onSubmit(event){
        event.preventDefault();
        await this.$store.dispatch('register', {
          username: this.username,
          email: this.email,
          password: this.password,
          password2: this.password2,
          date_of_birth: this.date_of_birth

        })
      },
      onReset(event){
        event.preventDefault();
        this.username = '';
        this.email = '';
        this.password = '';
        this.password2 = '';
        this.date_of_birth = '';
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