import suggestionMap from './suggestionMap'

const obj = {}
const sa = {}
Object.keys(suggestionMap).forEach(
  _key => {
    const key = _key.toLowerCase()

    obj[key] = [suggestionMap[_key]]
    if (!sa[key[0]]) {
      sa[key[0]] = []
    }
    sa[key[0]].push(suggestionMap[_key])
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
      return dictionary[editor.getLastWord().toLowerCase()] || []
    },
    getSuggestionListOf: (editor, key) => {
      return dictionary[editor.getLastWord().toLowerCase() + key.toLowerCase()] || []
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
