<template>
  <div class="service-selector">
    <label class="typewriter" v-if="!asButton">What is this password for?</label>
    <v-select v-model="service" taggable selectOnTab filterable :clearable="false" :placeholder="asButton ? 'Get started' : 'Search or enter a new one...'" :options="services" label="name" v-on:input="onSelectChange" v-on:search:focus="onFocus" v-on:search:blur="onBlur" autocomplete="off" v-bind:class="{ selected: this.service !== null, 'as-button': asButton }" transition="slide" :disabled="disabled">
      <!-- <v-slot name="no-options">Sorry! no matching options.</v-slot> -->
      <!-- <v-slot name="spinner"> -->
      <!--   <div class="spinner">Loading...</div> -->
      <!-- </v-slot> -->
    </v-select>
  </div>
</template>

<script>
export default {
  name: 'ServiceSelector',
  props: {
    value: String,
    services: Array,
    currentUser: Object,
    disabled: Boolean,
    asButton: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    onSelectChange: function(v) {
      this.$emit('input', v)
    },
    onFocus: function() {
      this.service = null;
      this.currentUser.state.step = null; // TODO
      this.$emit('input', null)
    },
    onBlur: function() {
    }
  },
  data () {
    return {
      service: null
    }
  },
  mounted () {
    this.service = null;
  },
  watch: {
    value: function(val) {
      this.service = val;
    }
  }
}
</script>

<style lang="scss">
.v-select {
  clear: both;
  margin-top: 10px;

  border: 1px solid $background-highlight;
  /* padding: 5px 10px; */
  width: 100%;

  input::placeholder {
    color: $placeholder-color;
    /* font-size: 18px; */
  }

  .vs__search {
    /* width: auto; */
    transition: background 0.1s linear;
    /* display: none; */
  }
  &.vs--open .vs__search {
    display: inline;
  }

  // the arrow
  .vs__actions {
    display: none;
  }

  .vs__dropdown-toggle {
    border-color: transparent;
    transition: border 0.1s linear;
    border-bottom: 0;
  }
  &.vs--open .vs__dropdown-toggle {
    border-color: $vs-border-color;
    background: $vs-dropdown-bg;
    border-bottom: 0;
  }

  &.vs--single .vs__selected {
    background: $vs-selected-background;
    color: $vs-selected-color;
    /* width: 100%; */
    border: $vs-selected-border;
    padding: 2px 10px;
  }
  .vs__selected {
    /* width: 50%; */
  }
  &.vs--open .vs__selected {
    background: none;
    /* color: $vs-dropdown-selected-color; */
    /* opacity: 1; */
  }

  .vs__selected-options {
    padding: 0;
  }

  .vs__dropdown-menu {
    padding: 10px 0;
    border-top: 1px dashed #36cdd4;

    li {
      color: $vs-dropdown-color;
      padding: 5px;
      margin: 0 5px;

      &.vs__dropdown-option--highlight {
        color: $vs-state-active-color;
      }
      /* &.vs__dropdown-option--selected { */
      /*   color: $vs-dropdown-selected-color; */
      /* } */
    }
  }
}

.v-select.vs--disabled {
  /* border-color: transparent; */

  .vs__dropdown-toggle {
    background: rgba($vs-selected-background, 0.3);
    /* background: $vs-selected-background; */
  }

  .vs__search {
    background: none;
  }

  .vs__selected {
    background: transparent;
  }
}

/* make it look like a button to press on */
.as-button.v-select:not(.vs--open) {
  border: 0;

  .vs__dropdown-toggle {
    padding: 0;
    cursor: default;
    border: 0;

    input::placeholder {
      color: $primary;
      text-align: center;
      text-transform: uppercase;
      font-size: $body-font-size;
      font-family: $font-family-titles;
      transition: $transition-default;
    }

    &:hover, &:active {
      input::placeholder {
        color: $vs-bg;
      }
    }

    .vs__selected-options input {
      cursor: pointer;
      background: $black;
      padding: 15px;
      border: 1px solid $primary;
      transition: background $transition-speed-default linear;

      &:hover, &:active {
        background: $primary;
        color: $primary;
        border-color: $primary;
      }
    }
  }
}
.landing.v-select.selected:not(.vs--open) .vs__dropdown-toggle {
  background: none;
  border: none;
  padding: 0 0 4px 0;
}
</style>
