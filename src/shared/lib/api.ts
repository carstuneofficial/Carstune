/**
 * Minimal API client helpers.
 *
 * Production notes:
 * - Set `VITE_API_BASE_URL` to your FastAPI/Node backend origin.
 * - Prefer signed URLs for GLB assets and presigned upload endpoints for large files.
 */

export function apiBaseUrl() {
  const base = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined
  return (base ?? '').replace(/\/+$/, '')
}

export function apiUrl(path: string) {
  if (!path.startsWith('/')) path = `/${path}`
  return `${apiBaseUrl()}${path}`
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const body = await safeText(res)
    throw new Error(`API ${res.status} ${res.statusText}: ${body}`)
  }
  return (await res.json()) as T
}

async function safeText(res: Response) {
  try {
    return await res.text()
  } catch {
    return ''
  }
}

