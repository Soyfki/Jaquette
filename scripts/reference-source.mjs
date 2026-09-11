// Acquisition location only. The canonical manifest remains the sole authority
// for identity, size, SHA-256 and original provenance. See reference-data/ARCHIVE.md.
export function referenceDownloadUrl(asset) {
  if (asset.id === 'epub-en') {
    return `https://github.com/Soyfki/Jaquette/releases/download/fixtures-reference-2026-08-21/epub-en-${asset.sha256}.epub`
  }
  return asset.downloadUrl
}
