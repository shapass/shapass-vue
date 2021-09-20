<template>
<div class="password-visibility-input">
  <label>{{ label }}</label>

  <input :type="inputType" :name="inputName" spellcheck="false" autocomplete="new-password" inputmode="verbatim" autocapitalize="none" autocorrect="none" v-model="internalValue" v-on:keyup.enter="onEnter" v-on:keyup.esc="onEsc" :placeholder="placeholder" :tabindex="tabindex != -9 ? tabindex : ''">
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
    tabindex: {
      type: Number,
      default: -9
    },
    inputName: String,
  },
  components: {
    PasswordVisibilityToggle
  },
  methods: {
    onEnter: function() {
      this.$emit('keyup:enter', null);
    },
    onEsc: function() {
      this.internalValue = null;
      this.$emit('keyup:esc', null);
    },
  },
  data () {
    return {
      internalValue: null,
      inputType: "password",
      inputName: "",
      isVisible: false,
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
  position: relative;

  input {
    margin-top: 5px;
    padding-right: 45px;
    padding-left: 10px;
    width: calc(100% - 55px);

  }

  .password-visibility-toggle {
    position: absolute;
    right: 10px;
    top: 2.0em; // based on how font-size is calculated
  }
}
</style>
