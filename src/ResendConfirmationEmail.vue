<template>
<div id="resend-confirmation" v-bind:class="{ mobile: this.$isMobile() }">
  <Navbar :currentUser="currentUser" :showLoginSignup="false" :loading="currentUser.isLoading()" />

  <div class="content-wrapper">
    <div class="container" id="label">
      <h3>Didn't receive your confirmation email?</h3>
      <!-- <span>Enter your email below and we'll send you a confirmation email if your registration is still pending.</span> -->
      <span>Just sign into your account and we will send you another one.</span>
    </div>
    <!-- <div class="container" id="email"> -->
    <!--   <label class="typewriter" for="master-input">Your email</label> -->
    <!--   <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submit" v-model="inputEmail" v-focus v-bind:class="{ wrong: notEmpty(inputEmail) && !isValidInputEmail() }"> -->
    <!-- </div> -->
    <router-link to="/login" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()">
      <button class="btn">Login</button>
    </router-link>
    <!-- <button class="btn btn-sumit" id="btn-submit" @click="submit" :disabled="!canSubmit()">Send</button> -->
    <!-- <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle> -->
  </div>
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import InfiniteLoadingCircle from './components/InfiniteLoadingCircle.vue'
import PasswordVisibilityInput from './components/PasswordVisibilityInput.vue'
import GeneratedPassword from './components/GeneratedPassword.vue'
import Store from './store.js'
import CurrentUser from './current_user.js'
import { Configs } from './config.js'

export default {
  name: 'resend-confirmation',
  components: {
    Navbar,
    InfiniteLoadingCircle
  },
  props: {
  },
  data () {
    return {
      // inputEmail: null,
      currentUser: CurrentUser
    }
  },
  methods: {
    // canSubmit() {
    //   return this.isValidInputEmail() && !this.currentUser.isLoading();
    // },
    // submit () {
    //   if (this.canSubmit()) {
    //     this.withDisabledButton("#btn-submit", (done) => {
    //       this.currentUser.resendVerification(this.inputEmail, () => {
    //         // we show a success msg even if there was an error in the API
    //         // to prevent people from figuring our what emails are registered
    //         this.$router.push('/')
    //         this.$toasted.success('Check you e-mail for instructions!');
    //         done();
    //       });
    //     });
    //   }
    // },
    // isValidInputEmail () {
    //   return this.isValidEmail(this.inputEmail);
    // },
  },
  mounted () {
    this.currentUser.setAtOther();
  },
}
</script>

<style scoped lang="scss">

button {
  float: left;
}

.loader {
  margin-left: 3%;
  float: left;
}

#email {
  padding-bottom: 30px;
}

</style>
