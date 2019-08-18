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
      <input id="email-input" type="email" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submitReset" v-model="inputEmail" v-focus v-bind:class="{ wrong: notEmpty(inputEmail) && !isValidInputEmail() }">
    </div>
    <button class="btn btn-reset-password" id="reset-password-submit" @click="submitReset" :disabled="!canSubmitReset()">Reset password</button>
    <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle>
  </div>

  <div class="content-wrapper" v-if="token">
    <div class="container" id="label">
      <h3>Choose a new password</h3>
    </div>
    <div class="container" id="master">
      <PasswordVisibilityInput id="master-input" label="Your new master password" v-on:keyup:enter="submitSet" v-model="master" v-focus></PasswordVisibilityInput>
    </div>
    <div class="container" id="master-confirmation">
      <label class="typewriter" for="master-input">Confirm your new master password</label>
      <input id="master-confirmation-input" type="password" spellcheck="false" placeholder="" autocomplete="off" v-on:keyup.enter="submitSet" v-model="masterConfirmation" :class="{ 'wrong-live': masterConfirmation && !isConfirmationCorrect() }">
    </div>
    <div class="container" id="generated">
      <GeneratedPassword label="Generated password:" :state="state"></GeneratedPassword>
    </div>
    <button class="btn btn-set-password" id="set-password-submit" @click="submitSet" :disabled="!canSubmitSet()">Set password</button>
    <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle>
    <router-link to="/reset-password">Request a new password reset e-mail</router-link>
  </div>
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import CurrentUser from './current_user.js'
import InfiniteLoadingCircle from './components/InfiniteLoadingCircle.vue'
import PasswordVisibilityInput from './components/PasswordVisibilityInput.vue'
import GeneratedPassword from './components/GeneratedPassword.vue'
import Store from './store.js'
import { Configs } from './config.js'

export default {
  name: 'reset-password',
  components: {
    Navbar,
    InfiniteLoadingCircle,
    PasswordVisibilityInput,
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
            this.$toasted.success('Check you e-mail for instructions!');
            done();
          });
        });
      }
    },
    submitSet () {
      if (this.canSubmitSet()) {
        this.withDisabledButton("#set-password-submit", (done) => {
          this.currentUser.setPassword(this.inputEmail, this.token, this.state.master, (r) => {
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
    token () {
      return this.$route.query.t;
    }
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

a {
  float: right;
  font-size: $font-sm;
  margin-top: 5px;
}

</style>
