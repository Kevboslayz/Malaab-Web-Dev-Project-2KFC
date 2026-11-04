const input =
  'w-full rounded-lg border border-line bg-[#0E1A14] px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/25'

const label = 'text-[11px] font-semibold uppercase tracking-[0.16em] text-muted'

const clearButton =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-muted hover:bg-surface hover:text-ink px-3.5 py-1.5 text-xs'

export default function FilterBar() {
  return (
    <form className="flex flex-wrap items-end gap-3 rounded-card border border-line bg-surface p-4">
      <div className="flex min-w-[10rem] flex-1 flex-col gap-1.5">
        <label htmlFor="q" className={label}>
          Venue or area
        </label>
        <input
          id="q"
          type="search"
          className={input}
          placeholder="Dekwaneh, Achrafieh"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sp" className={label}>
          Sport
        </label>
        <select id="sp" className={`${input} w-36`}>
          <option>Any</option>
          <option selected>Football</option>
          <option>Basketball</option>
          <option>Padel</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="dt" className={label}>
          When
        </label>
        <select id="dt" className={`${input} w-36`}>
          <option selected>Next 7 days</option>
          <option>Tonight</option>
          <option>Weekend</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lv" className={label}>
          Level
        </label>
        <select id="lv" className={`${input} w-36`}>
          <option>Any</option>
          <option>Casual</option>
          <option>Competitive</option>
        </select>
      </div>
      <span className={clearButton}>Clear</span>
      <span className="flex-1"></span>
      <span className="font-mono text-xs text-muted">5 games</span>
    </form>
  )
}
