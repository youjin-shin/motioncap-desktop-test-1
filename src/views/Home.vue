<template>
<div>
  <v-container >
  <v-row>
  <div>
       <RenderingSection @initTimeline="initTimeline"/>
  </div>
  </v-row>
  <v-row>
  <div>
      <TimelineSection ref="TimelineSection"/>
  </div>
  </v-row>
  </v-container>
</div>
</template>

<script>
// @ is an alias to /src
import RenderingSection from '@/components/Rendering/RenderingSection.vue'
import TimelineSection from '@/components/Rendering/Timeliner.vue'

export default {
  name: 'Home',
  components: {
    RenderingSection,
    // eslint-disable-next-line vue/no-unused-components
    TimelineSection

  },
  data () {
    return {
      isTimelinerInit: false,
      objects: [],
      scene: undefined,
      render: undefined
    }
  },
  methods: {
    initTimeline (scene, objects, render) {
      this.$refs.TimelineSection.init(scene, objects, render)
    }
  }
}
</script>
