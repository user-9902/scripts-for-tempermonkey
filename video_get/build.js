const fs = require('fs')
const path = require('path')

// 文件路径
const sourcePath = path.join(__dirname, 'src/index.js')
const targetPath = path.join(__dirname, 'dist.js')

// 新建文件
fs.access(targetPath, fs.constants.F_OK, err => {
  if (!err) {
    // 如果文件存在，则删除文件
    fs.unlink(targetPath, unlinkErr => {
      if (unlinkErr) return
      createNewFile()
    })
  } else {
    // 如果文件不存在，直接创建新文件
    createNewFile()
  }
})

function createNewFile() {
  const filePath = path.join(__dirname, 'dist.js')

  fs.writeFileSync(filePath, '')
  // 使用fs.createReadStream和fs.createWriteStream来复制文件
  const readStream = fs.createReadStream(sourcePath)
  const writeStream = fs.createWriteStream(targetPath)

  readStream.pipe(writeStream).on('finish', () => {
    const templ = fs.readFileSync(
      path.join(__dirname, 'src/template.html'),
      'utf8',
    )
    const style = fs.readFileSync(path.join(__dirname, 'src/style.css'), 'utf8')

    // 读取文件内容
    fs.readFile(filePath, 'utf8', (err, data) => {
      // 使用replace方法替换目标模板
      const newData = data
        .replace(/{{\s*template\s*}}/g, templ)
        .replace(/{{\s*style\s*}}/g, style)

      // 将更新后的内容写回文件
      fs.writeFile(filePath, newData, writeErr => {})
    })
  })
}
