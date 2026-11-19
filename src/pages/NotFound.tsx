import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { pageTitle, primaryButton, secondaryButton, sizeNormal } from '../components/ui'

// Fallback for any URL that is not one of our eight surfaces. The hosting
// platform serves index.html for deep links, so React decides what is a 404.
export default function NotFound() {
  return (
    <Layout footerCode="CSC443-F26 · T07 · S404 · rev A">
      <div className="rounded-card border border-line bg-surface px-6 py-16 text-center">
        <p className="font-display text-6xl uppercase leading-none text-accent-300">404</p>
        <h1 className={`${pageTitle} mt-5`}>Nothing on this pitch</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
          That page does not exist. The game may have been moved or the link may
          have a typo. The games list is the quickest way back in.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/games" className={`${primaryButton} ${sizeNormal}`}>
            Browse games
          </Link>
          <Link to="/" className={`${secondaryButton} ${sizeNormal}`}>
            Back home
          </Link>
        </div>
      </div>
    </Layout>
  )
}
