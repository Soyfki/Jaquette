import type { Repository } from '../../core/contracts'
// Narrow injected host surface. No path, fs, shell, process, Electron or IPC access here.
export function createDesktopAdapter(host: Repository): Repository {
  return {
    readContext: (projectId, chapterId) => host.readContext(projectId, chapterId),
    commitChapter: request => host.commitChapter(request),
  }
}
