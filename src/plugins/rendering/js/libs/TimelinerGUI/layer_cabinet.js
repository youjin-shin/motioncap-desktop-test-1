/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-tabs */

// var LayoutConstants = require('./layout_constants')
import { LayoutConstants } from './layout_constants.js'
// var LayerView = require('./layer_view')
import { LayerView } from './layer_view.js'
// var IconButton = require('./widget/icon_button')
import { IconButton } from './widget/icon_button.js'
import { utils } from './utils.js'
// var Theme = require('./theme')
import { Theme } from './theme.js'
// var NumberUI = require('./widget/number')
import { NumberUI } from './widget/number.js'
import colors from 'vuetify/lib/util/colors'
var style = utils.style
var STORAGE_PREFIX = utils.STORAGE_PREFIX

function LayerCabinet (context) {
  var div = document.createElement('div')

  var top = document.createElement('div')
  top.style.cssText = 'margin: 0px; top: 0; left: 0; height: ' + LayoutConstants.MARKER_TRACK_HEIGHT + 'px'
  // top.style.textAlign = 'right';

  var layer_scroll = document.createElement('div')
  style(layer_scroll, {
    position: 'absolute',
    top: LayoutConstants.MARKER_TRACK_HEIGHT + 'px',
    // height: (height - LayoutConstants.MARKER_TRACK_HEIGHT) + 'px'
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  })

  div.appendChild(layer_scroll)

  var playing = false

  var button_styles = {
    width: '22px',
    height: '22px',
    padding: '2px'
  }

  var op_button_styles = {
    width: '32px',
    padding: '3px 4px 3px 4px'
  }

  var dispatcher = context.dispatcher
  var controller = context.controller

  var play_button = new IconButton(16, 'play', 'Play', dispatcher)
  style(play_button.dom, button_styles, { marginTop: '2px' })
  play_button.onClick(function (e) {
    e.preventDefault()
    dispatcher.fire('controls.toggle_play')
  })

  var stop_button = new IconButton(16, 'stop', 'Stop', dispatcher)
  style(stop_button.dom, button_styles, { marginTop: '2px' })
  stop_button.onClick(function (e) {
    dispatcher.fire('controls.stop')
  })

  var undo_button = new IconButton(16, 'undo', 'undo', dispatcher)
  style(undo_button.dom, op_button_styles)
  undo_button.onClick(function () {
    dispatcher.fire('controls.undo')
  })

  var redo_button = new IconButton(16, 'repeat', 'redo', dispatcher)
  style(redo_button.dom, op_button_styles)
  redo_button.onClick(function () {
    dispatcher.fire('controls.redo')
  })

  var curveEditor = new IconButton(16, 'repeat', 'redo', dispatcher)
  style(curveEditor.dom, op_button_styles)
  curveEditor.onClick(function () {
    dispatcher.fire('controls.curveEditor')
  })
  var dopesheetEditor = new IconButton(16, 'repeat', 'redo', dispatcher)
  style(dopesheetEditor.dom, op_button_styles)
  dopesheetEditor.onClick(function () {
    dispatcher.fire('controls.dopesheetEditor')
  })

  var range = document.createElement('input')
  range.type = 'range'
  range.value = 0
  range.min = -1
  range.max = +1
  range.step = 0.125

  style(range, {
    width: '80px',
    margin: '0px',
    marginLeft: '2px',
    marginRight: '2px'
  })

  var draggingRange = 0

  range.addEventListener('mousedown', function () {
    draggingRange = 1
  })

  range.addEventListener('mouseup', function () {
    draggingRange = 0
    changeRange()
  })

  range.addEventListener('mousemove', function () {
    if (!draggingRange) return
    changeRange()
  })

  div.appendChild(top)

  var time_options = {
    min: 0,
    step: 0.125
  }
  var currentTime = new NumberUI(time_options)
  var totalTime = new NumberUI(time_options)

  currentTime.onChange.do(function (value, done) {
    dispatcher.fire('time.update', value)
    currentTime.paint()
  })

  totalTime.onChange.do(function (value, done) {
    dispatcher.fire('totalTime.update', value)
    totalTime.paint()
  })

  // Play Controls
  top.appendChild(currentTime.dom)
  top.appendChild(document.createTextNode('/ ')) // 0:00:00 / 0:10:00
  top.appendChild(totalTime.dom)
  top.appendChild(play_button.dom)
  top.appendChild(stop_button.dom)
  top.appendChild(range)

  var operations_div = document.createElement('div')
  style(operations_div, {
    marginTop: '4px'
    // borderBottom: '1px solid ' + Theme.b
  })
  top.appendChild(operations_div)
  // top.appendChild(document.createElement('br'));

  /*
	// open _alt
	var file_open = new IconButton(16, 'folder_open_alt', 'Open', dispatcher);
	style(file_open.dom, op_button_styles);
	operations_div.appendChild(file_open.dom);

	function populateOpen() {
		while (dropdown.length) {
			dropdown.remove(0);
		}

		var option;
		option = document.createElement('option');
		option.text = 'New';
		option.value = '*new*';
		dropdown.add(option);

		option = document.createElement('option');
		option.text = 'Import JSON';
		option.value = '*import*';
		dropdown.add(option);

		// Doesn't work
		// option = document.createElement('option');
		// option.text = 'Select File';
		// option.value = '*select*';
		// dropdown.add(option);

		option = document.createElement('option');
		option.text = '==Open==';
		option.disabled = true;
		option.selected = true;
		dropdown.add(option);

		var regex = new RegExp(STORAGE_PREFIX + '(.*)');
		for (var key in localStorage) {
			// console.log(key);

			var match = regex.exec(key);
			if (match) {
				option = document.createElement('option');
				option.text = match[1];

				dropdown.add(option);
			}
		}

	}

	// listen on other tabs
	window.addEventListener('storage', function(e) {
		var regex = new RegExp(STORAGE_PREFIX + '(.*)');
		if (regex.exec(e.key)) {
			populateOpen();
		}
	});

	dispatcher.on('save:done', populateOpen);

	var dropdown = document.createElement('select');

	style(dropdown, {
		position: 'absolute',
		// right: 0,
		// margin: 0,
		opacity: 0,
		width: '16px',
		height: '16px',
		// zIndex: 1,
	});

	dropdown.addEventListener('change', function(e) {
		// console.log('changed', dropdown.length, dropdown.value);

		switch (dropdown.value) {
			case '*new*':
				dispatcher.fire('new');
				break;
			case '*import*':
				dispatcher.fire('import');
				break;
			case '*select*':
				dispatcher.fire('openfile');
				break;
			default:
				dispatcher.fire('open', dropdown.value);
				break;
		}
	});

	file_open.dom.insertBefore(dropdown, file_open.dom.firstChild);

	populateOpen();

	// // json import
	// var import_json = new IconButton(16, 'signin', 'Import JSON', dispatcher);
	// operations_div.appendChild(import_json.dom);
	// import_json.onClick(function() {
	// 	dispatcher.fire('import');
	// });

	// // new
	// var file_alt = new IconButton(16, 'file_alt', 'New', dispatcher);
	// operations_div.appendChild(file_alt.dom);
	// save

	var save = new IconButton(16, 'save', 'Save', dispatcher);
	style(save.dom, op_button_styles);
	operations_div.appendChild(save.dom);
	save.onClick(function() {
		dispatcher.fire('save');
	});

	// save as
	var save_as = new IconButton(16, 'paste', 'Save as', dispatcher);
	style(save_as.dom, op_button_styles);
	operations_div.appendChild(save_as.dom);
	save_as.onClick(function() {
		dispatcher.fire('save_as');
	});
*/
  // download json (export)
  var download_alt = new IconButton(16, 'download_alt', 'Download animation', dispatcher)
  style(download_alt.dom, op_button_styles)
  operations_div.appendChild(download_alt.dom)
  download_alt.onClick(function () {
    dispatcher.fire('export')
  })

  var upload_alt = new IconButton(16, 'upload_alt', 'Upload animation', dispatcher)
  style(upload_alt.dom, op_button_styles)
  operations_div.appendChild(upload_alt.dom)
  upload_alt.onClick(function () {
    dispatcher.fire('openfile')
  })

  var span = document.createElement('span')
  span.style.width = '20px'
  span.style.display = 'inline-block'
  operations_div.appendChild(span)

  operations_div.appendChild(undo_button.dom)
  operations_div.appendChild(redo_button.dom)
  operations_div.appendChild(curveEditor.dom)
  operations_div.appendChild(dopesheetEditor.dom)
  operations_div.appendChild(document.createElement('br'))

  // Cloud Download / Upload edit pencil

  // show layer
  // var eye_open = new IconButton(16, 'eye_open', 'eye_open', dispatcher)
  // operations_div.appendChild(eye_open.dom)

  // // hide / disable layer
  // var eye_close = new IconButton(16, 'eye_close', 'eye_close', dispatcher)
  // operations_div.appendChild(eye_close.dom)

  // // remove layer
  // var minus = new IconButton(16, 'minus', 'minus', dispatcher)
  // operations_div.appendChild(minus.dom)

  // // check
  // var ok = new IconButton(16, 'ok', 'ok', dispatcher)
  // operations_div.appendChild(ok.dom)

  // // cross
  // var remove = new IconButton(16, 'remove', 'remove', dispatcher)
  // operations_div.appendChild(remove.dom)

  // range.addEventListener('change', changeRange);

  function convertPercentToTime (t) {
    var min_time = 1
    var max_time = 10 * 60 // 10 minutes
    var v = 500 / (t * (max_time - min_time) + min_time)
    return v
  }

  function convertTimeToPercent (v) {
    var min_time = 1
    var max_time = 10 * 60 // 10 minutes
    var t = ((500 / v) - min_time) / (max_time - min_time)
    return t
  }

  function changeRange () {
    // console.log("range.value", range.value);

    dispatcher.fire('update.scale', 6 * Math.pow(100, range.value))
  }

  var layer_uis = []
  var unused_layers = []

  this.layers = layer_uis

  this.setControlStatus = function (v) {
    playing = v
    if (playing) {
      play_button.setIcon('pause')
      play_button.setTip('Pause')
    } else {
      play_button.setIcon('play')
      play_button.setTip('Play')
    }
  }

  this.updateState = function () {
    var layers = context.controller.getChannelNames()

    // console.log(layer_uis.length, layers);
    var i, layer
    for (i = 0; i < layers.length; i++) {
      layer = layers[i]

      if (!layer_uis[i]) {
        var layer_ui
        if (unused_layers.length) {
          layer_ui = unused_layers.pop()
          layer_ui.dom.style.display = 'block'
        } else {
          // new
          layer_ui = new LayerView(context, layer)
          layer_scroll.appendChild(layer_ui.dom)
        }
        layer_uis.push(layer_ui)
      }

      layer_uis[i].setState(layer)
    }

    // console.log('Total layers (view, hidden, total)', layer_uis.length, unused_layers.length,
    //	layer_uis.length + unused_layers.length);
  }

  function repaint () {
    var layers = context.controller.getChannelNames()
    var time = context.currentTime
    currentTime.setValue(time)
    totalTime.setValue(context.totalTime)
    currentTime.paint()
    totalTime.paint()

    // TODO needed?
    for (var i = layer_uis.length; i-- > 0;) {
      // quick hack
      if (i >= layers.length) {
        layer_uis[i].dom.style.display = 'none'
        unused_layers.push(layer_uis.pop())
        continue
      }

      // console.log('yoz', states.get(i).value);
      layer_uis[i].setState(layers[i])
      // layer_uis[i].setState('layers'+':'+i);
      layer_uis[i].repaint(time)
    }
  }

  this.repaint = repaint
  this.updateState()

  this.scrollTo = function (x) {
    layer_scroll.scrollTop = x * (layer_scroll.scrollHeight - layer_scroll.clientHeight)
  }

  this.dom = div

  repaint()
}
export { LayerCabinet }
