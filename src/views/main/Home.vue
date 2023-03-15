<template>
  <b-jumbotron class="full-height white-bg">
    <template slot="header">Vue Auth</template>

    <template slot="lead">
      Naucz się obsługiwać proces rejestracji oraz logowania przy pomocy Vue Auth, Axios i Firebase
    </template>

    <hr class="my-4" />

    <p>
      Kluczowe funkcjonalności przetestujesz w tych poniższych route'ach
    </p>

    <b-button variant="primary"><router-link to="/register" tag="span">Rejestracja</router-link></b-button> &nbsp;
    <b-button variant="success"><router-link to="/login" tag="span">Logowanie</router-link></b-button>
  </b-jumbotron>
</template>

<script>
export default {
  name: 'home-main',
}
</script>

<style>
  .full-height {
    height: 100%;
  }

  .white-bg{
    background:#fff !important;
  }
</style>