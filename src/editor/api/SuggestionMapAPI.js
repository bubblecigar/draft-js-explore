import store from 'store-js'

const exporter = data => { store.set('client-suggestionMap', data) }
const importer = () => store.get('client-suggestionMap') || {}

export default { importer, exporter }
