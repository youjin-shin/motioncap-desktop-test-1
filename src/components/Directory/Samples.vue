<template>

 <v-container fill-height>
<!-- <v-tabs> -->
  <!-- <v-tab>Library</v-tab> -->
  <!-- <v-tab>Samples</v-tab> -->
<!-- </v-tabs> -->

  <v-text-field
  outlined
  label="Search Samples"
  prepend-inner-icon="mdi-magnify"
  class="ma-0 pa-0 ">
  </v-text-field>

<v-divider></v-divider>
  <v-select
:items="items"
v-model="e2"
label="">
  </v-select>

    <v-row dense>
    <v-col
    v-for="(element, i) in cards"
    :key="i"
    :cols="4">

    <v-card depressed
    class="ma-2">

      <v-img
      v-bind:src="element.src"
      contain
      max-height="100%"></v-img>
    </v-card>
    </v-col>
    </v-row>
    </v-container>
</template>

<script>
export default {
  data: () => ({
    items: [
      { text: 'Character' },
      { text: 'Sound' },
      { text: 'Motion' }]
  })
}
</script>

<script>
  data: () => ({
    cards: [
      { title: 'ironman', src: require('@/assets/ironman.png'), flex: 4 },
      { title: 'Rupy', src: require('@/assets/Rupy.png'), flex: 4 },
      { title: 'ninja', src: require('@/assets/ninja.png'), flex: 4 },
      { title: 'ironman', src: require('@/assets/ironman.png'), flex: 4 },
      { title: 'Rupy', src: require('@/assets/Rupy.png'), flex: 4 },
      { title: 'ninja', src: require('@/assets/ninja.png'), flex: 4 },
      { title: 'ironman', src: require('@/assets/ironman.png'), flex: 4 },
      { title: 'Rupy', src: require('@/assets/Rupy.png'), flex: 4 },
      { title: 'ninja', src: require('@/assets/ninja.png'), flex: 4 }
    ]
  })
</script>
