<template>
<div id="app" v-bind:class="{ mobile: this.$isMobile() }">
  <Navbar :afterLogout="afterLogout" :currentUser="currentUser" :showLoginSignup="true" />
  <div id="content-common" class="content-wrapper">
    <div class="container" id="service">
      <ServiceSelector v-model="state.service" :services="state.servicesForSelect" :currentUser="currentUser" :disabled="currentUser.isLoggingInOrSigningUp()" />
    </div>
  </div>
  <div id="content-landing" v-if="currentUser.atLanding()" class="content-wrapper">
    <div id="start" v-shortkey.once="['enter']" @shortkey="start">Press <kbd>enter</kbd> to start</div>
    <div id="slogan">The password manager<br/>that <em>does not</em> store<br/>your passwords.</div>
    <div id="logo-landing" v-tooltip="{ content: 'You sha...pass!', delay: { show: 42000, hide: 100 }, placement: 'right' }">
      <img src="logo.svg" alt="Shapass" />
    </div>
  </div>
  <div id="content-app" v-if="!currentUser.atLanding()" class="content-wrapper">
    <div class="container" id="email" v-if="currentUser.isLoggingInOrSigningUp()">
      <label class="typewriter" for="master-input">Your email</label>
      <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="enterOnInput" v-model="inputEmail" v-focus="currentUser.isLoggingInOrSigningUp()">
    </div>
    <div class="container" id="master" v-if="state.service || currentUser.isLoggingInOrSigningUp()">
      <label class="typewriter" for="master-input">Your master password:</label>
      <input id="master-input" :type="masterPasswordType" spellcheck="false" autocomplete="off" v-model="state.master" v-on:keyup.enter="enterOnInput" v-focus="!currentUser.isLoggingInOrSigningUp()" placeholder="Type your password...">
      <PasswordVisibilityToggle v-model="masterPasswordVisible" />
    </div>
    <div class="container" id="generated">
      <GeneratedPassword label="Generated password:" :state="state"></GeneratedPassword>
      <div class="container clearfix" id="configurations" v-if="state.generated && !currentUser.isLoggingInOrSigningUp()">
        <!-- <label class="typewriter">Configure the generated password:</label> -->
        <div id="length">
          <label class="typewriter">Length:</label>
          <input type="number" v-on:blur="setLengthEvent" :value="state.outputLength" />
          <button class="btn btn-ico btn-length-minus" @click="lengthAdd(-1)" tabindex="-1">
            <font-awesome-icon icon="minus-square" />
          </button>
          <button class="btn btn-ico btn-length-plus" @click="lengthAdd(1)" tabindex="-1">
            <font-awesome-icon icon="plus-square" />
          </button>
        </div>
        <div id="algorithm">
          <label class="typewriter" for="algorithm-input">Algorithm:</label>
          <select id="algorithm-input" v-model="state.algorithm" tabindex="-1">
            <option>sha256-str</option>
            <option>sha256-bin</option>
            <!-- <option>sha256-bin-alfanum</option> -->
          </select>
        </div>
        <div id="suffix">
          <label class="typewriter" for="suffix-input">Suffix:</label>
          <input id="suffix-input" type="text" spellcheck="false" placeholder="(none)" autocomplete="off" v-model="state.suffix" tabindex="-1">
        </div>
      </div>
    </div>
    <div class="container clearfix" id="login-registration-buttons" v-if="state.generated && currentUser.isLoggingInOrSigningUp()">
      <button class="btn btn-login" id="login-submit" @click="submitLogin" v-if="currentUser.isLoggingIn()" :disabled="!canLogin()">Login</button>
      <router-link to="/reset-password" v-if="currentUser.isLoggingIn()">Forgot your password?</router-link>

      <button class="btn btn-signup" id="signup-submit" @click="submitSignUp" v-if="currentUser.isSigningUp()" :disabled="!canSignUp()">Register</button>
    </div>
  </div>

  <div class="clearfix" id="toolbar" v-if="state.generated && !currentUser.isLoggingInOrSigningUp()">
    <button class="btn btn-ico btn-save" @click="save" tabindex="-1" v-shortkey.once="['ctrl', 's']" @shortkey="save" v-tooltip="'Save the selected service in your list of services'">
      <span v-if="this.$isMobile()"><kbd>save</kbd></span>
      <font-awesome-icon icon="save" />
      <span v-if="!this.$isMobile()"><kbd>ctrl</kbd>+<kbd>s</kbd></span>
    </button>
    <button class="btn btn-ico btn-remove" @click="remove" tabindex="-1" v-shortkey.once="['ctrl', 'del']" @shortkey="remove" v-tooltip="'Remove the selected service from your list of services'">
      <span v-if="this.$isMobile()"><kbd>delete</kbd></span>
      <font-awesome-icon icon="trash" />
      <span v-if="!this.$isMobile()"><kbd>ctrl</kbd>+<kbd>del</kbd></span>
    </button>
    <button class="btn btn-ico btn-copy" @click="copyToClipboard" tabindex="-1" v-shortkey.once="['ctrl', 'c']" @shortkey="copyToClipboard" v-tooltip="'Copy the generated password to your clipboard'">
      <span v-if="this.$isMobile()"><kbd>copy</kbd></span>
      <font-awesome-icon icon="copy" />
      <span v-if="!this.$isMobile()"><kbd>ctrl</kbd>+<kbd>c</kbd></span>
    </button>
  </div>
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import ServiceSelector from './components/ServiceSelector.vue'
import PasswordVisibilityToggle from './components/PasswordVisibilityToggle.vue'
import { Configs } from './config.js'
import Store from './store.js'
import CurrentUser from './current_user.js'
import GeneratedPassword from './components/GeneratedPassword.vue'

