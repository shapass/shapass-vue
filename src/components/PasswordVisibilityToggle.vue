<template>
  <div class="password-visibility-toggle">
    <button class="btn btn-ico" v-if="!visible" @click="toggleVisibility" tabindex="-1">
      <div class="countdown">
        <font-awesome-icon icon="eye-slash" />
        <div class="l-half"></div>
        <div class="r-half"></div>
      </div>
    </button>
    <button class="btn btn-ico active" v-if="visible" @click="toggleVisibility" tabindex="-1">
      <div class="countdown active">
        <font-awesome-icon icon="eye" />
        <div class="l-half"></div>
        <div class="r-half"></div>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'PasswordVisibilityToggle',
  props: {
    timeout: Number,
    value: Boolean,
  },
  methods: {
    toggleVisibility: function() {
      this.visible = !this.visible;
      this.afterToggleVisibility();
    },
    afterToggleVisibility: function() {
      if (this.visible) {
        clearTimeout(this.timeoutInstance);
        this.timeoutInstance = setTimeout(() => {
          this.visible = false;
        }, this.timeout);
      } else {
        clearTimeout(this.timeoutInstance);
      }
    }
  },
  data () {
    return {
      visible: false,
      timeoutInstance: null,
    }
  },
  watch: {
    visible: function(val, prev) {
      if (val != prev) {
        this.afterToggleVisibility();
      }
      this.$emit('input', val)
    },
    value: function(val) {
      this.visible = val;
    }
  },
  mounted () {
    this.visible = false;
  }
}
</script>

<style scoped lang="scss">

$s: 30px; // width & height of the overall element
$w: 2;    // line width in px
$t: 8;    // timeout in s

.btn.btn-ico {
  .svg-inline--fa {
    padding: 0;
  }
}

.countdown {
  width: $s;
  height: $s;
  position: relative;
  border-radius: 999px;
  /* box-shadow: inset 0 0 0 $w+px rgba(255,255,255,0.1); /* to add a background bar */
  text-align: center;

  svg, .svg-inline--fa {
    position: absolute;
    padding: 0;
    margin: auto auto;
    left: 0;
    right: 0;
    top: 7px;
    font-size: $btn-font-size;
    /* font-size: 14px; */
    z-index: 2;
  }

  .l-half, .r-half {
    float: left;
    width: 50%;
    height: 100%;
    overflow: hidden;

    &:before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: $w+px solid $primary;
      -webkit-animation-duration: $t+s;
      -webkit-animation-iteration-count: 1;
      -webkit-animation-timing-function: linear;
      -webkit-animation-fill-mode: forwards;
    }

  }
  .l-half:before {
    display: none;
    border-right: none;
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
  }

  .r-half:before {
    display: none;
    border-left: none;
    border-top-right-radius: 999px;
    border-bottom-right-radius: 999px;
  }

  &.active {
    .l-half:before {
      display: block;
      -webkit-transform-origin: center right;
      -webkit-animation-name: l-rotate;
    }

    .r-half:before {
      display: block;
      -webkit-transform-origin: center left;
      -webkit-animation-name: r-rotate;
    }
  }
}

@-webkit-keyframes l-rotate {
  0% { -webkit-transform: rotate(0deg); }
  50% { -webkit-transform: rotate(-180deg); }
  100% { -webkit-transform: rotate(-180deg); }
}

@-webkit-keyframes r-rotate {
  0% { -webkit-transform: rotate(0deg); }
  50% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(-180deg); }
}

@-webkit-keyframes fadeout {
  0% { opacity: 1; }
  100% { opacity: 0.5; }
}
</style>
