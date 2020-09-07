
<template>
    <div ref="container" id="rendering-container" style="height: 100%;"/>
</template>
<style>
</style>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
// import * as THREE from 'three'

import * as THREE from '@/plugins/rendering/build/three.module'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OrbitControls } from '@/plugins/rendering/jsm/controls/cameraOrbitControls.js'
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { TransformControls } from '@/plugins/rendering/jsm/controls/transformControls.js'

import { Theme } from '@/plugins/rendering/js/libs/Timeliner/theme.js'
// import { Timeliner } from '@/plugins/rendering/js/libs/TimelinerGUI/timeliner.js'
// import { TimelinerController } from '@/plugins/rendering/jsm/controls/TimelinerController.js'

import { DragControls } from '@/plugins/rendering/jsm/controls/DragControls.js'

var scene, renderer, camera, stats, grid
var model, skeleton, mixer, clock
var transformControls, cameraControls, dragControls

var enableSelection = false
var crossFadeControls = []

var idleWeight, walkWeight, runWeight
var actionWeights = []

var singleStepMode = false
var sizeOfNextStep = 0
export default {
  components: {
  },
  data () {
    return {

      isGUIOn: false,
      // path: '/models/gltf/exo2.glb',
      path: '/models/gltf/Xbot.glb',
      // path: '/models/gltf/Soldier.glb',
      // path: '/models/fbx/xbot.fbx',
      actions: [],
      bonePivotSize: 1.2,
      settings: [],
      weights: [],
      trackInfo: [],
      container: undefined,
      sectionContainer: undefined,
      objects: []
    }
  },
  mounted () {
    // setTimeout(() => {
    // }, 1000)
    this.init()
  },
  methods: {
    init () {
      this.container = this.$refs.container
      this.sectionContainer = this.$refs.container.parentElement
      // console.log(this.sectionContainer.cle)

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight), 1, 1000)
      camera.position.set(-2, 2, 5)

      camera.lookAt(0, 1, 0)

      clock = new THREE.Clock()
      // scene.add(clock)

      scene = new THREE.Scene()
      scene.background = new THREE.Color(Theme.renderingFog)
      scene.fog = new THREE.Fog(Theme.renderingFog, 10, 80)

      // grid = new THREE.GridHelper(16, 16, 0xff0000, 0x222222)
      // scene.add(grid)
      var hemiLight = new THREE.HemisphereLight(0x0e0e0e)
      hemiLight.position.set(0, 20, 0)

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

      var spotLight = this.createSpotlight(0xFFFFFF)
      spotLight.position.set(5, 10, 5)
      var spotLightHelper = new THREE.SpotLightHelper(spotLight)

      scene.add(hemiLight, spotLightHelper, spotLight)

      // scene.add(new CameraHelper(light.shadow.camera))

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

      // For accurate color
      renderer.gammaFactor = 2.2
      renderer.gammaOutput = true

      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true
      // renderer.setSize(this.sectionContainer.clientWidth, this.sectionContainer.clientHeight)
      renderer.outputEncoding = THREE.sRGBEncoding

      this.container.appendChild(renderer.domElement)

      // ground
      var texture = new THREE.TextureLoader().load('textures/texture_05.png', this.render)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(30, 30)
      var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100),
        new THREE.MeshPhongMaterial({
          color: Theme.renderingBackground,
          map: texture,
          depthWrite: false
        }))
      mesh.position.set(0, -0, 0)
      mesh.rotation.x = -Math.PI / 2
      mesh.receiveShadow = true
      scene.add(mesh)

      stats = new Stats()
      // this.container.appendChild(stats.dom)

      // Camera Orbit Controller
      cameraControls = new OrbitControls(camera, renderer.domElement)
      cameraControls.target.set(0, 1, 0)
      cameraControls.update()
      cameraControls.enablePan = true
      // controls.enableDamping = true

      // Mesh Controller
      transformControls = new TransformControls(camera, renderer.domElement)
      transformControls.addEventListener('change', this.render)
      transformControls.addEventListener('dragging-changed', function (event) {
        cameraControls.enabled = !event.value
      })

      var loader = new GLTFLoader()
      if (this.path !== undefined) {
        loader.load(this.path,

          (gltf) => {
            model = gltf.scene

            scene.add(model)

            model.traverse((object) => {
              if (object.isMesh) object.castShadow = true
            })

            skeleton = new THREE.SkeletonHelper(model)
            skeleton.visible = true

            skeleton.bones.forEach(element => {
              var materials = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
              materials.depthWrite = false
              materials.depthTest = false
              var mesh = new THREE.Mesh(new THREE.SphereGeometry(this.bonePivotSize), materials)
              this.objects.push(element)
              element.add(mesh)
            })

            scene.add(skeleton)

            //

            //
            var animations = gltf.animations

            mixer = new THREE.AnimationMixer(model)

            // var jsonObject = JSON.stringify(animations[0])
            // console.log(jsonObject)

            animations.forEach(element => {
              if (element.name !== 'TPose') {
                this.actions.push(mixer.clipAction(element))
              }
            })

            // if (!this.isGUIOn) { this.createPanel() }

            this.activateAllActions()
            this.animate()

            scene.add(transformControls)

            this.$emit('initTimeline', scene, this.objects, this.render)
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded')
          },
          // eslint-disable-next-line handle-callback-err
          (error) => {
            console.log('An error happened')

            this.$emit('initTimeline', scene, this.objects, this.render)
          }
        )
      }
      // Event Listners
      dragControls = new DragControls(this.objects, camera, renderer.domElement) //

      dragControls.enabled = false
      dragControls.addEventListener('hoveron', function (event) {
        window.addEventListener('click', () => {
          transformControls.attach(event.object.parent)
        })

        cancelHideTransform()
      })

      dragControls.addEventListener('hoveroff', function () {
        // delayHideTransform()
      })

      var hiding

      function delayHideTransform () {
        cancelHideTransform()
        hideTransform()
      }

      function hideTransform () {
        hiding = setTimeout(function () {
          transformControls.object.children[transformControls.object.children.length - 1].material.opacity = 0.5
          transformControls.detach(transformControls.object)
        }, 0)
      }

      function cancelHideTransform () {
        if (hiding) clearTimeout(hiding)
      }

      // Hiding transform situation is a little in a mess :()
      transformControls.addEventListener('change', function () {
        cancelHideTransform()
      })

      transformControls.addEventListener('mouseDown', function () {
        cancelHideTransform()
      })

      transformControls.addEventListener('mouseUp', function () {
        delayHideTransform()
      })

      window.addEventListener('keydown', function (event) {
        // console.log(event.keyCode)
        switch (event.keyCode) {
          case 27: // ESC
            hideTransform()
            break
          case 81: // Q
            transformControls.setSpace(transformControls.space === 'local' ? 'world' : 'local')
            break

          case 91: // Ctrl
            transformControls.setTranslationSnap(1)
            transformControls.setRotationSnap(THREE.MathUtils.degToRad(15))
            break

          case 87: // W
            transformControls.setMode('translate')
            break

          case 69: // E
            transformControls.setMode('rotate')
            break

          case 82: // R
            transformControls.setMode('scale')
            break

          case 187:
          case 107: // +, =, num+
            transformControls.setSize(transformControls.size + 0.1)
            break

          case 189:
          case 109: // -, _, num-
            transformControls.setSize(Math.max(transformControls.size - 0.1, 0.1))
            break
        }
      })

      window.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
          case 91: // Ctrl
            transformControls.setTranslationSnap(null)
            transformControls.setRotationSnap(null)
            break
        }
      })

      // eslint-disable-next-line no-new

      window.addEventListener('resize', this.onWindowResize, false)
    },

    createPanel () {
      this.isGUIOn = true
      var panel = new GUI({ width: 310 })

      var folder1 = panel.addFolder('Visibility')
      var folder2 = panel.addFolder('Activation/Deactivation')
      var folder3 = panel.addFolder('Pausing/Stepping')
      // var folder4 = panel.addFolder('Crossfading')
      var folder5 = panel.addFolder('Blend Weights')
      var folder6 = panel.addFolder('General Values')

      this.settings = {
        'show model': true,
        'show skeleton': true,
        'deactivate all': this.deactivateAllActions,
        'activate all': this.activateAllActions,
        'pause/continue': this.pauseContinue,
        'make single step': this.toSingleStepMode,
        'modify step size': 0.05,
        'use default duration': true,
        'set custom duration': 3.5,
        // 'from idle to idle': () => {
        //   this.prepareCrossFade(this.actions[0], this.actions[0], 1.0)
        // },

        'modify idle weight': 0.0,
        'modify bonePivot scale': 1.0,
        'modify time scale': 1.0
      }
      folder1.add(this.settings, 'show model').onChange(this.showModel)
      folder1.add(this.settings, 'show skeleton').onChange(this.showSkeleton)
      folder2.add(this.settings, 'deactivate all')
      folder2.add(this.settings, 'activate all')
      folder3.add(this.settings, 'pause/continue')
      folder3.add(this.settings, 'make single step')
      folder3.add(this.settings, 'modify step size', -0.1, 0.1, 0.001)

      // crossFadeControls.push(folder4.add(this.settings, 'from' + ' idle' + ' to' + ' idle'))
      folder5.add(this.settings, 'modify idle weight', 0.0, 1.0, 0.01).listen().onChange((weight) => {
        this.setWeight(this.actions[0], weight)
      })

      folder6.add(this.settings, 'modify time scale', 0.0, 1.5, 0.01).onChange(this.modifyTimeScale)
      folder6.add(this.settings, 'modify bonePivot scale', 0.0, 2, 0.01).onChange(this.modifybonePivotScale)
      folder1.open()
      folder2.open()
      folder3.open()
      // folder4.open()
      folder5.open()
      folder6.open()

      crossFadeControls.forEach(function (control) {
        control.classList1 = control.domElement.parentElement.parentElement.classList
        control.classList2 = control.domElement.previousElementSibling.classList

        control.setDisabled = function () {
          control.classList1.add('no-pointer-events')
          control.classList2.add('control-disabled')
        }

        control.setEnabled = function () {
          control.classList1.remove('no-pointer-events')
          control.classList2.remove('control-disabled')
        }
      })
    },

    showModel: function (visibility) {
      model.visible = visibility
    },

    showSkeleton: function (visibility) {
      skeleton.visible = visibility
    },

    modifyTimeScale: function (speed) {
      mixer.timeScale = speed
    },
    modifybonePivotScale: function (scale) {
      this.bonePivotSize = scale
    },
    deactivateAllActions: function () {
      this.actions.forEach(function (action) {
        action.stop()
      })
    },

    activateAllActions: function () {
      this.actions.forEach(element => {
        this.setWeight(element, this.settings['modify' + element._clip.name + 'weight'])
      })

      // this.setWeight(this.actions[0], this.settings['modify idle weight'])

      this.actions.forEach(function (action) {
        action.play()
      })
    },

    pauseContinue: function () {
      if (singleStepMode) {
        singleStepMode = false
        this.unPauseAllActions()
      } else {
        if (this.actions[0].paused) {
          this.unPauseAllActions()
        } else {
          this.pauseAllActions()
        }
      }
    },

    pauseAllActions: function () {
      this.actions.forEach(function (action) {
        action.paused = true
      })
    },

    unPauseAllActions: function () {
      this.actions.forEach(function (action) {
        action.paused = false
      })
    },

    toSingleStepMode: function () {
      this.unPauseAllActions()

      singleStepMode = true
      sizeOfNextStep = this.settings['modify step size']
    },

    prepareCrossFade: function (startAction, endAction, defaultDuration) {
      // Switch default / custom crossfade duration (according to the user's choice)
      var duration = this.setCrossFadeDuration(defaultDuration)
      // console.log(startAction._clip.name, endAction._clip.name)

      // Make sure that we don't go on in singleStepMode, and that all this.actions are unpaused

      singleStepMode = false
      this.unPauseAllActions()

      // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
      // else wait until the current action has finished its current loop

      if (startAction === this.actions[0]) {
        this.executeCrossFade(startAction, endAction, duration)
      } else {
        this.synchronizeCrossFade(startAction, endAction, duration)
      }
    },

    setCrossFadeDuration: function (defaultDuration) {
      // Switch default crossfade duration <-> custom crossfade duration

      if (this.settings['use default duration']) {
        return defaultDuration
      } else {
        return this.settings['set custom duration']
      }
    },

    synchronizeCrossFade: function (startAction, endAction, duration) {
      mixer.addEventListener('loop', onLoopFinished)

      function onLoopFinished (event) {
        if (event.action === startAction) {
          mixer.removeEventListener('loop', onLoopFinished)

          this.executeCrossFade(startAction, endAction, duration)
        }
      }
    },

    executeCrossFade: function (startAction, endAction, duration) {
      // Not only the start action, but also the end action must get a weight of 1 before fading
      // (concerning the start action this is already guaranteed in this place)

      this.setWeight(endAction, 1)
      endAction.time = 0
      // Crossfade with warping - you can also try without warping by setting the third parameter to false

      startAction.crossFadeTo(endAction, duration, true)
    },

    // This function is needed, since animationAction.crossFadeTo() disables its start action and sets
    // the start action's timeScale to ((start animation's duration) / (end animation's duration))

    setWeight: function (action, weight) {
      action.enabled = true
      action.setEffectiveTimeScale(1)
      action.setEffectiveWeight(weight)
    },

    // Called by the render loop

    updateWeightSliders: function () {
      this.settings['modify idle weight'] = actionWeights[0]
      // for (var i = 0; i < this.actions.length; i++) {
      //   this.settings['modify ' + this.actions[i]._clip.name + ' weight'] = actionWeights[i]
      // }
    },
    // Called by the render loop

    updateCrossFadeControls: function () {
      crossFadeControls.forEach(function (control) {
        control.setDisabled()
      })

      // if (actionWeights[0] === 1) {
      //   crossFadeControls[0].setEnabled()
      // }
    },
    createSpotlight: function (color) {
      var newObj = new THREE.SpotLight(color, 2)

      newObj.castShadow = true
      newObj.angle = 0.25
      newObj.penumbra = 0.2
      newObj.decay = 2
      newObj.distance = 50

      return newObj
    },

    onWindowResize: function () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
      this.render()
    },

    animate: function () {
      // Render loop

      requestAnimationFrame(this.animate)
      for (var i = 0; i < this.actions.length; i++) {
        actionWeights[i] = this.actions[i].getEffectiveWeight()
      }

      // Update the panel values if weights are modified from "outside" (by crossfadings)

      this.updateWeightSliders()

      // Enable/disable crossfade controls according to current weight values

      this.updateCrossFadeControls()

      // Get the time elapsed since the last frame, used for mixer update (if not in single step mode)

      var mixerUpdateDelta = clock.getDelta()

      // If in single step mode, make one step and then do nothing (until the user clicks again)

      if (singleStepMode) {
        mixerUpdateDelta = sizeOfNextStep
        sizeOfNextStep = 0
      }

      // Update the animation mixer, the stats panel, and render this frame

      mixer.update(mixerUpdateDelta)
      stats.update()
      this.render()
    },
    render: function () {
      renderer.render(scene, camera)
    }

  }

}
</script>
