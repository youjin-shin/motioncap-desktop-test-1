/* eslint-disable vue/no-unused-components */
<template>
  <v-container>
    <v-layout row wrap>
      <v-flex lg2 order-lg1>
        <v-card tile flat class="ma-0 pa-0">
          <div>
            <Samples />
          </div>
        </v-card>
      </v-flex>
      <v-flex lg8 order-lg2>
        <v-card fluid class="ma-0 pa-0">
          <div>
          <RenderingSection />
          </div>
        </v-card>
      </v-flex>
      <v-flex lg2 order-lg3>
        <v-card fluid class="ma-0 pa-0">
          <div>
          <Rigging />
          </div>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
          <v-flex lg10 order-lg2>
        <v-card depressed
        class="ma-0 pa-0"
        weight="auto"
        max-height="auto">
        <div>
          <Track />
        </div>
        </v-card>
      </v-flex>
    </v-layout>

      <v-flex lg2 order-lg1>
        <v-card fluid
        class="ma-0 pa-0">
          <div>
            <Body />
          </div>

        </v-card>
      </v-flex>

      <v-flex lg2 order-lg3>
        <v-card fluid
        class="ma-0 pa-0">
        </v-card>
      </v-flex>
  </v-container>
</template>

<script>
// @ is an alias to /src
import RenderingSection from '@/components/Rendering/RenderingSection.vue'
import Samples from '@/components/Samples.vue'
import Body from '@/components/Body.vue'
import Rigging from '@/components/Rigging.vue'
import Track from '@/components/Track.vue'

export default {
  name: 'Home',
  components: {
    RenderingSection, Samples, Body, Rigging, Track
  }
}
</script>
