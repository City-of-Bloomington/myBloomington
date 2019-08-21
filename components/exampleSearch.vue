<template>
  <component :is="wrapper" :class="['field-group']">
    <label :for="id" v-if="label">{{ label }}</label>
    <input
      autocomplete="off"
      :id="id"
      :disabled="disabled"
      :type="type"
      :value="value"
      :name="name"
      :class="state"
      :placeholder="placeholder"
      @input="onInput($event.target.value)"
      @focus="onFocus($event.target.value)"
    />
    <button
      :for="id"
      :type="buttonType"
      v-if="buttonValue"
      v-html="buttonValue"></button>
  </component>
</template>

<script>
/**
 * Defines a single-line search field that a user can enter text into.
 */
export default {
  name: "exampleSearch",
  status: "ready",
  release: "1.0.0",
  props: {
    /**
     * The type of the form input field.
     * `search`
     */
    type: {
      type: String,
      default: "search",
      validator: value => {
        return value.match(/(search)/)
      },
    },
    /**
     * Text value of the text input.
     * @model
     */
    value: {
      type: String,
      default: null,
    },
    /**
     * The placeholder value for the search input.
     */
    placeholder: {
      type: String,
      default: null,
    },
    /**
     * The label of the text input.
     */
    label: {
      type: String,
      default: null,
    },
    /**
     * The button text of the search input.
     */
    buttonValue: {
      type: String,
      default: null,
    },
    /**
     * The button type of the search input.
     */
    buttonType: {
      type: String,
      default: "submit",
    },
    /**
     * The name of the search input.
     */
    name: {
      type: String,
      default: null,
    },
    /**
     * The html element name used for the wrapper.
     * `div`
     */
    wrapper: {
      type: String,
      default: "div",
      validator: value => {
        return value.match(/(div)/)
      },
    },
    /**
     * Unique identifier of the search input.
     */
    id: {
      type: String,
      default: null,
    },
    /**
     * Whether the form input field is disabled or not.
     * `true, false`
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Manually trigger various states of the input.
     * `hover, active, focus`
     */
    state: {
      type: String,
      default: null,
      validator: value => {
        return value.match(/(hover|active|focus)/)
      },
    },
  },
  methods: {
    onInput(value) {
      this.$emit("input", value)
    },
    onFocus(value) {
      this.$emit("focus", value)
    },
  },
}
</script>

<style lang="scss">
.field-group {
  display: flex;
  flex-wrap: wrap;

  input {
    &[type="search"] {
      flex: 1 1 auto;
      width: 1%;
      -webkit-border-radius: 3px;
      -webkit-border-top-right-radius: 0;
      -webkit-border-bottom-right-radius: 0;
      -moz-border-radius: 3px;
      -moz-border-radius-topright: 0;
      -moz-border-radius-bottomright: 0;
      border-radius: 3px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  button {
    &[type="submit"] {
      border-top: 1px solid $color-blue;
      border-right: 1px solid $color-blue;
      border-bottom: 1px solid $color-blue;
      margin-left: auto;
      -webkit-border-radius: 0;
      -webkit-border-top-right-radius: 3px;
      -webkit-border-bottom-right-radius: 3px;
      -moz-border-radius: 0;
      -moz-border-radius-topright: 3px;
      -moz-border-radius-bottomright: 3px;
      border-radius: 0;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;

      svg {
        display: block;
        height: 20px;
        width: 20px;
      }
    }
  }
}
</style>

<docs>
  ```jsx
  <div>
    <fn1-search
      buttonValue="Go"
      placeholder="Search for it"
      name="search"
      id="search" />
  </div>
  ```
</docs>
