<template>
<div id="navbar" class="clearfix">
  <div id="navbar-content">
    <a href="/"><img src="logo.svg" id="logo" alt="ShaPass" /></a>
    <label class="user-email" v-if="currentUser.isLoggedIn()">{{ currentUser.state.email }}</label>
    <button class="btn" v-on:click="setInitialStep()" v-if="currentUser.isLoggingInOrSigningUp()">&lt; back</button>
    <button class="btn" v-on:click="setLoggingIn()" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()">Login</button>
    <button class="btn" v-on:click="setSigningUp()" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()">Register</button>
    <button class="btn" v-on:click="logout" v-if="currentUser.isLoggedIn()">Logout</button>
  </div>
</div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    afterLogout: Function,
    currentUser: Object
  },
  methods: {
    setInitialStep () {
      this.currentUser.setInitialStep();
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
  }

  .btn {
    /* float: right; */
    margin: 10px 0 10px 15px;
  }

  .user-email {
    text-transform: none;
    font-size: $label-font-size + 2px;
  }
}

#logo {
  float: left;
  width: 40px;
  height: 40px;
  margin: 5px 0;
}
</style>
