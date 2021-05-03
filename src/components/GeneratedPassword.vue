<template>
<div class="generated-password" v-if="state.generated">
  <label>{{ label }}</label>
  <div class="generated-input" v-if="generatedToDisplay" :class="{ highlighted: this.highlighted }">
    <div v-if="!generatedPasswordVisible">
      <transition-group name="list-complete" tag="span">
        <span
          v-for="(item, key, index) in generatedToDisplayA"
          v-bind:key="key"
          class="list-complete-item censored"
        >
          {{ item }}
        </span>
      </transition-group>
      <span>{{ this.state.suffix }}</span>
    </div>
    <span v-if="generatedPasswordVisible">{{ generatedToDisplay }}</span>
  </div>
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
    bus: {
      type: Object,
      default: null
    },
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
    let result = null;
      this.state.generated = val;
      if (val !== null) {
        let toMask = val;
        if (this.state.suffix !== null) {
          toMask = toMask.substring(0, toMask.length - this.state.suffix.length);
        }
        let masked = this.applyMask(toMask, this.maskSet, this.generatedCensored);
        this.generatedCensored = masked;
      } else {
        this.generatedCensored = null;
      }

      if (this.generatedPasswordVisible) {
        this.generatedToDisplay = this.state.generated;
      } else {
        this.generatedToDisplay = this.generatedCensored;
      }

      if (this.generatedToDisplay !== null) {
        result = {}
        for (var i = 0; i < this.generatedToDisplay.length; i++) {
          let char = this.generatedToDisplay[i];
          result[`${i}-${char}`] = char;
        }
        this.generatedToDisplayA = result;
      }

      this.$emit('input', this.state.generated);
    },
    isValueSet: function(v) {
      return this.notEmpty(v);
    },
    highlight: function() {
      this.highlighted = true;
      setTimeout(() => {
        this.highlighted = false;
      }, 300);
    }
  },
  data () {
    return {
      generatedCensored: null,
      generatedToDisplay: null,
      generatedToDisplayA: [],
      generatedPasswordVisible: false,
      maskSet: this.randomMaskSet(),
      highlighted: false,
    }
  },
  mounted () {
    this.generatePassword();
    if (this.bus !== null) {
      this.bus.$on('copied-to-clipboard', (e) => {
        this.highlight();
      });
    }
  },
  watch: {
    "state.service" (val, prev) {
      if (val !== prev) { this.generatePassword(); }
    },
    "state.master" (val, prev) {
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
    color: $generated-input-color;
    border: 1px solid $generated-input-bg;
    border-radius: $generated-input-border-radius;
    padding-top: 8px;
    padding-bottom: 9px;
    font-family: $font-family-titles;

    .censored {
      color: $generated-input-censored-color;
      font-family: monospace;
      font-size: $font-md-sm;
    }

    transition: border-color 0.5s;
    &.highlighted {
      border-color: $primary;
      .censored {
        color: $primary;
      }
    }
  }

  .password-visibility-toggle {
    position: absolute;
    right: 10px;
    top: 2.0em; // based on how font-size is calculated
  }
}

.list-complete-item {
  transition: all 0.5s;
  display: inline-block;
  margin-right: 2px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(15px);
}
.list-complete-leave-active {
  position: absolute;
}

</style>
