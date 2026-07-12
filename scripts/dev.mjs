import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const require = createRequire(import.meta.url)

function resolvePython() {
  if (process.env.PYTHON) return process.env.PYTHON
  // Prefer the original training/backend venv if present
  const venvPy = path.resolve(root, '..', 'spotcheck-backend', '.venv', 'Scripts', 'python.exe')
  try {
    require('node:fs').accessSync(venvPy)
    return venvPy
  } catch {
    return process.platform === 'win32' ? 'python' : 'python3'
  }
}

function run(command, args, name) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      console.error(`[${name}] killed (${signal})`)
      process.exit(1)
    }
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`)
      process.exit(code)
    }
  })

  return child
}

const python = resolvePython()
const api = run(python, ['python/local_server.py'], 'ml')
const next = run('npx', ['next', 'dev'], 'next')

function shutdown() {
  api.kill('SIGTERM')
  next.kill('SIGTERM')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