export default {
  name: 'app',
  components: {
    Navbar,
    ServiceSelector,
    PasswordVisibilityToggle,
    GeneratedPassword
  },
  watch: {
    "state.service" (val) {
      Store.loadStateConfigs(val === null ? null : (typeof val === 'string' ? val : val.name));
    },
    "currentUser.state.step" (val, prev) {
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
      // force-hide passwords when changing page
      if (val != prev) {
        // TODO: how to do this now with components?
        // this.masterPasswordVisible = false;
        // this.generatedPasswordVisible = false;
        this.inputEmail = null;
      }
    },
    masterPasswordVisible () {
      if (this.masterPasswordVisible) {
        this.masterPasswordType = 'text';
      } else {
        this.masterPasswordType = 'password';
      }
    },
  },
  methods: {
    copyToClipboard () {
      this.$copyText(this.state.generated).then(() => {
        this.$toasted.show('Copied', { duration: 1000 });
        if (!this.$isMobile()) {
          this.focusMasterPassword();
        }
      }, () => {
        this.$toasted.error('Could not copy', { duration: 1000 });
      })
    },
    lengthAdd (v) {
      this.setLength(this.state.outputLength + v);
    },
    setLength (v) {
      this.state.outputLength = Configs.boundedOutputLength(v);
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
      Store.reloadServices(() => {
        this.focusServiceSelector();
      });
    },
    afterLogout (r) {
      if (r) {
        this.$toasted.success('Bye!');
      } else {
        this.$toasted.error('Something went wrong :(');
      }
      this.currentUser.setAtLanding();
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
      masterPasswordType: "password",     // input type to control visibility of the master password
      masterPasswordVisible: false,       // is the master password visible?
    }
  },
  mounted () {
    this.currentUser.setAtLanding();
    this.currentUser.checkLoggedIn(r => {
      if (r) {
        Store.reloadServices();
      }
    });
  }
}
</script>

<style lang="scss">

#content-landing {
  #slogan {
    margin-top: 30px;
    padding: 20px;
    font-size: $font-lg;
    text-align: center;
    font-family: $font-family-titles;

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

#master {
  position: relative;

  > input {
    margin-top: 5px;
    padding-right: 45px;
    padding-left: 10px;
    width: calc(100% - 55px);
  }

  .password-visibility-toggle {
    position: absolute;
    right: 10px;
    top: 1.95em; // based on how font-size is calculated
  }
}

#configurations {
  background: none;
  margin: 20px 0;
  padding-left: 0px;
  padding-top: 10px;

  > div {
    align-items: baseline;
    justify-content: left;
    float: left;
    clear: both;
    margin-bottom: 5px;
    position: relative;

    label {
      margin-right: 10px;
      width: 100px;
      text-align: right;
      float: left;
      margin-top: 10px;
    }

    &#suffix input {
      width: 70px;
    }

    &#algorithm select {
      width: auto;
    }

    &#length {
      input {
        width: 30px;
        margin-right: 25px;
        text-align: center;
        -moz-appearance: textfield;
        -webkit-appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
      .btn-length-minus {
        position: absolute;
        right: 0;
        bottom: 0;
      }
      .btn-length-plus {
        position: absolute;
        right: 0;
        top: 0;
      }
      .svg-inline--fa {
        padding: 0;
      }
    }
  }
}

#toolbar {
  border: 0;
  padding: 0;
  background: none;
  position: absolute;
  bottom: 20px;
  right: 0;
  left: 0;
  text-align: center;
  /* border-bottom: none; */
  width: auto;
  /* max-width: $toolbar-width; */
  margin: 0 auto;

  button {
    width: auto;
    height: auto;
    background: $toolbar-ico-bg;
    border: $toolbar-ico-border;
    border-radius: 0;
    padding: 10px;
    margin: 0 0.5em;
    transition: $transition-default;

    &:hover, &:active {
      background: $toolbar-ico-hover-bg;
      border-color: $toolbar-ico-hover-border-color;
      .svg-inline--fa {
        color: $toolbar-ico-hover-color;
      }
    }

    .svg-inline--fa {
      font-size: $toolbar-ico-size;
      color: $toolbar-ico-color;
      padding: 0;
      margin: 0;
      border: 1px solid transparent;
      width: auto;
      display: block;
      margin: 0 auto;
    }

    > span {
      margin-top: 10px;
      display: block;
    }
  }
  @include mobile {
    right: 20px;
    bottom: 20px;
    left: auto;

    button {
      float: right;
      clear: both;
      margin: 0.3em 0;
      @include clearfix;

      .svg-inline--fa {
        display: inline-block;
        float: left;
      }

      > span {
        float: left;
        display: inline-block;
        margin: 0.2em 0.8em 0 0;
      }
    }
  }
}

#login-registration-buttons {
  border: 0;
  padding: 10px 0;

  a {
    float: right;
    font-size: $font-sm;
    margin-top: 5px;
  }
}
</style>
