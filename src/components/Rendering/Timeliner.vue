<template>
  <div ref="container" id="container" style="height: 100%;"></div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
import * as THREE from '@/plugins/rendering/build/three.module'
import { Timeliner } from '@/plugins/rendering/js/libs/TimelinerGUI/timeliner.js'
import { TimelinerController } from '@/plugins/rendering/jsm/controls/TimelinerController.js'
export default {
  data () {
    return {
      container: undefined,
      trackInfo: []
    }
  },
  methods: {
    init (scene, objects, render) {
      this.container = this.$refs.container

      for (var i = 0; i < objects.length; i++) {
        var vectorValue = Object.values(objects[i].position)
        var quaternionValue = Object.values(objects[i].quaternion)
        quaternionValue.pop()

        this.trackInfo.push({
          type: THREE.VectorKeyframeTrack,
          propertyPath: objects[i].name + '.position',
          initialValue: vectorValue,
          interpolation: THREE.InterpolateSmooth
        })

        this.trackInfo.push(
          {
            type: THREE.QuaternionKeyframeTrack,
            propertyPath: objects[i].name + '.quaternion',
            initialValue: quaternionValue,
            interpolation: THREE.InterpolateLinear

          })
      }

      // console.log(this.trackInfo)

      // eslint-disable-next-line no-new
      new Timeliner(new TimelinerController(scene, this.trackInfo, render, this.container))
    }
  }

}
</script>
