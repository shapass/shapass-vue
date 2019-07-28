<template>
  <div class="service-selector">
    <label class="typewriter" v-if="!currentUser.atLanding()">What is this password for?</label>
    <v-select v-model="service" taggable selectOnTab filterable :clearable="false" :placeholder="currentUser.atLanding() ? 'Get started' : 'e.g. gmail'" :options="services" label="name" v-on:input="onSelectChange" v-on:search:focus="onFocus" v-on:search:blur="onBlur" autocomplete="off" v-bind:class="{ selected: this.service !== null, landing: currentUser.atLanding() }"></v-select>
  </div>
</template>

<script>
export default {
  name: 'ServiceSelector',
  props: {
    value: String,
    services: Array,
    currentUser: Object
  },
  methods: {
    onSelectChange: function(v) {
      this.$emit('input', v)
    },
    onFocus: function() {
      this.service = null;
      this.currentUser.state.step = null;
      this.$emit('input', null)
    },
    onBlur: function() {
      // if (this.service === null) {
      //   this.currentUser.state.step = 'Landing';
      // }
    }
  },
  data () {
    return {
      service: null
    }
  },
  mounted () {
    // if (!this.$isMobile()) {
    //   this.$el.getElementsByTagName('input')[0].focus();
    // }
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

/* make it look like a button to press on */
.landing.v-select:not(.vs--open) .vs__dropdown-toggle {
  background: $primary;
  padding: 15px;
  cursor: pointer;

  input::placeholder {
    color: $body-background;
    text-align: center;
    text-transform: uppercase;
  }

  .vs__selected-options input {
    cursor: pointer;
  }
}
.landing.v-select.selected:not(.vs--open) .vs__dropdown-toggle {
  background: none;
  border: none;
  padding: 0 0 4px 0;
}
</style>
