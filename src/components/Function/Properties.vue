<template>
  <v-treeview :items="items"></v-treeview>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        id: 1,
        name: 'Transform',
        children: [
          { id: 2, name: 'Location' },
          { id: 3, name: 'Rotation' },
          { id: 4, name: 'Scale' }
        ]
      },
      {
        id: 5,
        name: 'Interpolation',
        children: [
          {
            id: 6,
            name: 'vuetify :',
            children: [
              {
                id: 7,
                name: 'src :',
                children: [
                  { id: 8, name: 'index : ts' },
                  { id: 9, name: 'bootstrap : ts' }
                ]
              }
            ]
          },
          {
            id: 10,
            name: 'Collections',
            children: [
              {
                id: 11,
                name: 'src :',
                children: [
                  { id: 12, name: 'v-btn : ts' },
                  { id: 13, name: 'v-card : ts' },
                  { id: 14, name: 'v-window : ts' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 15,
        name: 'Instancing',
        children: [
          { id: 16, name: 'October : pdf' },
          { id: 17, name: 'November : pdf' },
          { id: 18, name: 'Tutorial : html' }
        ]
      },
      {
        id: 19,
        name: 'Motion Paths',
        children: [
          {
            id: 20,
            name: 'Tutorials',
            children: [
              { id: 21, name: 'Basic layouts : mp4' },
              { id: 22, name: 'Advanced techniques : mp4' },
              { id: 23, name: 'All about app : dir' }
            ]
          },
          { id: 24, name: 'Intro : mov' },
          { id: 25, name: 'Conference introduction : avi' }
        ]
      },
      {
        id: 26,
        name: 'Visibility',
        children: [
          { id: 27, name: 'October : pdf' },
          { id: 28, name: 'November : pdf' },
          { id: 29, name: 'Tutorial : html' }
        ]
      },
      {
        id: 30,
        name: 'Viewpoint Display',
        children: [
          { id: 31, name: 'October : pdf' },
          { id: 32, name: 'November : pdf' },
          { id: 33, name: 'Tutorial : html' }
        ]
      },
      {
        id: 34,
        name: 'Custom Properties',
        children: [
          { id: 35, name: 'October : pdf' },
          { id: 36, name: 'November : pdf' },
          { id: 37, name: 'Tutorial : html' }
        ]
      }
    ]
  })
}
</script>
