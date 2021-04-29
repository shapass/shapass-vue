<template>
<div id="app" v-bind:class="{ mobile: this.$isMobile() }" class="site-wrapper">
  <v-dialog/>
  <Navbar :currentUser="currentUser" :showLoginSignup="true" v-on:logout="logout" :loading="currentUser.isLoading() || state.saving" />

  <div id="content">

  <!-- SERVICE SELECTOR (ON BOTH PAGES) -->
  <div class="content-wrapper" id="service-wrapper" v-if="!videoPlaying">
    <div class="container" id="service">
      <ServiceSelector v-model="state.service" :services="state.servicesForSelect" :currentUser="currentUser" :asButton="currentUser.atLanding()" v-on:focused="serviceFocused" v-on:blurred="serviceBlurred" :disabled="modalOpened()" :tabindex="1" />
    </div>
    <div class="container" id="service-buttons" v-if="currentUser.atApp()">
      <transition name="slide">
        <button class="btn btn-ico btn-save btn-toolbar" @click="save" tabindex="-1" v-shortkey.once="['ctrl', 's']" @shortkey="save" v-tooltip="'Save the selected service in your list of services'" v-if="showSaveButton()">
          <font-awesome-icon icon="save" />
        </button>
      </transition>
      <transition name="slide">
        <button class="btn btn-ico btn-remove btn-toolbar" @click="removeConfirm" tabindex="-1" v-shortkey.once="['ctrl', 'del']" @shortkey="removeConfirm" v-tooltip="'Remove the selected service from your list of services'" v-if="showRemoveButton()">
          <font-awesome-icon icon="trash" />
        </button>
      </transition>
    </div>
  </div>

  <!-- LANDING PAGE -->
  <div id="content-landing" v-if="currentUser.atLanding() && !videoPlaying" class="content-wrapper">
    <div id="start" v-shortkey.once="['enter']" @shortkey="start">Press <kbd>enter</kbd> to start</div>
    <div id="slogan">The password manager that <em>does not</em> store your passwords.</div>
  </div>
  <div id="content-landing-video" v-if="currentUser.atLanding()" class="content-wrapper">
    <IntroVideo :playing="videoPlaying" v-on:playing="videoPlaying = true" v-on:ended="videoPlaying = false"></IntroVideo>
  </div>

  <!-- APP PAGE -->
  <div id="content-app" v-if="!currentUser.atLanding()" class="content-wrapper">
    <div class="container" id="master" v-if="state.service">
      <PasswordVisibilityInput id="master-input" v-model="state.master" v-on:keyup:enter="enterOnInput" v-focus label="Your master password:" :tabindex="2" />
    </div>
    <div class="container" id="generated">
      <GeneratedPassword label="Generated password:" :state="state" :bus="bus"></GeneratedPassword>
    </div>
  </div>

  <div class="clearfix content-wrapper" id="toolbar" v-if="state.generated && currentUser.atApp()">
    <div class="toolbar-left">
      <button class="btn btn-ico btn-configure btn-toolbar" @click="configure" tabindex="3" v-shortkey.once="['ctrl', '/']" @shortkey="configure" v-tooltip="'Configure the generated password'">
        <font-awesome-icon icon="cog" />
        <span>configure</span>
        <!-- <span v-if="this.$isMobile()">configure</span> -->
        <!-- <span v-if="!this.$isMobile()"><kbd>ctrl</kbd>+<kbd>/</kbd></span> -->
      </button>
    </div>
    <div class="toolbar-right">
      <button class="btn btn-ico btn-copy btn-toolbar" @click="copyToClipboard" tabindex="4" v-shortkey.once="['ctrl', 'c']" @shortkey="copyToClipboard" v-tooltip="'Copy the generated password to your clipboard'">
        <font-awesome-icon icon="copy" />
        <span>copy</span>
        <!-- <span v-if="this.$isMobile()">copy</span> -->
        <!-- <span v-if="!this.$isMobile()"><kbd>ctrl</kbd>+<kbd>c</kbd></span> -->
      </button>
    </div>
  </div>

  <modal name="configurations" @opened="configurations_opened" @closed="configurations_closed" :width="this.$isMobile() ? '100%' : 600" :height="250" :pivotY="0.1" :minHeight="250">
    <div id="configurations" class="modal-body clearfix" v-if="state.generated">
      <div id="length">
        <label>Length:</label>
        <input type="number" v-on:blur="setLengthEvent" :value="state.outputLength" tabindex="20" v-focus  />
        <button class="btn btn-ico btn-length-minus" @click="lengthAdd(-1)" tabindex="-1">
          <font-awesome-icon icon="minus-square" />
        </button>
        <button class="btn btn-ico btn-length-plus" @click="lengthAdd(1)" tabindex="-1">
          <font-awesome-icon icon="plus-square" />
        </button>
      </div>
      <div id="suffix">
        <label for="suffix-input">Suffix:</label>
        <input id="suffix-input" type="text" spellcheck="false" placeholder="(none)" autocomplete="off" v-model="state.suffix" tabindex="21">
      </div>
      <div id="algorithm">
        <label for="algorithm-input">Algorithm:</label>
        <select id="algorithm-input" v-model="state.algorithm" tabindex="22">
          <option value="sha256-bin">Default</option>
          <option value="sha256-num">Numeric</option>
          <option value="sha256-str">Legacy</option>
          <!-- <option>sha256-bin-alfanum</option> -->
        </select>
      </div>
    </div>
    <div class="v--modal-buttons">
      <button class="btn modal-button" @click="configurationsSave" tabindex="23">save</button>
      <button class="btn modal-button" @click="configurationsCancel" tabindex="24">cancel</button>
    </div>
  </modal>

  <!-- FAQ (AT LANDING PAGE) -->
  <div v-if="currentUser.atLanding() && !videoPlaying" class="content-wrapper">
    <FAQ></FAQ>
  </div>

  </div>

  <Footer />
