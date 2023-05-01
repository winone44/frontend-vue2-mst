<template>
  <div class="tiktok">
    <video :src="video" ref="vidRef" @click="togglePlay" />
    <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        @click="togglePlay"
        v-show="!state.playing"
    >
      <path d="M152.443 136.417l207.114 119.573-207.114 119.593z" fill="#fff" />
    </svg>

    <div class="back-button">
      <router-link to="/protected" tag="a" class="transparent-button">MENU</router-link>
    </div>

    <div class="user-button">
      <router-link :to="{path: '/user/' + user.id + '/'}" tag="a" >@{{user.id}}</router-link>
    </div>

    <div class="title">
      <p :class="title.length>15 ? 'title-small': null" style="margin: 10px; opacity: 0.8">{{title}}</p>
      <p style="font-size: 0.5em; margin: 10px; opacity: 0.5">📌{{address}}</p>
    </div>


    <div v-if="enterprise === '1'">
      <div class="map">
        <a class="transparent-button" :href="'https://www.google.com/maps/search/?api=1&query=' + latitude_deg + '%2C' + longitude_deg ">Lokalizacja 🏭</a>
      </div>
    </div>
    <div v-else>
      <div class="map">
        <a class="transparent-button" :href="'https://www.google.com/maps/search/?api=1&query=' + latitude_deg + '%2C' + longitude_deg ">Lokalizacja 🧑‍🚀</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tiktok-vue",
  props: {
    user: [String, Object],
    video: String,
    title: String,
    enterprise: [String, Boolean],
    latitude_deg: String,
    longitude_deg: String,
    address: String,
  },
  data() {
    return {
      state: {
        playing: false,
      },
    };
  },
  mounted() {

  },
  methods: {
    play(next) {
      if(next) {
        this.$refs.vidRef.currentTime = 0;
      }
      this.$refs.vidRef.play();
      this.state.playing = true;
    },
    pause() {
      this.$refs.vidRef.pause();
      this.state.playing = false;
    },
    togglePlay() {
      if (this.state.playing) {
        this.pause();
      } else {
        this.play();
      }
    },
  },
};
</script>

<style scoped>
.transparent-button {
  display: inline-block;
  font-size: 1em;
  background: none;
  padding: 10px 30px;
  text-decoration: none;
  color: white;
  margin-top: 10px;
  margin-right: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: 0.2s;
  border: white solid;
}

.transparent-button:hover {
  background: rgba(255,255,255,0.5);
  color: #111;
}


.tiktok {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 30px;
  color: white;
}

.user-button {
  position: absolute;
  top: 35px;
  right: 30px;
  color: white;
}

.map {
  position: absolute;
  bottom: 50px;
  left: 30px;
  color: white;
}

.title {
  position: absolute;
  bottom: 150px;
  left: 30px;
  color: white;
  font-size: 30px;
  font-weight: 500;
  text-align: left;
}

.title-small {
  font-size: 20px;
}

video {
/*aspect-ratio: 348/520;*/
width: 100%;
  height: auto;
  position: relative;
}

svg {
  position: absolute;
  top: calc(50% - 35px);
  left: calc(50% - 35px);
  width: 90px;
  height: 90px;
  z-index: 10;
}
</style>