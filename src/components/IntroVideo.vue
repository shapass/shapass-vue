<template>
<div class="intro-video clearfix">
  <!-- <div>{{ steps.current }}<div class="cursor"></div></div><br/> -->
  <div class="mage">
    <img src="logo.svg" alt="Shapass" />
    <div class="text-balloon from-mage" x-placement="right">
      <div class="arrow"></div><div class="text"></div>
    </div>
  </div>
  <div class="play">
    <div class="text-balloon from-mage" x-placement="right">
      <div class="arrow"></div>Let me tell you of my magic...
    </div>
    <div class="text-balloon from-user" x-placement="left" v-on:click="start">
      Yes, please, show me!<div class="arrow"></div>
      <font-awesome-icon icon="play-circle" />
    </div>
  </div>
  <div class="demo">
    <div class="input input-service clearfix"><span>{{ vals.service }}</span><div class="cursor"></div></div>
    <span class="plus">+</span>
    <div class="input input-master clearfix"><span>{{ vals.master }}</span><div class="cursor"></div></div>
    <div class="input input-generated clearfix"><span>{{ vals.generated }}</span></div>
  </div>
</div>
</template>

<script>

var SCENES = {
  "start": 0,
  "intro": 5,
  "service_1": 40,
  "master": 70,
  "master_show": 100,
  "master_hide": 140,
  "generated_show": 160,
  "service_2": 205,
  "service_3": 245,
  "service_4": 275,
  "service_5": 305,
  "service_6": 335,
  "service_7": 365,
  "last": 395,
};

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
    end: function() {
      clearTimeout(this.timeout);
      this.clear();
    },
    step: function(step) {
      clearTimeout(this.timeout);
      this.steps.current = step;
      this.act();
      this.timeout = setTimeout(() => {
        if (this.steps.current == this.steps.max) {
          //this.steps.current = -1;
          //this.step(this.steps.current + 1);
          // TODO:
          this.end();
        } else {
          this.step(this.steps.current + 1);
        }
      }, this.steps.duration);
    },
    act: function() {
      if (this.steps.current == SCENES.start) {
        this.clear();
        this.$el.classList.add("playing");
        this.say(null);
      } else if (this.steps.current == SCENES.intro) {
        this.say("To start, type the name of the website or the service you need a password for");
      } else if (this.steps.current == SCENES.service_1) {
        this.say("Let's say you need a password for Twitter");
        this.show(this.el.service);
        this.typing(this.el.service);
      } else if (this.steps.current >= SCENES.service_1+2 && this.steps.current < SCENES.master) {
        this.vals.service = this.type("twitter", SCENES.service_1+2);
      } else if (this.steps.current == SCENES.master) {
        this.show(this.el.plus);
        this.show(this.el.master);
        this.typing(this.el.master);
        this.say("Then you type your master password");
      } else if (this.steps.current >= SCENES.master+2 && this.steps.current < SCENES.master_show) {
        this.vals.master = this.type("••••••••••••••••", SCENES.master+2);
      } else if (this.steps.current == SCENES.master_show) {
        this.say("Make sure only <span class='em'>you</span> know this password!");
        this.vals.master = "mysecretpassword"
      } else if (this.steps.current == SCENES.master_hide) {
        this.vals.master = "••••••••••••••••"
      } else if (this.steps.current == SCENES.generated_show) {
        this.say("I'll generate a <span class='em'>long and (very) hard-to-guess password</span> for you", "bottom");
        // this.say("Based on the service and your master password, I'll generate a <span class='em'>long and (very) hard-to-guess password</span> for you", "bottom");
        this.show(this.el.generated);
      } else if (this.steps.current == SCENES.service_2) {
        this.say("You can use the <span class='em'>same master password</span> for any other website you want", "bottom");
        this.typing(this.el.service);
        this.select(this.el.service)
      } else if (this.steps.current >= SCENES.service_2+2 && this.steps.current < SCENES.service_3) {
        this.vals.service = this.type("gmail", SCENES.service_2+2);
      } else if (this.steps.current == SCENES.service_3) {
        this.select(this.el.service)
      } else if (this.steps.current >= SCENES.service_3+2 && this.steps.current < SCENES.service_4) {
        this.vals.service = this.type("amazon", SCENES.service_3+2);
      } else if (this.steps.current == SCENES.service_4) {
        this.say("As you can see, I'll generate a completely <span class='em'>unique</span>, long and hard-to-guess password for each website", "bottom");
        this.select(this.el.service)
      } else if (this.steps.current >= SCENES.service_4+2 && this.steps.current < SCENES.service_5) {
        this.vals.service = this.type("instagram", SCENES.service_4+2);
      } else if (this.steps.current == SCENES.service_5) {
        this.select(this.el.service)
      } else if (this.steps.current >= SCENES.service_5+2 && this.steps.current < SCENES.service_6) {
        this.vals.service = this.type("spotify", SCENES.service_5+2);
      } else if (this.steps.current == SCENES.service_6) {
        this.select(this.el.service)
      } else if (this.steps.current >= SCENES.service_6+2 && this.steps.current < SCENES.service_7) {
        this.vals.service = this.type("battle.net", SCENES.service_6+2);
      } else if (this.steps.current == SCENES.service_7) {
        this.select(this.el.service)
      } else if (this.steps.current >= SCENES.service_7+2 && this.steps.current < SCENES.last) {
        this.vals.service = this.type("shapass", SCENES.service_7+2);
      } else if (this.steps.current >= SCENES.last) {
        this.say("That's all for now, bye");
      }
    },
    clear: function() {
      this.$el.classList.remove("playing");
      this.say(null);
      Object.keys(this.vals).map((key) => {
        this.vals[key] = " ";
      });
      Object.keys(this.el).map((key) => {
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
      Object.keys(this.el).map((key) => {
        this.el[key].classList.remove("typing");
      });
      el.classList.add("typing");
    },
    select: function(el) {
      this.deselect();
      el.classList.add("selected");
    },
    deselect: function() {
      Object.keys(this.el).map((key) => {
        this.el[key].classList.remove("selected");
      });
    },
    type: function(word, start) {
      var letters = this.steps.current - start + 1;
      return word.substring(0, letters);
    },
    say: function(words, position="top") {
      var balloon = this.$el.querySelector(".mage .text-balloon");
      balloon.querySelector("div.text").innerHTML = words;
      if (words === null) {
        this.hide(balloon);
      } else {
        this.show(balloon);
      }
      if (position === "bottom") {
        this.$el.classList.add("say-at-bottom");
      } else {
        this.$el.classList.remove("say-at-bottom");
      }
    },
  },
  data () {
    return {
      timeout: null,
      steps: {
        current: 0,
        max: 450,
        duration: 120, // 120
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
    // this.start();
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

.intro-video {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;
  align-items: flex-start;
  padding: 70px 10px 0 0;
  position: relative;
  transition: $transition-default;

  .mage {
    text-align: center;
    /* flex-basis: 50%; */
    /* order: 1; */
    text-align: left;
    transition: $transition-default;
    position: absolute;
    left: 0;
    top: 30px;
    width: 50%;
    z-index: 999;

    img {
      width: 80%;
      animation: float 3s ease-in-out infinite alternate;
      transition: $transition-default;
    }

    .text-balloon {
      display: none;
    }
  }

  .play {
    display: block;
    order: 2;
    flex-basis: 50%;

    .from-mage {
      float: left;
      margin-left: -10%;
    }

    .from-user {
      $bg: $primary;
      background: $bg;
      color: $black;
      border-color: $bg;
      float: right;
      margin-top: 30px;
      cursor: pointer;
      transition: $transition-default;

      .arrow {
        border-color: $bg;
        transition: $transition-default;
      }

      svg {
        margin-left: 10px;
        transition: $transition-default;
        animation: float-sm 5s ease-in-out infinite alternate;
      }

      &:hover {
        transform: scale(1.1);
        $bg: $secondary; //lighten($primary, 10);
        background: $bg;
        border-color: $bg;
        color: $white;
        .arrow { border-color: $bg; }
      }
    }
  }

  .demo {
    display: none;
  }

}

.intro-video.playing {
  flex-direction: row;
  position: relative;
  transition: $transition-default;

  .play {
    display: none;
  }

  .mage {
    top: 0;
    width: 100%;
    transition: $transition-default;

    img {
      max-width: 40px;
    }

    .text-balloon {
      position: absolute;
      top: 0px;
      bottom: auto;
      max-width: 80%;
      left: 70px;

    }
  }
  .text .em {
    color: $primary;
    font-weight: bold;
    border-bottom: 1px dashed $primary;
    font-style: normal;
  }

  .demo {
    display: block;
    order: 2;
    flex-basis: 100%;
    position: relative;
  }

  &.say-at-bottom {
    .mage {
      margin-top: 200px;
    }
    /* .demo .text-balloon { */
    /*   bottom: -100px; */
    /*   top: auto; */
    /* } */
  }
}

.text-balloon {
  background: $background-highlight;
  border: 1px solid $background-highlight;
  padding: 10px;
  border-radius: 4px;
  position: relative;
  font-family: $font-family-titles;
  font-size: $font-sm;
  height: auto;

  $w: 10px;

  .arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: $w;
    border-color: $tooltip-bg;
    z-index: 1;
  }

  &[x-placement^="right"] {
    .arrow {
      border-width: $w $w*2 $w 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -($w*2);
      bottom: 0;
      top: 0;
      margin-left: 0;
      margin-right: 0;
    }
  }
  &[x-placement^="left"] {
    .arrow {
      border-width: $w 0 $w $w*2;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -($w*2);
      bottom: 0;
      top: 0;
      margin-left: 0;
      margin-right: 0;
    }
  }
}

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
      color: $orange;
    }
    .cursor {
      display: none;
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
  width: calc(40% - 40px);
}

.input-master {
  float: right;
  width: calc(60% - 40px);
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

</style>
