
const styleQueryPlugin = {
  queries: {
    isBoldActive: editor => editor.value.activeMarks.some(mark => mark.type === 'bold'),
    isItalicActive: editor => editor.value.activeMarks.some(mark => mark.type === 'italic'),
    isStrikethroughActive: editor => editor.value.activeMarks.some(mark => mark.type === 'strikethrough'),
    isMarkTypeActive: (editor, type) => editor.value.activeMarks.some(mark => mark.type === type),
    isCodeBlock: editor => editor.value.blocks.some(block => block.type === 'code'),
    isParagraphBlock: editor => editor.value.blocks.some(block => block.type === 'paragraph'),
    isQuotationBlock: editor => editor.value.blocks.some(block => block.type === 'quotation'),
    isBlockTypeActive: (editor, type) => editor.value.blocks.some(block => block.type === type)
  }
}

export default styleQueryPlugin
