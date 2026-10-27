// Synthetic qualification fixture; not the .jacq format or production storage.
const fixture = {
  projectId: 'T75-synthetic-project', bookId: 'T75-synthetic-book', chapterId: 'T75-chapter-1',
  tokenId: 'T75-chapter-1:word-1', marker: 'T75-offline-marker-20261027',
} as const
export type LocalQualification = typeof fixture
const database = 'jaquette-T75-qualification'
function validate(value: unknown): LocalQualification {
  if (!value || typeof value !== 'object' || Object.keys(value).length !== Object.keys(fixture).length ||
      Object.entries(fixture).some(([key, expected]) => (value as Record<string, unknown>)[key] !== expected)) throw new Error('Projet local de qualification illisible ; données conservées.')
  return value as LocalQualification
}
async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let failed = false
    const request = indexedDB.open(database, 1)
    request.onupgradeneeded = () => request.result.createObjectStore('qualification')
    request.onerror = () => reject(new Error('Stockage local indisponible.'))
    request.onblocked = () => { failed = true; reject(new Error('Stockage local occupé.')) }
    request.onsuccess = () => {
      if (failed) request.result.close()
      else { request.result.onversionchange = () => request.result.close(); resolve(request.result) }
    }
  })
}
export async function readQualification(): Promise<LocalQualification | null> {
  const db = await openDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction('qualification', 'readonly')
      const request = transaction.objectStore('qualification').get('project')
      let value: unknown
      request.onsuccess = () => { value = request.result }
      transaction.oncomplete = () => { try { resolve(value === undefined ? null : validate(value)) } catch (e) { reject(e) } }
      transaction.onerror = () => reject(new Error('Lecture locale impossible.'))
      transaction.onabort = () => reject(new Error('Lecture locale interrompue.'))
    })
  } finally { db.close() }
}
async function saveQualification() {
  const db = await openDatabase()
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('qualification', 'readwrite')
      const store = transaction.objectStore('qualification')
      const request = store.get('project')
      request.onsuccess = () => {
        try { if (request.result === undefined) store.add(fixture, 'project'); else validate(request.result) }
        catch { transaction.abort() }
      }
      transaction.oncomplete = () => resolve()
      transaction.onabort = () => reject(new Error('Projet local non remplacé : préparation impossible.'))
      transaction.onerror = () => reject(new Error('Préparation locale impossible.'))
    })
  } finally { db.close() }
}
async function message(command: 'prepare' | 'status', register: boolean): Promise<string | null> {
  if (!('serviceWorker' in navigator)) throw new Error('Préparation hors ligne indisponible ici.')
  if (!register && !await navigator.serviceWorker.getRegistration('/')) return null
  const activation = register
    ? navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(() => navigator.serviceWorker.ready)
    : navigator.serviceWorker.ready
  const registration = await new Promise<ServiceWorkerRegistration>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Activation hors ligne non confirmée.')), 30000)
    activation.then((value) => { clearTimeout(timer); resolve(value) }, (error: unknown) => { clearTimeout(timer); reject(error) })
  })
  if (!registration.active) throw new Error('Préparation hors ligne indisponible ici.')
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Préparation non confirmée ; vérifier son état avant de réessayer.')) }, 30000)
    channel.port1.onmessage = ({ data }) => {
      clearTimeout(timer); channel.port1.close()
      if (!data?.ok) reject(new Error('Préparation hors ligne impossible ; ancienne copie conservée.'))
      else resolve(typeof data.buildId === 'string' ? data.buildId : null)
    }
    registration.active!.postMessage({ command }, [channel.port2])
  })
}
export async function qualificationStatus() {
  const project = await readQualification()
  return { project, buildId: project ? await message('status', false) : null }
}
export async function prepareQualification() {
  const buildId = await message('prepare', true)
  if (!buildId) throw new Error('Copie hors ligne non confirmée.')
  await saveQualification()
  const status = await qualificationStatus()
  if (!status.project || status.buildId !== buildId) throw new Error('Préparation non confirmée.')
  return status
}
