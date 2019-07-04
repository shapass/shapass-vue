<template>
  <div id="app">
    <ServiceSelector v-model="service" v-on:input="generatePassword" />
    <div class="container" id="master" v-if="service">
      <label class="typewriter">Your master password</label>
      <button class="btn-toggle-visibility" v-if="masterPasswordType == 'password'" @click="toggleMasterPasswordType" tabindex="-1">
        <font-awesome-icon icon="eye-slash" />
      </button>
      <button class="btn-toggle-visibility" v-if="masterPasswordType == 'text'" @click="toggleMasterPasswordType" tabindex="-1">
        <font-awesome-icon icon="eye" class="active" />
      </button>
      <input :type="masterPasswordType" spellcheck="false" placeholder="" autocomplete="off" v-model="master" v-focus v-on:input="generatePassword" v-on:keyup.enter="copyToClipboard">
    </div>
    <div class="container" id="generated" v-if="generated">
      <label class="typewriter">Generated password</label>
      <button class="btn-toggle-visibility" v-if="!isGeneratedPasswordVisible" @click="toggleGeneratedPasswordVisibility" tabindex="-1">
        <font-awesome-icon icon="eye-slash" />
      </button>
      <button class="btn-toggle-visibility" v-if="isGeneratedPasswordVisible" @click="toggleGeneratedPasswordVisibility" tabindex="-1">
        <font-awesome-icon icon="eye" class="active" />
      </button>
      <button class="btn-copy" @click="copyToClipboard" tabindex="-1">
        <font-awesome-icon icon="copy" />
      </button>
      <!-- <input type="text" readonly="readonly" autocomplete="off" v-model="generatedShown" /> -->
      <div v-html="generatedShown"></div>
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
        this.setGeneratedPassword(this.shapass(input));
      } else {
        this.setGeneratedPassword(null);
      }
    },
    copyToClipboard: function() {
      this.$copyText(this.generated).then(() => {
        this.$toasted.show('Copied', { duration: 500 });
        this.$el.children[1].getElementsByTagName('input')[0].focus();
      }, () => {
        this.$toasted.error('Could not copy', { duration: 500 });
      })
    },
    toggleMasterPasswordType: function() {
      this.masterPasswordType = this.masterPasswordType === 'password' ? 'text' : 'password'
    },
    toggleGeneratedPasswordVisibility: function() {
      if (this.isGeneratedPasswordVisible) {
        this.isGeneratedPasswordVisible = false;
      } else {
        this.isGeneratedPasswordVisible = true;
      }
      this.setGeneratedPassword(this.generated);
    },
    setGeneratedPassword: function(val) {
      this.generated = val;
      if (this.generated !== null) {
        let maskHtml = `<span class="censored">${this.mask}</span>`;
        this.generatedCensored = this.generated.replace(/(.){4}/g, `${maskHtml}$1`);
      } else {
        this.generatedCensored = null;
      }
      if (this.isGeneratedPasswordVisible) {
        this.generatedShown = this.generated;
      } else {
        this.generatedShown = this.generatedCensored;
      }
    }
  },
  data () {
    return {
      service: null,
      master: null,
      generated: null,
      generatedCensored: null,
      generatedShown: null,
      isGeneratedPasswordVisible: false,
      mask: this.randomMask(),
      masterPasswordType: "password"
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
  @include mobile { font-size: $m-body-font-size; }
  font-family: $body-font-family;
  color: $body-font-color;
  height: 100%;
  
  #app {
    margin: 60px auto;
    max-width: 600px;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;

    .censored {
      color: $background-highlight;
    }
  }
  
  #master, #generated {
    .btn-toggle-visibility, .btn-copy {
      position: absolute;
      top: -3px;
      left: -40px;
    }
    .btn-copy {
      top: 25px;
      left: -37px;
    }

    input {
      margin-top: 5px;
    }
  }

  #generated {
    div {
      padding: 1px 0; /* to look like the #master input */
      margin-top: 5px;
      white-space: nowrap;
    }
  }
  
  
  /*
   * Global classes
   */
  
  .container {
    /* width: 100%; */
    max-width: 800px;
    /* margin: 0 auto 30px auto; */
    position: relative;
    border-left: 1px solid $background-highlight;
    padding-left: 15px;
    margin: 0 40px 30px 40px;
  }
  
  button {
    outline: none;
    padding: 0;
    border: 0;
    margin: 0;
    background: none;
  }

  input {
    background: none;
    border: 0;
    font-size: $body-font-size;
    @include mobile { font-size: $m-body-font-size; }
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
    font-size: $body-font-size;
    @include mobile { font-size: $m-body-font-size; }
  }
  label {
    text-transform: uppercase;
    font-size: $label-font-size;
    @include mobile { font-size: $m-label-font-size; }
    color: $label-color;
    display: inline;
    
    &.typewriter {
      height: 14px;
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

  .svg-inline--fa {
    font-size: $icon-size;
    @include mobile { font-size: $m-icon-size; }
    cursor: pointer;
    padding: 5px;
    transition:
      background .2s linear,
      color .2s linear;

    color: $background-highlight;
    &:hover {
      color: $secondary;
    }

    &.active {
      color: $primary;
      &:hover {
        color: $orange;
      }
    }
  }
}
</style>
