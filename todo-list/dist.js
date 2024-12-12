const style = `#todolist_plugin {
  .bp-container {
    position: fixed;
    right: 20px;
    top: 0;
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 10px;
    background-color: red;

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
        font-size: 12px;
      }
    }
  }
}

html[theme='dark'] {
  .link-navbar-more {
    background-color: #17181a !important;
  }
  #app {
    background-color: var(--bg1);
  }
}
`

const template = `<div
  class="todo-container"
  theme="light"
>
  <div>todolist</div>
  <div>当前域名下的todo</div>

  <div id="button">
    <svg
      data-v-d2e47025=""
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="currentColor"
        d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
      ></path>
    </svg>
  </div>
</div>
`

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
