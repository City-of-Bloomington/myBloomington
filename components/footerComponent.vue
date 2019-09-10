<template>
  <footer>
    <div class="container">
      <p>City staff strives to keep complete and accurate information and regrets any errors or omissions.</p>

      <p>The information reported comes from the <strong>City of Bloomington Geographic Information Systems (GIS)</strong> and related databases.</p>

      <p>To report missing City of Bloomington addresses or other profile errors, please contact the City of Bloomington GIS Staff at <strong>812-349-3454</strong> or <strong>email</strong> us at <a href="mailto: gis@bloomington.in.gov">gis@bloomington.in.gov</a>.</p>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
footer {
  margin: 60px 0;

  .container {
    padding: 60px 0 0 0;
    border-top: 1px solid $color-grey;
  }

  p {
    color: $text-color;
    margin: 0 0 20px 0;
  }

  @media (max-width: 575px) {
    margin: 60px 0 0 0;

    .container {
      width: 100%;
      padding: 20px;
    }
  }
}
</style>