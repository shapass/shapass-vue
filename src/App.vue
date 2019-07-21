<template>
<div id="app" v-bind:class="{ mobile: this.$isMobile() }">
  <Navbar :afterLogout="afterLogout" :currentUser="currentUser" />
  <div id="content">
    <div class="container" id="service">
      <ServiceSelector v-model="state.service" :services="state.servicesForSelect" />
      <div class="clearfix" id="configurations" v-if="state.generated && !currentUser.isSigningInOrRegistering()">
        <div id="length">
          <label class="typewriter">Length:</label>
          <button class="btn-clean btn-length-minus" @click="lengthAdd(-1)" tabindex="-1">
            <font-awesome-icon icon="minus-square" />
          </button>
          <input type="number" v-on:blur="setLengthEvent" :value="state.outputLength"></input>
          <button class="btn-clean btn-length-plus" @click="lengthAdd(1)" tabindex="-1">
            <font-awesome-icon icon="plus-square" />
          </button>
        </div>
        <div id="suffix">
          <label class="typewriter" for="suffix-input">Suffix:</label>
          <input id="suffix-input" type="text" spellcheck="false" placeholder="(none)" autocomplete="off" v-model="state.suffix" v-on:input="generatePassword" tabindex="-1">
        </div>
      </div>
    </div>
    <div class="container" id="email" v-if="currentUser.isSigningInOrRegistering()">
      <label class="typewriter" for="master-input">Your email</label>
      <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-model="inputEmail" v-focus="currentUser.isSigningInOrRegistering()">
    </div>
    <div class="container" id="master" v-if="state.service || currentUser.isSigningInOrRegistering()">
      <label class="typewriter" for="master-input">Your master password</label>
      <button class="btn-clean btn-toggle-visibility" v-if="masterPasswordType == 'password'" @click="toggleMasterPasswordType" tabindex="-1">
        <font-awesome-icon icon="eye-slash" />
      </button>
      <button class="btn-clean btn-toggle-visibility" v-if="masterPasswordType == 'text'" @click="toggleMasterPasswordType" tabindex="-1">
        <font-awesome-icon icon="eye" class="active" />
      </button>
      <input id="master-input" :type="masterPasswordType" spellcheck="false" placeholder="" autocomplete="off" v-model="state.master" v-on:input="generatePassword" v-on:keyup.enter="copyToClipboard" v-focus="!currentUser.isSigningInOrRegistering()">
    </div>
    <div class="container" id="generated" v-if="state.generated || currentUser.isSigningInOrRegistering()">
      <label class="typewriter">Generated password</label>
      <button class="btn-clean btn-toggle-visibility" v-if="!isGeneratedPasswordVisible" @click="toggleGeneratedPasswordVisibility" tabindex="-1">
        <font-awesome-icon icon="eye-slash" />
      </button>
      <button class="btn-clean btn-toggle-visibility" v-if="isGeneratedPasswordVisible" @click="toggleGeneratedPasswordVisibility" tabindex="-1">
        <font-awesome-icon icon="eye" class="active" />
      </button>
      <div v-html="generatedShown"></div>
    </div>
    <div class="container clearfix" id="login-registration-buttons" v-if="state.generated && currentUser.isSigningInOrRegistering()">
      <button class="btn btn-login" @click="login" v-if="currentUser.isSigningIn()">Login</button>
      <button class="btn btn-register" @click="register" v-if="currentUser.isRegistering()">Register</button>
    </div>
  </div>
  <div class="clearfix" id="toolbar" v-if="state.generated && !currentUser.isSigningInOrRegistering()">
    <button class="btn-clean btn-save" @click="save" tabindex="-1" v-shortkey="['ctrl', 's']" @shortkey="save">
      <font-awesome-icon icon="save" />
    </button>
    <button class="btn-clean btn-remove" @click="remove" tabindex="-1" v-shortkey="['ctrl', 'del']" @shortkey="remove">
      <font-awesome-icon icon="trash" />
    </button>
    <button class="btn-clean btn-copy" @click="copyToClipboard" tabindex="-1" v-shortkey="['ctrl', 'c']" @shortkey="copyToClipboard">
      <font-awesome-icon icon="copy" />
    </button>
  </div>
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import ServiceSelector from './components/ServiceSelector.vue'
import { Configs } from './config.js'
import Store from './store.js'
import CurrentUser from './current_user.js'

