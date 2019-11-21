const LastWordPlugin = suggestionMapImporter => {
  let suggestionMap = suggestionMapImporter()
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
      getSuggestionWord: editor => { // string
        return suggestionMap[editor.getLastWord()] || ''
      },
      getSuggestionWordOf: (editor, key) => { // string
        return suggestionMap[editor.getLastWord() + key] || ''
      },
      getSuggestionListOf: (editor, key) => {
        const lastWord = editor.getLastWord() + key || ''
        return !lastWord ? [] : lastWord.split('').reduce(
          (acc, char, i) => (
            acc[0] ? [acc[0] + char, ...acc] : [char]
          ), []
        ).reduce(
          (acc, key) => (
            suggestionMap[key] ? [...acc, suggestionMap[key]] : [...acc]
          ), []
        )
      }
    },
    commands: {
      updateSuggestionMap: editor => { suggestionMap = suggestionMapImporter() },
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
        const suggestion = editor.getSuggestionWord()
        if (!suggestion) {
          return
        }
        editor.deleteBackward(lastWord.length).insertText(suggestion)
      }
    }
  }
}

export default LastWordPlugin
