
const styleQueryPlugin = {
  queries: {
    isBoldActive: editor => editor.value.activeMarks.some(mark => mark.type === 'bold'),
    isItalicActive: editor => editor.value.activeMarks.some(mark => mark.type === 'italic'),
    isStrikethroughActive: editor => editor.value.activeMarks.some(mark => mark.type === 'strikethrough'),
    isCodeBlock: editor => editor.value.blocks.some(block => block.type === 'code'),
    isParagraphBlock: editor => editor.value.blocks.some(block => block.type === 'paragraph'),
    isQuotationBlock: editor => editor.value.blocks.some(block => block.type === 'quotation')
  }
}

export default styleQueryPlugin
