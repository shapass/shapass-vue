<template>
<div id="navbar" class="clearfix">
  <button class="btn" v-on:click="setStep()" v-if="this.step != null">< back</button>
  <button class="btn" v-on:click="setStep('Register')" v-if="this.step == null">Register</button>
  <button class="btn" v-on:click="setStep('Login')" v-if="this.step == null">Login</button>
</div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    stepChanged: Function
  },
  methods: {
    setStep (v) {
      this.step = v;
      this.stepChanged(v);
    }
  },
  data () {
    return {
      step: null
    }
  }
}
</script>

<style lang="scss">
#navbar {
  background: $navbar-bg-color;
  padding: 10px 20px;

  .btn {
    float: right;
    margin-left: 15px;
  }
}
</style>


