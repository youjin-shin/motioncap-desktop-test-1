/* eslint-disable no-sequences */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-tabs */
import { LayoutConstants } from '../layout_constants.js'
import { Theme } from '../theme.js'
import { utils } from '../utils/utils.js'
import { Tweens } from '../utils/util_tween.js'
import { handleDrag } from '../utils/util_handle_drag.js'
import { ScrollCanvas } from './time_scroller.js'
import { Canvas } from '../ui/canvas.js'

const proxy_ctx = utils.proxy_ctx

var LINE_HEIGHT = LayoutConstants.LINE_HEIGHT
var DIAMOND_SIZE = LayoutConstants.DIAMOND_SIZE
var TIME_SCROLLER_HEIGHT = 32
var MARKER_TRACK_HEIGHT = 28
var LEFT_PANE_WIDTH = LayoutConstants.LEFT_PANE_WIDTH
var time_scale = LayoutConstants.time_scale
// var SCROLL_HEIGHT = LayoutConstants.SCROLL_HEIGHT
var TOP = 10

var frame_start = 0 // this is the current scroll position.

/*
 * This class contains the view for the right main section of timeliner
 */

// TODO
// dirty rendering
// drag block
// DON'T use time.update for everything

var tickMark1
var tickMark2
var tickMark3

function time_scaled () {
  /*
	 * Subdivison LOD
	 * time_scale refers to number of pixels per unit
	 * Eg. 1 inch - 60s, 1 inch - 60fps, 1 inch - 6 mins
	 */
  var div = 60

  tickMark1 = time_scale / div
  tickMark2 = 2 * tickMark1
  tickMark3 = 10 * tickMark1
}

time_scaled()

/**************************/
// Timeline Panel
/**************************/

