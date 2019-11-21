import store from 'store-js'
import defaultMap from './suggestionMap'

const exporter = data => { store.set('client-suggestionMap', data) }
const importer = () => store.get('client-suggestionMap') || defaultMap

export default { importer, exporter }
