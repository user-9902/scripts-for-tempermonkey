const style = `#bili_plugin {
  .bp-container {
    position: fixed;
    left: 8px;
    top: 20vh;
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 10px;

    div {
      border-radius: 8px;
      border: 1px #e3e5e7 solid;
      padding: 4px;
      text-align: center;
      margin-top: 8px;
      cursor: pointer;
      &:hover {
        background-color: #e3e5e7;
      }
      svg {
        width: 28px;
      }
      p {
        color: #9499a0;
      }
    }
  }
}
`

const template = `<div class="bp-container">
  <div id="bp-container-downloadvideo">
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
    <p>下载视频</p>
  </div>

  <div id="bp-container-downloadaudio">
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

  <div id="bp-container-screenshot">
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

  <div>
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

  // runing immediately
  let json = ''
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
          )
        ) {
          json = JSON.parse(this.responseText)
        }
      }
    }, 20)
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
    const url = canvas.toDataURL('image/png')
    download(url, new Date().getTime() + '.png')
  }

  // controller
  const styleEl = document.createElement('style')
  styleEl.textContent = style
  document.head.appendChild(styleEl)
  const templateEl = document.createElement('div')
  templateEl.innerHTML = template
  document.body.appendChild(templateEl)
  templateEl.id = 'bili_plugin'

  const audioBtn = document.getElementById('bp-container-downloadaudio')
  audioBtn.addEventListener('click', () =>
    download(json.data.dash.audio[0].baseUrl, document.title + '.mp3'),
  )

  const screenShotBtn = document.getElementById('bp-container-screenshot')
  screenShotBtn.addEventListener('click', () => screenshot())

  const videoBtn = document.getElementById('bp-container-downloadvideo')
  videoBtn.addEventListener('click', () =>
    download(json.data.dash.video[0].baseUrl, document.title + '.mp4'),
  )
})()