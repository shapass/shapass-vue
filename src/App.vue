<template>
<div id="app" v-bind:class="{ mobile: this.$isMobile() }">
  <Navbar :afterLogout="afterLogout" :currentUser="currentUser" />
  <div id="content-common" class="content-wrapper">
    <div class="container" id="service">
      <ServiceSelector v-model="state.service" :services="state.servicesForSelect" :currentUser="currentUser" />
    </div>
  </div>
  <div id="content-landing" v-if="currentUser.atLanding()" class="content-wrapper">
    <div id="start" v-shortkey.once="['enter']" @shortkey="start">Press <kbd>enter</kbd> to start</div>
    <div id="slogan">The password manager that <em>does not</em> store your passwords.</div>
    <div id="logo-landing">
      <img src="logo.svg" alt="ShaPass" />
    </div>
  </div>
  <div id="content-app" v-if="!currentUser.atLanding()" class="content-wrapper">
    <div class="container" id="email" v-if="currentUser.isLoggingInOrSigningUp()">
      <label class="typewriter" for="master-input">Your email</label>
      <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="enterOnInput" v-model="inputEmail" v-focus="currentUser.isLoggingInOrSigningUp()">
    </div>
    <div class="container" id="master" v-if="state.service || currentUser.isLoggingInOrSigningUp()">
      <label class="typewriter" for="master-input">Your master password:</label>
      <input id="master-input" :type="masterPasswordType" spellcheck="false" autocomplete="off" v-model="state.master" v-on:input="generatePassword" v-on:keyup.enter="enterOnInput" v-focus="!currentUser.isLoggingInOrSigningUp()" placeholder="Type your password...">
    </div>
    <div class="container" id="generated" v-if="state.generated && state.master !== null && state.master !== ''">
      <label class="typewriter">Generated password:</label>
      <div id="generated-input" v-html="generatedShown"></div>

      <div class="container clearfix" id="configurations" v-if="state.generated && !currentUser.isLoggingInOrSigningUp()">
        <!-- <label class="typewriter">Configure the generated password:</label> -->
        <div id="length">
          <label class="typewriter">Length:</label>
          <button class="btn btn-ico btn-length-minus" @click="lengthAdd(-1)" tabindex="-1">
            <font-awesome-icon icon="minus-square" />
          </button>
          <input type="number" v-on:blur="setLengthEvent" :value="state.outputLength" />
          <button class="btn btn-ico btn-length-plus" @click="lengthAdd(1)" tabindex="-1">
            <font-awesome-icon icon="plus-square" />
          </button>
        </div>
        <div id="suffix">
          <label class="typewriter" for="suffix-input">Suffix:</label>
          <input id="suffix-input" type="text" spellcheck="false" placeholder="(none)" autocomplete="off" v-model="state.suffix" v-on:input="generatePassword" tabindex="-1">
        </div>
      </div>
    </div>
    <div class="container clearfix" id="login-registration-buttons" v-if="state.generated && currentUser.isLoggingInOrSigningUp()">
      <button class="btn btn-login" id="login-submit" @click="submitLogin" v-if="currentUser.isLoggingIn()" :disabled="!canLogin()">Login</button>
      <button class="btn btn-signup" id="signup-submit" @click="submitSignUp" v-if="currentUser.isSigningUp()" :disabled="!canSignUp()">Register</button>
    </div>
  </div>

  <div class="clearfix" id="toolbar" v-if="state.generated && !currentUser.isLoggingInOrSigningUp()">
    <button class="btn btn-ico btn-save" @click="save" tabindex="-1" v-shortkey.once="['ctrl', 's']" @shortkey="save">
      <font-awesome-icon icon="save" />
    </button>
    <button class="btn btn-ico btn-remove" @click="remove" tabindex="-1" v-shortkey.once="['ctrl', 'del']" @shortkey="remove">
      <font-awesome-icon icon="trash" />
    </button>
    <button class="btn btn-ico btn-copy" @click="copyToClipboard" tabindex="-1" v-shortkey.once="['ctrl', 'c']" @shortkey="copyToClipboard">
      <font-awesome-icon icon="copy" />
    </button>

      <!-- <button class="btn-clean btn-toggle-visibility" v-if="masterPasswordType == 'password'" @click="toggleMasterPasswordType" tabindex="-1"> -->
      <!--   <font-awesome-icon icon="eye-slash" /> -->
      <!-- </button> -->
      <!-- <button class="btn-clean btn-toggle-visibility" v-if="masterPasswordType == 'text'" @click="toggleMasterPasswordType" tabindex="-1"> -->
      <!--   <font-awesome-icon icon="eye" class="active" /> -->
      <!-- </button> -->
      <button class="btn btn-ico btn-toggle-visibility" v-if="!isGeneratedPasswordVisible" @click="togglePasswordVisibility" tabindex="-1">
        <font-awesome-icon icon="eye-slash" />
      </button>
      <button class="btn btn-ico btn-toggle-visibility" v-if="isGeneratedPasswordVisible" @click="togglePasswordVisibility" tabindex="-1">
        <font-awesome-icon icon="eye" class="active" />
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
    "state.service" (val) {
      Store.loadStateConfigs(val === null ? null : (typeof val === 'string' ? val : val.name));
      this.generatePassword();
    },
    "currentUser.state.step" () {
      if (this.currentUser.isLoggingInOrSigningUp()) {
        Store.clearEntries();
        this.state.service = Configs.SHAPASS_SERVICE;
        this.focusEmail();
      } else if (this.currentUser.atLanding()) {
        Store.clearEntries();
      } else if (this.currentUser.atApp()) {
        Store.clearEntries();
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
    // toggleMasterPasswordType () {
    //   this.masterPasswordType = this.masterPasswordType === 'password' ? 'text' : 'password'
    // },
    togglePasswordVisibility () {
      if (this.isGeneratedPasswordVisible) {
        this.isGeneratedPasswordVisible = false;
      } else {
        this.isGeneratedPasswordVisible = true;
      }
      this.setGeneratedPassword(this.state.generated);
      this.masterPasswordType = this.masterPasswordType === 'password' ? 'text' : 'password'
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
      this.focusInput('#email');
    },
    focusServiceSelector () {
      this.focusInput('#service');
    },

    // Pressed enter on an input, decide what to do
    enterOnInput () {
      if (this.currentUser.atApp()) {
        this.copyToClipboard();
      } else if (this.currentUser.isLoggingIn()) {
        this.submitLogin();
      } else if (this.currentUser.isSigningUp()) {
        this.submitSignUp();
      }
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
    start () {
      if (this.currentUser.atLanding()) {
        this.focusServiceSelector();
      }
    },
    submitLogin () {
      if (this.canLogin()) {
        this.withDisabledButton("#login-submit", (done) => {
          this.currentUser.login(this.inputEmail, this.state.generated, (r) => {
            if (r) {
              this.$toasted.success('Welcome!');
              this.afterLogin();
            } else {
              this.$toasted.error('Incorrect email or password, try again');
            }
            done();
          });
        });
      }
    },
    submitSignUp () {
      if (this.canSignUp()) {
        this.withDisabledButton("#signup-submit", (done) => {
          this.currentUser.signup(this.inputEmail, this.state.generated, (r) => {
            if (r) {
              this.$toasted.success('Successfully registered!');
              this.afterSignUp();
            } else {
              this.$toasted.error('Error registering');
            }
            done();
          });
        });
      }
    },
    afterSignUp () {
      this.submitLogin();
    },
    afterLogin () {
      this.currentUser.setAtApp();
      Store.reloadServices();
    },
    afterLogout (r) {
      if (r) {
        this.$toasted.success('Bye!');
      } else {
        this.$toasted.error('Something went wrong :(');
      }
    },
    canLogin () {
      return this.notEmpty(this.state.master) && this.notEmpty(this.inputEmail);
    },
    canSignUp () {
      return this.notEmpty(this.state.master) && this.notEmpty(this.inputEmail);
    }
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
    this.currentUser.checkLoggedIn(r => {
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

#content-landing {
  #slogan {
    margin-top: 30px;
    padding: 20px;
    font-size: $font-lg;
    text-align: center;

    @include mobile {
      padding: 0;
      font-size: $m-font-lg;
    }

    em {
      color: $primary;
      font-weight: bold;
      border-bottom: 1px dashed $primary;
      font-style: normal;
    }
  }

  #start {
    text-align: center;
    font-size: $font-sm;
    opacity: 0.7;
    @include mobile { display: none; }
  }

  #logo-landing {
    text-align: center;
    width: 70%;
    max-width: 300px;
    margin: 40px auto;

    img {
      animation:
        float 3s ease-in-out infinite alternate;
    }
  }
}

.content-wrapper {
  margin: 0 auto;
  padding: 0 $content-side-padding;
  max-width: $content-width;
}

#master, #generated {
  input {
    margin-top: 5px;
  }
}

#generated {
  #generated-input {
    margin-top: 5px;
    word-break: break-all;
    padding: 10px 15px;
    background: $generated-input-bg;
    border: $generated-input-border;
    color: $generated-input-color;
  }

  .censored {
    color: $generated-input-censored-color;
  }
}

#configurations {
  background: none;
  margin: 0;
  padding-left: 0px;
  padding-top: 10px;

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
  background: none;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
  background: $toolbar-bg;
  border: $toolbar-border;
  border-bottom: none;
  width: auto;
  max-width: $toolbar-width;
  margin: 0 auto;

  button {
    width: 20%;
  }

  .svg-inline--fa {
    font-size: 24px;
    padding: 15px 0;
    margin: 0;
    border: 1px solid transparent;
    width: 100%;
  }
}

#login-registration-buttons {
  border: 0;
  padding: 10px 0;
}
</style>
