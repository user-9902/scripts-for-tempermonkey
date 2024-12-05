const style = `{{ style  }}`

const template = `{{ template }}`

;(function () {
  'use strict'

  // runing immediately
  let json = window.__playinfo__ ?? ''
  if (!json) {
    const send = window.XMLHttpRequest.prototype.send
    window.XMLHttpRequest.prototype.send = function () {
      send.call(this, ...arguments)

      setTimeout(() => {
        const onreadystatechange = this.onreadystatechange
        this.onreadystatechange = function () {
          if (onreadystatechange) onreadystatechange.call(this, ...arguments)

          if (
            this.responseURL.startsWith(
              'https://api.bilibili.com/x/player/wbi/playurl',
            ) &&
            this.responseText
          ) {
            try {
              json = JSON.parse(this.responseText)
            } catch {}
          }
        }
      })
    }
  }

  document.documentElement.setAttribute(
    'theme',
    localStorage.getItem('__bili_plugin_theme__'),
  )

  // utils
  function download(url, fullName) {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        var a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = fullName

        document.body.appendChild(a)

        a.click()
        a.remove()
      })
  }

  function screenshot() {
    const videoEl = document.getElementsByClassName('bpx-player-video-wrap')[0]
      .firstChild

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = videoEl.videoWidth
    canvas.height = videoEl.videoHeight
    context.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
    const url = canvas.toDataURL('image/png')
    download(url, new Date().getTime() + '.png')
  }

  function darktheme() {
    let theme = localStorage.getItem('__bili_plugin_theme__')
    theme = theme === 'dark' ? '' : 'dark'
    document.documentElement.setAttribute('theme', theme)
    localStorage.setItem('__bili_plugin_theme__', theme)
  }

  // controller
  const styleEl = document.createElement('style')
  styleEl.textContent = style
  document.head.appendChild(styleEl)
  const templateEl = document.createElement('div')
  templateEl.innerHTML = template
  document.body.appendChild(templateEl)
  templateEl.id = 'bili_plugin'

  const videoBtn = document.getElementById('bp-container-downloadvideo')
  videoBtn.addEventListener('click', () =>
    download(json.data.dash.video[0].baseUrl, document.title + '.mp4'),
  )

  const audioBtn = document.getElementById('bp-container-downloadaudio')
  audioBtn.addEventListener('click', () =>
    download(json.data.dash.audio[0].baseUrl, document.title + '.mp3'),
  )

  const screenShotBtn = document.getElementById('bp-container-screenshot')
  screenShotBtn.addEventListener('click', () => screenshot())

  const darkThemeBtn = document.getElementById('bp-container-darktheme')
  darkThemeBtn.addEventListener('click', () => darktheme())
})()
