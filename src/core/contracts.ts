import type { BookId, ChapterId, MediaId, OccurrenceId, ProjectId, TokenId } from './ids'
export type Family = 'SFX' | 'Ambiance' | 'Musique'
export type Command = Readonly<{
  projectId: ProjectId; bookId: BookId; chapterId: ChapterId; occurrenceId: OccurrenceId
  family: Family; range: Readonly<{ startTokenId: TokenId; endTokenId: TokenId }>; mediaId: MediaId
}>
export type Occurrence = Command
export type Snapshot = Readonly<{
  projectId: ProjectId; bookId: BookId; revision: string
  common: Readonly<{
    text: readonly Readonly<{ chapterId: ChapterId; tokens: readonly Readonly<{ id: TokenId; text: string }>[] }>[]
    media: readonly MediaId[]
  }>
  chapters: readonly Readonly<{ id: ChapterId; activeValidations: boolean; occurrences: readonly Occurrence[] }>[]
}>
export type ErrorCode = 'invalid-input' | 'unknown-project' | 'unknown-book' | 'unknown-chapter' | 'unknown-token'
  | 'unknown-media' | 'cross-chapter-range' | 'reversed-range' | 'duplicate-id' | 'forbidden'
  | 'unsupported-workflow' | 'stale-revision' | 'cancelled' | 'unavailable' | 'storage-failure' | 'outcome-unknown'
export type Result<T> = { ok: true; value: T } | { ok: false; error: ErrorCode }
export const success = <T>(value: T): Result<T> => ({ ok: true, value })
export const failure = (error: ErrorCode): Result<never> => ({ ok: false, error })
// Host-owned context: the command payload never selects an actor or permissions.
export type Actor = Readonly<{ identityId: string; workspaceId: string; teamId: string }>
export type Cancellation = Readonly<{ aborted: boolean }>
export type CommitRequest = Readonly<{ command: Command; expectedRevision: string; actor: Actor; cancellation?: Cancellation }>
export interface Repository {
  readContext(projectId: ProjectId, chapterId: ChapterId): Promise<Result<Snapshot>>
  commitChapter(request: CommitRequest): Promise<Result<{ revision: string }>>
}
export interface Access { authorizeEdit(actor: Actor, projectId: ProjectId, chapterId: ChapterId): boolean }
export interface AudioCapabilities { describe(mediaId: MediaId): Promise<Result<{ available: boolean }>> }
export type Ports = { repository: Repository; access: Access; audio: AudioCapabilities }
