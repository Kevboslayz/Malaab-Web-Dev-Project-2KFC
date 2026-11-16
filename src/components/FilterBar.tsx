import { fieldLabel, ghostButton, inputValid, sizeSmall } from './ui'

// Controlled filter bar: the page owns the values and does the filtering, so
// the count beside "Clear" is the real number of results.
type FilterBarProps = {
  query: string
  sport: string
  when: string
  level: string
  onQuery: (value: string) => void
  onSport: (value: string) => void
  onWhen: (value: string) => void
  onLevel: (value: string) => void
  onClear: () => void
  count: number
}

const selectClass = `${inputValid} w-full sm:w-36`

export default function FilterBar({
  query,
  sport,
  when,
  level,
  onQuery,
  onSport,
  onWhen,
  onLevel,
  onClear,
  count,
}: FilterBarProps) {
  return (
    <form
      className="flex flex-wrap items-end gap-3 rounded-card border border-line bg-surface p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex min-w-[10rem] flex-1 flex-col gap-1.5">
        <label htmlFor="q" className={fieldLabel}>
          Venue or area
        </label>
        <input
          id="q"
          type="search"
          className={inputValid}
          placeholder="Dekwaneh, Achrafieh"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sp" className={fieldLabel}>
          Sport
        </label>
        <select id="sp" className={selectClass} value={sport} onChange={(event) => onSport(event.target.value)}>
          <option value="Any">Any</option>
          <option value="Football">Football</option>
          <option value="Basketball">Basketball</option>
          <option value="Padel">Padel</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="dt" className={fieldLabel}>
          When
        </label>
        <select id="dt" className={selectClass} value={when} onChange={(event) => onWhen(event.target.value)}>
          <option value="Next 7 days">Next 7 days</option>
          <option value="Tonight">Tonight</option>
          <option value="Weekend">Weekend</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lv" className={fieldLabel}>
          Level
        </label>
        <select id="lv" className={selectClass} value={level} onChange={(event) => onLevel(event.target.value)}>
          <option value="Any">Any</option>
          <option value="Casual">Casual</option>
          <option value="Competitive">Competitive</option>
        </select>
      </div>
      <button type="button" onClick={onClear} className={`${ghostButton} ${sizeSmall}`}>
        Clear
      </button>
      <span className="flex-1"></span>
      <span className="font-mono text-xs text-muted" role="status">
        {count} {count === 1 ? 'game' : 'games'}
      </span>
    </form>
  )
}
