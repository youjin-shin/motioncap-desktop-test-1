<template>
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
</template>

<script>
export default {
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
}
</script>
