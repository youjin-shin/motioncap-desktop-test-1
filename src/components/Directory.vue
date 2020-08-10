<template>
<div class="text-center">
    <v-menu offset-y>
    <template v-slot:activator="{on, attrs}">
    <v-btn
    color="blue"
    dark
    v-bind="attrs"
    v-on="on">
    Directory
    </v-btn>
    </template>

    <v-list>
    <v-list-item
    v-for="(item, index) in items"
    :key="index"
    @click="foo">
    <v-list-item-title>{{item.title}}</v-list-item-title>
    </v-list-item>
    </v-list>
    </v-menu>
</div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: 'Library' },
      { title: 'Samples' }
    ]
  })
}
</script>
