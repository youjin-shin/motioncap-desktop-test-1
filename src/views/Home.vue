<template>
<v-container
  class="main-container px-7"
  fluid
  fill-height
>
<v-layout row wrap>
  <v-row>
    <v-col cols="2.5" class="pa-1">
      <div class="section-card ">
      <Directory />
      </div>
    </v-col>
<!-- style="align-self: baseline" -->
    <v-col cols="7" class="pa-1" >
      <div class="section-card">
        <RenderingSection @initTimeline="initTimeline"/>
      </div>
    </v-col>
    <v-col cols="2.5" class="pa-1">
      <div class="section-card ">
      <Menu />
      </div>
    </v-col>
    <v-col cols="12" class="pa-1">
    <div class="section-card pa-2">
      <TimelineSection ref="TimelineSection"/>
    </div>
    </v-col>
  </v-row>

  <!-- <v-row>
  </v-row> -->
</v-layout>

</v-container>
</template>

<style>
.main-container {
  background: #e6e6e6;
}
.section-card {
  border-radius: 5px 5px;
  overflow: hidden;
  background: #f5f5f5;
  height: 100%;
}
</style>

<script>
// @ is an alias to /src
import RenderingSection from '@/components/Rendering/RenderingSection.vue'
import Samples from '@/components/Directory/Samples.vue'
import Properties from '@/components/Function/Properties.vue'
import TimelineSection from '@/components/Rendering/Timeliner.vue'
import Directory from '@/components/Directory/Directory.vue'
import Menu from '@/components/Function/Menu.vue'

export default {
  name: 'Home',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    RenderingSection,
    // eslint-disable-next-line vue/no-unused-components
    Samples,
    // eslint-disable-next-line vue/no-unused-components
    Properties,
    // eslint-disable-next-line vue/no-unused-components
    TimelineSection,
    Directory,
    Menu

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
