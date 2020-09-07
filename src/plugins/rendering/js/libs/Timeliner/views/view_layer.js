/* eslint-disable no-sequences */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-tabs */
import { Theme } from '../theme.js'
import { UINumber } from '../ui/ui_number.js'
import { Tweens } from '../utils/util_tween.js'
import { LayoutConstants } from '../layout_constants.js'
import { utils } from '../utils/utils.js'

// TODO - tagged by index instead, work off layers.

function LayerView (layer, dispatcher) {
  var dom = document.createElement('div')

  var label = document.createElement('span')

  label.style.cssText = 'font-size: 14px; padding: 4px; vertical-align: -webkit-baseline-middle;'

  label.addEventListener('click', function (e) {
    // context.dispatcher.fire('label', channelName);
  })

  label.addEventListener('mouseover', function (e) {
    // context.dispatcher.fire('label', channelName);
  })

  var dropdown = document.createElement('select')
  var option
  dropdown.style.cssText = 'border: 1px solid black; border-radius: 5px;  padding: 4px; font-size: 14px; width: 20%; margin: 0; float: right; text-align: right;'

  for (var k in Tweens) {
    option = document.createElement('option')
    option.text = k
    dropdown.appendChild(option)
  }

  dropdown.addEventListener('change', function (e) {
    dispatcher.fire('ease', layer, dropdown.value)
  })
  var height = (LayoutConstants.LINE_HEIGHT - 2)

  var keyframe_button = document.createElement('button')
  keyframe_button.innerHTML = '&#9679;' // '&diams;' &#9671; 9679 9670 9672
  keyframe_button.style.cssText = 'background: none; font-size: 12px; padding: 0px; font-family: ; float: right; width: 20px; height: ' + height + 'px; border-style:none; outline: none;' //  border-style:inset;

  keyframe_button.addEventListener('click', function (e) {
    // console.log('state')
    console.log('clicked:keyframing...', state.get('values'))
    dispatcher.fire('keyframe', layer, state.get('_value').value)
  })

  var color_button = document.createElement('button')
  color_button.innerHTML = '&#9632;' // '&diams;' &#9671; 9679 9670 9672
  color_button.style.cssText = 'color: purple; background: none; font-size: 12px; padding: 0px; font-family: ; float: right; width: 20px; height: ' + height + 'px; border-style:none; outline: none;' //  border-style:inset;

  color_button.addEventListener('click', function (e) {
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

  function ToggleButton (text) {
    // for css based button see http://codepen.io/mallendeo/pen/eLIiG

    var button = document.createElement('button')
    button.textContent = text

    utils.style(button, {
      fontSize: '12px',
      padding: '1px',
      borderSize: '1px',
      outline: 'none',
      background: Theme.a,
      color: Theme.c
    })

    this.pressed = false

    button.onclick = () => {
      this.pressed = !this.pressed

      utils.style(button, {
        borderStyle: this.pressed ? 'inset' : 'outset' // inset outset groove ridge
      })

      if (this.onClick) this.onClick()
    }

    this.dom = button
  }

  // Solo
  var solo_toggle = new ToggleButton('S')
  // dom.appendChild(solo_toggle.dom)

  solo_toggle.onClick = function () {
    dispatcher.fire('action:solo', layer, solo_toggle.pressed)
  }

  // Mute
  var mute_toggle = new ToggleButton('M')
  // dom.appendChild(mute_toggle.dom)

  mute_toggle.onClick = function () {
    dispatcher.fire('action:mute', layer, mute_toggle.pressed)
  }

  var number = new UINumber(layer, dispatcher)

  number.onChange.do(function (value, done) {
    state.get('values').value = value
    dispatcher.fire('value.change', layer, value, done)
  })

  utils.style(number.dom, {
    float: 'right'
    // borderBottom: '1px solid ' + Theme.c
  })

  dom.appendChild(label)
  dom.appendChild(keyframe_button)
  dom.appendChild(color_button)
  // dom.appendChild(number.dom)
  dom.appendChild(dropdown)

  utils.style(dom, {
    textAlign: 'left',
    // margin: '0px 0px 0px 5px',
    borderBottom: '1px solid ' + Theme.b,
    top: 0,
    left: 0,
    height: (LayoutConstants.LINE_HEIGHT) + 'px',
    color: Theme.c
  })

  this.dom = dom

  this.repaint = repaint
  var state

  this.setState = function (l, s) {
    layer = l
    state = s

    var tmp_value = state.get('values')
    if (tmp_value.value === undefined) {
      tmp_value.value = 0
    }

    // number.setValue(tmp_value.value)

    // console.log(state)
    label.textContent = state.get('name').value
    // color_button.style.color = state.get('_color').value

    repaint()
  }

  function repaint (s) {
    dropdown.style.opacity = 0
    dropdown.disabled = true
    keyframe_button.style.color = Theme.b
    // keyframe_button.disabled = false;
    // keyframe_button.style.borderStyle = 'solid';

    var tween = null
    var o = utils.timeAtLayer(layer, s)

    // console.log(o)
    if (!o) return

    if (o.can_tween) {
      dropdown.style.opacity = 1
      dropdown.disabled = false
      // if (o.tween)
      dropdown.value = o.tween ? o.tween : 'none'
      if (dropdown.value === 'none') dropdown.style.opacity = 0.5
    }

    if (o.keyframe) {
      keyframe_button.style.color = Theme.c
      // keyframe_button.disabled = true;
      // keyframe_button.style.borderStyle = 'inset';
    }

    o.value = state.get('values').value
    number.setValue(o.value)
    number.paint()

    dispatcher.fire('target.notify', layer.name, o.value)
  }
}

export { LayerView }
