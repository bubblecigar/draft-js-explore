import store from 'store-js'
import { Value } from 'slate'

const importer = () => {
  const storedJsonStr = store.get('slateJs-demo') // json || undefined
  const json = storedJsonStr ? JSON.parse(storedJsonStr) : ''
  const initialValue = Value.fromJSON(json || {
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              text: ''
            }
          ]
        }
      ]
    }
  })
  return new Promise(
    (resolve, reject) => {
      resolve(initialValue)
    }
  )
}

const exporter = change => {
  const jsonStr = JSON.stringify(change.value.toJSON())
  store.set('slateJs-demo', jsonStr)
}

export default { importer, exporter }
