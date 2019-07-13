<template>
  <div class="service-selector">
    <label class="typewriter">What is this password for?</label>
    <v-select v-model="service" taggable selectOnTab filterable :clearable="false" placeholder="e.g. gmail" :options="services" label="name" v-on:input="onSelectChange" v-on:search:focus="onFocus" autocomplete="off"></v-select>
  </div>
</template>

<script>
export default {
  name: 'ServiceSelector',
  props: {
    value: String,
    services: Array
  },
  methods: {
    onSelectChange: function(v) {
      this.$emit('input', v)
    },
    onFocus: function() {
      this.service = null;
      this.$emit('input', null)
    }
  },
  data () {
    return {
      service: null
    }
  },
  mounted () {
    // TODO: only on desktop
    this.$el.getElementsByTagName('input')[0].focus();
  }
}
</script>

<style lang="scss">
.v-select {
  clear: both;
  margin-top: 10px;
  
  input::placeholder {
    color: #666;
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
    border-radius: 4px;
    color: $vs-selected-color;
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
</style>


