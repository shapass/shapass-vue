<template>
  <div class="loader"><div></div><div></div></div>
</template>

<script>
export default {
  name: 'InfiniteLoadingCircle',
}
</script>

<style scoped lang="scss">

/* From https://loading.io/css */
.loader {
  display: inline-block;
  position: relative;
  /* width: 100%; */
  /* max-width: 30px; */
  /* height: 30px; */
  width: 26px;
  height: 26px;

  div {
    position: absolute;
    border: 3px solid $primary;
    opacity: 1;
    border-radius: 50%;
    animation: loader 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  div:nth-child(2) {
    animation-delay: -0.5s;
  }
}

@keyframes loader {
  0% {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

</style>
