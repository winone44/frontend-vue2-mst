<template>
  <div>
    <b-avatar rounded size="20em" :src="'/media/photos/' + personData.profile_picture" alt="Zdjęcie osoby"></b-avatar>
<!--    <pre>{{personData}}</pre>-->
    <ul>
      <li>Imię: {{personData.firstName}}</li>
      <li>Nazwisko: {{personData.lastName}}</li>
      <li>Email: {{personData.email}}</li>
      <li>Wiek: {{personData.age}}</li>
      <li>Firma: {{personData.is_company}}</li>
      <li
          v-for="company in personData.person_ExternalContact"
          :key="company.id"
      >
        <ul>
          <li>Nazwa firmy: {{company.external_company.name}}</li>
          <li>Adres: {{company.external_company.address}}</li>
          <li>Numer Telefonu: {{company.external_company.phone_number}}</li>
          <li>Email: {{company.external_company.email}}</li>
          <li>Strona internetowa: {{company.external_company.website}}</li>
          <li>{{company.external_company.notes}}</li>
          <br>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ModalPersonDetails",
  props: {
    personData: [Object, String]
  },

}
</script>

<style scoped>
ul {
  list-style: none;
}

</style>