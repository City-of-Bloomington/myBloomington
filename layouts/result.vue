<template>
  <div>
    <div><headerComponent /></div>
      <div>
        <noScript />
        <nuxt />
      </div>
    <div><footerComponent /></div>
  </div>
</template>

<script>
import headerComponent      from '~/components/headerComponent'
import noScript             from '~/components/noScript'
import footerComponent      from '~/components/footerComponent'

export default {
  components: { headerComponent, footerComponent, noScript},
}
</script>