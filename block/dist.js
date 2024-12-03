;(function () {
  'use strict'
  const url = location.href
  // 必应搜索
  if (url.startsWith('https://cn.bing.com/search')) {
    // 删除广告
    const node = document.getElementById('b_results')
    for (let el of node.children) {
      if (/b_ad/.test(el.className)) {
        el.style.display = 'none'
      }
    }
  }

  // csdn
  else if (url.startsWith('https://blog.csdn.net/')) {
    // todo 删除广告
  }
})()
