<template>
<div id="signup" v-bind:class="{ mobile: this.$isMobile() }">
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
      <PasswordVisibilityInput id="master-input" label="Your master password" v-on:keyup:enter="submit" v-model="master"></PasswordVisibilityInput>
    </div>
    <div class="container" id="master-confirmation">
      <label class="typewriter" for="master-input">Confirm your master password</label>
      <input id="master-confirmation-input" type="password" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submit" v-model="masterConfirmation" :class="{ 'wrong-live': masterConfirmation && !isConfirmationCorrect() }">
    </div>
    <div class="container" id="generated">
      <GeneratedPassword label="Generated password:" :state="state"></GeneratedPassword>
    </div>
    <button class="btn btn-signup" id="signup-submit" @click="submit" :disabled="!canSubmit()">Register</button>
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
  name: 'signup',
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
      master: null,
      masterConfirmation: null
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
          this.currentUser.signup(this.inputEmail, this.state.generated, (r) => {
            if (r) {
              // TODO: show a 'waiting confirmation' page instead
              this.$router.push('/')
              this.$toasted.success('Successfully registered!');
            } else {
              this.$toasted.error('Error registering');
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
      return this.notEmpty(this.master) && this.notEmpty(this.masterConfirmation) && this.master === this.masterConfirmation;
    },
    setStateMaster () {
      if (this.isConfirmationCorrect()) {
        this.state.master = this.master;
      } else {
        this.state.master = null;
      }
    }
  },
  computed: {
  },
  mounted () {
    this.state.service = Configs.SHAPASS_SERVICE;
  },
  watch: {
    master () {
      this.setStateMaster();
    },
    masterConfirmation () {
      this.setStateMaster();
    },
  },
}
</script>

<style scoped lang="scss">

</style>
