<template>
  <b-icon-arrow-left id="back" @click="$router.go(-1)"></b-icon-arrow-left>
</template>

<style scoped>
#back {
  cursor: pointer;
}
</style>