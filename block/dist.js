;(function () {
  'use strict'
  const url = location.href
  const host = location.host
  // 必应搜索
  if (url.startsWith('https://cn.bing.com/search')) {
    // 删除广告
    const node = document.getElementById('b_results')
    for (let el of node.children) {
      if (/b_ad/.test(el.className)) {
        el.style.display = 'none'
      }
      let i = el.querySelector('.b_lineclamp2')

      setTimeout(() => {
        if (
          i &&
          getComputedStyle(i, ':before').content.startsWith(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAICAYAAADjoT9j',
          )
        ) {
          el.style.display = 'none'
        }
      }, 100)
    }
  }

  // csdn
  else if (host.endsWith('.csdn.net')) {
    const el = document.getElementById('toolbarBox')
    for (let i = 0; i < el.children.length - 1; i++) {
      el.children[i].display = 'none'
    }
  }
})()
