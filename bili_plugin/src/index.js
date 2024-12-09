const style = `{{ style  }}`

const template = `{{ template }}`

;(function () {
  'use strict'

  // controller
  const styleEl = document.createElement('style')
  styleEl.textContent = style
  document.head.appendChild(styleEl)
  const templateEl = document.createElement('div')
  templateEl.innerHTML = template
  document.body.appendChild(templateEl)
  templateEl.id = 'bili_plugin'

  const videoBtn = templateEl.querySelector('#bp-container-downloadvideo')
  videoBtn.addEventListener('click', () =>
    download(info.playinfo.data.dash.video[0].baseUrl, document.title + '.mp4'),
  )

  const audioBtn = templateEl.querySelector('#bp-container-downloadaudio')
  audioBtn.addEventListener('click', () =>
    download(info.playinfo.data.dash.audio[0].baseUrl, document.title + '.mp3'),
  )

  const screenShotBtn = templateEl.querySelector('#bp-container-screenshot')
  screenShotBtn.addEventListener('click', () => screenshot())

  const darkThemeBtn = templateEl.querySelector('#bp-container-darktheme')
  darkThemeBtn.addEventListener('click', () => darktheme())

  // runing immediately

  // 是否能进行操作视频
  const info = new Proxy(
    {
      playinfo: null,
      theme: null,
    },
    {
      set(target, key, val, arg) {
        if (key === 'playinfo' && val) {
          videoBtn.style.display = 'inline'
          audioBtn.style.display = 'inline'
          screenShotBtn.style.display = 'inline'
        }
        if (key === 'theme') {
          const theme = val === 'dark' ? 'dark' : ''
          localStorage.setItem('__bili_plugin_theme__', theme)
          document.documentElement.setAttribute('theme', theme)
        }
        return Reflect.set(target, key, val, arg)
      },
    },
  )

  // 支持深色模式的白名单
  const host = location.hostname
  if (['search.', 'www.'].some(i => host.startsWith(i))) {
    darkThemeBtn.style.display = 'inline'

    info.theme = localStorage.getItem('__bili_plugin_theme__')
  }

  info.playinfo = window.__playinfo__
  if (!info.playinfo) {
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
              const responseText = JSON.parse(this.responseText)
              if (
                responseText.code == '0' &&
                responseText?.data?.dash?.audio?.length < 5
              ) {
                info.playinfo = responseText
              }
            } catch {}
          }
        }
      })
    }
  }

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
    canvas.toBlob(async blob => {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])
    }, 'image/png') // 指定导出的图片格式
  }

  function darktheme() {
    info.theme = info.theme === 'dark' ? '' : 'dark'
  }
})()
