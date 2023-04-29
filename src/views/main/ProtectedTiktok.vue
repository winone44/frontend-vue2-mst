<template>
  <div
      class="tiktok-stream"
      ref="tiktokStream"
      v-swipe="onSwipe"
      :style="style"
  >
    <tiktok
        v-for="(tiktok, i) in tiktokData"
        :user="tiktok.user"
        :video="tiktok.video"
        :title="tiktok.title"
        :enterprise="tiktok.enterprise"
        :latitude_deg="tiktok.latitude_deg"
        :longitude_deg="tiktok.longitude_deg"
        :city="tiktok.city"
        :key="tiktok.id"
        :ref="
        (el) => {
          tiktokRefs[i] = el;
        }
      "
    />
  </div>
</template>

<script>

import swipe from "../../directives/swipe.js";
import Tiktok from "../../components/Tiktok.vue";

export default {
  name: "TikTokStream",
  directives: {
    swipe,
  },
  components: {
    Tiktok,
  },
  data() {
    return {
      tiktokStream: null,
      tiktokRefs: [],
      currentSlide: 1,
    };
  },
  computed: {
    tiktokData() {
      return this.$store.state.videos;
    },
    amountOfSlides() {
      return this.$store.state.videos.length;
    },
    style() {
      return {
        transform: `translate3d(0, ${-(this.currentSlide - 1) * 100}%, 0)`,
      };
    },
  },
  async mounted() {
    await this.$store.dispatch('getVideos')
    this.$watch(
        () => this.currentSlide,
        (items, oldItems) => {
          this.tiktokRefs[items - 1].play();
          this.tiktokRefs[oldItems - 1].pause();
        },
        {
          lazy: false,
        }
    );

    this.$nextTick(() => {
      this.tiktokRefs = [];
    });
  },
  methods: {
    onSwipe(direction) {
      if (
          (direction === 1 && this.currentSlide === this.amountOfSlides) ||
          (direction === -1 && this.currentSlide === 1)
      ) {
        return;
      }

      this.currentSlide += direction;
    },
  },
};
</script>

<style>
.tiktok-stream {
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  transform: translate3d(0, 0, 0);
  transition: transform 200ms ease;
}
</style>