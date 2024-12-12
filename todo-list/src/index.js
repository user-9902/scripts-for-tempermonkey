const style = `{{ style  }}`

const template = `{{ template }}`

;(function () {
  'use strict'
  // runing immediately


  // utils

  // controller
  const styleEl = document.createElement('style')
  styleEl.textContent = style
  document.head.appendChild(styleEl)
  const templateEl = document.createElement('div')
  templateEl.innerHTML = template
  document.body.appendChild(templateEl)
  templateEl.id = 'todolist_plugin'
})()
