
<template>
<v-container class="pa-4" custom depressed
width="auto">
<!-- <v-tabs> -->
  <!-- <v-tab>Library</v-tab> -->
  <!-- <v-tab>Samples</v-tab> -->
<!-- </v-tabs> -->

<div>
<v-select depressed
  min-width="10%"
  :items="items"
  label=""
  v-model="index"
  class="custom">
</v-select>

<Library v-if="index == 'Library'" />
<Samples v-if="index == 'Samples'" />
    <!-- <v-menu open-on-hover offset-y depresssed align="end"> -->
    <!-- <template v-slot:activator="{on, attrs}"> -->
    <!-- <v-btn text color="" v-bind="attrs" v-on="on">Characters -->
      <!-- <v-img -->
    <!-- src='@/assets/menu_drawer.png' -->
    <!-- width="12" -->
    <!-- class="ml-2" -->
    <!-- contain></v-img > -->
    <!-- </v-btn> -->
    <!-- </template> -->
   <!-- <v-list> -->
    <!-- <v-list-item -->
    <!-- v-for="(item2, index2) in items2" -->
    <!-- :key="index2" -->
    <!-- @click="index2"> -->
    <!-- <v-list-item-title>{{item2.title2}}</v-list-item-title> -->
    <!-- </v-list-item> -->
    <!-- </v-list> -->
    <!-- </v-menu> -->
</div>

</v-container>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import Library from './Library.vue'
import Samples from './Samples.vue'

export default {
  components: {
    Library,
    Samples
  },
  data: () => ({
    index: 'Library',
    items: [
      { text: 'Library' },
      { text: 'Samples' }]
  })
}
</script>
