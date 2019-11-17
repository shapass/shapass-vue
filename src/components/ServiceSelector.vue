<template>
<div class="service-selector">
  <label v-if="!asButton">What is this password for?</label>

  <v-select v-model="service" taggable selectOnTab searchable :clearable="false" :placeholder="placeholder" :options="services" label="name" v-on:input="onInput" v-on:search:focus="onFocus" v-on:search:blur="onBlur" autocomplete="off" v-bind:class="{ selected: this.service !== null, 'as-button': asButton, 'no-drop': !showDrop }" :disabled="disabled" :filterBy="filterBy" :noDrop="!showDrop" :tabindex="tabindex">

    <!-- this should never show up -->
    <template slot="no-options">
      Loading...
    </template>

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
    tabindex: {
      type: Number,
      default: 1
    },
    asButton: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    onInput: function(v) {
      this.$emit('input', v);
    },
    onFocus: function() {
      this.service = null;
      this.$emit('input', null)
      this.$emit('focused', null)
    },
    onBlur: function() {
      this.$emit('blurred', null)
    },
    filterBy: function(option, label, search) {
      return (label || "").toLowerCase().indexOf(search.toLowerCase()) > -1;
    },
  },
  data () {
    return {
      service: null
    }
  },
  computed: {
    placeholder () {
      if (this.asButton) {
        return 'Get started';
      } else {
        if (this.services !== undefined && this.services.length > 0) {
          return 'Type to search or add...';
        } else {
          return 'Type the name of a service (e.g. twitter)';
        }
      }
    },
    showDrop () {
      return (this.services !== undefined && this.services.length > 0);
    }
  },
  mounted () {
    this.service = this.value;
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
  }

  .vs__search {
    transition: background 0.1s linear;
    padding-left: 0px;
  }
  .vs__search:focus  {
    padding-left: 0px;
  }
  &.vs--open .vs__search {
    display: inline;
  }

  .vs__actions {
    // the clear button
    .vs__clear {
      display: none;
    }
  }

  .vs__dropdown-toggle {
    border-color: transparent;
    transition: border 0.1s linear;
    border-bottom: 0;
    margin: 0;
    padding: 2px 9px 7px 9px;
  }
  &.vs--open .vs__dropdown-toggle {
    border-color: $vs-border-color;
    background: $vs-dropdown-bg;
    border-bottom: 0;
  }
  &.no-drop:focus-within {
    border-color: $vs-border-color;
    background: $vs-dropdown-bg;
  }

  &.vs--single .vs__selected {
    color: $vs-selected-color;
    border-left: 0;
    margin-left: 0;
    padding-left: 0px;
  }
  .vs__selected {
    font-family: $input-font-family;
  }
  &.vs--open .vs__selected {
    background: none;
  }

  .vs__selected-options {
    padding: 0;
  }

  .vs__dropdown-menu {
    padding: 10px 0;
    border-top: 1px dashed #36cdd4;

    li {
      color: $vs-dropdown-color;
      padding: 7px;
      margin: 0 7px;

      &.vs__dropdown-option--highlight {
        background: $vs-selected-background;
        color: $vs-selected-color;
      }
    }
  }
}

.v-select.vs--disabled/* , .v-select.selected  */{
  .vs__dropdown-toggle {
    background: $input-not-empty-bg;
  }

  .vs__search {
    background: none;
  }

  .vs__selected {
    background: transparent;
    /* color: $gray; */
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
      opacity: 1;
      text-align: center;
      text-transform: uppercase;
      font-size: $body-font-size;
      font-family: $input-font-family; //$font-family-titles;
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

      &:hover, &:active, &:focus {
        background: $primary;
        color: $primary;
        border-color: $primary;
      }
    }

    .vs__actions {
      width: 0;
      display: none;
    }
  }
}
.landing.v-select.selected:not(.vs--open) .vs__dropdown-toggle {
  background: none;
  border: none;
  padding: 0 0 4px 0;
}
</style>
