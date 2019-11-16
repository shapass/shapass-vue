<template>
<div id="welcome" v-bind:class="{ mobile: this.$isMobile() }" class="site-wrapper">
  <Navbar :currentUser="currentUser" :showLoginSignup="false" :loading="currentUser.isLoading()" />

  <div id="content">

  <div class="content-wrapper">
    <div class="container" id="label">
      <h3>Welcome!</h3>
      <p>Hi there, it's really nice to have you using Shapass :)</p>
      <p>Before you start, there is a small list of <em>extremely important</em> things you need to know:</p>
      <ul>
        <li>
          All the data we store in our servers is cryptographed in your browser using your login password. This is great for you because we don't have access to your information. However, if you forget your password we won't be able to recover your data. So do not forget it! It can help if you:
          <span class="note">Write it down in a piece of paper and put it in a safe place.</span>
          <span class="note">Don't use it as your master password.</span>
        </li>
        <li>We use a cookie to keep you logged in. By using the service we assume you are ok with it.</li>
      </ul>
      <p>That's all! We hope you enjoy Shapass.</p>
    </div>
    <router-link to="/">
      <button class="btn" tabindex="1">Get started!</button>
    </router-link>
  </div>
  </div>

  <Footer />
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CurrentUser from './current_user.js'

export default {
  name: 'welcome',
  components: {
    Navbar,
    Footer,
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
  mounted () {
    this.currentUser.setAtOther();
  },
}
</script>

<style scoped lang="scss">

em {
  color: $font-color-highlight;
  font-style: normal;
  font-weight: $font-weight-bold;
  text-transform: uppercase;
  font-size: $font-md-sm;
}

li {
  margin-bottom: 20px;
}

.note {
  display: block;
  margin-top: 5px;
  margin-left: 20px;
  font-size: $font-md-sm;
  position: relative;
  padding-left: 20px;

  &:first-child {
    margin-top: 15px;
  }

  &::before {
    content: '-';
    position: absolute;
    top: 0;
    left: 0;
  }
}

</style>
