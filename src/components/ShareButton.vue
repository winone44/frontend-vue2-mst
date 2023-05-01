<template>
  <b-icon-share id="share" @click="copyToClipboard"></b-icon-share>
</template>

<script>
export default {
  methods: {
    copyToClipboard() {
      const el = document.createElement('textarea');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert('Adres URL skopiowany do schowka');
    },
  },
};
</script>

<style scoped>
#share {
  cursor: pointer;
}
</style>