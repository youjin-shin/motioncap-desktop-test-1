/* eslint-disable vue/no-unused-components */
<template>
  <v-container>
    <!--  class="ma-0 pa-0" -->
    <v-row fill-height="100%">
      <v-col cols="2.5" class="ma-0 pa-0" fill-height="100%">
          <div>
            <Samples fill-height="100%" />
          </div>

      </v-col >
      <v-col fill-height="100%" cols="7"  class="ma-0 pa-0" height="100%">
          <div>
          <RenderingSection fill-height="100%" />
          </div>
      </v-col>
      <v-col cols="2.5" class="ma-0 pa-0" fill-height="100%">
          <div>
          <Properties fill-height="100%" />
          </div>
      </v-col>
    </v-row>
    <v-row>
      <!--타임라이너 -->
          <!-- <v-col cols="6" class="ma-0 pa-0" height="100"> -->
        <!-- <v-card class="ma-0 pa-0"> -->
        <!-- <div> -->
      <!-- <Timeliner /> -->
      <!-- </div> -->
      <!-- </v-card> -->
            <!-- </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import RenderingSection from '@/components/Rendering/RenderingSection.vue'
import Samples from '@/components/Samples.vue'
import Properties from '@/components/Properties.vue'
// import Directory from '@/components/Directory.vue'
// import Timeliner from '@/components/Rendering/Timeliner.vue'

export default {
  name: 'Home',
  components: {
    RenderingSection, Samples, Properties
    // , Directory
  }
}
</script>
