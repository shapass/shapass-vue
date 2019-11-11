<template>
<div id="faq" v-bind:class="{ mobile: this.$isMobile() }">
  <h1>FAQ</h1>
  <ul>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">What is Shapass?</h3>
      <div data-collapse-content>
        <p>Shapass is a password generator, an application similar to a password manager that helps you generate safe passwords without having to remember them all.</p>
        <p>We help you generate passwords that are <b>long and difficult to guess</b> for all services and websites you use, all based on a <b>single master password</b> (or more than one if you want to) that is only in your head (we don't know it and the other services you use won't know it as well).</p>
        <p>The main differences from other password managers is that Shapass <b>does not store your passwords</b> and is based on an <b>open free algorithm</b> to generate passwords. This algorithm is based on a <a href="https://en.m.wikipedia.org/wiki/Secure_Hash_Algorithms" target="_blank">SHA</a> function (hence the name "Shapass"). See the questions below for more technical details.</p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">How are paswords generated?</h3>
      <div data-collapse-content>
        <p></p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">Are my passwords safe from being leaked?</h3>
      <div data-collapse-content>
        <p>Yes. <b>We do not save your passwords</b>, so they cannot be leaked.</p>
        <p>Your master password is known only by you. When you enter it in our website it is never sent to the server, it's only used inside your web browser to calculate the generated password for a service you selected. The generated passwords are also never sent to our servers, so we will never know them.</p>
        <p>However, your passwords could be leaked if your computer is compromised with some kind of key logger or virus that can read your inputs, clipboard and/or browser information. It is your responsibility to make sure this doesn't happen. (By the way, all password managers would be affected in this case.)</p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">What is stored in your servers?</h3>
      <div data-collapse-content>
        <p></p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">Can I use Shapass without creating an account?</h3>
      <div data-collapse-content>
        <p></p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">Should I use just one master password or can I use multiple?</h3>
      <div data-collapse-content>
        <p></p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">What happens if Shapass is offline (or goes offline forever)?</h3>
      <div data-collapse-content>
        <p></p>
      </div>
    </li>
</ul>
</div>
</template>

<script>
export default {
  name: 'faq',
  methods: {
    collapse: function(event) {
      var parent = event.target.parentElement;
      parent.classList.toggle('collapsed');
    }
  },
}
</script>

<style scoped lang="scss">
#faq {
  font-size: $font-md-sm;
  text-align: justify;

  h1 {
    margin-bottom: 40px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
  }

  li {
    margin-bottom: 0px;
    position: relative;
    padding-left: 20px;

    h3 {
      color: $font-color-highlight;
      transition: $transition-default;
    }

    [data-collapse-toggle] {
      cursor: pointer;
    }

    [data-collapse-content] {
      transition: max-height 1s cubic-bezier(0.1,0.5,1,1);
      max-height: 1000px; // so the transition works
      overflow: hidden;
    }

    &::before {
      content: '-';
      position: absolute;
      left: 0;
      top: 3px;
      color: $primary;
      font-weight: $font-weight-bold;
    }

    &.collapsed {
      [data-collapse-content] {
        max-height: 0;
        transition: max-height 0.5s cubic-bezier(0.1,0.5,1,1);
      }

      h3 {
        color: $font-color;
        &:hover, &:focus {
          color: $font-color-highlight;
        }
      }

      &::before {
        content: '+';
      }
    }
  }
}

</style>
