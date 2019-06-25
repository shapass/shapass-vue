<template>
  <div id="app">
    <ServiceSelector v-model="service" v-on:input="onServiceChanged" />
    <div class="container" v-if="service">
      <label class="typewriter">Your master password:</label>
      <input ref="password" type="password" spellcheck="false" placeholder="" autocomplete="off" v-focus>
    </div>
  </div>
</template>

<script>
import ServiceSelector from './components/ServiceSelector.vue'

export default {
  name: 'app',
  components: {
    ServiceSelector
  },
  methods: {
    onServiceChanged: function(v) {
      // if (this.$refs.password && this.service) {
      //   this.$refs.password.focus();
      // }
    }
  },
  data () {
    return {
      service: null
    }
  }
}
</script>

<style lang="scss">
html {
  height: 100%;
}

body {
  background: $body-background;
  font-size: $body-font-size;
  font-family: $body-font-family;
  color: $body-font-color;
  height: 100%;
  
  #app {
    margin: 40px;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }

  .container {
    width: 100%;
    max-width: 700px;
    margin: 0 auto 30px auto;
  }
  
  input {
    background: none;
    border: 0;
    font-size: 20px;
    margin: 0;
    width: 100%;
    outline: none;
    background: none;
    /* padding: 10px; */
    /* border: 1px solid darken($body-background, 10); */
    /* border-radius: 4px; */
    color: $body-font-color;
  }
  input:focus {
    outline: none;
    /* border-color: $primary; */
  }
  input::placeholder {
    color: #666;
    font-size: 18px;
  }
  label {
    text-transform: uppercase;
    font-size: 12px;
    color: $label-color;
    display: inline;
    
    &.typewriter {
      height: 14px;
      /* float: left; */
      overflow: hidden;
      white-space: nowrap; /* Keeps the content on a single line */
      margin: 0 auto; /* Gives that scrolling effect as the typing happens */
      animation: 
        typing 2s steps(40, end);
    }
  }
  
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }
}
</style>
