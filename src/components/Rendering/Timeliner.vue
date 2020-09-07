
<template>
  <div ref="container" id="container" style="height: 100%;"></div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
import * as THREE from '@/plugins/rendering/build/three.module'
import { Timeliner } from '@/plugins/rendering/js/libs/Timeliner/timeliner.js'
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
          interpolation: THREE.InterpolateSmooth,
          color: '#' + (Math.random() * 0xffffff | 0).toString(16)
        })

        this.trackInfo.push(
          {
            type: THREE.QuaternionKeyframeTrack,
            propertyPath: objects[i].name + '.quaternion',
            initialValue: quaternionValue,
            interpolation: THREE.InterpolateLinear,
            color: '#' + (Math.random() * 0xffffff | 0).toString(16)

          })
      }

      console.log(this.trackInfo)
      var controller = new TimelinerController(scene, this.trackInfo, render, this.container)
      var timeliner = new Timeliner(controller)
      // console.log(this.trackInfo)

      // eslint-disable-next-line no-new
      // var timeliner = new Timeliner(new TimelinerController(scene, this.trackInfo, render, this.container))

      // initialize timeliner
      // var timeliner = new Timeliner(this.trackInfo)
      // timeliner.load(
      //   {
      //     version: '1.2.0',
      //     modified: 'Mon Dec 08 2014 10:41:11 GMT+0800 (SGT)',
      //     title: 'Untitled',
      //     layers: [{
      //       name: 'ab',
      //       values: [{ time: 0.1, value: 0, _color: '#893c0f', tween: 'quadEaseIn' },
      //         { time: 3, value: 3.500023, _color: '#b074a0' }],
      //       tmpValue: 3.500023,
      //       _color: '#6ee167'
      //     },
      //     {
      //       name: 'y',
      //       values: [{ time: 0.1, value: 0, _color: '#abac31', tween: 'quadEaseOut' },
      //         { time: 0.5, value: -1.000001, _color: '#355ce8', tween: 'quadEaseIn' }, { time: 1.1, value: 0, _color: '#47e90', tween: 'quadEaseOut' }, { time: 1.7, value: -0.5, _color: '#f76bca', tween: 'quadEaseOut' }, { time: 2.3, value: 0, _color: '#d59cfd' }],
      //       tmpValue: -0.5,
      //       _color: '#8bd589'
      //     },
      //     {
      //       name: 'rotate',
      //       values: [{ time: 0.1, value: -25.700014000000003, _color: '#f50ae9', tween: 'quadEaseInOut' },
      //         { time: 2.8, value: 0, _color: '#2e3712' }],
      //       tmpValue: -25.700014000000003,
      //       _color: '#2d9f57'
      //     }]
      //   })
    }
  }

}
</script>
