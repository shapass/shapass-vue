<template>
<div id="navbar" class="clearfix">
  <label class="user-email" v-if="user">{{ user }}</label>
  <button class="btn" v-on:click="setStep()" v-if="this.step != null && user == null">< back</button>
  <button class="btn" v-on:click="setStep('Login')" v-if="this.step == null && user == null">Login</button>
  <button class="btn" v-on:click="setStep('Register')" v-if="this.step == null && user == null">Register</button>
  <button class="btn" v-on:click="logout" v-if="this.step == null && user != null">Logout</button>
</div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    stepChanged: Function,
    currentUser: String
  },
  methods: {
    setStep (v) {
      this.step = v;
      this.stepChanged(v);
    },
    logout () {
      this.apiLogout((r) => {
        if (r) {
          this.currentUser = null;
          this.$toasted.success('Bye!');
        } else {
          this.$toasted.error('Something went wrong :(');
        }
      });
    },
  },
  watch: {
    currentUser (v) {
      this.user = v;
      if (this.user !== null) {
        this.setStep(null);
      }
    }
  },
  data () {
    return {
      step: null,
      user: null
    }
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
