const LastWordPlugin = suggestionMap => {
  return {
    queries: {
      getLastWord: editor => {
        if (editor.value.focusText) {
          const text = editor.value.focusText.text
          const focusOffset = editor.value.selection.focus.offset
          const tail = text.slice(0, focusOffset).split('\n').join('').split(' ').reverse()[0]
          return tail
        }
        return ''
      },
      getSuggestionList: editor => {
        return suggestionMap[editor.getLastWord().toLowerCase()] || []
      },
      getSuggestionListOf: (editor, key) => {
        return suggestionMap[editor.getLastWord().toLowerCase() + key.toLowerCase()] || []
      }
    },
    commands: {
      replaceLastWord: (editor, newWord) => {
        const lastWord = editor.getLastWord()
        if (!lastWord) {
          return
        }
        if (typeof newWord !== 'string') {
          return
        }
        editor.deleteBackward(lastWord.length).insertText(newWord)
      },
      replaceLastWordBySuggestion: editor => {
        const lastWord = editor.getLastWord()
        if (!lastWord) {
          return
        }
        const suggestions = editor.getSuggestionList()
        editor.deleteBackward(lastWord.length).insertText(suggestions[0] ? suggestions[0] : lastWord)
      }
    }
  }
}

export default LastWordPlugin
