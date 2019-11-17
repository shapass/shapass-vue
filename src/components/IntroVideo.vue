<template>
<div class="intro-video clearfix">
  <!-- <div>{{ steps.current }}<div class="cursor"></div></div><br/> -->
  <div class="wizard">
    <img src="logo.svg" alt="Shapass" />
    <div class="text-balloon from-wizard" x-placement="right">
      <div class="arrow"></div><div class="text"></div>
    </div>
  </div>
  <div class="play">
    <div class="text-balloon from-wizard" x-placement="right">
      <div class="arrow"></div>Let me tell you of my magic...
    </div>
    <div class="text-balloon from-user" x-placement="left" v-on:click="start">
      Yes, show me!<div class="arrow"></div>
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

// name, duration, step it starts (calculated when mounted)
var SCENES = [
  [ "start", 3, 0 ],
  [ "greeting", 25, 0 ],
  [ "greeting_2", 35, 0 ],
  [ "greeting_3", 30, 0 ],
  [ "intro", 45, 0 ],
  [ "service_1_intro", 20, 0 ],
  [ "service_1", 20, 0 ],
  [ "master_intro", 30, 0 ],
  [ "master", 30, 0 ],
  [ "master_show", 35, 0 ],
  [ "generated_intro", 30, 0 ],
  [ "generated_show", 30, 0 ],
  [ "master_2", 40, 0 ],
  [ "service_2", 30, 0 ],
  [ "service_3", 30, 0 ],
  [ "service_4", 30, 0 ],
  [ "service_5", 30, 0 ],
  [ "service_6", 30, 0 ],
  [ "service_7", 30, 0 ],
  [ "remember", 60, 0 ],
  [ "last", 40, 0 ],
  [ "end_at", 0, 0 ],
];

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
      clearTimeout(this.steps.timeout);
      clearInterval(this.wizard.interval);
      this.clear();
    },
    step: function(step) {
      clearTimeout(this.steps.timeout);
      this.steps.current = step;
      this.act();
      this.steps.timeout = setTimeout(() => {
        if (this.steps.current == this.stepfor("end_at")) {
          if (this.steps.infinite) {
            this.steps.current = -1;
            this.step(this.steps.current + 1);
          } else {
            this.end();
          }
        } else {
          this.step(this.steps.current + 1);
        }
      }, this.steps.duration);
    },
    calculateSteps: function() {
      var step = 0;
      for (var i = 0; i < SCENES.length; i++) {
        SCENES[i][2] = step;
        step += SCENES[i][1];
      }
    },
    stepfor: function(scene) {
      for (var i = 0; i < SCENES.length; i++) {
        if (SCENES[i][0] === scene) {
          return SCENES[i][2];
        }
      }
      return 0;
    },
    act: function() {
      if (this.steps.current == this.stepfor("start")) {
        this.clear();
        this.say(null);
        this.$el.classList.add("playing");
      } else if (this.steps.current == this.stepfor("greeting")) {
        this.say("Hi, I'm the password wizard");
      } else if (this.steps.current == this.stepfor("greeting_2")) {
        this.say("I will help you create better passwords");
      } else if (this.steps.current == this.stepfor("greeting_3")) {
        this.say("It's easy, let me guide you");
      } else if (this.steps.current == this.stepfor("intro")-5) {
        this.say(null);
        this.$el.classList.add("demoing");
      } else if (this.steps.current == this.stepfor("intro")) {
        this.say("To start, type the name of the website or service you need a password for");
      } else if (this.steps.current == this.stepfor("service_1_intro")) {
        this.say("Let's say you need a password for Twitter");
        this.show(this.el.service);
        this.typing(this.el.service);
      } else if (this.steps.current >= this.stepfor("service_1") && this.steps.current < this.stepfor("master_intro")) {
        this.vals.service = this.type("twitter", this.stepfor("service_1"));
      } else if (this.steps.current == this.stepfor("master_intro")) {
        this.say("Then, you will type a MASTER password");
      } else if (this.steps.current >= this.stepfor("master") && this.steps.current < this.stepfor("master_show")) {
        this.show(this.el.plus);
        this.show(this.el.master);
        this.typing(this.el.master);
        this.vals.master = this.type("••••••••••••••••", this.stepfor("master"));
      } else if (this.steps.current == this.stepfor("master_show")) {
        this.say("I'll show it here, but make sure ONLY YOU know this password!");
        this.vals.master = "mysecretpassword"
      } else if (this.steps.current == this.stepfor("generated_intro")) {
        this.say("I will generate a long and (very) hard-to-guess password for you", "bottom");
      } else if (this.steps.current == this.stepfor("generated_show")) {
        this.show(this.el.generated);
        this.typing(this.el.generated);
      } else if (this.steps.current == this.stepfor("master_2")) {
        this.say("You can use the same master password for any other website you want");
      } else if (this.steps.current == this.stepfor("service_2")-2) {
        this.vals.master = "mysecretpassword"
      } else if (this.steps.current == this.stepfor("service_2")) {
        this.typing(this.el.service);
        this.select(this.el.service)
      } else if (this.steps.current >= this.stepfor("service_2")+2 && this.steps.current < this.stepfor("service_3")) {
        this.vals.service = this.type("gmail", this.stepfor("service_2")+2);
      } else if (this.steps.current == this.stepfor("service_3")) {
        this.select(this.el.service)
      } else if (this.steps.current >= this.stepfor("service_3")+2 && this.steps.current < this.stepfor("service_4")) {
        this.vals.service = this.type("amazon", this.stepfor("service_3")+2);
      } else if (this.steps.current == this.stepfor("service_4")) {
        this.say("As you can see, I'll generate a completely unique, long and hard-to-guess password for each website", "bottom");
        this.select(this.el.service)
      } else if (this.steps.current >= this.stepfor("service_4")+2 && this.steps.current < this.stepfor("service_5")) {
        this.vals.service = this.type("instagram", this.stepfor("service_4")+2);
      } else if (this.steps.current == this.stepfor("service_5")) {
        this.select(this.el.service)
      } else if (this.steps.current >= this.stepfor("service_5")+2 && this.steps.current < this.stepfor("service_6")) {
        this.vals.service = this.type("spotify", this.stepfor("service_5")+2);
      } else if (this.steps.current == this.stepfor("service_6")) {
        this.select(this.el.service)
      } else if (this.steps.current >= this.stepfor("service_6")+2 && this.steps.current < this.stepfor("service_7")) {
        this.vals.service = this.type("battle.net", this.stepfor("service_6")+2);
      } else if (this.steps.current == this.stepfor("service_7")) {
        this.select(this.el.service)
      } else if (this.steps.current >= this.stepfor("service_7")+2 && this.steps.current < this.stepfor("remember")) {
        this.vals.service = this.type("shapass", this.stepfor("service_7")+2);
      } else if (this.steps.current == this.stepfor("remember")) {
        this.say("I give you unique passwords for all websites, but you only have to remember one");
        this.typing(this.el.master);
      } else if (this.steps.current == this.stepfor("last")) {
        this.say("Use me, and they SHA'll not PASS!");
      }
    },
    clear: function() {
      this.$el.classList.remove("playing");
      this.$el.classList.remove("demoing");
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
      // el.style.display = "block";
      el.style.opacity = 1;
    },
    hide: function(el) {
      // el.style.display = "none";
      el.style.opacity = 0;
    },
    typing: function(el) {
      Object.keys(this.el).map((key) => {
        this.el[key].classList.remove("typing");
      });
      if (el !== null) {
        el.classList.add("typing");
      }
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
      clearInterval(this.wizard.interval);
      var balloon = this.$el.querySelector(".wizard .text-balloon");

      if (words === null) {
        this.hide(balloon);
        balloon.querySelector("div.text").innerHTML = null;
      } else {
        this.show(balloon);
      }
      if (position === "bottom") {
        this.$el.classList.add("say-at-bottom");
      } else {
        this.$el.classList.remove("say-at-bottom");
      }

      if (words !== null) {
        var letters = 1;
        this.wizard.interval = setInterval(() => {
          balloon.querySelector("div.text").innerHTML = words.substring(0, letters);
          letters += 1;
          if (letters > words.length) {
            clearInterval(this.wizard.interval);
          }
        }, this.wizard.between_letters);
      }
    },
    highlightStart: function() {
      var balloon = this.$el.querySelector(".play .from-user");
      balloon.classList.add("highlight");
      setTimeout(() => {
        balloon.classList.remove("highlight");
      }, 1500);
    },
  },
  data () {
    return {
      steps: {
        timeout: null,
        current: 0,
        duration: 120, // 120
        infinite: false
      },
      wizard: {
        interval: null,
        between_letters: 30,
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
    this.calculateSteps();

    setTimeout(() => {
      this.highlightStart();
    }, 5000);
    setInterval(() => {
      this.highlightStart();
    }, 30000);
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

  .wizard {
    text-align: center;
    /* flex-basis: 50%; */
    /* order: 1; */
    text-align: left;
    transition: $transition-default;
    position: absolute;
    left: 0;
    top: 50px;
    width: 50%;
    z-index: 999;

    img {
      width: 80%;
      animation: float-sm 5s ease-in-out infinite alternate;
      transition: $transition-default;
    }

    .text-balloon {
      /* display: none; */
      opacity: 0;
    }
  }

  .play {
    display: block;
    order: 2;
    flex-basis: 50%;

    .from-wizard {
      float: left;
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
      white-space: nowrap;
      margin-right: 10px;

      .arrow {
        border-color: $bg;
        transition: $transition-default;
      }

      svg {
        margin-left: 10px;
        transition: $transition-default;
        animation: float-sm 5s ease-in-out infinite alternate;
      }

      &:hover, &.highlight {
        transform: scale(1.1);
        $bg: $secondary;
        background: $bg;
        border-color: $bg;
        color: $white;
        .arrow { border-color: $bg; }
      }
    }
  }

  .demo {
    display: none;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;

    .input-service {
      width: calc(40% - 2.3em);
      order: 1;
    }

    .input-master {
      width: calc(60% - 2.3em);
      order: 3;
    }

    .plus {
      opacity: 0;
      order: 2;
      flex-grow: 1;
      width: auto;
      text-align: center;
    }

    .input-generated {
      order: 4;
      flex-basis: 100%;
      word-break: break-all;
      background: $generated-input-bg;
      border: $generated-input-border;
      color: $generated-input-color;
      border: 1px solid $background-highlight;
      font-family: $font-family-titles;
      margin-top: 10px;
      width: 100%;
    }
  }
}

.intro-video.playing {
  padding-top: 100px;

  .play {
    display: none;
  }

  .wizard {
    .text-balloon {
      position: absolute;
      top: 30px;
      width: 90%;
      right: -95%;
    }
  }

  &.demoing {
    .wizard {
      top: 0;
      width: 100%;
      transition: $transition-default;
      @include mobile {
        top: 20px;
      }

      .text-balloon {
        top: -10px;
        bottom: auto;
        max-width: 80%;
        left: 70px;
        width: auto;
        @include mobile {
          max-width: 70%;
        }
      }

      img {
        max-width: 40px;
      }
    }

    .demo {
      display: flex;
      order: 2;
      flex-basis: 100%;
      position: relative;
    }

    &.say-at-bottom {
      .wizard {
        margin-top: 230px;
        @include mobile { margin-top: 190px; }
      }
    }
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
  opacity: 0;
  position: relative;
  background: none;
  font-family: $input-font-family;
  color: $input-font-color;
  border: 1px solid $background-highlight;
  padding: 0.3em 0.5em;
  /* line-height: 1.2em; */
  width: calc(100% - 20px);
  transition: $transition-default;

  span {
    float: left;
    min-height: 1.5em;
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
    @include mobile { height: 1.5em; }

    width: 2px;
    max-width: 2px;
    overflow: hidden;
    margin-left: 2px;
    margin-top: 2px;
    text-decoration: blink;
    animation: blinker 1s linear infinite;
  }
}

</style>
