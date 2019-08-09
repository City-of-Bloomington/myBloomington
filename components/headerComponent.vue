<template>
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
</template>

<script>
export default {
  data() {
    return {
      appName:            process.env.appName,
      baseUrl:            process.env.baseUrl,
      frontEndBase:       process.env.frontEndBase,
      cityName:           process.env.cityName,
      logoHeading:        process.env.logoHeading,
      logoSubHeading:     process.env.logoSubHeading,
      headerLogo:         'city-of-bloomington-logo.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  padding: 15px 20px !important;
}
</style>