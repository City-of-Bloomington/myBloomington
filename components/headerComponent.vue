<template>
  <div>
    <example-header
      :logo="{
        url: `${cobSiteUrl}`,
        image: `${headerLogo}`,
        imageAlt: `${nameOfCity}`
      }"
      :application="showAppUrl"
      :navItems="showHeaderUrls"
    >
    </example-header>
  </div>
</template>

<script>
import exampleHeader from "~/components/exampleHeader.vue";
import { mapFields } from "vuex-map-fields";

export default {
  props: {
    redirect: {
      type: Boolean,
      default: false
    }
  },
  components: { exampleHeader },
  data() {
    return {
      headerLogo: require("../assets/images/cob-logo-horizontal.svg")
    };
  },
  computed: {
    showHeaderUrls() {
      return [
        {
        name: "Help",
        href: `help`
      },{
        name: "Feedback",
        href: `https://bloomington.in.gov/ureport/miscellaneous/53`
      }];
    },
    showAppUrl() {
      return {
          name: `${process.env.appName}`,
          url: `/${process.env.frontEndBase}`
        }
    },
    cobSiteUrl() {
      return process.env.baseUrl;
    },
    nameOfCity() {
      return process.env.cityName;
    },
    api() {
      return process.env.apiHost;
    },
    client() {
      return process.env.clientHost;
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  z-index: 10;
  border-bottom: $border-default;

  .auth {
    padding: 5px 10px;
  }
}
</style>
