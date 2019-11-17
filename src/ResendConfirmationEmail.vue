<template>
<div id="resend-confirmation" v-bind:class="{ mobile: this.$isMobile() }" class="site-wrapper">
  <Navbar :currentUser="currentUser" :showLoginSignup="false" :loading="currentUser.isLoading()" />

  <div id="content">
  <div class="content-wrapper">
    <div class="container" id="label">
      <h3>Didn't receive your confirmation email?</h3>
      <!-- <span>Enter your email below and we'll send you a confirmation email if your registration is still pending.</span> -->
      <span>Just sign into your account and we will send you another one.</span>
      <span class="note"><b>Note:</b> If you just tried it please wait a few minutes. We won't send you more than one email every few minutes to prevent spam.</span>
    </div>
    <!-- <div class="container" id="email"> -->
    <!--   <label for="master-input">Your email</label> -->
    <!--   <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submit" v-model="inputEmail" v-focus v-bind:class="{ wrong: notEmpty(inputEmail) && !isValidInputEmail() }"> -->
    <!-- </div> -->
    <router-link to="/login" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()">
      <button class="btn" tabindex="1">Login</button>
    </router-link>
    <!-- <button class="btn btn-sumit" id="btn-submit" @click="submit" :disabled="!canSubmit()">Send</button> -->
    <!-- <InfiniteLoading v-if="currentUser.isLoading()"></InfiniteLoading> -->
  </div>
  </div>

  <Footer />
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CurrentUser from './current_user.js'

export default {
  name: 'resend-confirmation',
  components: {
    Navbar,
    Footer,
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

.infinite-loading {
  margin-left: 3%;
  float: left;
}

#email {
  padding-bottom: 30px;
}

.note {
  display: block;
  margin-top: 20px;
  color: $font-color-faded;
  font-size: $font-sm;
}

</style>
