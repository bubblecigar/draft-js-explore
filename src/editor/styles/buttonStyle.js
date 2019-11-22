export const toggleButtonStyle = ({ active, mouseover }) => ({
  margin: '10px 5px',
  backgroundColor: active ? 'gray' : 'transparent',
  color: active ? 'white' : 'black',
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New",monospace',
  fontWeight: 'bold',
  padding: '5px',
  border: 0,
  cursor: 'pointer'
})
