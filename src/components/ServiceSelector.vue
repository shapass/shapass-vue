<template>
  <div class="service-selector container">
    <label class="typewriter">What service or website is this password for?</label>
    <v-select taggable selectOnTab filterable :clearable="false" placeholder="e.g. gmail" :options="getServices()">
    </v-select>
    <div id="service-configs">
      <label>configurations:</label>
      <span></span>
    </div>
    <input type="text"></input>
  </div>
</template>

<script>
export default {
  name: 'ServiceSelector',
  methods: {
    getServices: function() {
      return ["netflix", "gmail", "twitter", "twitch"];
    }
  },
  mounted () {
    //this.setupSelectize()
  }
}
</script>

<style lang="scss">
.v-select {
  clear: both;
  margin-top: 10px;
  
  input::placeholder {
    color: #666;
    font-size: 18px;
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


