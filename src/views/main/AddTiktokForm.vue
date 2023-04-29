<template>
  <div>
    <form @submit.prevent="submitForm">
      <label for="title">Opis:</label>
      <input type="text" id="title" v-model="title" />
      <label for="address">Adres:</label>
      <input type="text" id="address" v-model="address" />
      <label for="enterprise">Firma/Reklama:</label>
      <input type="checkbox" id="enterprise" v-model="enterprise" />
      <vue-dropzone
          id="file-send-box"
          ref="dropzone"
          :options="dropzoneOptions"
          @vdropzone-success="onSuccess"
      >
        <div class="dropzone-message">
          Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać pliki do przesłania.
        </div>
      </vue-dropzone>
      <button type="submit">Wyslij</button>
    </form>
    <div v-if="coordinates">
      Współrzędne geograficzne: {{ coordinates }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueDropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: "AddTiktokForm",
  components: {
    VueDropzone,
  },
  data() {
    return {
      title: "",
      address: "",
      coordinates: null,
      dropzoneOptions: {
        autoProcessQueue: false,
        url: './upload.php',
        uploadMultiple: false,
        paramName: 'file',
        maxFilesize: 100,
        maxFiles: 5,
        dictDefaultMessage: 'Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać pliki do przesłania.',
        acceptedFiles: '.mp4,.m4v',
        renameFile: this.renameToTimestamp,
      },
      newFileName: null,
      enterprise: false,
    };
  },
  methods: {
    onSuccess(file, response) {
      console.log(file, response);
    },
    renameToTimestamp(file) {
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split(".").pop();
      this.newFileName = `${timestamp}.${fileExtension}`
      return `${timestamp}.${fileExtension}`;
    },
    async submitForm() {
      try {
        // Wysyłanie adresu do Django REST API
        // const response = await axios.post(
        //     "http://localhost:8000/api/address/",
        //     { address: this.address }
        // );
          // Użycie Nominatim do przekształcenia adresu w współrzędne geograficzne
          const nominatimResponse = await axios.get(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                  this.address
              )}`
          );
          if (nominatimResponse.data.length > 0) {
            this.coordinates = {
              lat: nominatimResponse.data[0].lat,
              lon: nominatimResponse.data[0].lon,
            };
            await this.sendFormAndData();
          } else {
            this.coordinates = "Adres nie został znaleziony.";
          }

      } catch (error) {
        console.error("Wystąpił błąd:", error);
      }
    },
    async sendFormAndData() {
      try {
        await this.$store.dispatch('sendVideoForm', {
          title: this.title,
          video: 'media/' + this.newFileName,
          enterprise: this.enterprise,
          latitude_deg: this.coordinates.lat,
          longitude_deg: this.coordinates.lon,
          address: this.address,
          user: this.$store.state.userId
        })
        this.$refs.dropzone.processQueue();
      } catch (error) {
        console.error("Wystąpił błąd:", error);
      }

    }
  },
}
</script>

<style scoped>

</style>