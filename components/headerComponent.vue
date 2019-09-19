<template>
  <div v-cloak>
    <fn1-header
      :logo="{
        url:          `${baseUrl}`,
        image:        `${headerLogo}`,
        imageAlt:     `${cityName}`
      }"

      :logoHeadings="{
        topHeading:   `${logoHeading}`,
        subHeading:   `${logoSubHeading}`,
      }"

      :application="{
        name:         `${appName}`,
        url:          `${baseUrl}${frontEndBase}`
      }"

      :navItems="[
        { name:       'Help',
          href:       'help' },
        { name:       'Feedback',
          href:       `${baseUrl}ureport/miscellaneous/53`}
      ]"
      :subNavItems="null">
    </fn1-header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoHeading:        process.env.logoHeading,
      logoSubHeading:     process.env.logoSubHeading,
      headerLogo:         'city-of-bloomington-logo.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
  [v-cloak] { display: none; }
  header {
    padding: 15px 20px !important;
    border-bottom: 1px solid $color-grey;

    ::v-deep a {
      &:first-of-type {
        img {
          @media (max-width: 575px) {
            width: 35px !important;
            height: 35px !important;
            margin: 0 !important;
          }
        }
      }
    }


  }

  @media (max-width: 575px) {
    header {
      ::v-deep div {

        a > :not(nav) {
        }
      }

      ::v-deep a {

        h1, h2 {
          display: none;
        }
      }
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    header {
      ::v-deep a {
        &:first-of-type {

          img {
            width: 35px !important;
            height: 35px !important;
            margin: 0 !important;
          }
        }

        h1, h2 {
          display: none;
        }
      }
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {

  }
</style>