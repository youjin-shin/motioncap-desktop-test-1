/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
/* eslint-disable no-tabs */
/* eslint-disable new-cap */
/**
 * Controller class for the Timeliner GUI.
 *
 * Timeliner GUI library (required to use this class):
 *
 * 		../libs/timeliner_gui.min.js
 *
 * Source code:
 *
 * 		https://github.com/tschw/timeliner_gui
 * 		https://github.com/zz85/timeliner (fork's origin)
 *
 * @author tschw
 *
 */

import {
  AnimationClip,
  AnimationMixer,
  AnimationUtils,
  PropertyBinding
} from '../../../../../node_modules/three/build/three.module.js'

var TimelinerController = function TimelinerController (scene, trackInfo, onUpdate) {
  this._scene = scene
  this._trackInfo = trackInfo

  this._onUpdate = onUpdate

  this._mixer = new AnimationMixer(scene)
  this._clip = null
  this._action = null

  this._tracks = []
  this._propRefs = {}
  this._channelNames = []
}

TimelinerController.prototype = {

  constructor: TimelinerController,

  init: function () {
    var tracks = []
    var trackInfo = this._trackInfo

    for (var i = 0, n = trackInfo.length; i !== n; ++i) {
      var spec = trackInfo[i]

      tracks.push(this._addTrack(spec.type, spec.propertyPath, spec.initialValue, spec.interpolation))
    }
    this._tracks = tracks
    this._clip = new AnimationClip('editclip', 0, tracks)
    // console.log(this._clip)
    this._action = this._mixer.clipAction(this._clip).play()
  },

  setDisplayTime: function (time) {
    this._action.time = time

    // console.log(time)
    this._mixer.update(0)
    this._onUpdate()
  },

  setDuration: function (duration) {
    this._clip.duration = duration
  },
  getTracks: function () {
    return this._tracks
  },
  getChannelNames: function () {
    return this._channelNames
  },

  getChannelKeyTimes: function (channelName) {
    // console.log(this._tracks[ channelName ])
    // for (let i = 0; i < this._tracks.length; i++) {
    // 	if(this._tracks[i].name === channelName)
    // 		return this._tracks[i].times;

    // }
    return this._tracks.find(item => item.name === channelName).times
    // return this._tracks[ channelName ].times;
  },

  setKeyframe: function (channelName, time) {
    // console.log(this._tracks.find(item=>item.name==channelName))
    // console.log(this._tracks)
    // var track = this._tracks[channelName]
    var track = this._tracks.find(item => item.name === channelName)
    var times = track.times
    var index = Timeliner.binarySearch(times, time)
    var values = track.values
    var stride = track.getValueSize()
    var offset = index * stride

    if (index < 0) {
      // insert new keyframe

      index = ~index
      offset = index * stride

      var nTimes = times.length + 1
      var nValues = values.length + stride

      for (var i = nTimes - 1; i !== index; --i) {
        times[i] = times[i - 1]
      }

      for (var i = nValues - 1, e = offset + stride - 1; i !== e; --i) {
        values[i] = values[i - stride]
      }
    }

    times[index] = time

    // console.log(channelName)
    // this._propRefs.channelName.getValue(values, offset)
    this._propRefs[channelName].getValue(values, offset)
  },

  delKeyframe: function (channelName, time) {
    // var track = this._tracks[ channelName ],

    var track = this._tracks.find(item => item.name === channelName)
    var times = track.times
    var index = Timeliner.binarySearch(times, time)

    // we disallow to remove the keyframe when it is the last one we have,
    // since the animation system is designed to always produce a defined
    // state

    if (times.length > 1 && index >= 0) {
      var nTimes = times.length - 1
      var values = track.values
      var stride = track.getValueSize()
      var nValues = values.length - stride

      // note: no track.getValueSize when array sizes are out of sync

      for (var i = index; i !== nTimes; ++i) {
        times[i] = times[i + 1]
      }

      times.pop()

      for (var offset = index * stride; offset !== nValues; ++offset) {
        values[offset] = values[offset + stride]
      }

      values.length = nValues
    }
  },

  moveKeyframe: function (channelName, time, delta, moveRemaining) {
    // var track = this._tracks[ channelName ],

    var track = this._tracks.find(item => item.name === channelName)
    var times = track.times
    var index = Timeliner.binarySearch(times, time)

    if (index >= 0) {
      var endAt = moveRemaining ? times.length : index + 1
      var needsSort = times[index - 1] <= time ||
					(!moveRemaining && time >= times[index + 1])

      while (index !== endAt) times[index++] += delta

      if (needsSort) this._sort(track)
    }
  },

  serialize: function () {
    var result = {
      duration: this._clip.duration,
      channels: {}
    }

    var names = this._channelNames
    var tracks = this._tracks

    var channels = result.channels

    for (var i = 0, n = names.length; i !== n; ++i) {
      var name = names[i]
      var track = tracks.find(item => item.name === name)

      channels[name] = {

        times: track.times,
        values: track.values

      }
    }

    return result
  },

  // deserialize: function (structs) {
  //   var names = this._channelNames
  //   var tracks = this._tracks

  //   var channels = structs.channels

  //   this.setDuration(structs.duration)

  //   for (var i = 0, n = names.length; i !== n; ++i) {
  //     var name = names[i]
  //     var track = tracks.find(item => item.name === name)
  //     var data = channels[name]

  //     this._setArray(track.times, data.times)
  //     this._setArray(track.values, data.values)
  //   }

  //   // update display
  //   this.setDisplayTime(this._mixer.time)
  // },

  deserialize: function (structs) {
    var names = this._channelNames
    var tracks = this._tracks

    var channels = []
    // var channels = structs.tracks
    for (var i = 0; i < structs.tracks.length; i++) {
      if (structs.tracks[i].name.includes('.position') || structs.tracks[i].name.includes('.quaternion')) {
        channels.push(structs.tracks[i])
      }
    }
    console.log(channels)
    this.setDuration(structs.duration)

    for (var i = 0, n = names.length; i !== n; ++i) {
      var name = names[i]
      var track = tracks.find(item => item.name === name)
      var data = channels[i]
      var timeData = Object.keys(data.times).map((key) => data.times[key])
      console.log(timeData)
      var valueData = Object.keys(data.values).map((key) => data.values[key])
      this._setArray(track.times, timeData)
      this._setArray(track.values, valueData)
    }

    // update display
    this.setDisplayTime(this._mixer.time)
  },

  _sort: function (track) {
    var times = track.times
    var order = AnimationUtils.getKeyframeOrder(times)

    this._setArray(times, AnimationUtils.sortedArray(times, 1, order))

    var values = track.values
    var stride = track.getValueSize()

    this._setArray(values, AnimationUtils.sortedArray(values, stride, order))
  },

  _setArray: function (dst, src) {
    dst.length = 0
    dst.push.apply(dst, src)
  },

  _addTrack: function (type, prop, initialValue, interpolation) {
    var track = new type(prop, [0], initialValue, interpolation)

    // data must be in JS arrays so it can be resized
    track.times = Array.prototype.slice.call(track.times)
    track.values = Array.prototype.slice.call(track.values)

    this._channelNames.push(prop)
    this._tracks[prop] = track

    // for recording the state:
    this._propRefs[prop] =
		new PropertyBinding(this._scene, prop)

    return track
  }

}

export { TimelinerController }
