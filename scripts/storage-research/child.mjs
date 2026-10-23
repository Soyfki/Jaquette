import { LaboratoryStore } from './store.mjs'

const [mode, root, adapter, barrier] = process.argv.slice(2)
try {
  const store = new LaboratoryStore(root, adapter, { checkpoint: async (point) => {
    if (point === barrier) {
      process.send({ barrier: point })
      await new Promise(() => {}) // Controller kills only this exact fork; never a user process.
    }
  } })
  if (mode === 'mutate') await store.mutateChapter({ expectedGeneration: 1 })
  else if (mode === 'read') {
    const result = await store.read()
    process.send({ generation: result.state.generation, chapters: result.chapters })
  } else throw new Error('INVALID_CHILD_MODE')
} catch (error) { process.send?.({ error: error.code ?? error.message }); process.exitCode = 1 }
if (mode === 'read') process.disconnect?.()
