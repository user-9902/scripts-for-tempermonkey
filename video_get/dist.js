// https://github.com/user-9902/scripts-for-tempermonkey

const style = `#vg-container {
  position: absolute;
  left: 2px;
  width: 14px;
  height: 14px;
  z-index: 99999;
  background-color: #eee;
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
  }
}
`

const template = `<div id="vg-container">
  <svg
    alet="下载视频"
    data-v-d2e47025=""
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
  >
    <path
      fill="currentColor"
      d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64z"
    ></path>
  </svg>
</div>

<style>
#vg-container {
  position: absolute;
  left: 2px;
  width: 14px;
  height: 14px;
  z-index: 99999;
  background-color: #ccc;
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
  }
}
</style>
`

;(function () {
  'use strict'

  // methods
  function RecordByRTC(videoEl) {
    videoEl.currentTime = 0.1
    videoEl.pause()
    videoEl.addEventListener(
      'play',
      () => {
        let recordedChunks = []
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

  document.addEventListener('DOMContentLoaded', () => {
    const styleEl = document.createElement('style')
    styleEl.textContent = style
    document.head.appendChild(styleEl)

    document.addEventListener('mouseover', e => {
      const el = e.target
      // 一些网站存在遮罩
      const videos = Array.prototype.filter.call(el.parentNode.childNodes, el => {
        return el.tagName === 'VIDEO'
      })
      if (videos.length === 0 || videos.length > 1) return
      const video = videos[0]

      const dashbord = document.createElement('div')
      dashbord.style.position = 'relative'
      dashbord.innerHTML = template

      el.parentNode.insertBefore(dashbord, el.parentNode.firstChild)
      dashbord.onclick = e => {
        e.stopPropagation()
        RecordByRTC(video)
      }

      setTimeout(() => {
        dashbord.remove()
      }, 5 * 1000)
    })
  })
})()
