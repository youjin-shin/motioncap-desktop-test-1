import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        primary: '#1f1f1f',
        secondary: '#b4b4b4',
        accent: '#222222',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
      light: {

        primary: '#f5f5f5',
        secondary: '#424242',
        accent: '#e6e6e6',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      }
    }
  }
})

// a: '#f5f5f5', // base
// b: '#e6e6e6', // dark
// c: '#2a2a2a', // text
// d: '#bbbbbb' // background