export default {
  name: 'app',
  components: {
    Navbar,
    ServiceSelector
  },
  watch: {
    "state.service" (val, _) {
      Store.loadStateConfigs(val === null ? null : (typeof val === 'string' ? val : val.name));
      this.generatePassword();
    },
    "currentUser.state.step" (v) {
      if (this.currentUser.isSigningInOrRegistering()) {
        Store.clearEntries();
        this.state.service = Configs.SHAPASS_SERVICE;
        this.focusEmail();
      } else {
        this.state.service = null;
        this.focusServiceSelector();
      }
    },
  },
  methods: {
    generatePassword () {
      if (this.state.service !== null && this.state.service !== undefined) {
        var input = this.state.service;
        if (this.state.master !== null) {
          input = `${input}${this.state.master}`;
        }
        var pass = this.shapass(input, this.state.outputLength);
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
        this.$toasted.show('Copied', { duration: 1000 });
        this.focusMasterPassword();
      }, () => {
        this.$toasted.error('Could not copy', { duration: 1000 });
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
      this.setLength(this.state.outputLength + v);
    },
    setLength (v) {
      let before = this.state.outputLength;
      this.state.outputLength = v;
      if (this.state.outputLength < Configs.MIN_LENGTH) { this.state.outputLength = Configs.MIN_LENGTH; }
      if (this.state.outputLength > Configs.MAX_LENGTH) { this.state.outputLength = Configs.MAX_LENGTH; }
      if (before != this.state.outputLength) {
        this.generatePassword();
      }
    },
    setLengthEvent (e) {
      this.setLength(e.target.valueAsNumber);
    },
    focusInput (parent) {
      var p = this.$el.querySelector(parent);
      if (p !== undefined && p !== null) {
        p.getElementsByTagName('input')[0].focus();
      }
    },
    focusMasterPassword () {
      this.focusInput('#master');
    },
    focusEmail () {
      // console.log("focusing email");
      this.focusInput('#email');
    },
    focusServiceSelector () {
      this.focusInput('#service');
    },
    save () {
      Store.saveCurrentState((r, saved) => {
        if (r) {
          this.$toasted.show(`Configuration '${saved.service}' saved`);
        } else {
          this.$toasted.error(`Error saving`);
        }
      });
    },
    remove () {
      Store.removeService((r, removed) => {
        if (r) {
          this.$toasted.show(`Configuration "${removed}" removed`);
          this.focusServiceSelector();
        } else {
          this.$toasted.error(`Error removing`);
        }
      });
    },
    login () {
      this.currentUser.login(this.inputEmail, this.state.generated, (r, token) => {
        if (r) {
          this.$toasted.success('Welcome!');
          this.afterLogin();
        } else {
          this.$toasted.error('Incorrect email or password, try again');
        }
      });
    },
    register () {
      this.currentUser.signup(this.inputEmail, this.state.generated, (r) => {
        if (r) {
          this.$toasted.success('Successfully registered!');
          this.afterSignUp();
        } else {
          this.$toasted.error('Error registering');
        }
      });
    },
    afterSignUp () {
      this.login();
    },
    afterLogin () {
      Store.reloadServices();
    },
    afterLogout (r) {
      if (r) {
        this.$toasted.success('Bye!');
      } else {
        this.$toasted.error('Something went wrong :(');
      }
    },
  },
  data () {
    return {
      state: Store.state,                 // shared state info
      currentUser: CurrentUser,           // shared user info

      inputEmail: null,                   // the email current in the input
      generatedCensored: null,            // censored version of the generated password
      generatedShown: null,               // clear text version of the generated password
      isGeneratedPasswordVisible: false,  // are we showing the clear text version?
      mask: this.randomMask(),            // mask to censor the generated password
      masterPasswordType: "password",     // input type to control visibility of the master password
    }
  },
  mounted () {
    // TODO: show loading while loading
    this.currentUser.checkSignedIn(r => {
      if (r) {
        Store.reloadServices();
      }
    });
  }
}
</script>

<style lang="scss">

#app {
  margin: 0;
  padding: 0;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}

#content {
  margin: 0 auto;
  padding: 20px 0;
  max-width: 600px;
}

#master, #generated {
  .btn-toggle-visibility, .btn-copy {
    position: absolute;
    top: 5px;
    left: -40px;
  }

  input {
    margin-top: 5px;
  }
}

#generated {
  /* background: $dark; //$background-highlight; */
  /* border: 1px solid $primary; */

  div {
    padding: 1px 0; /* to look like the #master input */
    margin-top: 5px;
    word-break: break-all;
  }

  .censored {
    color: $background-highlight;
  }
}

#configurations {
  background: none;
  margin-top: 10px;

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

#toolbar {
  border: 0;
  padding: 0;
  margin: 0;
  background: none;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
  background: $toolbar-bg-color;
  width: 100%;

  .svg-inline--fa {
    font-size: 28px;
    margin-right: 15px;
    padding: 10px;
    margin: 10px;
    border: 1px solid transparent;

    &:hover {
      background: $black;
      border: $btn-border;
    }
  }
}

#login-registration-buttons {
  border: 0;
  padding: 10px 0;
}

</style>
