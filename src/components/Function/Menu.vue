<template>
  <v-card depressed
  class="ma-0 pa-0"
  >
  <div>
    <v-menu open-on-hover offset-y depressed>
      <template v-slot:activator="{ on, attrs }">
   <v-btn text
    v-bind="attrs"
    v-on="on">
    Function
    <v-model></v-model>
    <v-img
    src='@/assets/menu.png'
    width="12"
    class="ml-2"
    contain></v-img >
    </v-btn>
      </template>
      <v-list max-height="100%" activator>
        <v-list-item
        v-for="(item, index) in items"
        :key="index"
        @click="index">
        <v-icon class="mr-2"> mdi-menu-right-outline </v-icon>
        <v-list-item-title > {{ item.title }} </v-list-item-title>
        </v-list-item>
      </v-list>
  </v-menu>
  </div>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: 'Rigging' },
      { title: 'Lighting' },
      { title: 'Rendering' },
      { title: 'Properties' }
    ]
  })
}
</script>
