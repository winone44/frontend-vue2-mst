<template>
  <b-container>
    <b-form @submit.prevent="submitForm">
      <b-form-group
        id="title"
        label="Opis:"
        label-for="title-input"
        >
        <b-form-input
          id="title-input"
          v-model="title"
          type="text"
          placeholder="Krótki opis"
          required
          ></b-form-input>
      </b-form-group>
<!--      <label for="title">Opis:</label>-->
<!--      <input type="text" id="title" v-model="title"/>-->
      <b-form-group
        id="address"
        label="Adres:"
        label-for="address-input"
        >
        <b-form-input
          id="address-input"
          v-model="address"
          type="text"
          placeholder="Wpisz pełny adres lub tylko miejscowość"
          required
          ></b-form-input>
      </b-form-group>
      <b-form-checkbox v-model="enterprise">Firma/Reklama:</b-form-checkbox>
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
      <b-button type="submit">Wyslij</b-button>
    </b-form>
    <div v-if="coordinates">
      Współrzędne geograficzne: {{ coordinates }}
    </div>
  </b-container>
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
        maxFilesize: 40,
        maxFiles: 5,
        dictDefaultMessage: 'Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać pliki do przesłania.',
        acceptedFiles: '.mp4,.m4v',
        renameFile: this.renameToTimestamp,
      },
      newFileName: null,
      enterprise: false,
      response: null,
    };
  },
  methods: {
    async onSuccess(file, response) {
      console.log(file, response);
      if (response.success === true) {
        await this.sendFormAndData();
      } else {
        console.log('Plik nie został przesłany')
      }

    },
    renameToTimestamp(file) {
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split(".").pop();
      this.newFileName = `${timestamp}.${fileExtension}`
      return `${timestamp}.${fileExtension}`;
    },
    async submitForm() {
      function setVariable(value) {
        const maxDigits = 18;
        const decimalPlaces = 14;

        const floatValue = parseFloat(value);

        if (isNaN(floatValue)) {
          console.error("Value is not a number.");
          return 0;
        }

        if (floatValue.toString().replace(".", "").length <= maxDigits) {
          return parseFloat(floatValue.toFixed(decimalPlaces));
        } else {
          console.error("Value exceeds the maximum allowed digits.");
          return 0;
        }
      }
      try {
        // Użycie Nominatim do przekształcenia adresu we współrzędne geograficzne
        const nominatimResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                this.address
            )}`
        );
        if (nominatimResponse.data.length > 0) {
          this.coordinates = {
            lat: setVariable(nominatimResponse.data[0].lat),
            lon: setVariable(nominatimResponse.data[0].lon),
          };
          //start uploadu
          this.$refs.dropzone.processQueue();

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
      } catch (error) {
        console.error("Wystąpił błąd:", error);
      }
    },
  },
}
</script>

<style scoped>

</style>