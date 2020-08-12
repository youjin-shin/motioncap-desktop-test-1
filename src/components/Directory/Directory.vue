<template>
<v-container fluid class="ma-0 pa-0" depressed>
<!-- <v-tabs> -->
  <!-- <v-tab>Library</v-tab> -->
  <!-- <v-tab>Samples</v-tab> -->
<!-- </v-tabs> -->

    <div>
    <!-- <v-menu open-on-hover offset-y depresssed> -->
    <!-- <template v-slot:activator="{on, attrs}"> -->
    <!-- <v-btn text color="" v-bind="attrs" v-on="on">Directory -->
      <!-- <v-select :items="items"> -->
            <!-- </v-select> -->
      <!-- <v-img -->
    <!-- src='@/assets/menu_drawer.png' -->
    <!-- width="12" -->
    <!-- class="ml-2" -->
    <!-- contain></v-img > -->
    <!-- </v-btn> -->
    <!-- </template> -->

    <!-- <v-list> -->
    <!-- <v-list-item -->
    <!-- v-for="(item, index) in items" -->
    <!-- :key="index" -->
    <!-- @click="index"> -->
    <!-- <v-list-item-title>{{item.title}}</v-list-item-title> -->
    <!-- </v-list-item> -->
    <!-- </v-list> -->
    <!-- </v-menu> -->

<v-select outilne
min-width="10%"
:items="items"
v-model="e1"
label=""
border: none
>
</v-select>

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
export default {
  data: () => ({
    items: [
      { text: 'Library' },
      { text: 'Samples' }]
  })
}
</script>
