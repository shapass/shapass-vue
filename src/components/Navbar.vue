<template>
<div id="navbar" class="clearfix">
  <div id="navbar-content">
    <router-link to="/">
      <img src="logo.svg" id="logo" alt="Shapass" v-if="!currentUser || !currentUser.atLanding()" v-tooltip="{ content: 'You sha...pass!', delay: { show: 42000, hide: 100 }, placement: 'right' }" v-on:click="setAtLanding"/>
    </router-link>

    <div v-if="!showLoginSignup">
      <router-link to="/">
        <button class="btn" :disabled="loading" v-on:click="setAtLanding">&lt; back</button>
      </router-link>
    </div>

    <div v-if="showLoginSignup">
      <router-link to="/signup" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()">
        <button class="btn" :disabled="loading">Register</button>
      </router-link>
      <router-link to="/login" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()">
        <button class="btn" :disabled="loading">Login</button>
      </router-link>

      <button class="btn" v-on:click="logout" v-if="currentUser.isLoggedIn()" :disabled="loading">Logout</button>
      <label class="user-email" v-if="currentUser.isLoggedIn()">{{ currentUser.state.email }}</label>

      <router-link to="/">
        <button class="btn" :disabled="loading" v-if="!currentUser.atLanding() && !currentUser.atApp()" v-on:click="setAtLanding">&lt; back</button>
      </router-link>

      <InfiniteLoading v-if="loading"></InfiniteLoading>
    </div>
  </div>
</div>
</template>

<script>
import InfiniteLoading from './InfiniteLoading.vue'

export default {
  name: 'Navbar',
  components: {
    InfiniteLoading
  },
  props: {
    currentUser: Object,
    showLoginSignup: Boolean,
    loading: Boolean,
  },
  methods: {
    setAtLanding () {
      this.currentUser.setAtLanding();
    },
    logout () {
      this.$emit('logout', null);
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

  .infinite-loading {
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
