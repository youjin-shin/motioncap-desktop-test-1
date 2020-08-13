<template>

 <v-container fill-height>
<!-- <v-tabs> -->
  <!-- <v-tab>Library</v-tab> -->
  <!-- <v-tab>Samples</v-tab> -->
<!-- </v-tabs> -->

<v-card-title class="">
    <v-btn text
     class="mr-auto">
     Samples
    <v-img
    src='@/assets/menu_drawer.png'
    width="16"
    class="ml-2"
    ></v-img >
    </v-btn>

    <v-btn text class="">
    Characters
    <v-img
    src='@/assets/menu.png'
    width="12"
    class="ml-2"
    contain></v-img >
        </v-btn>
</v-card-title>
  <v-text-field

  outlined
  label="Search Samples"
  prepend-inner-icon="mdi-magnify"
  class="ma-0 pa-0 ">
  </v-text-field>

  <v-select
:item="item"
v-model="e2"
label="">
  </v-select>

    <v-row dense>
    <v-col
    v-for="(element, i) in cards"
    :key="i"
    :cols="4">

    <v-card depressed
    class="ma-0">

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
    item: [
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
