<template>
  <div>
    <div><headerComponent /></div>
      <div><nuxt /></div>
    <div><footerComponent /></div>
  </div>
</template>

<script>
import headerComponent      from '~/components/headerComponent'
import footerComponent      from '~/components/footerComponent'

export default {
  components: { headerComponent, footerComponent },
}
</script>