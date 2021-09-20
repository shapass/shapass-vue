<template>
<div id="login" v-bind:class="{ mobile: this.$isMobile() }" class="site-wrapper">
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
      <PasswordVisibilityInput id="master-input" label="Your master password" v-on:keyup:enter="submit" v-model="state.master" inputName="login-password"></PasswordVisibilityInput>
    </div>
    <div class="container" id="generated">
      <GeneratedPassword label="Generated password:" :state="state"></GeneratedPassword>
    </div>
    <div class="container">
      <button class="btn btn-login" id="login-submit" @click="submit" :disabled="!canSubmit()">Login</button>
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
  name: 'login',
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
      currentUser: CurrentUser,
      state: Store.getState(),
      inputEmail: null,
      generated: null,
      master: null,
      submitted: false
    }
  },
  methods: {
    canSubmit() {
      return this.isValidInputEmail(this.inputEmail) &&
        this.notEmpty(this.state.master) &&
        this.state.generated && !this.currentUser.isLoading();
    },
    submit () {
      if (this.canSubmit()) {
        this.withDisabledButton("#login-submit", (done) => {
          this.currentUser.login(this.inputEmail, this.state.master, this.state.generated, (r, firstAccess, code) => {
            this.state.service = Configs.SHAPASS_SERVICE; // because login() clears the state
            if (r) {
              Store.clearState();
              this.currentUser.setAtApp();
              this.submitted = true;
              if (firstAccess) {
                this.$router.push('/welcome')
              } else {
                this.$router.push('/')
                this.$toasted.success('Welcome!');
              }
            } else {
              if (code == API.Errors.CodeIncorrectLoginInfo) {
                this.$toasted.error('Incorrect email or password, try again');
              } else if (code == API.Errors.CodeUserNotActivated) {
                this.$router.push({ path: 'confirmation', query: { email: this.inputEmail } })
              } else {
                this.$toasted.error('Error logging in, please try again later');
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
  },
  computed: {
  },
  mounted () {
    this.state.service = Configs.SHAPASS_SERVICE;
    this.currentUser.setLoggingIn();
  },
  watch: {
  },
  beforeRouteLeave (to, from, next) {
    if (!this.submitted) {
      this.disableSavePassword(this.$el);
    }
    next();
  },
}
</script>

<style scoped lang="scss">

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

#login-submit {
  float: left;
}

.infinite-loading {
  float: left;
  margin-left: 20px;
}

.content-wrapper {
  flex: 1 0 auto;
}

</style>
