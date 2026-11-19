import { useParams } from 'react-router-dom'
import StatusScreen from '../components/StatusScreen'
import { isStatusCode } from '../data/status'

// Reachable at /error/400, /error/401, /error/403, /error/404, /error/500 and
// /error/503 so every status has a real screen you can open and inspect.
export default function StatusPage({ code }: { code?: number }) {
  const params = useParams()
  const raw = code ?? Number(params.code)
  return <StatusScreen code={isStatusCode(raw) ? raw : 500} />
}
