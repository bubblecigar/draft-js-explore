import suggestionMap from './suggestionMap'

const obj = {}
const sa = {}
Object.keys(suggestionMap).forEach(
  key => {
    obj[key] = [suggestionMap[key]]
    if (!sa[key[0]]) {
      sa[key[0]] = []
    }
    sa[key[0]].push(suggestionMap[key])
  }
)

const dictionary = {
  lt: ['left', 'light', 'lot'],
  ...obj,
  ...sa
}

const triggerReplacePlugin = {
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
      return dictionary[editor.getLastWord()] || []
    },
    getSuggestionListOf: (editor, key) => {
      return dictionary[editor.getLastWord() + key] || []
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

export default triggerReplacePlugin
