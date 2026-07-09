const BASE_URL = ''  // same-origin Next.js API routes

export class ApiError extends Error {
  constructor(public status: number, public body: unknown) {
    const msg =
      (body as Record<string, string>)?.detail ||
      (body as Record<string, string>)?.error ||
      (body as Record<string, string>)?.message ||
      `API error ${status}`
    super(msg)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, body)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400: return 'Invalid request. Please check your input.'
      case 404: return 'Not found.'
      case 429: return 'Too many requests. Please wait a moment.'
      case 500:
      case 502:
      case 503: return 'Server error. Please try again later.'
      default: return error.message || 'Something went wrong.'
    }
  }
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Cannot connect to server. Check your connection.'
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'An unexpected error occurred.'
}