function TimelinePanel (controller, data, dispatcher) {
  var dpr = window.devicePixelRatio
  var track_canvas = document.createElement('canvas')

  var scrollTop = 0; var scrollLeft = 0
  var SCROLL_HEIGHT

  var layers = data.get('layers').value

  this.scrollTo = function (s, y) {
    scrollTop = s * Math.max(layers.length * LINE_HEIGHT - SCROLL_HEIGHT, 0)
    repaint()
  }

  this.resize = function () {
    var h = (LayoutConstants.height - TIME_SCROLLER_HEIGHT)
    dpr = window.devicePixelRatio
    // track_canvas.width = LayoutConstants.width * dpr

    track_canvas.width = controller.getContainerWidth() * dpr - LayoutConstants.LEFT_PANE_WIDTH
    // track_canvas.height = h * dpr
    track_canvas.height = (LayoutConstants.height) * dpr
    // track_canvas.style.width = LayoutConstants.width + 'px'
    track_canvas.style.width = controller.getContainerWidth() - LayoutConstants.LEFT_PANE_WIDTH + 'px'
    track_canvas.style.height = LayoutConstants.height + 'px'
    SCROLL_HEIGHT = LayoutConstants.height - TIME_SCROLLER_HEIGHT
    scroll_canvas.setSize(controller.getContainerWidth(), TIME_SCROLLER_HEIGHT)
  }

  var div = document.createElement('div')

  var scroll_canvas = new Canvas(controller.getContainerWidth(), TIME_SCROLLER_HEIGHT)
  // data.addListener('ui', repaint );

  utils.style(track_canvas, {
    position: 'absolute',
    // top: 22 + 'px',
    top: TIME_SCROLLER_HEIGHT + 'px',
    left: '0px'
  })

  utils.style(scroll_canvas.dom, {
    position: 'absolute',
    top: '0px'
    // left: '10px'
  })

  scroll_canvas.uses(new ScrollCanvas(dispatcher, data))

  div.appendChild(track_canvas)
  div.appendChild(scroll_canvas.dom)
  scroll_canvas.dom.id = 'scroll-canvas'
  track_canvas.id = 'track-canvas'

  // this.dom = canvas;
  this.dom = div
  this.dom.id = 'timeline-panel'
  this.resize()

  var ctx = track_canvas.getContext('2d')
  var ctx_wrap = proxy_ctx(ctx)

  var currentTime // measured in seconds
  // technically it could be in frames or  have it in string format (0:00:00:1-60)

  var LEFT_GUTTER = 20
  var i, x, y, il, j

  var needsRepaint = false
  var renderItems = []

  function EasingRect (x1, y1, x2, y2, frame, frame2, values, layer, j) {
    var self = this

    this.path = function () {
      ctx_wrap.beginPath()
        .rect(x1, y1, x2 - x1, y2 - y1)
        .closePath()
    }

    this.paint = function () {
      this.path()
      ctx.fillStyle = frame._color
      ctx.fill()
    }

    this.mouseover = function () {
      track_canvas.style.cursor = 'pointer' // pointer move ew-resize
    }

    this.mouseout = function () {
      track_canvas.style.cursor = 'default'
    }

    this.mousedrag = function (e) {
      var t1 = x_to_time(x1 + e.dx)
      t1 = Math.max(0, t1)
      // TODO limit moving to neighbours
      frame.time = t1

      var t2 = x_to_time(x2 + e.dx)
      t2 = Math.max(0, t2)
      frame2.time = t2

      // dispatcher.fire('time.update', t1);
    }
  }

  function Diamond (frame, y) {
    var x, y2

    x = time_to_x(frame.time)
    y2 = y + LINE_HEIGHT * 0.5 - DIAMOND_SIZE / 2

    var self = this

    var isOver = false

    this.path = function (ctx_wrap) {
      ctx_wrap
        .beginPath()
        .moveTo(x, y2)
        .lineTo(x + DIAMOND_SIZE / 2, y2 + DIAMOND_SIZE / 2)
        .lineTo(x, y2 + DIAMOND_SIZE)
        .lineTo(x - DIAMOND_SIZE / 2, y2 + DIAMOND_SIZE / 2)
        .closePath()
    }

    this.paint = function (ctx_wrap) {
      self.path(ctx_wrap)
      if (!isOver) { ctx_wrap.fillStyle(Theme.c) } else { ctx_wrap.fillStyle('yellow') } // Theme.d

      ctx_wrap.fill()
        .stroke()
    }

    this.mouseover = function () {
      isOver = true
      track_canvas.style.cursor = 'move' // pointer move ew-resize
      self.paint(ctx_wrap)
    }

    this.mouseout = function () {
      isOver = false
      track_canvas.style.cursor = 'default'
      self.paint(ctx_wrap)
    }

    this.mousedrag = function (e) {
      var t = x_to_time(x + e.dx)
      t = Math.max(0, t)
      // TODO limit moving to neighbours
      frame.time = t
      dispatcher.fire('time.update', t)
      // console.log('frame', frame);
      // console.log(s, format_friendly_seconds(s), this);
    }
  }

  function repaint () {
    needsRepaint = true
  }

  function drawLayerContents () {
    renderItems = []

    // horizontal Layer lines
    for (i = 0, il = layers.length; i <= il; i++) {
      ctx.strokeStyle = Theme.b
      ctx.beginPath()
      y = i * (LINE_HEIGHT)
      y = ~~y - 0.5

      ctx_wrap
        .moveTo(0, y)
        .lineTo(controller.getContainerWidth(), y)
        .stroke()
    }

    var frame, frame2, j

    // Draw Easing Rects
    for (i = 0; i < il; i++) {
      // check for keyframes
      var layer = layers[i]
      var values = layer.values

      y = i * (LINE_HEIGHT)

      for (j = 0; j < values.length - 1; j++) {
        frame = values[j]
        frame2 = values[j + 1]

        // Draw Tween Rect
        var x = time_to_x(frame.time)
        var x2 = time_to_x(frame2.time)

        if (!frame.tween || frame.tween === 'none') continue

        var y1 = y + LINE_HEIGHT / 3
        var y2 = y + LINE_HEIGHT / 1.5

        renderItems.push(new EasingRect(x, y1, x2, y2, frame, frame2))

        // // draw easing graph
        // var color = parseInt(frame._color.substring(1, 7), 16)
        // color = 0xffffff ^ color
        // color = color.toString(16) // convert to hex
        // color = '#' + ('000000' + color).slice(-6)

        // ctx.strokeStyle = color
        // var x3
        // ctx.beginPath()
        // ctx.moveTo(x, y2)
        // var dy = y1 - y2
        // var dx = x2 - x

        // for (x3 = x; x3 < x2; x3++) {
        //   ctx.lineTo(x3, y2 + Tweens[frame.tween]((x3 - x) / dx) * dy)
        // }
        // ctx.stroke()
      }

      for (j = 0; j < values.length; j++) {
        // Dimonds
        frame = values[j]
        renderItems.push(new Diamond(frame, y))
      }
    }

    // render items
    var item
    for (i = 0, il = renderItems.length; i < il; i++) {
      item = renderItems[i]
      item.paint(ctx_wrap)
    }
  }

  function setTimeScale () {
    var v = data.get('ui:timeScale').value
    if (time_scale !== v) {
      time_scale = v
      time_scaled()
    }
  }

  var over = null
  var mousedownItem = null

  function check () {
    var item
    var last_over = over
    // over = [];
    over = null
    for (i = renderItems.length; i-- > 0;) {
      item = renderItems[i]
      item.path(ctx_wrap)

      if (ctx.isPointInPath(pointer.x * dpr, pointer.y * dpr)) {
        // over.push(item);
        over = item
        break
      }
    }

    // clear old mousein
    if (last_over && last_over !== over) {
      item = last_over
      if (item.mouseout) item.mouseout()
    }

    if (over) {
      item = over
      if (item.mouseover) item.mouseover()

      if (mousedown2) {
        mousedownItem = item
      }
    }

    // console.log(pointer)
  }

  function pointerEvents () {
    if (!pointer) return

    ctx_wrap
      .save()
      .scale(dpr, dpr)
      .translate(0, MARKER_TRACK_HEIGHT)
      .beginPath()
      .rect(0, 0, controller.getContainerWidth(), SCROLL_HEIGHT)
      .translate(-scrollLeft, -scrollTop)
      .clip()
      .run(check)
      .restore()
  }

  function _paint () {
    if (!needsRepaint) {
      pointerEvents()
      return
    }

    scroll_canvas.repaint()

    setTimeScale()

    currentTime = data.get('ui:currentTime').value
    frame_start = data.get('ui:scrollTime').value

    /**************************/
    // background

    ctx.fillStyle = Theme.a
    ctx.clearRect(0, 0, track_canvas.width, track_canvas.height)
    ctx.save()
    ctx.scale(dpr, dpr)

    //

    ctx.lineWidth = 1 // .5, 1, 2

    var width = controller.getContainerWidth()
    var height = LayoutConstants.height

    var units = time_scale / tickMark1
    var offsetUnits = (frame_start * time_scale) % units

    var count = (controller.getContainerWidth() - LEFT_GUTTER + offsetUnits) / units

    // console.log('time_scale', time_scale, 'tickMark1', tickMark1, 'units', units, 'offsetUnits', offsetUnits, frame_start);

    // time_scale = pixels to 1 second (40)
    // tickMark1 = marks per second (marks / s)
    // units = pixels to every mark (40)

    // labels only
    for (i = 0; i < count; i++) {
      x = i * units + LEFT_GUTTER - offsetUnits

      // vertical lines
      ctx.strokeStyle = Theme.b
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()

      ctx.fillStyle = Theme.c

      ctx.textAlign = 'center'

      var t = (i * units - offsetUnits) / time_scale + frame_start
      t = utils.format_friendly_seconds(t)
      ctx.fillText(t, x, 10)
    }

    units = time_scale / tickMark2
    count = (controller.getContainerWidth() - LEFT_GUTTER + offsetUnits) / units

    // marker lines - main
    for (i = 0; i < count; i++) {
      ctx.strokeStyle = Theme.c
      ctx.beginPath()
      x = i * units + LEFT_GUTTER - offsetUnits
      ctx.moveTo(x, MARKER_TRACK_HEIGHT - 0)
      ctx.lineTo(x, MARKER_TRACK_HEIGHT - 14)
      ctx.stroke()
    }

    var mul = tickMark3 / tickMark2
    units = time_scale / tickMark3
    count = (width - LEFT_GUTTER + offsetUnits) / units

    // small ticks
    for (i = 0; i < count; i++) {
      if (i % mul === 0) continue
      ctx.strokeStyle = Theme.c
      ctx.beginPath()
      x = i * units + LEFT_GUTTER - offsetUnits
      ctx.moveTo(x, MARKER_TRACK_HEIGHT - 0)
      ctx.lineTo(x, MARKER_TRACK_HEIGHT - 8)
      ctx.stroke()
    }

    // Encapsulate a scroll rect for the layers
    ctx_wrap
      .save()
      .translate(0, MARKER_TRACK_HEIGHT)
      .beginPath()
      .rect(0, 0, controller.getContainerWidth(), SCROLL_HEIGHT)
      .translate(-scrollLeft, -scrollTop)
      .clip()
      .run(drawLayerContents)
      .restore()

    // Current Marker / Cursor
    ctx.strokeStyle = 'red' // Theme.c
    x = (currentTime - frame_start) * time_scale + LEFT_GUTTER

    var txt = utils.format_friendly_seconds(currentTime)
    var textWidth = ctx.measureText(txt).width

    var base_line = MARKER_TRACK_HEIGHT - 5; var half_rect = textWidth / 2 + 4

    ctx.beginPath()
    ctx.moveTo(x, base_line)
    ctx.lineTo(x, height)
    ctx.stroke()

    ctx.fillStyle = 'red' // black
    ctx.textAlign = 'center'
    ctx.beginPath()
    ctx.moveTo(x, base_line + 5)
    ctx.lineTo(x + 5, base_line)
    ctx.lineTo(x + half_rect, base_line)
    ctx.lineTo(x + half_rect, base_line - 14)
    ctx.lineTo(x - half_rect, base_line - 14)
    ctx.lineTo(x - half_rect, base_line)
    ctx.lineTo(x - 5, base_line)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.fillText(txt, x, base_line - 4)

    ctx.restore()

    needsRepaint = false
    // pointerEvents();
  }

  function y_to_track (y) {
    if (y - MARKER_TRACK_HEIGHT < 0) return -1
    return (y - MARKER_TRACK_HEIGHT + scrollTop) / LINE_HEIGHT | 0
  }

  function x_to_time (x) {
    var units = time_scale / tickMark3

    // return frame_start + (x - LEFT_GUTTER) / time_scale;

    return frame_start + ((x - LEFT_GUTTER) / units | 0) / tickMark3
  }

  function time_to_x (s) {
    var ds = s - frame_start
    ds *= time_scale
    ds += LEFT_GUTTER

    return ds
  }

  var me = this
  this.repaint = repaint
  this._paint = _paint

  repaint()

  var mousedown = false; var selection = false

  var dragObject
  var canvasBounds

  document.addEventListener('mousemove', onMouseMove)

  track_canvas.addEventListener('dblclick', function (e) {
    canvasBounds = track_canvas.getBoundingClientRect()

    var mx = e.clientX - canvasBounds.left; var my = e.clientY - canvasBounds.top

    var track = y_to_track(my)
    var s = x_to_time(mx)

    console.log(layers[track])

    dispatcher.fire('keyframe', layers[track], currentTime)
  })

  function onMouseMove (e) {
    canvasBounds = track_canvas.getBoundingClientRect()
    var mx = e.clientX - canvasBounds.left; var my = e.clientY - canvasBounds.top
    onPointerMove(mx, my)
  }

  var pointerdidMoved = false
  var pointer = null

  function onPointerMove (x, y) {
    if (mousedownItem) return
    pointerdidMoved = true
    pointer = { x: x, y: y }
  }

  track_canvas.addEventListener('mouseout', function () {
    pointer = null
  })

  var mousedown2 = false; var mouseDownThenMove = false
  handleDrag(track_canvas, function down (e) {
    mousedown2 = true
    pointer = {
      x: e.offsetx,
      y: e.offsety
    }
    pointerEvents()

    if (!mousedownItem) dispatcher.fire('time.update', x_to_time(pointer.x))
    // Hit criteria
  }, function move (e) {
    mousedown2 = false
    if (mousedownItem) {
      mouseDownThenMove = true
      if (mousedownItem.mousedrag) {
        mousedownItem.mousedrag(e)
      }
    } else {
      dispatcher.fire('time.update', x_to_time(pointer.x))
    }
  }, function up (e) {
    if (mouseDownThenMove) {
      dispatcher.fire('keyframe.move')
    } else {
      dispatcher.fire('time.update', x_to_time(pointer.x))
    }
    mousedown2 = false
    mousedownItem = null
    mouseDownThenMove = false
  }
  )

  this.setState = function (state) {
    layers = state.value
    repaint()
  }
}

export { TimelinePanel }
