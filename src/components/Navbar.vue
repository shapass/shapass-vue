<template>
<div id="navbar" class="clearfix">
  <label class="user-email" v-if="currentUser.isLoggedIn()">{{ currentUser.state.email }}</label>
  <button class="btn" v-on:click="setInitialStep()" v-if="currentUser.isLoggingInOrSigningUp()">&lt; back</button>
  <button class="btn" v-on:click="setLoggingIn()" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()">Login</button>
  <button class="btn" v-on:click="setSigningUp()" v-if="!currentUser.isLoggingInOrSigningUp() && !currentUser.isLoggedIn()">Register</button>
  <button class="btn" v-on:click="logout" v-if="currentUser.isLoggedIn()">Logout</button>
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
  background: $navbar-bg-color;
  padding: 10px 20px;
  text-align: right;

  .btn {
    /* float: right; */
    margin-left: 15px;
  }

  .user-email {
    text-transform: none;
    font-size: $label-font-size + 2px;
  }
}
</style>
