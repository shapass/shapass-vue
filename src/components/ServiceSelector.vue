<template>
  <div class="service-selector container">
    <label class="typewriter">What service or website is this password for?</label>
    <input type="select-multiple" spellcheck="false" autofocus placeholder="e.g. gmail" autocomplete="off"/>
    <div id="service-configs">
      <label>configurations:</label>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceSelector',
  methods: {
    setupSelectize: function() {
      $(".service-selector input").selectize({
        persist: false,
        openOnFocus: false,
        maxItems: 1,
        valueField: 'name',
        hideSelected: false,
        closeAfterSelect: true,
        searchField: ['name'],
        highlight: true,
        // options: storedServices(true),
        preload: 'focus',
        render: {
          item: function(item, escape) {
            return '<div>' +
              (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
              '</div>';
          },
          option: function(item, escape) {
            var label = item.name;
            var caption = "test-"; //serviceConfigs(item.name);
            return '<div>' +
              '<span class="label">' + escape(label) + '</span>' +
              (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
              '</div>';
          }
        },
        create: true,
        createOnBlur: true,
        addPrecedence: false,
        selectOnTab: true,
        plugins: ['restore_on_backspace'],
        // load: function(query, callback) {
        //   callback(storedServices(true));
        // }
      });
    }
  },
  mounted () {
    this.setupSelectize()
  }
}
</script>

<style lang="scss">

.selectize-input {
  padding: 0;
  border-radius: 0;
  background: none;
  border: 0;
  font-size: 20px;
  line-height: 24px;
  margin: 0;
  width: 100%;
  outline: none;
}

.selectize-input input {
  background: none;
  border: 0;
  font-size: 20px;
  margin: 0;
}

.selectize-control.single .selectize-input {
  border: none;
  color: #36cdd4;
  box-shadow: none;
  background: #010913;
}

.selectize-input,
.selectize-control.single .selectize-input.input-active {
  background: #010913;
}

.selectize-dropdown {
  border: none;
  background: #010913;
  margin-top: 20px;
  box-shadow: 7px 7px 0px rgba(0, 0, 0, 0.8);
  border-radius: 0;
  color: #fff;
  font-size: 20px;
  line-height: 24px;
}
.selectize-dropdown.single {
  border: none;
}

.selectize-input.dropdown-active::before {
  content: '';
  display: none;
}

.selectize-input.dropdown-active {
  border-radius: 0;
  border: none !important;
}

.selectize-dropdown [data-selectable] {
  /* border-bottom: 1px solid #36cdd4; */
  padding: 5px;
  font-size: 20px;
}

.selectize-dropdown .create {
  color: #aaa;
  font-size: 14px;
  line-height: 18px;
}
/* .selectize-dropdown [data-selectable]:first-child { */
/*   border-top: 1px solid #36cdd4; */
/* } */

.selectize-dropdown .create.active {
  color: #fff;
}

.selectize-dropdown-content {
  border: 1px solid #36cdd4;
  padding: 5px;
  /* overflow: hidden; */
  max-height: 300px;
}

.selectize-dropdown [data-selectable].active {
  color: #fff;
  background: #000;
}

.selectize-dropdown [data-selectable] .label {
  float: left;
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selectize-dropdown [data-selectable] .caption {
  float: right;
  font-size: 12px;
  color: #666;
  max-width: 29%;
  white-space: nowrap;
}

.selectize-input [data-value] {
  padding: .2rem .4rem;
  font-size: 87.5%;
  color: #fff;
  background-color: #212529;
  border-radius: .2rem;
}

.selectize-control.single .selectize-input:after {
  content: none;
  display: none;
}
</style>
