<template>
<div id="navbar" class="clearfix">
  <label class="user-email" v-if="currentUser.isSignedIn()">{{ currentUser.state.email }}</label>
  <button class="btn" v-on:click="setStep()" v-if="currentUser.isSigningInOrRegistering()">< back</button>
  <button class="btn" v-on:click="setStep('Login')" v-if="!currentUser.isSigningInOrRegistering() && !currentUser.isSignedIn()">Login</button>
  <button class="btn" v-on:click="setStep('Register')" v-if="!currentUser.isSigningInOrRegistering() && !currentUser.isSignedIn()">Register</button>
  <button class="btn" v-on:click="logout" v-if="currentUser.isSignedIn()">Logout</button>
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
    setStep (v) {
      this.currentUser.setStep(v);
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
