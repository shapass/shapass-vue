<template>
<div id="signup" v-bind:class="{ mobile: this.$isMobile() }" class="site-wrapper">
  <Navbar :currentUser="currentUser" :showLoginSignup="false" :loading="currentUser.isLoading()" />

  <div id="content">

  <div class="content-wrapper">
    <div class="container" id="service">
      <ServiceSelector v-model="state.service" :currentUser="currentUser" :disabled="true" :asButton="false" />
    </div>
    <div class="container" id="email">
      <label for="master-input">Your email</label>
      <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submit" v-model="inputEmail" v-focus v-bind:class="{ wrong: notEmpty(inputEmail) && !isValidInputEmail() }">
    </div>
    <div class="container" id="master">
      <PasswordVisibilityInput id="master-input" label="Your master password" v-on:keyup:enter="submit" v-model="master" inputName="login-password"></PasswordVisibilityInput>
    </div>
    <div class="container" id="master-confirmation">
      <label for="master-input">Confirm your master password</label>
      <input id="master-confirmation-input" type="password" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submit" v-model="masterConfirmation" :class="{ 'wrong-live': master && !isConfirmationCorrect() }">
    </div>
    <div class="container" id="generated">
      <GeneratedPassword label="Generated password:" :state="state"></GeneratedPassword>
    </div>
    <div class="container">
      <button class="btn btn-signup" id="signup-submit" @click="submit" :disabled="!canSubmit()">Register</button>
      <InfiniteLoading v-if="currentUser.isLoading()"></InfiniteLoading>
      <div class="help-links">
        <span>Need help?</span>
        <router-link to="/reset-password">Forgot your password?</router-link>
        <router-link to="/resend-confirmation">Did not receive your confirmation email?</router-link>
      </div>
    </div>

  </div>
  </div>

  <Footer />
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ServiceSelector from './components/ServiceSelector.vue'
import GeneratedPassword from './components/GeneratedPassword.vue'
import InfiniteLoading from './components/InfiniteLoading.vue'
import PasswordVisibilityInput from './components/PasswordVisibilityInput.vue'
import Store from './store.js'
import API from './api.js'
import CurrentUser from './current_user.js'
import { Configs } from './config.js'

export default {
  name: 'signup',
  components: {
    Navbar,
    Footer,
    ServiceSelector,
    InfiniteLoading,
    PasswordVisibilityInput,
    GeneratedPassword
  },
  props: {
  },
  data () {
    return {
      state: Store.getState(),
      inputEmail: null,
      generated: null,
      master: null,
      masterConfirmation: null,
      currentUser: CurrentUser
    }
  },
  methods: {
    canSubmit() {
      return this.isValidInputEmail(this.inputEmail) && this.isConfirmationCorrect() &&
        this.state.generated && !this.currentUser.isLoading();
    },
    submit () {
      if (this.canSubmit()) {
        this.withDisabledButton("#signup-submit", (done) => {
          this.currentUser.signup(this.inputEmail, this.state.generated, (r, code) => {
            if (r) {
              this.$router.push({ path: 'confirmation', query: { email: this.inputEmail } })
            } else {
              if (code == API.Errors.CodeIncorrectSignupInfo) {
                this.$toasted.error('Invalid sign up information. Make sure this email is not already registered.');
              } else if (code == API.Errors.CodeCouldNotSendEmail) {
                this.$toasted.error('We could not send a confirmation email right now, please try again in a few minutes');
              } else {
                this.$toasted.error('Error registering, please try again later');
              }
            }
            done();
          });
        });
      }
    },
    isValidInputEmail () {
      return this.isValidEmail(this.inputEmail);
    },
    isConfirmationCorrect () {
      return this.notEmpty(this.master) && this.master === this.masterConfirmation;
    },
  },
  computed: {
  },
  mounted () {
    this.state.service = Configs.SHAPASS_SERVICE;
    this.currentUser.setSigningUp();
  },
  watch: {
    master () {
      this.state.master = this.master;
    },
  },
  beforeRouteLeave (to, from, next) {
    // prevents the service input from not updating when going to /login
    this.state.service = null;

    this.disableSavePassword(this.$el);
    next();
  },
}
</script>

<style scoped lang="scss">

#signup-submit {
  float: left;
}

.infinite-loading {
  float: left;
  margin-left: 20px;
}

.help-links {
  display: block;
  float: left;
  font-size: $font-sm;
  margin-top: 5px;
  clear: both;
  margin-top: 40px;

  span {
    color: $font-color-faded;
    text-transform: uppercase;
    margin-bottom: 5px;
    display: block;
  }

  a {
    display: block;
  }
}

</style>
