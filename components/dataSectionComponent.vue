<template>
  <component
    :is="wrapper"
    class="data-section">
    <header>
      <h2
        v-if="title"
        v-html="title"></h2>

      <div v-if="$slots.icon || $slots.excerpt">
        <slot
          v-if="$slots.icon"
          name="icon" />
        <slot
          v-if="$slots.excerpt"
          name="excerpt" />
      </div>
    </header>

    <slot
      v-if="$slots.officials"
      name="officials" />

    <slot
      v-if="$slots.locations"
      name="locations" />

    <slot
      v-if="$slots.table"
      name="table" />
  </component>
</template>

<script>
/**
 * SOON TO BE PORTED BACK TO THE COBDS
 */
export default {
  name: "dataSectionComponent",
  status: "ready",
  release: "1.0.0",
  metaInfo: {
    title: "Data Section Component | COB Design System",
  },
  props: {
    wrapper: {
      type:         String,
      default:      "section",
      validator: value => {
        return value.match(/(section)/)
      },
    },
    title: {
      type:         String,
      default:      null,
    }
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss">
  .data-section {

    header {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;

      div {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        margin: 0 0 40px 0;
      }

      svg {
        color: $color-silver;
        width: 50px;
        height: 50px;
        margin: 0 40px 0 0;
      }

      

      blockquote {
        width: calc(100% - 90px);
        margin: 0;
        padding: 0 0 0 40px;
        font-size: 18px;

        p {
          width: 100%;
          color: lighten($text-color, 5%);
          margin: 0 0 10px 0;

          &:last-of-type {
            margin: 0;
          }
        }
      }
    }

    p {
      font-size: 18px;
      color: red;
      // color: lighten($text-color, 5%);
      margin: 0 0 10px 0;
    }
  }
</style>

<docs>
  ```jsx```
</docs>