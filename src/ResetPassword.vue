<template>
<div id="reset-password" v-bind:class="{ mobile: this.$isMobile() }">
  <!-- <Navbar /> -->
  <Navbar :currentUser="currentUser" :showLoginSignup="false" />
  <div class="content-wrapper">
    <div class="container" id="label">
      <h3>So you need a new password?</h3>
      <span>Enter your e-mail below and (if you're a subscriber) we'll send you an e-mail with instructions to create a new password.</span>
    </div>
    <div class="container" id="email">
      <label class="typewriter" for="master-input">Your email</label>
      <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submit" v-model="inputEmail" v-focus>
    </div>
      <button class="btn btn-reset-password" id="reset-password-submit" @click="submit" :disabled="!isValidEmail() || currentUser.isLoading()">Reset password</button>
      <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle>
  </div>
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import { Configs } from './config.js'
import CurrentUser from './current_user.js'
import InfiniteLoadingCircle from './components/InfiniteLoadingCircle.vue'

export default {
  name: 'reset-password',
  components: {
    Navbar,
    InfiniteLoadingCircle
  },
  data () {
    return {
      inputEmail: null,
      currentUser: CurrentUser
    }
  },
  methods: {
    submit () {
      this.withDisabledButton("#reset-password-submit", (done) => {
        this.currentUser.resetPassword(this.inputEmail, (r) => {
          // we show a success msg even if there was an error in the API
          // to prevent people from figuring our what emails are registered
          this.$router.push('/')
          this.$toasted.success('Check you e-mail for instructions!');
          done();
        });
      });
    },
    isValidEmail () {
      // see https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      return re.test(this.inputEmail);
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss">

.content-wrapper {
  margin-top: 5%;
}

h3 {
  text-align: center;
}

span {
  font-family: $font-family-aux;
  /* font-size: $font-md; */
  text-align: center;
  display: block;
}

button {
  float: left;
}

.loader {
  margin-left: 3%;
  float: left;
}

</style>
