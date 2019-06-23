<template>
  <div id="app">
    <ServiceSelector />
  </div>
</template>

<script>
import ServiceSelector from './components/ServiceSelector.vue'

export default {
  name: 'app',
  components: {
    ServiceSelector
  }
}
</script>

<style lang="scss">
body {
  background: $body-background;
  font-size: $body-font-size;
  font-family: $body-font-family;
  color: $body-font-color;
}

#app {
  margin: 40px;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  .container {
    /* position: relative; */
    width: 100%;
    max-width: 700px;
    margin: 0 auto 40px auto;
    /* display: none; */
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
    
    &.typewriter {
      height: 14px;
      float: left;
      display: none;
      overflow: hidden;
      display: block;
      overflow: hidden; /* Ensures the content is not revealed until the animation */
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
