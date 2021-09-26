<template>
<div id="footer">
  <div class="push"></div>
  <div class="content-wrapper">
    <a href="https://www.notion.so/Shapass-FAQ-51b40cc521c946eea4a1c68caea0e1ba" target="_blank">
      <span>FAQ</span>
    </a>
    <a href="https://github.com/shapass" target="_blank">
      <span>Github</span>
    </a>
    <a href="https://twitter.com/shapasspw" target="_blank">
      <span>Twitter</span>
    </a>
  </div>
</div>
</template>

<script>
export default {
  name: 'Footer',
  props: {
  },
  methods: {
  }
}
</script>

<style lang="scss">
#footer {
  flex-shrink: 0;
  font-size: $font-sm;
  text-align: right;
  padding: 20px 0 10px 0;
  vertical-align: middle;

  a {
    padding: 0 10px;
    display: inline-block;
  }
}
</style>
