/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-tabs */

// var LayoutConstants = require('./layout_constants')
// var Theme = require('./theme')
// var utils = require('./utils')
import { LayoutConstants } from './layout_constants.js'
import { Theme } from './theme.js'
import { utils } from './utils.js'
var proxy_ctx = utils.proxy_ctx

var LINE_HEIGHT = LayoutConstants.LINE_HEIGHT
var DIAMOND_SIZE = LayoutConstants.DIAMOND_SIZE
var MARKER_TRACK_HEIGHT = LayoutConstants.MARKER_TRACK_HEIGHT

var LEFT_PANE_WIDTH = LayoutConstants.LEFT_PANE_WIDTH
var time_scale = LayoutConstants.TIME_SCALE

var frame_start = 0 // this is the current scroll position.
// TODO
// dirty rendering
// drag block
// drag current time
// pointer on timescale

var tickMark1, tickMark2, tickMark3

function time_scaled () {
  var div = 60

  tickMark1 = time_scale / div
  tickMark2 = 2 * tickMark1
  tickMark3 = 10 * tickMark1
}

time_scaled()

/**************************/
// DopeSheetPanel Panel
/**************************/

function DopeSheetPanel (context) {
  var dispatcher = context.dispatcher

  var scrollTop = 0; var scrollLeft = 0

  var dpr = window.devicePixelRatio
  var canvas = document.createElement('canvas')

  var layers

  this.updateState = function () {
    layers = context.controller.getChannelNames()
    repaint()
  }

  this.updateState()

  this.scrollTo = function (s) {
    scrollTop = s * Math.max(layers.length * LINE_HEIGHT - context.scrollHeight, 0)
    repaint()
  }

  this.resize = function () {
    dpr = window.devicePixelRatio
    canvas.width = context.controller.getContainerWidth() * dpr - LayoutConstants.LEFT_PANE_WIDTH
    canvas.height = (context.height) * dpr
    canvas.style.width = context.controller.getContainerWidth() - LayoutConstants.LEFT_PANE_WIDTH + 'px'
    canvas.style.height = context.height + 'px'
    context.scrollHeight = context.height - MARKER_TRACK_HEIGHT
  }

  this.dom = canvas
  this.resize()

  var ctx = canvas.getContext('2d')
  var ctx_wrap = proxy_ctx(ctx)

  var current_frame // currently in seconds
  // var currentTime = 0; // in frames? could have it in string format (0:00:00:1-60)

  var LEFT_GUTTER = 20
  var i, x, y, il, j

  var needsRepaint = false
  var renderItems = []

  var timeDrag = 0
  var channelDrag

  function Diamond (t, x, y) {
    var self = this

    var isOver = false

    this.time = t

    this.path = function (ctx_wrap) {
      ctx_wrap
        .beginPath()
        .moveTo(x, y)
        .lineTo(x + DIAMOND_SIZE / 2, y + DIAMOND_SIZE / 2)
        .lineTo(x, y + DIAMOND_SIZE)
        .lineTo(x - DIAMOND_SIZE / 2, y + DIAMOND_SIZE / 2)
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
      canvas.style.cursor = 'move' // pointer move ew-resize
      self.paint(ctx_wrap)
    }

    this.mouseout = function () {
      isOver = false
      canvas.style.cursor = 'default'
      self.paint(ctx_wrap)
    }

    this.mousedrag = function (e, domEvent) {
      if (channelDrag !== undefined) {
        var t = x_to_time(e.offsetx)
        var delta = Math.max(t - timeDrag, -timeDrag)
        var shift = domEvent.shiftKey

        if (delta) {
          context.draggingKeyframe = true

          context.controller.moveKeyframe(channelDrag, timeDrag, delta, shift)

          timeDrag += delta
          repaint()
        }
      }
    }
  }

  function repaint () {
    needsRepaint = true
  }

  function drawLayerContents () {
    renderItems.length = 0

    // horizontal Layer lines
    for (i = 0, il = layers.length; i <= il; i++) {
      ctx.strokeStyle = Theme.b
      ctx.beginPath()
      y = i * LINE_HEIGHT
      y = ~~y - 0.5

      ctx_wrap
        .moveTo(0, y)
        .lineTo(context.controller.getContainerWidth(), y)
        .stroke()
    }

    // Draw Diamonds
    for (i = 0; i < il; i++) {
      // check for keyframes
      var layer = layers[i]
      var times = context.controller.getChannelKeyTimes(layer)

      y = i * LINE_HEIGHT

      // TODO use upper and lower bound here

      for (var j = 0; j < times.length; j++) {
        var time = times[j]

        renderItems.push(new Diamond(
          time, time_to_x(time),
          y + LINE_HEIGHT * 0.5 - DIAMOND_SIZE / 2))
      }
    }

    // render
    for (i = 0, il = renderItems.length; i < il; i++) {
      var item = renderItems[i]
      item.paint(ctx_wrap)
    }
  }

  var TOP_SCROLL_TRACK = 20
  var scroller = {
    left: 0,
    grip_length: 0,
    k: 1
  }
  var left

  function drawScroller () {
    var w = context.controller.getContainerWidth()

    var totalTime = context.totalTime
    var viewTime = w / time_scale

    var k = w / totalTime // pixels per seconds
    scroller.k = k

    // 800 / 5 = 180

    // var k = Math.min(viewTime / totalTime, 1);
    // var grip_length = k * w;

    scroller.grip_length = viewTime * k
    var h = TOP_SCROLL_TRACK

    scroller.left = context.scrollTime * k
    scroller.left = Math.min(Math.max(0, scroller.left), w - scroller.grip_length)

    // console.log(scroller.left)

    ctx.beginPath()
    ctx.fillStyle = Theme.b // 'cyan';
    ctx.rect(0, 5, w, h)
    ctx.fill()

    ctx.fillStyle = Theme.d // 'yellow';

    ctx.beginPath()
    ctx.rect(scroller.left, 5, scroller.grip_length, h)
    ctx.fill()

    var r = current_frame * k

    // ctx.fillStyle = Theme.a; // 'yellow';
    // ctx.fillRect(0, 5, w, 2);

    ctx.fillStyle = 'red'
    ctx.fillRect(0, 5, r, 2)

    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.moveTo(r, 5);
    // ctx.lineTo(r, 15);
    // ctx.stroke();
  }

  function setTimeScale (v) {
    if (time_scale !== v) {
      time_scale = v
      time_scaled()
    }
  }

  this.setTimeScale = setTimeScale

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
      .rect(0, 0, context.controller.getContainerWidth(), context.scrollHeight)
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

    setTimeScale(context.timeScale)

    current_frame = context.currentTime
    frame_start = context.scrollTime

    /**************************/
    // background

    ctx.fillStyle = Theme.a
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(dpr, dpr)

    //

    ctx.lineWidth = 1 // .5, 1, 2

    var width = context.controller.getContainerWidth()
    var height = context.height

    var units = time_scale / tickMark1
    var offsetUnits = (frame_start * time_scale) % units

    var count = (context.controller.getContainerWidth() - LEFT_GUTTER + offsetUnits) / units

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
      ctx.fillText(t, x, 38)
    }

    units = time_scale / tickMark2
    count = (context.controller.getContainerWidth() - LEFT_GUTTER + offsetUnits) / units

    // marker lines - main
    for (i = 0; i < count; i++) {
      ctx.strokeStyle = Theme.c
      ctx.beginPath()
      x = i * units + LEFT_GUTTER - offsetUnits
      ctx.moveTo(x, MARKER_TRACK_HEIGHT - 0)
      ctx.lineTo(x, MARKER_TRACK_HEIGHT - 16)
      ctx.stroke()
    }

    var mul = tickMark3 / tickMark2
    units = time_scale / tickMark3
    count = (context.controller.getContainerWidth() - LEFT_GUTTER + offsetUnits) / units

    // small ticks
    for (i = 0; i < count; i++) {
      if (i % mul === 0) continue
      ctx.strokeStyle = Theme.c
      ctx.beginPath()
      x = i * units + LEFT_GUTTER - offsetUnits
      ctx.moveTo(x, MARKER_TRACK_HEIGHT - 0)
      ctx.lineTo(x, MARKER_TRACK_HEIGHT - 10)
      ctx.stroke()
    }

    // Encapsulate a scroll rect for the layers
    ctx_wrap
      .save()
      .translate(0, MARKER_TRACK_HEIGHT)
      .beginPath()
      .rect(0, 0, context.controller.getContainerWidth(), context.scrollHeight)
      .translate(-scrollLeft, -scrollTop)
      .clip()
      .run(drawLayerContents)
      .restore()

    drawScroller()

    // Current Marker / Cursor
    ctx.strokeStyle = 'red' // Theme.c
    x = (current_frame - frame_start) * time_scale + LEFT_GUTTER

    var txt = utils.format_friendly_seconds(current_frame)
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

  canvas.addEventListener('dblclick', function (e) {
    canvasBounds = canvas.getBoundingClientRect()
    var mx = e.clientX - canvasBounds.left; var my = e.clientY - canvasBounds.top

    var track = y_to_track(my)
    var s = x_to_time(mx)

    dispatcher.fire('keyframe', layers[track], current_frame)
  })

  function onMouseMove (e) {
    canvasBounds = canvas.getBoundingClientRect()
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

  canvas.addEventListener('mouseout', function () {
    pointer = null
  })

  var mousedown2 = false; var mouseDownThenMove = false
  utils.handleDrag(canvas, function down (e) {
    mousedown2 = true
    pointer = {
      x: e.offsetx,
      y: e.offsety
    }
    pointerEvents()
    if (mousedownItem instanceof Diamond) {
      timeDrag = mousedownItem.time
      channelDrag = layers[y_to_track(e.offsety)]
      if (!channelDrag) mousedownItem = null
    }
    dispatcher.fire('time.update', x_to_time(e.offsetx))
    // Hit criteria
  }, function move (e, domEvent) {
    mousedown2 = false
    if (mousedownItem) {
      mouseDownThenMove = true
      if (mousedownItem.mousedrag) {
        mousedownItem.mousedrag(e, domEvent)
      }
    } else {
      dispatcher.fire('time.update', x_to_time(e.offsetx))
    }
  }, function up () {
    if (mouseDownThenMove) {
      dispatcher.fire('keyframe.move')
    }
    mousedown2 = false
    mousedownItem = null
    mouseDownThenMove = false
    context.draggingKeyframe = false
    repaint()
  }
  )

  /** Handles dragging for scroll bar **/

  var draggingx

  utils.handleDrag(canvas, function down (e) {
    draggingx = scroller.left
  }, function move (e) {
    context.scrollTime = Math.max(0, (draggingx + e.dx) / scroller.k)
    repaint()
  }, function up () {
  }, function (e) {
    var bar = e.offsetx >= scroller.left && e.offsetx <= scroller.left + scroller.grip_length
    return e.offsety <= TOP_SCROLL_TRACK && bar
  }
  )

  /** * End handling for scrollbar ***/
}

export { DopeSheetPanel }
