<template>
  <div id="app">
      <tik-tok-stream :userId="userId"/>
  </div>
</template>

<script>

import TikTokStream from "@/views/main/ProtectedTiktok";
export default {
  props: {
    userId: [String, Number]
  },
  components: {TikTokStream}
}
</script>

<style>
body {
  background: #f1f1f1;
  margin: 0;
  overflow: hidden;
}

* {
  font-family: 'Poppins', sans-serif;
}

html,
body {
  height: 100%;
}

#app {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
