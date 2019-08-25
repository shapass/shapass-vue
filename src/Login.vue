<template>
<div id="login" v-bind:class="{ mobile: this.$isMobile() }">
  <Navbar :currentUser="currentUser" :showLoginSignup="false" />

  <div class="content-wrapper">
    <div class="container" id="service">
      <ServiceSelector v-model="state.service" :currentUser="currentUser" :disabled="true" :asButton="false" />
    </div>
    <div class="container" id="email">
      <label class="typewriter" for="master-input">Your email</label>
      <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submit" v-model="inputEmail" v-focus v-bind:class="{ wrong: notEmpty(inputEmail) && !isValidInputEmail() }">
    </div>
    <div class="container" id="master">
      <PasswordVisibilityInput id="master-input" label="Your master password" v-on:keyup:enter="submit" v-model="state.master"></PasswordVisibilityInput>
    </div>
    <div class="container" id="generated">
      <GeneratedPassword label="Generated password:" :state="state"></GeneratedPassword>
    </div>
    <button class="btn btn-login" id="login-submit" @click="submit" :disabled="!canSubmit()">Login</button>
    <router-link to="/reset-password" v-if="currentUser.isLoggingIn()" class="forgot-password">Forgot your password?</router-link>
    <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle>
  </div>
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import CurrentUser from './current_user.js'
import ServiceSelector from './components/ServiceSelector.vue'
import GeneratedPassword from './components/GeneratedPassword.vue'
import InfiniteLoadingCircle from './components/InfiniteLoadingCircle.vue'
import PasswordVisibilityInput from './components/PasswordVisibilityInput.vue'
import Store from './store.js'
import { Configs } from './config.js'

export default {
  name: 'login',
  components: {
    Navbar,
    ServiceSelector,
    InfiniteLoadingCircle,
    PasswordVisibilityInput,
    GeneratedPassword
  },
  data () {
    return {
      state: Store.state,
      currentUser: CurrentUser,
      inputEmail: null,
      generated: null,
      master: null
    }
  },
  methods: {
    canSubmit() {
      return this.isValidInputEmail(this.inputEmail) && this.notEmpty(this.state.master) &&
        this.state.generated && !this.currentUser.isLoading();
    },
    submit () {
      if (this.canSubmit()) {
        this.withDisabledButton("#login-submit", (done) => {
          this.currentUser.login(this.inputEmail, this.state.generated, (r) => {
            if (r) {
              this.currentUser.setAtApp();
              this.$router.push('/')
              this.$toasted.success('Welcome!');
            } else {
              this.$toasted.error('Incorrect email or password, try again');
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
}
</script>

<style scoped lang="scss">

a.forgot-password {
  float: right;
  font-size: $font-sm;
  margin-top: 5px;
}

#login-submit {
  float: left;
}

.loader {
  float: left;
  margin-left: 20px;
}

</style>