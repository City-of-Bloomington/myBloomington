<template>
  <div>
    <headerComponent />
      <nuxt />
    <footerComponent />
  </div>
</template>

<script>
import headerComponent      from '~/components/headerComponent'
import footerComponent      from '~/components/footerComponent'

export default {
  components: { headerComponent, footerComponent },
}
</script>