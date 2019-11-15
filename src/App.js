import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import { Divider, Box, Grid } from '@material-ui/core'

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: 'A line of text in a paragraph.'
          }
        ]
      }
    ]
  }
})

const MyEditor = props => {
  const [value, setValue] = React.useState(initialValue)
  const [stateTracker, setStateTracker] = React.useState({})

  const onChange = ({ value }) => {
    setValue(value)
  }
  const onKeyDown = (e) => {
    console.log('e:', e)
  }

  return (
    <div>
      <Box p={2}>
        <Editor
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
        />
      </Box>
      <Divider />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Property
            </TableCell>
            <TableCell>
              Value
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(stateTracker).map(
            (property, i) => (
              <TableRow key={property}>
                <TableCell>
                  {property}
                </TableCell>
                <TableCell>
                  {stateTracker[property]}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function App () {
  return (
    <MyEditor />
  )
}

export default App
