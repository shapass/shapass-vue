<template>
<div id="footer">
  <div class="push"></div>
  <div class="content-wrapper">
    <span>Follow us</span>
    <a href="https://twitter.com/shapassed" target="_blank" class="twitter-badge">
      <img src="twitter-logo.svg" alt="Twitter"/>
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
  
  .twitter-badge {
    height: 18px;
    vertical-align: middle;
    /* background: $twitter-blue; */
    display: inline-block;
    /* border-radius: 2px; */
    padding: 3px 6px;
    margin-left: 2px;
    font-family: $font-family-titles;
    color: $white;
    text-decoration: none;
    opacity: 0.7;

    &:hover, &:active, &:focus {
      opacity: 1;
    }

    img {
      width: 18px;
      height: 18px;
      float: left;
      /* padding-top: 1px; */
    }
    
    /* span { */
    /*   float: left; */
    /* } */
  }
}
</style>
