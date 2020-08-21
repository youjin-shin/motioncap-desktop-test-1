/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-tabs */

// var Theme = require('./theme')
// var LayoutConstants = require('./layout_constants')
// var utils = require('./utils')
import { Theme } from './theme.js'
import { LayoutConstants } from './layout_constants.js'
import { utils } from './utils.js'

function LayerView (context, channelName) {
  var dom = document.createElement('div')
  var label = document.createElement('span')

  label.style.cssText = 'font-size: 14px; padding: 4px;'

  var height = (LayoutConstants.LINE_HEIGHT)

  var keyframe_button = document.createElement('button')
  keyframe_button.innerHTML = '&#9679;' // '&diams;' &#9671; 9679 9670 9672
  keyframe_button.style.cssText = 'background: none; font-size: 12px; padding: 0px; font-family: monospace; float: right; width: 20px; height: ' + height + 'px; border-style:none; outline: none;' //  border-style:inset;

  keyframe_button.addEventListener('click', function (e) {
    context.dispatcher.fire('keyframe', channelName)
  })

  /*
	// Prev Keyframe
	var button = document.createElement('button');
	button.textContent = '<';
	button.style.cssText = 'font-size: 12px; padding: 1px; ';
	dom.appendChild(button);

	// Next Keyframe
	button = document.createElement('button');
	button.textContent = '>';
	button.style.cssText = 'font-size: 12px; padding: 1px; ';
	dom.appendChild(button);
	*/

  dom.appendChild(label)
  dom.appendChild(keyframe_button)

  dom.style.cssText = 'margin: 0px; border-bottom:1px solid ' + Theme.b + '; top: 0; left: 0; height: ' + height + 'px; line-height: ' + height + 'px; color: ' + Theme.c
  this.dom = dom

  var repaint = function repaint (time) {
    keyframe_button.style.color = Theme.b

    if (time == null || context.draggingKeyframe || channelName == null) return

    var keyTimes = context.controller.getChannelKeyTimes(channelName)

    if (utils.binarySearch(keyTimes, time) >= 0) {
      keyframe_button.style.color = Theme.c
    }
  }

  this.repaint = repaint

  this.setState = function (name) {
    channelName = name
    label.textContent = name

    repaint()
  }
}

export { LayerView }
