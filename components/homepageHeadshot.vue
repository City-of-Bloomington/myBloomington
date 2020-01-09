<template>
  <component :is="wrapper">
    <a  :href="href"
        :title="`${title} - ${name}`"
        :target="target">

      <span class="sr-only">
        {{`${title} - ${name}`}}
      </span>

      <template v-if="image != ''">
        <div
          class="headshot"
          :style="`background-image: url(${image});`"></div>
      </template>

      <template v-else>
        <div class="headshot">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z" class=""></path></svg>
        </div>
      </template>
    </a>
  </component>
</template>

<script>
/**
 * SOON TO BE PORTED BACK TO THE COBDS
 * Should also soon be used on the search result index
 */
export default {
  name: "homepageHeadshot",
  status: "ready",
  release: "1.0.0",
  metaInfo: {
    title: "Homepage Headshot Component | COB Design System",
  },
  props: {
    /**
     * The element used for Modals.
     * `div`
     */
    wrapper: {
      type:         String,
      default:      "span",
      validator:    value => {
        return value.match(/(span)/)
      },
    },
    href: {
      type:         String,
      default:      null,
    },
    title: {
      type:         String,
      defaut:       null,
    },
    name: {
      type:         String,
      defaut:       null,
    },
    target: {
      type:         String,
      default:      "_blank",
    },
    image: {
      type:         String,
      defaut:       null,
    }
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss">
a {
  display: inline-block;
  border-radius: 50%;
  margin: 0 10px 0 0;
  border: 3px dashed transparent;

  svg {
    position: relative;
    top: -1px;
    left: -1px;
    width: 50px;
    height: 50px;

    path {
      fill: rgba(255, 255, 255, 0.6);
    }
  }

  &:focus,
  &:hover {
    outline: none;
    border: 3px dashed white;
  }
}

.headshot {
  position: relative;
  display: block;
  width: 50px;
  height: 50px;
  margin: 0;
  border-radius: 50%;
  border: 1px solid $color-blue-darker;
  background-position: top center;
  background-repeat: no-repeat;
  background-size: cover;

  &:after {
    z-index: -1;
    position: absolute;
    content: '';
    width: 50px;
    height: 50px;
    left: -2px;
    bottom: -5px;
    display: block;
    border-radius: 50%;
    background-color: darken($color-blue-darker, 5%);
  }
}
</style>

<docs>
  ```jsx```
</docs>