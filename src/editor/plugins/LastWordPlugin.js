import SuggestionMapAPI from '../api/SuggestionMapAPI'

const suggestionMap = {
  map: {}
}

SuggestionMapAPI.importer().then(
  data => {
    suggestionMap.map = data
  }
)

const LastWordPlugin = {
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
      return suggestionMap.map[editor.getLastWord()] || ''
    },
    getSuggestionWordOf: (editor, key) => { // string
      return suggestionMap.map[editor.getLastWord() + key] || ''
    },
    getSuggestionListOf: (editor, key) => {
      const lastWord = editor.getLastWord() + key || ''
      return !lastWord ? [] : lastWord.split('').reduce(
        (acc, char, i) => (
          acc[0] ? [acc[0] + char, ...acc] : [char]
        ), []
      ).reduce(
        (acc, key) => (
          suggestionMap.map[key] ? [...acc, suggestionMap.map[key]] : [...acc]
        ), []
      )
    }
  },
  commands: {
    updateSuggestionMap: editor => {
      SuggestionMapAPI.importer().then(
        data => {
          suggestionMap.map = data
        }
      )
    },
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

export default LastWordPlugin
