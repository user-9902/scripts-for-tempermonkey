// https://github.com/user-9902/scripts-for-tempermonkey

const style = `{{ style  }}`

const template = `{{ template }}`

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
