<template>
<div id="signup-pending" v-bind:class="{ mobile: this.$isMobile() }">
  <Navbar :currentUser="currentUser" :showLoginSignup="false" />

  <div class="content-wrapper">
    <div class="container" id="label">
      <h3>Welcome, {{email}}</h3>
      <p>Your registration was successful! We sent a link to your email that you should use to <b>confirm your account</b>.</p>
      <p>You will only be able login after you confirm it, so do it now!</p>
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
  name: 'signup-pending',
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
    }
  },
}
</script>

<style scoped lang="scss">

.content-wrapper {
  margin-top: 5%;
}

p {
  font-family: $font-family-text;
  display: block;
}

</style>
