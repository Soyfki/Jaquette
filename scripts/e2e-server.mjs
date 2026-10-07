import { fileURLToPath, URL } from 'node:url'
import { createServer } from 'vite'

// Own the Vite instance in Playwright's setup process. Windows webServer
// teardown otherwise waits for a shell child to be forcibly terminated.
export async function startE2EServer({ port = 4173 } = {}) {
  const server = await createServer({
    root: fileURLToPath(new URL('..', import.meta.url)),
    logLevel: 'error',
    server: { host: '127.0.0.1', port, strictPort: true, open: false },
  })
  try {
    await server.listen()
  } catch (error) {
    await server.close()
    throw error
  }
  return server
}

export default async function globalSetup() {
  const server = await startE2EServer()
  console.log('[E2E server] listening on 127.0.0.1:4173')
  return async () => {
    await server.close()
    console.log('[E2E server] closed')
  }
}
