<template>
  <div>
    <div><headerComponent /></div>
    <div><nuxt /></div>
  </div>
</template>

<script>
import headerComponent      from '~/components/headerComponent'

export default {
  components: { headerComponent },
}
</script>