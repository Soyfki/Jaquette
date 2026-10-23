import { LaboratoryStore } from './store.mjs'

const [flag, root, adapterFlag, adapter] = process.argv.slice(2)
if (flag !== '--run' || !root || adapterFlag !== '--adapter' || !['directory', 'append', 'monolith'].includes(adapter)) throw new Error('Usage: recover.mjs --run OWNED_PROJECT --adapter directory|append|monolith (read-only; never removes writer locks)')
const { state, common, chapters } = await new LaboratoryStore(root, adapter).read()
console.log(JSON.stringify({ generation: state.generation, projectId: common.projectId, chapterIds: Object.keys(chapters), media: Object.keys(state.media), mode: 'read-only', durableRecovery: 'NOT_PROVEN' }))
