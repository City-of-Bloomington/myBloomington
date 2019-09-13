<template>
  <div>
    <div><headerComponent /></div>
    <div>
      <noScript />
      <nuxt />
    </div>
  </div>
</template>

<script>
import headerComponent  from '~/components/headerComponent'
import noScript         from '~/components/noScript'

export default {
  components: { headerComponent, noScript },
}
</script>