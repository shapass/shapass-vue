<template>
<div class="generated-password" v-if="state.generated">
  <label class="typewriter">{{ label }}</label>
  <div class="generated-input" v-html="generatedToDisplay"></div>
  <PasswordVisibilityToggle v-model="generatedPasswordVisible" />
</div>
</template>

<script>
import PasswordVisibilityToggle from './PasswordVisibilityToggle.vue'

export default {
  name: 'GeneratedPassword',
  props: {
    label: String,
    state: Object,
    onlyIfMasterSet: {
      type: Boolean,
      default: false
    }
  },
  components: {
    PasswordVisibilityToggle
  },
  methods: {
    generatePassword: function() {
      if (this.notEmpty(this.state.service) &&
          (!this.onlyIfMasterSet || this.notEmpty(this.state.master))) {
        var input = this.state.service;
        if (this.state.master !== null) {
          input = `${input}${this.state.master}`;
        }
        var pass = this.shapass(input, this.state.algorithm, this.state.outputLength);
        if (this.state.suffix !== null) {
          pass = `${pass}${this.state.suffix.trim()}`;
        }
        this.setGeneratedPassword(pass);
      } else {
        this.setGeneratedPassword(null);
      }
    },
    setGeneratedPassword (val) {
      this.state.generated = val;
      if (this.state.generated !== null) {
        let maskHtml = `<span class="censored">${this.mask}</span>`;
        this.generatedCensored = this.applyMask(this.state.generated, maskHtml, this.state.suffix);
      } else {
        this.generatedCensored = null;
      }
      if (this.generatedPasswordVisible) {
        this.generatedToDisplay = this.state.generated;
      } else {
        this.generatedToDisplay = this.generatedCensored;
      }
      this.$emit('input', this.state.generated);
    },
    isValueSet: function(v) {
      return this.notEmpty(v);
    }
  },
  data () {
    return {
      generatedCensored: null,
      generatedToDisplay: null,
      generatedPasswordVisible: false,
      mask: this.randomMask(),
    }
  },
  mounted () {
    this.generatePassword();
  },
  watch: {
    "state.service" (val, prev) {
      if (val !== prev) { this.generatePassword(); }
    },
    "state.master" (val, prev) {
      console.log("changed master");
      if (val !== prev) { this.generatePassword(); }
    },
    "state.suffix" (val, prev) {
      if (val !== prev) { this.generatePassword(); }
    },
    "state.outputLength" (val, prev) {
      if (val !== prev) { this.generatePassword(); }
    },
    "state.algorithm" (val, prev) {
      if (val !== prev) { this.generatePassword(); }
    },
    generatedPasswordVisible () {
      this.setGeneratedPassword(this.state.generated);
    },
  }
}
</script>

<style lang="scss">
.generated-password {
  position: relative;

  > input, .generated-input {
    margin-top: 5px;
    padding-right: 45px;
    padding-left: 10px;
    width: calc(100% - 55px);
  }

  .generated-input {
    word-break: break-all;
    background: $generated-input-bg;
    border: $generated-input-border;
    color: $generated-input-color;
    border: 1px solid $background-highlight;
    padding-top: 5px;
    padding-bottom: 5px;
    font-family: $font-family-titles;

    .censored {
      color: $generated-input-censored-color;
    }
  }

  .password-visibility-toggle {
    position: absolute;
    right: 10px;
    top: 1.95em; // based on how font-size is calculated
  }
}
</style>
