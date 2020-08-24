<template>
<v-container
  class="main-container px-0"
  fluid
  fill-height
  align-start
>
  <v-container
    class="main-container px-7 py-0"
    fluid

  >
    <v-row>
      <v-col cols="2" class="" style="padding: 2px;">
        <div class="section-card ">
        <!-- <Samples /> -->
        </div>
      </v-col>
  <!-- style="align-self: baseline" -->
      <v-col  cols="8" class=""  style="padding: 2px;">
        <div class="section-card">
          <RenderingSection @initTimeline="initTimeline"/>
        </div>
      </v-col>
      <v-col cols="2" class=""  style="padding: 2px;">
        <div class="section-card ">
        <!-- <Properties/> -->
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-container
    class="main-container px-7 py-0"
    fluid
  >
    <v-row style="height: 31vh" >
      <v-col cols="12" class="py-0" style="padding: 2px;" >
      <div  class="section-card pa-2 pt-0">
        <TimelineSection ref="TimelineSection"/>
      </div>
      </v-col>
    </v-row>

  </v-container>

</v-container>
</template>

<style>
.main-container {
  background: #222222;
}
.section-card {
  border-radius: 5px 5px;
  overflow: hidden;
  background: #1f1f1f;
  height: 100%;
}
</style>

<script>
// @ is an alias to /src
import RenderingSection from '@/components/Rendering/RenderingSection.vue'
import Samples from '@/components/Samples.vue'
import Properties from '@/components/Properties.vue'
import TimelineSection from '@/components/Rendering/Timeliner.vue'

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
