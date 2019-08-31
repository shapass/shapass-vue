<template>
<div class="intro-video clearfix">
  <div>{{ steps.current }}<div class="cursor"></div></div><br/>
  <div class="input input-service clearfix"><span>{{ vals.service }}</span><div class="cursor"></div></div>
  <span class="plus">+</span>
  <div class="input input-master clearfix"><span>{{ vals.master }}</span><div class="cursor"></div></div>
  <div class="input input-generated clearfix"><span>{{ vals.generated }}</span></div>
</div>
</template>

<script>
export default {
  name: 'IntroVideo',
  props: {
  },
  components: {
  },
  methods: {
    start: function() {
      this.clear();
      this.step(0);
    },
    step: function(step) {
      clearTimeout(this.timeout);
      this.steps.current = step;
      this.act();
      this.timeout = setTimeout(() => {
        if (this.steps.current == this.steps.max) {
          this.steps.current = -1;
        }
        this.step(this.steps.current + 1);
      }, this.steps.duration);
    },
    act: function() {
      if (this.steps.current == 0) {
        this.clear();
        this.show(this.el.service);
        this.typing(this.el.service);
      } else if (this.steps.current >= 5 && this.steps.current < 30) {
        this.vals.service = this.type("twitter", 5);
      } else if (this.steps.current == 30) {
        this.show(this.el.plus);
        this.show(this.el.master);
        this.typing(this.el.master);
      } else if (this.steps.current >= 32 && this.steps.current < 50) {
        this.vals.master = this.type("••••••••••••••••", 32);
      } else if (this.steps.current == 60) {
        this.vals.master = "mysecretpassword"
      } else if (this.steps.current == 80) {
        this.vals.master = "••••••••••••••••"
      } else if (this.steps.current == 90) {
        this.show(this.el.generated);
      } else if (this.steps.current == 115) {
        this.select(this.el.service)
      } else if (this.steps.current == 120) {
        this.typing(this.el.service);
      } else if (this.steps.current >= 122 && this.steps.current < 135) {
        this.vals.service = this.type("gmail", 122);
      } else if (this.steps.current == 135) {
        this.select(this.el.service)
      } else if (this.steps.current >= 137 && this.steps.current < 155) {
        this.vals.service = this.type("amazon", 137);
      } else if (this.steps.current == 155) {
        this.select(this.el.service)
      } else if (this.steps.current >= 157 && this.steps.current < 175) {
        this.vals.service = this.type("instagram", 157);
      } else if (this.steps.current == 175) {
        this.select(this.el.service)
      } else if (this.steps.current >= 177 && this.steps.current < 195) {
        this.vals.service = this.type("spotify", 177);
      } else if (this.steps.current == 195) {
        this.select(this.el.service)
      } else if (this.steps.current >= 197 && this.steps.current < 215) {
        this.vals.service = this.type("shapass", 197);
      }
    },
    clear: function() {
      Object.keys(this.vals).map((key, i) => {
        this.vals[key] = " ";
      });
      Object.keys(this.el).map((key, i) => {
        this.hide(this.el[key]);
      });
    },
    generate: function() {
      this.vals.generated = this.shapass(`${this.vals.service}${this.vals.master}`, 'sha256-bin', 32);
    },
    show: function(el) {
      el.style.display = "block";
    },
    hide: function(el) {
      el.style.display = "none";
    },
    typing: function(el) {
      Object.keys(this.el).map((key, i) => {
        this.el[key].classList.remove("typing");
      });
      el.classList.add("typing");
    },
    select: function(el) {
      this.deselect();
      el.classList.add("selected");
    },
    deselect: function(el) {
      Object.keys(this.el).map((key, i) => {
        this.el[key].classList.remove("selected");
      });
    },
    type: function(word, start) {
      var letters = this.steps.current - start + 1;
      return word.substring(0, letters);
    },
  },
  data () {
    return {
      timeout: null,
      steps: {
        current: 0,
        max: 240,
        duration: 50,
      },
      el: {
        service: null,
        master: null,
        generated: null,
      },
      vals: {
        service: null,
        master: null,
        generated: null,
        plus: null,
      }
    }
  },
  mounted () {
    this.el.service = this.$el.querySelector(".input-service");
    this.el.master = this.$el.querySelector(".input-master");
    this.el.generated = this.$el.querySelector(".input-generated");
    this.el.plus = this.$el.querySelector(".plus");
    this.start();
  },
  watch: {
    "vals.service": function() {
      this.deselect();
      this.generate();
    },
    "vals.master": function() {
      this.deselect();
      this.generate();
    },
  }
}
</script>

<style scoped lang="scss">

.input {
  display: none;
  position: relative;
  background: none;
  font-family: $input-font-family;
  color: $input-font-color;
  border: 1px solid $background-highlight;
  padding: 5px 10px;
  min-height: $font-md + 10px;
  width: calc(100% - 20px);

  span {
    float: left;
  }

  &.typing {
    border-color: $primary;

    .cursor {
      display: inline-block;
    }
  }

  &.selected {
    span {
      background: $white;
      color: $primary;
    }
  }

  .cursor {
    float: left;
    display: none;
    font-size: 12px;
    background-color: $primary;
    color: $primary;
    position: relative;
    opacity: 0.8;
    height: 2em;
    width: 2px;
    max-width: 2px;
    overflow: hidden;
    margin-left: 2px;
    margin-top: 2px;
    text-decoration: blink;
    animation: blinker 1s linear infinite;
  }
}

.plus {
  display: none;
}

.input-service {
  float: left;
  width: calc(50% - 40px);
}

.input-master {
  float: right;
  width: calc(50% - 40px);
}

.plus {
  float: left;
  margin: 5px 12px;
}

.input-generated {
  word-break: break-all;
  background: $generated-input-bg;
  border: $generated-input-border;
  color: $generated-input-color;
  border: 1px solid $background-highlight;
  padding-top: 5px;
  padding-bottom: 5px;
  font-family: $font-family-titles;
  margin-top: 10px;
  float: left;
}

@keyframes blinker {
  50% { opacity: 0.0; }
}

</style>
