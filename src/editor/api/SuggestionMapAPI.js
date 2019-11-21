import store from 'store-js'
import defaultMap from './suggestionMap'

const exporter = data => { store.set('client-suggestionMap', data) }
const importer = () => {
  const map = store.get('client-suggestionMap') || defaultMap
  return new Promise(
    (resolve, reject) => {
      resolve(map)
    }
  )
}

export default { importer, exporter }