</div>
</template>

<script>
import Vue from 'vue';
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ServiceSelector from './components/ServiceSelector.vue'
import PasswordVisibilityInput from './components/PasswordVisibilityInput.vue'
import { Configs } from './config.js'
import Store from './store.js'
import CurrentUser from './current_user.js'
import GeneratedPassword from './components/GeneratedPassword.vue'
import IntroVideo from './components/IntroVideo.vue'
import FAQ from './components/FAQ.vue'

export default {
  name: 'app',
  components: {
    Navbar,
    Footer,
    ServiceSelector,
    PasswordVisibilityInput,
    GeneratedPassword,
    IntroVideo,
    FAQ,
  },
  metaInfo: {
    title: 'Shapass',
    htmlAttrs: {
      lang: 'en',
    },
    // titleTemplate: '%s | Shapass'
  },
  watch: {
    "state.service" (val) {
      Store.onServiceChanged(val === null ? null : (typeof val === 'string' ? val : val.name));
    },
    "currentUser.state.step" () {
      if (this.currentUser.atLanding()) {
        Store.clearState();
      } else if (this.currentUser.atApp()) {
        Store.clearState();
      }
    },
  },
  methods: {
    copyToClipboard () {
      this.$copyText(this.state.generated).then(() => {
        this.$toasted.show('Password copied', { duration: 2000 });
        this.bus.$emit('copied-to-clipboard');
        if (!this.$isMobile()) {
          this.focusMasterPassword();
        }
      }, () => {
        this.$toasted.error('Could not copy', { duration: 2000 });
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
    focusServiceSelector () {
      this.focusInput('#service');
    },
    serviceFocused() {
      this.currentUser.setAtApp();
    },
    // TODO: Hacky, but works.
    // On vue-select 3.3 there's an attr for this: :select-on-key-codes="[13, 9]"
    serviceBlurred() {
      setTimeout(() => { this.focusInput('#master'); }, 50);
    },
    enterOnInput () {
      if (this.currentUser.atApp()) {
        this.copyToClipboard();
      }
    },
    save () {
      Store.saveCurrentState((r, saved) => {
        if (r) {
          this.$toasted.show(`Configuration '${saved.name}' saved`);
        } else {
          this.$toasted.error(`Error saving`);
        }
      });
    },
    removeConfirm () {
      this.$modal.show('dialog', {
        title: 'Confirmation',
        text: `Are you sure you want to remove the service "${this.state.service}" from your list?`,
        buttons: [
          {
            title: 'Yes',
            handler: () => {
              this.remove();
            }
          },
          {
            title: 'No',
            default: true
          }
        ]
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
        this.$modal.hide('dialog');
      });
    },
    configure () {
      this.showConfigs = !this.showConfigs;
      if (this.showConfigs) {
        this.$modal.show('configurations');
      } else {
        this.$modal.hide('configurations');
      }
    },
    configurations_opened () {
      this.showConfigs = true;
      this.stateBeforeConfigs = Store.fromState();
    },
    configurations_closed () {
      this.showConfigs = false;
      Store.toState(this.stateBeforeConfigs);
    },
    configurationsCancel () {
      this.$modal.hide('configurations');
    },
    configurationsSave () {
      if (Store.isCurrentServiceSaved()) {
        Store.saveCurrentState(() => {
          this.stateBeforeConfigs = Store.fromState();
          this.$toasted.success('Configurations saved!');
          this.$modal.hide('configurations');
        });
      } else {
        this.stateBeforeConfigs = Store.fromState();
        this.$toasted.success('Configurations saved!');
        this.$modal.hide('configurations');
      }
    },
    modalOpened () {
      return this.showConfigs;
    },
    start () {
      if (this.currentUser.atLanding()) {
        this.focusServiceSelector();
      }
    },
    logout () {
      this.currentUser.logout((r) => {
        if (r) {
          this.$toasted.success('Bye!');
        } else {
          this.$toasted.error('Something went wrong :(');
        }
        this.currentUser.setAtLanding();
      });
    },
    showSaveButton () {
      return this.currentUser.isLoggedIn() && this.currentUser.atApp() &&
        this.state.service !== null && this.state.service !== undefined &&
        !Store.isCurrentServiceSaved();
    },
    showRemoveButton () {
      return this.currentUser.isLoggedIn() && this.currentUser.atApp() &&
        Store.isCurrentServiceSaved();
    },
  },
  data () {
    return {
      state: Store.getState(),
      currentUser: CurrentUser,
      showConfigs: false,
      videoPlaying: false,
      bus: new Vue()
    }
  },
  mounted () {
    this.state.service = null;
    this.currentUser.setAtLanding();
    Store.reloadFromLocalStorage();
    this.currentUser.checkLoggedIn(r => {
      if (r) {
        Store.fetchDataFromAPI(() => {
          if (this.currentUser.atApp()) {
            this.focusServiceSelector();
          }
        });
      }
    });
  },
  beforeRouteLeave (to, from, next) {
    this.disableSavePassword(this.$el);
    Store.clearState();
    this.masterPasswordVisible = false;
    this.generatedPasswordVisible = false;
    next();
  },
}
</script>


<style scoped lang="scss">

#content-landing {
  margin-top: 30px;

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

#master {
  position: relative;
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
  background: none;
  padding-top: 30px;
  @include mobile {
    padding-top: 10px;
  }
  padding-bottom: 10px;
  text-align: right;
  width: auto;

  .toolbar-left {
    float: left;

    button:first-child {
      margin-left: 0;
    }

    @include mobile {
      button {
        display: block;
        margin: 0.7em 0 0 0;
      }
      button:first-child {
        margin-top: 0;
      }
    }
  }

  .toolbar-right {
    float: right;

    button:first-child {
      margin-left: 0;
    }

    @include mobile {
      button {
        clear: both;
        margin: 0.7em 0 0 0;
      }
      button:first-child {
        margin-top: 0;
      }
    }
  }

  .btn-toolbar {
    margin: 0.7em 0 0 1em;
  }
}

button.btn-toolbar {
  width: auto;
  height: auto;
  background: $toolbar-ico-bg;
  border: $toolbar-ico-border;
  padding: 10px 10px 12px 10px;
  transition: $transition-default;

  &:hover, &:active {
    background: $toolbar-ico-hover-bg;
    border: $toolbar-ico-border;
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
    display: inline-block;
    margin: 0 auto;
    margin-bottom: -4px;
  }

  > span {
    display: inline-block;
    margin-left: 10px;
  }
}

#service-wrapper {
  display: flex;
  flex-direction: row;
}

#service {
  flex-grow: 1;
  transition: flex 500ms ease-in-out;
}

#service-buttons {
  flex-grow: 0.00001;
  display: flex;
  align-items: flex-end;
  padding-bottom: 0;

  button {
    margin-left: 1em;
  }
}

.slide-enter-active {
  transition: all .1s ease;
}
.slide-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-enter, .slide-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

#faq {
  clear: both;
  margin-top: 200px;
  margin-bottom: 50px;
  padding-top: 40px;
  border-top: 1px dashed $background-highlight;

  @include mobile {
    margin-top: 80px;
  }
}

.intro-video.playing {
  margin-top: 40px;
}

</style>
