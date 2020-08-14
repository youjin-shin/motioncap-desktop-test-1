<template>

  <div class="pa-4">
    <!-- <v-menu open-on-hover offset-y depressed>
    <template v-slot:activator="{ on, attrs }">
   <v-btn text
    v-bind="attrs"
    v-on="on">
    Function
    <v-img
    src='@/assets/menu.png'
    width="12"
    class="ml-2"
    contain></v-img >
    </v-btn>
      </template>

      <v-list max-height="100%" activator>
        <v-list-item
        v-for="(item, indexs) in items"
        :key="indexs"
        @click="indexs">
        <v-icon class="mr-2"> mdi-menu-right-outline </v-icon>
        <v-list-item-title > {{ item.title }} </v-list-item-title>
        </v-list-item>
        <v-list-item>
          </v-list-item>
      </v-list>
      </v-menu> -->
<v-select dense
  min-width="10%"
  :items="items"
  label=""
  v-model="index"
  class="pa-2">
</v-select>
      <Rigging v-if="index == 'Rigging'" />
      <Lighting v-if="index == 'Lighting'" />
      <Rendering v-if="index == 'Rendering'" />
      <Properties v-if="index == 'Properties'" />
  </div>

</template>

<script>
import Rigging from './Rigging.vue'
import Lighting from './Lighting.vue'
import Properties from './Properties.vue'
import Rendering from './Rendering.vue'

export default {
  components: {
    Rigging,
    Lighting,
    Properties,
    Rendering
  },

  data: () => ({
    index: 'Rigging',
    items: [
      { text: 'Rigging' },
      { text: 'Lighting' },
      { text: 'Rendering' },
      { text: 'Properties' }]
  })
}
</script>
