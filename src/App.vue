<template>
  <div id="app">
    <ServiceSelector v-model="state.service" v-on:input="generatePassword" :services="this.state.services" />
    <div class="container" id="master" v-if="state.service">
      <label class="typewriter" for="master-input">Your master password</label>
      <button class="btn-toggle-visibility" v-if="masterPasswordType == 'password'" @click="toggleMasterPasswordType" tabindex="-1">
        <font-awesome-icon icon="eye-slash" />
      </button>
      <button class="btn-toggle-visibility" v-if="masterPasswordType == 'text'" @click="toggleMasterPasswordType" tabindex="-1">
        <font-awesome-icon icon="eye" class="active" />
      </button>
      <input id="master-input" :type="masterPasswordType" spellcheck="false" placeholder="" autocomplete="off" v-model="state.master" v-focus v-on:input="generatePassword" v-on:keyup.enter="copyToClipboard">
    </div>
    <div class="container" id="generated" v-if="state.generated">
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
      <div v-html="generatedShown"></div>
    </div>
    <div class="container clearfix" id="configurations" v-if="state.generated">
      <div id="length">
        <label class="typewriter">Length:</label>
        <button class="btn-length-minus" @click="lengthAdd(-1)" tabindex="-1">
          <font-awesome-icon icon="minus-square" />
        </button>
        <input type="number" v-on:blur="setLengthEvent" :value="state.length"></input>
        <button class="btn-length-plus" @click="lengthAdd(1)" tabindex="-1">
          <font-awesome-icon icon="plus-square" />
        </button>
      </div>
      <div id="suffix">
        <label class="typewriter" for="suffix-input">Suffix:</label>
        <input id="suffix-input" type="text" spellcheck="false" placeholder="(none)" autocomplete="off" v-model="state.suffix" v-on:input="generatePassword" tabindex="-1">
      </div>
      <button class="btn-save" @click="save" tabindex="-1">
        <font-awesome-icon icon="save" />
      </button>
      <button class="btn-remove" @click="remove" tabindex="-1">
        <font-awesome-icon icon="trash" />
      </button>
    </div>
  </div>
</template>

<script>
import ServiceSelector from './components/ServiceSelector.vue'
import { Configs } from './config.js'
import Store from './store.js'

export default {
  name: 'app',
  components: {
    ServiceSelector
  },
  methods: {
    generatePassword () {
      if (this.state.service !== null && this.state.service !== undefined) {
        var input = this.state.service;
        if (this.state.master !== null) {
          input = `${input}${this.state.master}`;
        }
        var pass = this.shapass(input, this.state.length);
        if (this.state.suffix !== null) {
          pass = `${pass}${this.state.suffix.trim()}`;
        }
        this.setGeneratedPassword(pass);
      } else {
        this.setGeneratedPassword(null);
      }
    },
    copyToClipboard () {
      this.$copyText(this.state.generated).then(() => {
        this.$toasted.show('Copied', { duration: 500 });
        this.$el.children[1].getElementsByTagName('input')[0].focus();
      }, () => {
        this.$toasted.error('Could not copy', { duration: 500 });
      })
    },
    toggleMasterPasswordType () {
      this.masterPasswordType = this.masterPasswordType === 'password' ? 'text' : 'password'
    },
    toggleGeneratedPasswordVisibility () {
      if (this.isGeneratedPasswordVisible) {
        this.isGeneratedPasswordVisible = false;
      } else {
        this.isGeneratedPasswordVisible = true;
      }
      this.setGeneratedPassword(this.state.generated);
    },
    setGeneratedPassword (val) {
      this.state.generated = val;
      if (this.state.generated !== null) {
        let maskHtml = `<span class="censored">${this.mask}</span>`;
        this.generatedCensored = this.applyMask(this.state.generated, maskHtml, this.state.suffix);
      } else {
        this.generatedCensored = null;
      }
      if (this.isGeneratedPasswordVisible) {
        this.generatedShown = this.state.generated;
      } else {
        this.generatedShown = this.generatedCensored;
      }
    },
    lengthAdd (v) {
      this.setLength(this.state.length + v);
    },
    setLength (v) {
      let before = this.state.length;
      this.state.length = v;
      if (this.state.length < Configs.MIN_LENGTH) { this.state.length = Configs.MIN_LENGTH; }
      if (this.state.length > Configs.MAX_LENGTH) { this.state.length = Configs.MAX_LENGTH; }
      if (before != this.state.length) {
        this.generatePassword();
      }
    },
    setLengthEvent (e) {
      this.setLength(e.target.valueAsNumber);
    },
    save () {
      Store.saveState();
    },
    remove () {
      Store.removeService();
    }
  },
  data () {
    return {
      state: Store.state,
      generatedCensored: null,
      generatedShown: null,
      isGeneratedPasswordVisible: false,
      mask: this.randomMask(),
      masterPasswordType: "password"
    }
  },
  mounted () {
    Store.updateStateServices();
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
      top: 2px;
      left: -40px;
    }
    .btn-copy {
      top: 30px;
      left: -37px;
    }
    
    input {
      margin-top: 5px;
    }
  }
  
  #generated {
    background: $dark; //$background-highlight;
    border: 1px solid $primary;
    
    div {
      padding: 1px 0; /* to look like the #master input */
      margin-top: 5px;
      word-break: break-all;
    }
  }
  
  #configurations {
    padding: 0;
    border: 0;
    
    > div {
      display: flex;
      align-items: baseline;
      justify-content: left;
      
      label {
        margin-right: 10px;
      }
      span {
        margin: 0 10px;
      }
      input[type="text"] {
        width: auto;
      }
      .svg-inline--fa {
        padding: 0;
      }
      input[type="number"] {
        width: 30px;
        margin: 0 10px;
        text-align: center;
        -moz-appearance: textfield;
        -webkit-appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
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
    margin: 0 10px 20px 40px;
    padding: 5px 15px 10px 15px;
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
    color: $placeholder-color;
    opacity: 0.8;
    font-size: $body-font-size;
    @include mobile { font-size: $m-body-font-size; }
  }
  label {
    text-transform: uppercase;
    font-size: $label-font-size;
    @include mobile { font-size: $m-label-font-size; }
    color: $label-color;
    display: inline;
    
    /* &.typewriter { */
    /*   height: 14px; */
    /*   overflow: hidden; */
    /*   white-space: nowrap; /\* Keeps the content on a single line *\/ */
    /*   margin: 0 auto; /\* Gives that scrolling effect as the typing happens *\/ */
    /*   animation:  */
    /*     typing 2s steps(40, end); */
    /* } */
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

  .clearfix::after {
    content: " ";
    display: block;
    height: 0;
    clear: both;
  }
}
</style>
