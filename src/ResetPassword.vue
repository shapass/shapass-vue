<template>
<div id="reset-password" v-bind:class="{ mobile: this.$isMobile() }">
  <Navbar :currentUser="currentUser" :showLoginSignup="false" :loading="currentUser.isLoading()" />

  <div class="content-wrapper" v-if="!token">
    <div class="container" id="label">
      <h3>So you need a new password?</h3>
      <span>Enter your email below and we'll send you instructions to create a new password.</span>
    </div>
    <div class="container" id="email">
      <label class="typewriter" for="master-input">Your email</label>
      <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submitReset" v-model="inputEmail" v-focus v-bind:class="{ wrong: notEmpty(inputEmail) && !isValidInputEmail() }">
    </div>
    <div class="container">
      <button class="btn btn-reset-password" id="reset-password-submit" @click="submitReset" :disabled="!canSubmitReset()">Send</button>
      <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle>
    </div>
  </div>

  <div class="content-wrapper" v-if="token">
    <div class="container" id="label">
      <h3>Choose a new password</h3>
    </div>
    <div class="container" id="master">
      <PasswordVisibilityInput id="master-input" label="Your new password" v-on:keyup:enter="submitSet" v-model="master" v-focus :tabindex="1"></PasswordVisibilityInput>
    </div>
    <div class="container" id="master-confirmation">
      <label class="typewriter" for="master-input">Confirm your new password</label>
      <input id="master-confirmation-input" type="password" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submitSet" v-model="masterConfirmation" :class="{ 'wrong-live': master && !isConfirmationCorrect() }" tabindex="2">
    </div>
    <div class="container" id="generated">
      <GeneratedPassword label="Generated password:" :state="state"></GeneratedPassword>
    </div>
    <div class="container">
      <button class="btn btn-set-password" id="set-password-submit" @click="submitSet" :disabled="!canSubmitSet()" tabindex="3">Set password</button>
      <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle>
      <div class="help-links">
        <span>Need help?</span>
        <router-link to="/reset-password" tabindex="4">Request a new password reset e-mail</router-link>
      </div>
    </div>
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
  name: 'reset-password',
  components: {
    Navbar,
    InfiniteLoadingCircle,
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
    canSubmitReset() {
      return this.isValidInputEmail() && !this.currentUser.isLoading();
    },
    canSubmitSet() {
      return this.isConfirmationCorrect() && this.state.generated && !this.currentUser.isLoading();
    },
    submitReset () {
      if (this.canSubmitReset()) {
        this.withDisabledButton("#reset-password-submit", (done) => {
          this.currentUser.resetPassword(this.inputEmail, () => {
            // we show a success msg even if there was an error in the API
            // to prevent people from figuring our what emails are registered
            this.$router.push('/')
            this.$toasted.success('Check your email for instructions!');
            done();
          });
        });
      }
    },
    submitSet () {
      if (this.canSubmitSet()) {
        this.withDisabledButton("#set-password-submit", (done) => {
          this.currentUser.setPassword(this.inputEmail, this.token, this.state.generated, (r) => {
            if (r) {
              this.$router.push('/')
              this.$toasted.success('Password reset successfully!');
            } else {
              this.$router.push('/reset-password')
              this.$toasted.error('There was an error setting your password, please try again');
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
    setStateMaster () {
      if (this.isConfirmationCorrect()) {
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
    this.currentUser.setResettingPassword();
  },
  watch: {
    master () {
      this.setStateMaster();
    },
    masterConfirmation () {
      this.setStateMaster();
    },
  },
  beforeRouteLeave (to, from, next) {
    this.disableSavePassword(this.$el);
    next();
  },
}
</script>

<style scoped lang="scss">

span {
  font-family: $font-family-text;
  display: block;
}

button {
  float: left;
}

.loader {
  margin-left: 3%;
  float: left;
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
