<template>
  <div id="app">
    <ServiceSelector v-model="service" v-on:input="generatePassword" />
    <div class="container" v-if="service">
      <label class="typewriter">Your master password:</label>
      <input ref="password" type="password" spellcheck="false" placeholder="" autocomplete="off" v-model="master" v-focus v-on:input="generatePassword" v-on:keyup.enter="copyToClipboard">
    </div>
    <div class="container" v-if="generated">
      <label class="typewriter">Generated password:</label>
      <input type="text" readonly="readonly" autocomplete="off" v-model="generatedCensored" />
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
    generatePassword: function() {
      if (this.service !== null && this.service !== undefined) {
        var input = this.service;
        if (this.master !== null) {
          input = `${this.service}${this.master}`;
        }
        this.generated = this.shapass(input);
        this.generatedCensored = this.generated.replace(/(.){4}/g, `${this.mask}$1`);
      } else {
        this.generated = null;
        this.generatedCensored = null;
      }
    },
    copyToClipboard: function() {
      this.$copyText(this.generated).then((e) => {
        this.$toasted.show('Copied', { duration: 500 });
        this.$el.children[1].children[1].focus()
      }, (e) => {
        this.$toasted.error('Could not copy', { duration: 500 });
      })
    }
  },
  data () {
    return {
      service: null,
      master: null,
      generated: null,
      generatedCensored: null,
      mask: this.randomMask()
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
    font-family: $input-font-family;
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

  .toasted.toasted-primary {
    border-radius: $notification-border-radius;

    &.default {
      background-color: $notification-bg-color;
      border: $notification-border;
    }
  }
}
</style>
