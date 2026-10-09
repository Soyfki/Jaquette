import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer, get } from 'node:http'
import test from 'node:test'
import { startE2EServer } from './e2e-server.mjs'

function read(url) {
  return new Promise((resolve, reject) => {
    get(url, response => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', chunk => { body += chunk })
      response.on('end', () => resolve({ status: response.statusCode, body }))
      response.on('error', reject)
    }).on('error', reject)
  })
}

test('Vite serves the project and releases its own port on close', async () => {
  const server = await startE2EServer({ port: 0 })
  const port = server.httpServer.address().port
  try {
    const response = await read(`http://127.0.0.1:${port}/`)
    assert.equal(response.status, 200)
    assert.match(response.body, /\/src\/main\.tsx/)
  } finally {
    await server.close()
  }
  const replacement = createServer()
  replacement.listen(port, '127.0.0.1')
  try {
    await once(replacement, 'listening')
  } finally {
    await new Promise((resolve, reject) => replacement.close(error => error ? reject(error) : resolve()))
  }
})

test('an occupied port fails instead of using or closing an existing server', async () => {
  const existing = createServer((_request, response) => response.end('existing test server'))
  existing.listen(0, '127.0.0.1')
  await once(existing, 'listening')
  const port = existing.address().port
  try {
    await assert.rejects(startE2EServer({ port }), /already in use/)
    assert.equal((await read(`http://127.0.0.1:${port}/`)).body, 'existing test server')
  } finally {
    await new Promise((resolve, reject) => existing.close(error => error ? reject(error) : resolve()))
  }
})
