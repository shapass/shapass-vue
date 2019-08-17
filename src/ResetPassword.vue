<template>
<div id="reset-password" v-bind:class="{ mobile: this.$isMobile() }">
  <Navbar :currentUser="currentUser" :showLoginSignup="false" />
  <div class="content-wrapper" v-if="!token">
    <div class="container" id="label">
      <h3>So you need a new password?</h3>
      <span>Enter your e-mail below and (if you're a subscriber) we'll send you an e-mail with instructions to create a new password.</span>
    </div>
    <div class="container" id="email">
      <label class="typewriter" for="master-input">Your email</label>
      <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submitReset" v-model="inputEmail" v-focus>
    </div>
    <button class="btn btn-reset-password" id="reset-password-submit" @click="submitReset" :disabled="!isValidEmail() || currentUser.isLoading()">Reset password</button>
    <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle>
  </div>

  <div class="content-wrapper" v-if="token">
    <div class="container" id="label">
      <h3>Choose a new password</h3>
    </div>
    <div class="container" id="email">
      <label class="typewriter" for="master-input">Your new master password</label>
      <input id="master-input" type="password" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submitSet" v-model="master" v-focus>
    </div>
    <div class="container" id="email">
      <label class="typewriter" for="master-input">Confirm your new master password</label>
      <input id="master-confirmation-input" type="password" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submitSet" v-model="masterConfirmation">
    </div>
    <div class="container" id="generated">
      <GeneratedPassword label="Generated password:" :state="state"></GeneratedPassword>
      <!-- <PasswordVisibilityToggle v-model="generatedPasswordVisible" /> -->
    </div>
    <button class="btn btn-set-password" id="set-password-submit" @click="submitSet" :disabled="!generated || currentUser.isLoading()">Set password</button>
    <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle>
  </div>
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import CurrentUser from './current_user.js'
import InfiniteLoadingCircle from './components/InfiniteLoadingCircle.vue'
// import PasswordVisibilityToggle from './components/PasswordVisibilityToggle.vue'
import GeneratedPassword from './components/GeneratedPassword.vue'
import Store from './store.js'
import { Configs } from './config.js'

export default {
  name: 'reset-password',
  components: {
    Navbar,
    InfiniteLoadingCircle,
    GeneratedPassword
  },
  data () {
    return {
      state: Store.state,
      inputEmail: null,
      currentUser: CurrentUser,
      generated: null,
      master: null,
      masterConfirmation: null
    }
  },
  methods: {
    submitReset () {
      this.withDisabledButton("#reset-password-submit", (done) => {
        this.currentUser.resetPassword(this.inputEmail, () => {
          // we show a success msg even if there was an error in the API
          // to prevent people from figuring our what emails are registered
          this.$router.push('/')
          this.$toasted.success('Check you e-mail for instructions!');
          done();
        });
      });
    },
    submitSet () {
      // this.withDisabledButton("#reset-password-submit", (done) => {
      //   this.currentUser.resetPassword(this.inputEmail, () => {
      //     // we show a success msg even if there was an error in the API
      //     // to prevent people from figuring our what emails are registered
      //     this.$router.push('/')
      //     this.$toasted.success('Check you e-mail for instructions!');
      //     done();
      //   });
      // });
    },
    isValidEmail () {
      // see https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      return re.test(this.inputEmail);
    },
    setStateMaster () {
      if (this.notEmpty(this.master) && this.notEmpty(this.masterConfirmation) && this.master === this.masterConfirmation) {
        this.state.master = this.master;
      } else {
        this.state.master = null;
      }
    }
  },
  computed: {
    token () {
      return this.$route.query.t;
    }
  },
  mounted () {
    this.state.service = Configs.SHAPASS_SERVICE;
  },
  watch: {
    master (val, prev) {
      this.setStateMaster();
    },
    masterConfirmation (val, prev) {
      this.setStateMaster();
    },
  }
}
</script>

<style scoped lang="scss">

.content-wrapper {
  margin-top: 5%;
}

span {
  font-family: $font-family-text;
  /* font-size: $font-md; */
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
