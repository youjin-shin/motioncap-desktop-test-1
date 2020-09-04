/* eslint-disable no-unused-vars */
<template>

 <v-container fill-height>
<!-- <v-tabs> -->
  <!-- <v-tab>Library</v-tab> -->
  <!-- <v-tab>Samples</v-tab> -->
<!-- </v-tabs> -->

  <v-text-field outlined
  label="Search Samples"
  prepend-inner-icon="mdi-magnify"
  class="ma-0 pa-0 ">
  </v-text-field>

<v-select depressed class="custom ma-0 pa-0" autowidth
:items="items"
v-model="index">
  </v-select>

<Character v-if="index == 'Character'" />
<Sound v-if="index == 'Sound'" />
<Motion v-if="index == 'Motion'" />

    </v-container>
</template>

<style>
.custom.v-text-field>.v-input__control>.v-input__slot:before {
    border-style: none;
}
.custom.v-text-field>.v-input__control>.v-input__slot:after {
    border-style: none;
}
</style>

<script>
/* eslint-disable vue/no-unused-components */
import Character from './Character.vue'
import Motion from './Motion.vue'
import Sound from './Sound.vue'

export default {
  components: {
    Character,
    Motion,
    Sound
  },
  data: () => ({
    items: [
      { text: 'Character' },
      { text: 'Sound' },
      { text: 'Motion' }]
  })
}
</script>
