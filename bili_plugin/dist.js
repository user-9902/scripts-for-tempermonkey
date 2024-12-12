const style = `#bili_plugin {
  .bp-container {
    position: fixed;
    left: 2px;
    top: max(70px, 20vh);
    display: flex;
    flex-direction: column;

    div {
      border-radius: 8px;
      border: 1px var(--bg2) solid;
      padding: 2px;
      text-align: center;
      margin-top: 8px;
      cursor: pointer;
      background-color: var(--bg1);
      &:hover {
        background-color: var(--bg3);
      }
      svg {
        width: 28px;
      }
      p {
        margin: 0;
        color: #9499a0;
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
}

/*  dark theme */
:root[theme='dark'] {
  --Ga1: #61666d; /* 不推荐改基本颜色。因为webcomponent的样在沙盒中，无法直接影响，才出此下策 */

  --bg1: var(--Ga9);
  --bg2: var(--Ga8);
  --bg3: var(--Ga8);
  --bg1_float: var(--Ga10);
  --bg2_float: var(--Ga8);
  --bg3_float: var(--Ga9);
  --text1: var(--Ga2);
  --text2: var(--Ga3);
  --text3: var(--Ga4);
  --text4: var(--Ga5);
  --graph_bg_thin: var(--Ga7);
  --graph_bg_regular: var(--Ga8);
  --graph_bg_thick: var(--G7);
  --line_light: var(--Ga7);
  --line_regular: var(--Ga7);
  --graph_weak: var(--Ga7);
  --graph_bg_regular_float: var(--Ga8);
}
`

const template = `<div
  class="bp-container"
  theme="light"
>
  <div
    id="bp-container-downloadvideo"
    style="display: none"
  >
    <svg
      data-v-d2e47025=""
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="#00AEEC"
        d="M704 768V256H128v512zm64-416 192-96v512l-192-96v128a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V224a32 32 0 0 1 32-32h640a32 32 0 0 1 32 32zm0 71.552v176.896l128 64V359.552zM192 320h192v64H192z"
      ></path>
    </svg>
    <p>下载视频</p>
  </div>

  <div
    id="bp-container-downloadaudio"
    style="display: none"
  >
    <svg
      data-v-d2e47025=""
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="#00AEEC"
        d="M896 529.152V512a384 384 0 1 0-768 0v17.152A128 128 0 0 1 320 640v128a128 128 0 1 1-256 0V512a448 448 0 1 1 896 0v256a128 128 0 1 1-256 0V640a128 128 0 0 1 192-110.848M896 640a64 64 0 0 0-128 0v128a64 64 0 0 0 128 0zm-768 0v128a64 64 0 0 0 128 0V640a64 64 0 1 0-128 0"
      ></path>
    </svg>
    <p>下载音频</p>
  </div>

  <div
    id="bp-container-screenshot"
    style="display: none"
  >
    <svg
      data-v-d2e47025=""
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="#00AEEC"
        d="M96 896a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h832a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32zm315.52-228.48-68.928-68.928a32 32 0 0 0-45.248 0L128 768.064h778.688l-242.112-290.56a32 32 0 0 0-49.216 0L458.752 665.408a32 32 0 0 1-47.232 2.112M256 384a96 96 0 1 0 192.064-.064A96 96 0 0 0 256 384"
      ></path>
    </svg>
    <p>视频截屏</p>
  </div>

  <div
    id="bp-container-darktheme"
    style="display: none"
  >
    <svg
      data-v-d2e47025=""
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="#00AEEC"
        d="M240.448 240.448a384 384 0 1 0 559.424 525.696 448 448 0 0 1-542.016-542.08 390.592 390.592 0 0 0-17.408 16.384zm181.056 362.048a384 384 0 0 0 525.632 16.384A448 448 0 1 1 405.056 76.8a384 384 0 0 0 16.448 525.696"
      ></path>
    </svg>
    <p>深色模式</p>
  </div>
</div>
`

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
