<template>
  <div class="tiktok">
    <video :src="'/' + video" ref="vidRef" @click="togglePlay" />
    <svg
        id="play-button"
        width="512"
        height="512"
        viewBox="0 0 512 512"
        @click="togglePlay"
        v-show="!state.playing"
    >
      <path d="M152.443 136.417l207.114 119.573-207.114 119.593z" fill="#fff" />
    </svg>

    <div class="back-button">
      <a :href="'/protected-mail'" class="transparent-button"><b-icon icon="envelope-fill"></b-icon> </a>
    </div>

    <div class="like">
      <b-icon v-if="!user_has_liked" icon="heart" style="width: 30px; height: 30px;" @click="likeAdd(video_id, index)"></b-icon>
      <b-icon v-else icon="heart-fill" style="width: 30px; height: 30px;" @click="likeDel(video_id, index)"></b-icon>
      <p v-if="!user_has_liked">{{likeCount}}</p>
      <p v-else>{{likeCount}}</p>
    </div>

    <div v-if="userId === $store.state.userId" class="delete-button">
      <b-icon v-b-modal.del-confirm-popup icon="x-circle" variant="danger" style="width: 30px; height: 30px;"></b-icon>
    </div>

    <div class="user-button">
      <a :href="'/user/' + user.id + '/'">@{{user.username}}</a>
    </div>

    <div class="title">
      <p :class="title.length>15 ? 'title-small': null" style="margin: 10px; opacity: 0.8">{{title}}</p>
      <p style="font-size: 0.5em; margin: 10px; opacity: 0.5">📌{{address}}</p>
    </div>


    <div v-if="enterprise === true">
      <div class="map">
        <a class="transparent-button" :href="'https://www.google.com/maps/search/?api=1&query=' + latitude_deg + '%2C' + longitude_deg ">Lokalizacja 🏭</a>
      </div>
    </div>
    <div v-else>
      <div class="map">
        <a class="transparent-button" :href="'https://www.google.com/maps/search/?api=1&query=' + latitude_deg + '%2C' + longitude_deg ">Lokalizacja 🧑‍🚀</a>
      </div>
    </div>
    <!-- The modal -->
    <b-modal @ok="videoDel(video_id)" id="del-confirm-popup">Usunąć ten film?</b-modal>
  </div>
</template>

<script>
export default {
  name: "tiktok-vue",
  props: {
    video_id: [String, Number],
    user: [String, Object],
    video: String,
    title: String,
    enterprise: [String, Boolean],
    latitude_deg: String,
    longitude_deg: String,
    address: String,
    likeCount: [String, Number],
    index: [String, Number],
    user_has_liked: [String, Boolean],
    userId: [String, Number],
  },
  data() {
    return {
      state: {
        playing: false,
      },
    };
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
    likeAdd(id, index) {
      this.$store.dispatch('sendLikeVideo', {
        person: this.$store.state.userId,
        video: id
      })
      this.$store.state.videos[index].user_has_liked = true;
      this.$store.state.videos[index].number_of_likes += 1;
    },
    likeDel(id, index) {
      this.$store.dispatch('delLikeVideo', {
        person: this.$store.state.userId,
        video: id
      })
      this.$store.state.videos[index].user_has_liked = false;
      this.$store.state.videos[index].number_of_likes -= 1;
    },
    videoDel(videoId) {
      this.$store.dispatch('delUserVideos', {
        video_id: videoId
      })
      location.reload();
    }
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

.like {
  width: 50px;
  height: 60px;
  position: absolute;
  bottom: 390px;
  right: 15px;
  color: white;
  opacity: 0.8;
}

.delete-button {
  width: 50px;
  height: 30px;
  position: absolute;
  bottom: 340px;
  right: 15px;
  color: white;
  opacity: 0.8;
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

#play-button {
  position: absolute;
  top: calc(50% - 35px);
  left: calc(50% - 35px);
  width: 90px;
  height: 90px;
  z-index: 10;
}
</style>