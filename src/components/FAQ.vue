<template>
<div id="faq" v-bind:class="{ mobile: this.$isMobile() }">
  <h1>FAQ</h1>
  <ul>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">What is Shapass?</h3>
      <div data-collapse-content>
        <p>Shapass is a password generator, an application similar to a <a href="https://en.wikipedia.org/wiki/Password_manager" target="_blank">password manager</a> that helps you generate complex (an thus safer) passwords without having to remember them all.</p>
        <p>We help you generate passwords that are <b>long and difficult to guess</b> for all services and websites you use, all based on a <b>single master password</b> (or more than one if you want to) that is only in your head (we don't know it and the other services you use won't know it as well).</p>
        <p>The main differences from other password managers is that Shapass <b>does not store your passwords</b> and that it is based on an <b>open free algorithm</b> to generate passwords. This algorithm is based on a <a href="https://en.m.wikipedia.org/wiki/Secure_Hash_Algorithms" target="_blank">SHA</a> function (hence the name "Shapass"). See the questions below for more technical details.</p>
        <p>It should also be clear that you don't have to trust us on this: you can verify with your browser the information we have access to. You can even build your own Shapass generator if you want to!</p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">Why should I use Shapass?</h3>
      <div data-collapse-content>
        <ul>
          <li>You need to remember a single master password but you get a unique complex password for each website/service you use.</li>
          <li>If a service leaks their passwords, it won't compromise all other services you use, since you have a password for each website.</li>
          <li>We generate complex passwords that would be a pain to do so manually.</li>
          <li>We don't store your passwords nor the information of the services you use.</li>
          <li>You don't have to trust us on this, you can verify in your browser what we have access to.</li>
          <li>It's based on an open algorithm, so you are not forever depending on us. We're here to help, not lock you up on our service.</li>
          <li>It's simple and we'll keep it this way. We won't offer you dozens of plans, options to choose from, complicated stuff you don't want nor need.</li>
          <li>We use it, we built it for ourselves and we'll continually make it better.</li>
        </ul>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">How are paswords generated?</h3>
      <div data-collapse-content>
        <p>You select an identifier (the name of the service, for example) and type a master password; we get them both and run through a function that will transform it into a random set of characters, that will be your generated password.</p>
        <p>As an example, let's pretend your identifier is "twitter" and your master password is "bananabread". This is what happens:</p>
        <p>
        <blockquote>
        <kbd>shapass(twitterbananabread)</kbd> = <kbd>jarSzI8XV4UhEi443jRTYL3pPSoxPVmg</kbd>
        </blockquote>
        </p>
        <p>The <kbd>shapass()</kbd> function applies a <a href="https://en.wikipedia.org/wiki/SHA-2" target="_blank">SHA256</a> function to the input and then converts the output to <a href="https://en.wikipedia.org/wiki/Base64" target="_blank">Base64</a>. With the default configurations the generated password will have 32 characters. There are a few more technical details on how this is done, we will write about it in the future.</p>
        <p>The way SHA functions work makes it virtually impossible to find out the inputs by having only the output, so no one will ever be able to guess your master password even if your generated password is leaked by some website. Not even by having both the output and the identifier you used.</p>
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
        <ul>
          <li>Your email;</li>
          <li>Your login password (which is a Shapass'd version of the password you used when registering);</li>
          <li>A cryptographed version of the configurations you saved (the name of the services and their configurations, including length, suffix, and others). It's cryptographed, we can't read any of it, we won't know which services you use.</li>
        </ul>
        <p>So, if you think about it, the only thing we really know is your email. Even the login password is not something you will use on other websites.</p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">Can I use Shapass without creating an account?</h3>
      <div data-collapse-content>
        <p><b>Yes</b>. Just type the name of a service, the master password and you'll see the generated password.</p>
        <p>Having an account helps you remember the identifiers you used for your services and also their configurations. Some websites require a password with a limited length, some websites require that you add numbers to your password, others require numeric passwords only. Signing in and saving your configurations will help you not have to remember all that. Just pick the service in a list, type your master password and that's it.</p>
        <p>But it's completely optional. You could simply take notes of all your configurations in a napkin if that suits you.</p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">Should I use just one master password or can I use multiple?</h3>
      <div data-collapse-content>
        <p>That's up to you. Some people like to have a single, very strong master password. Others like to have more than one. Just make sure that you will pick the strongest master passwords you can and that you will not use them directly in any service, use them only to generate Shapass passwords.</p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">What happens if Shapass is offline (or goes offline forever)?</h3>
      <div data-collapse-content>
        <p>Since the algorithm we use is open, people could always build their own tools to replicate what we do here.</p>
        <p>We, of course, don't intend on being offline, but we have a list of things in line to help you deal with it if it happens:</p>
        <ul>
          <li>You can export your configurations so you won't lose them (coming soon).</li>
          <li>We'll provide libraries and other offline applications (possibly a mobile app) that you can use if the website is out (coming soon).</li>
          <li>We'll write articles describing in details how passwords are generated, so you (or someone else) can replicate it.</li>
        </ul>
        <p>We don't want you locked up on our service. We want Shapass to help you and want you to use it because it does so.</p>
      </div>
    </li>

    <li data-collapse class="collapsed">
      <h3 data-collapse-toggle v-on:click="collapse">How can I contact you?</h3>
      <div data-collapse-content>
        <ul>
          <li>Send us a message on Twitter <a href="https://twitter.com/shapassed" target="_blank">@shapassed</a>; or</li>
          <li>Send an email to <a href="mailto:contact@shapass.com">contact@shapass.com</a>.</li>
        </ul>
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

  blockquote {
    text-align: left;
    margin: 0;
    padding: 10px;
    line-height: 2em;
  }

}

</style>
