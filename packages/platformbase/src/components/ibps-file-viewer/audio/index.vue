<template>
  <vue-aplayer
    :music="music"
  />
</template>
<script>
import VueAPlayer from 'vue-aplayer'
export default {
  name: 'IbpsFileAudio',
  components: {
    'vue-aplayer': VueAPlayer
  },
  props: {
    url: {
      type: String
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      music: {
        title: this.title,
        author: '',
        src: this.url
      }
    }
  }
}
</script>
