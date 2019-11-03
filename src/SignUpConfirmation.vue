<template>
<div id="signup-confirmation" v-bind:class="{ mobile: this.$isMobile() }">
  <Navbar :currentUser="currentUser" :showLoginSignup="false" :loading="currentUser.isLoading()" />

  <div class="content-wrapper">
    <div class="container" id="label">
      <div v-if="!confirmed">
        <h3>Welcome, {{email}}</h3>
        <p>Your registration was successful! We sent a link to your email, please use it to <b>confirm your account</b>.</p>
        <p>You will only be able sign in after you confirm it, so do it now!</p>
      </div>
      <div v-if="confirmed">
        <div v-if="confirmed == 'true'">
          <h3>Welcome, {{email}}</h3>
          <p>Your registration was confirmed! Use the link below to sign in.</p>
          <router-link to="/login">
            <button class="btn" >Login</button>
          </router-link>
        </div>
        <div v-if="confirmed == 'false'">
          <p>The confirmationof your account failed <span v-if="code">(code: {{ code }}) </span>:(</p>
          <p>Please try again or contact us informing the error you got.</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import InfiniteLoadingCircle from './components/InfiniteLoadingCircle.vue'
import CurrentUser from './current_user.js'
import { Configs } from './config.js'

export default {
  name: 'signup-confirmation',
  components: {
    Navbar,
    InfiniteLoadingCircle
  },
  props: {
  },
  data () {
    return {
      currentUser: CurrentUser
    }
  },
  methods: {
  },
  computed: {
    email () {
      return this.$route.query.email;
    },
    confirmed () {
      return this.$route.query.confirmed;
    },
    code () {
      return this.$route.query.code;
    }
  },
  mounted () {
    this.currentUser.setAtOther();
  }
}
</script>

<style scoped lang="scss">

.content-wrapper {
  margin-top: 5%;
  text-align: center;
}

p {
  font-family: $font-family-text;
  display: block;
}

.btn {
  width: 50%;
  padding: 2% 5%;
  margin-top: 40px;
}

</style>
