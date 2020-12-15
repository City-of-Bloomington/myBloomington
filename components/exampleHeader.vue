<template>
  <component :is="type">
    <div :class="['menu-container', { contained: contained }]">
      <a v-if="logo" class="logo" :href="logo.url" :title="logo.imageAlt">
        <img v-if="logo" :src="logo.image" :alt="logo.imageAlt" />
      </a>

      <a
        v-if="application"
        class="name"
        :href="application.url"
        v-html="application.name"
        :target="application.target"
        :title="application.name"
      ></a>

      <div class="nav-items">
        <nav v-if="navItems" id="navigation" role="navigation" aria-labelledby="navigation">
          <ul>
            <li v-for="(item, index) in navItems" :key="index">
              <a
                :href="item.href"
                :class="item.class"
                :disabled="item.disabled"
                :title="item.name"
                :target="item.target"
                v-html="item.name"
              ></a>
            </li>
          </ul>
        </nav>

        <slot name="dropdown"></slot>

        <nav
          v-if="subNavItems"
          role="sub navigation"
          id="sub-navigation"
          aria-labelledby="sub-navigation"
        >
          <ul>
            <li v-for="(item, index) in subNavItems" :key="index">
              <a
                :href="item.href"
                :class="item.class"
                :disabled="item.disabled"
                :title="item.name"
                :target="item.target"
                v-html="item.name"
              ></a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </component>
</template>

<script>
/**
 * Used as the Header template.
 */
export default {
  name: "example-header",
  status: "ready",
  release: "1.0.0",
  props: {
    /**
     * The html element name used for the nav bar.
     * `header`
     */
    type: {
      type: String,
      default: "header",
      validator: (value) => {
        return value.match(/(header)/);
      },
    },
    /**
     * Application information, name & url.
     */
    application: {
      type: Object,
      default: null,
    },
    /**
     * Menu items to be displayed on the nav bar.
     */
    navItems: {
      type: Array,
      default: null,
    },
    /**
     * Displays sub-navigation menu items.
     */
    subNavItems: {
      type: Array,
      default: null,
    },
    /**
     * Displays the City of Bloomington snowflake logo.
     *
     * size: `55px x 55px`
     */
    logo: {
      type: Object,
      default: null,
      required: true,
    },
    /**
     * Determines if the header should fully expand or be contained.
     */
    contained: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  display: flex;
  flex-wrap: wrap;
  font-family: $font-text;
  width: 100%;
  background: white;
  border-top: 4px solid $color-blue;
  // border-bottom: 1px solid $color-grey;
  padding: 15px 20px;

  .menu-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;

    &.contained {
      margin: 0 auto;
      width: 1080px;

      nav {
        &[role="sub navigation"] {
          margin: 15px 0 0 0;
        }
      }
    }

    a {
      text-decoration: none;

      &.logo {
        margin: 0 20px 0 0;

        @media (max-width: 767px) {
          background-image: url("../assets/images/cob-badge.svg");
          height: 30px;
          width: 30px;
          margin: 0 10px 0 0;

          img {
            display: none;
          }
        }

        img {
          height: 55px;
        }
      }

      &.name {
        border-radius: 0;
        color: $text-color;
        font-size: 14px;
        text-transform: uppercase;
        font-weight: 600;
        border-left: 2px solid $color-grey;
        padding: 0 0 0 20px;

        @media (max-width: 767px) {
          padding: 0 0 0 10px;
        }
      }
    }

    .nav-items {
      display: flex;
      margin: 0 0 0 auto;
    }
  }

  nav {
    display: flex;
    align-items: center;
    align-self: center;
    // margin: 0 0 0 auto;

    &.navigation-dropdown {
      margin: 0 0 0 20px;

      ::v-deep ul {
        box-shadow: 0 1px 5px 0 rgba(70, 70, 70, 0.164);

        li {
          padding: 5px 10px;

          a {
            color: $text-color;
          }
        }
      }
    }

    &:not(.navigation-dropdown) {
      margin: 0 0 0 auto;

      ul {
        display: flex;
        align-items: center;
        align-self: center;
        margin: 0;
        padding: 0;
        list-style: none;

        li {
          font-size: 16px;
          margin: 0 20px 0 0;

          &:last-of-type {
            margin: 0;
          }

          a {
            font-size: 16px;
            width: auto;
            height: auto;
            color: $text-color;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }

    &[role="sub navigation"] {
      display: block;

      background: tint($color-blue, 10%);
      width: calc(100% + 40px);
      margin: 15px -20px 0 -20px;
      padding: 5px 20px;

      ul {
        li {
          a {
            font-size: $size-s;
            color: white;
          }
        }
      }
    }
  }
}
</style>