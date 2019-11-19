export default {
  onKeyDown: (e, editor, next) => {
    if (e.keyCode !== 9) {
      return next()
    }
    e.preventDefault()
    editor.insertText('    ')
  }
}
