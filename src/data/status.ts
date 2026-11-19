// One vocabulary for every failure status the app can show. Phase 2 can add
// more codes here without touching the components.

export type StatusCode = 400 | 401 | 403 | 404 | 500 | 503

export type StatusInfo = {
  label: string
  title: string
  body: string
}

export const STATUS: Record<StatusCode, StatusInfo> = {
  400: {
    label: 'Bad request',
    title: 'That did not make sense',
    body: 'The request could not be understood. Go back and try again with different details.',
  },
  401: {
    label: 'Sign in required',
    title: 'You need to sign in',
    body: 'This area needs an account. Sign in and we will take you back to where you were.',
  },
  403: {
    label: 'Not allowed',
    title: 'Not your game to touch',
    body: 'You do not have permission to see or change this. Only the organiser can manage their game.',
  },
  404: {
    label: 'Not found',
    title: 'Nothing on this pitch',
    body: 'That page does not exist. The game may have been moved or the link may have a typo.',
  },
  500: {
    label: 'Server error',
    title: 'Something went wrong',
    body: 'The page could not be displayed. Reloading restarts the app with fresh Phase 1 mock data.',
  },
  503: {
    label: 'Unavailable',
    title: 'The pitch is closed for a moment',
    body: 'This service is temporarily unavailable. Please try again in a little while.',
  },
}

const CODES: StatusCode[] = [400, 401, 403, 404, 500, 503]

export function isStatusCode(value: number): value is StatusCode {
  return CODES.includes(value as StatusCode)
}

// Phase 2 API errors can carry `status` / `statusCode`, or a named error class.
// Anything unrecognised falls back to a generic 500 screen.
export function statusFromError(error: Error): StatusCode {
  const withStatus = error as Error & { status?: number; statusCode?: number }
  const status = withStatus.status ?? withStatus.statusCode
  if (status && isStatusCode(status)) return status
  if (error.name === 'NotFoundError') return 404
  if (error.name === 'ForbiddenError') return 403
  if (error.name === 'UnauthorizedError') return 401
  if (error.name === 'BadRequestError') return 400
  if (error.name === 'ServiceUnavailableError') return 503
  return 500
}
