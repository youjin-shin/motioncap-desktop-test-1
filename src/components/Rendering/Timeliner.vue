<template>
  <div>

    <div ref="container" id="container"></div>

  </div>
</template>

<script>

import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module.js'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OrbitControls } from '@/plugins/rendering/jsm/controls/cameraOrbitControls.js'
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { TransformControls } from '@/plugins/rendering/jsm/controls/transformControls.js'

import { Timeliner } from '@/plugins/rendering/js/libs/TimelinerGUI/timeliner.js'
import { TimelinerController } from 'three/examples/jsm/animation/TimelinerController.js'

var scene, renderer, camera, stats, grid
var meshControls, cameraControls

export default {
  data () {
    return {

      isGUIOn: false,
      path: '/models/gltf/Soldier.glb',
      actions: [],
      settings: [],
      weights: [],
      trackInfo: [],
      container: undefined
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // container = document.getElementById('container')
      this.container = this.$refs.container

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
      camera.position.set(3, 3, -5)

      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1b1b1b)
      scene.fog = new THREE.Fog(0x303030, 10, 50)

      grid = new THREE.GridHelper(16, 16, 0xff0000, 0x222222)
      scene.add(grid)

      var hemiLight = new THREE.HemisphereLight(0xffffff, 0x1b1b1b)
      hemiLight.position.set(0, 20, 0)
      scene.add(hemiLight)

      // var dirLight = new THREE.DirectionalLight(0xffffff)
      // dirLight.position.set(-3, 10, -10)
      // dirLight.castShadow = true
      // dirLight.shadow.camera.top = 2
      // dirLight.shadow.camera.bottom = -2
      // dirLight.shadow.camera.left = -2
      // dirLight.shadow.camera.right = 2
      // dirLight.shadow.camera.near = 0.1
      // dirLight.shadow.camera.far = 40
      // scene.add(dirLight)

      // scene.add(new CameraHelper(light.shadow.camera))

      // ground
      // var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x101010, depthWrite: false }))
      // mesh.rotation.x = -Math.PI / 2
      // mesh.receiveShadow = true
      // // scene.add(mesh)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.outputEncoding = THREE.sRGBEncoding

      this.container.appendChild(renderer.domElement)

      stats = new Stats()
      this.container.appendChild(stats.dom)

      // Camera Orbit Controller
      cameraControls = new OrbitControls(camera, renderer.domElement)
      cameraControls.target.set(0, 1, 0)
      cameraControls.update()
      cameraControls.enablePan = true
      // controls.enableDamping = true

      // Mesh Controller
      meshControls = new TransformControls(camera, renderer.domElement)
      meshControls.addEventListener('change', this.render)
      meshControls.addEventListener('dragging-changed', function (event) {
        cameraControls.enabled = !event.value
      })

      var geometry = new THREE.BoxBufferGeometry(1, 1, 1)
      var material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
      var mesh = new THREE.Mesh(geometry, material)
      mesh.name = 'MyBox'
      scene.add(mesh)

      meshControls.attach(mesh)
      scene.add(meshControls)

      this.trackInfo = [

        {
          type: THREE.VectorKeyframeTrack,
          propertyPath: mesh.name + '.position',
          initialValue: Object.values(mesh.position),
          interpolation: THREE.InterpolateSmooth
        },

        {
          type: THREE.QuaternionKeyframeTrack,
          propertyPath: mesh.name + '.quaternion',
          initialValue: Object.values(mesh.quaternion),
          interpolation: THREE.InterpolateLinear

        }

      ]
      // eslint-disable-next-line no-new
      new Timeliner(new TimelinerController(scene, this.trackInfo, this.render))

      // eslint-disable-next-line no-new
      // new Timeliner(new TimelinerController(scene, this.trackInfo, this.render))
      window.addEventListener('resize', this.onWindowResize, false)
    },

    onWindowResize: function () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
      this.render()
    },

    render: function () {
      renderer.render(scene, camera)
    }

  }

}
</script>
