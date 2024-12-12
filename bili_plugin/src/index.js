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
  videoBtn.addEventListener('click', downloadVideo)

  const audioBtn = templateEl.querySelector('#bp-container-downloadaudio')
  audioBtn.addEventListener('click', () =>
    download(
      config.playinfo.data.dash.audio[0].baseUrl,
      document.title + '.mp3',
    ),
  )

  const screenShotBtn = templateEl.querySelector('#bp-container-screenshot')
  screenShotBtn.addEventListener('click', () => screenshot())

  const darkThemeBtn = templateEl.querySelector('#bp-container-darktheme')
  darkThemeBtn.addEventListener('click', () => darktheme())

  // runing immediately
  const config = new Proxy(
    {
      playinfo: null,
      theme: null,
      recodModule: true, // b站音视频分开的，这里提供了两种模式，false：直接下载无音频的视频；true：webrtc录制模式，需完整播放视频完成下载
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

  const host = location.hostname
  const path = location.pathname
  // 插件作用域于整个b站，而b站又有许多子域名，我们用白名单的方式来管理插件的作用域
  // 支持深色模式的白名单
  if (['search.', 'www.'].some(i => host.startsWith(i))) {
    darkThemeBtn.style.display = 'inline'

    config.theme = localStorage.getItem('__bili_plugin_theme__')
  }
  // 支持下载的白名单
  if (
    host.startsWith('www.') &&
    ['/video', '/list'].some(i => path.startsWith(i))
  ) {
    config.playinfo = window.__playinfo__
    if (!config.playinfo) {
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
                  config.playinfo = responseText
                }
              } catch {}
            }
          }
        })
      }
    }
  }

  // utils
  async function downloadVideo() {
    if (config.recodModule) {
      const videoEl = document.getElementsByTagName('video')?.[0]
      if (!videoEl) return

      videoEl.currentTime = 0.1
      videoEl.pause()
      videoEl.addEventListener(
        'play',
        () => {
          let recordedChunks = []
          // 这里代码同异步处理有问题，临时方案
          const mimeType = 'video/webm'
          let mr = new MediaRecorder(videoEl.captureStream(), { mimeType })

          mr.ondataavailable = function (event) {
            if (event.data.size > 0) {
              recordedChunks.push(event.data)
            }
          }

          mr.onstop = function () {
            const blob = new Blob(recordedChunks, { type: mimeType })
            const url = URL.createObjectURL(blob)
            download(url, document.title)
            recordedChunks = []
          }

          mr.start()

          videoEl.addEventListener('stop', () => mr.stop(), { once: true })
        },
        { once: true },
      )
      videoEl.play()
    } else {
      download(
        config.playinfo.data.dash.video[0].baseUrl,
        document.title + '.mp4',
      )
    }
  }

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
    config.theme = config.theme === 'dark' ? '' : 'dark'
  }
})()
