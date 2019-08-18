<template>
<div id="navbar" class="clearfix">
  <div id="navbar-content">
    <div v-if="!showLoginSignup">
      <router-link to="/">
        <img src="logo.svg" id="logo" alt="ShaPass"/>
      </router-link>
      <router-link to="/">
        <button class="btn">&lt; back</button>
      </router-link>
    </div>

    <div v-if="showLoginSignup">
      <img v-on:click="goToLanding" src="logo.svg" id="logo" alt="ShaPass" v-if="!currentUser || !currentUser.atLanding()" v-tooltip="{ content: 'You sha...pass!', delay: { show: 42000, hide: 100 }, placement: 'right' }"/>

      <button class="btn" v-on:click="setAtLanding()" v-if="currentUser.isLoggingInOrSigningUp()" :disabled="currentUser.isLoading()">&lt; back</button>

      <router-link to="/signup" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()">
        <button class="btn" v-on:click="setSigningUp()" :disabled="currentUser.isLoading()">Register</button>
      </router-link>
      <button class="btn" v-on:click="setLoggingIn()" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()" :disabled="currentUser.isLoading()">Login</button>

      <button class="btn" v-on:click="logout" v-if="currentUser.isLoggedIn()" :disabled="currentUser.isLoading()">Logout</button>
      <label class="user-email" v-if="currentUser.isLoggedIn()">{{ currentUser.state.email }}</label>

      <InfiniteLoadingCircle v-if="currentUser.isLoading()"></InfiniteLoadingCircle>
    </div>
  </div>
</div>
</template>

<script>
import InfiniteLoadingCircle from './InfiniteLoadingCircle.vue'

export default {
  name: 'Navbar',
  components: {
    InfiniteLoadingCircle
  },
  props: {
    afterLogout: Function,
    currentUser: Object,
    showLoginSignup: Boolean
  },
  methods: {
    setAtLanding () {
      this.currentUser.setAtLanding();
    },
    setLoggingIn () {
      this.currentUser.setLoggingIn();
    },
    setSigningUp () {
      this.currentUser.setSigningUp();
    },
    logout () {
      this.currentUser.logout((r) => {
        this.afterLogout(r);
      });
    },
    goToLanding () {
      this.currentUser.setAtLanding();
    },
  }
}
</script>

<style lang="scss">
#navbar {
  background: $navbar-bg;
  border-bottom: $navbar-border-bottom;
  padding: 2px $content-side-padding;
  text-align: right;

  #navbar-content {
    max-width: $content-width;
    margin: 0 auto;
    @include clearfix;
  }

  .btn {
    /* float: right; */
    margin: 10px 0 10px 15px;
    /* display: inline; */
    float: right;
  }

  .user-email {
    text-transform: none;
    font-size: $label-font-size;
    float: right;
    margin: 16px 0 10px 15px;
  }

  .loader {
    margin: 10px 0 10px 15px;
    display: block;
    float: right;
  }
}

#logo {
  float: left;
  width: 40px;
  height: 40px;
  margin: 5px 0;
  cursor: pointer;
}
</style>
