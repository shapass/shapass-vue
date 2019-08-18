<template>
<div class="password-visibility-input">
  <label>{{ label }}</label>
  <input :type="inputType" spellcheck="false" autocomplete="off" v-model="internalValue" v-on:keyup.enter="onEnter" :placeholder="placeholder">
  <PasswordVisibilityToggle v-model="isVisible" />
</div>
</template>

<script>
import PasswordVisibilityToggle from './PasswordVisibilityToggle.vue'

export default {
  name: 'PasswordVisibilityInput',
  props: {
    value: String,
    label: String,
    placeholder: String,
  },
  components: {
    PasswordVisibilityToggle
  },
  methods: {
    onEnter: function() {
      this.$emit('keyup:enter', null);
    }
  },
  data () {
    return {
      internalValue: null,
      inputType: "password",
      isVisible: false
    }
  },
  mounted () {
    this.isVisible = false;
  },
  watch: {
    value (val) {
      this.internalValue = val;
    },
    internalValue () {
      this.$emit('input', this.internalValue)
    },
    isVisible (val, prev) {
      if (val !== prev) {
        this.inputType = this.isVisible ? "text" : "password";
      }
    },
  }
}
</script>

<style lang="scss">
.password-visibility-input {
  input {
    margin-top: 5px;
    padding-right: 45px;
    padding-left: 10px;
    width: calc(100% - 55px);
  }

  .password-visibility-toggle {
    position: absolute;
    right: 10px;
    top: 1.95em; // based on how font-size is calculated
  }
}
</style>
