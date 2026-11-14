import { errorText, fieldLabel, hintText, inputInvalid, inputValid } from './ui'

// A labelled input with its message underneath. When there is an error the
// input gets aria-invalid and aria-describedby points at the message, so a
// screen reader announces what is wrong.

type FieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  type?: string
  placeholder?: string
  autoComplete?: string
  hint?: string
  error?: string
}

export default function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  autoComplete,
  hint,
  error,
}: FieldProps) {
  const messageId = `${id}-msg`
  const message = error ?? hint

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={error ? inputInvalid : inputValid}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
      />
      {message && (
        <p id={messageId} className={error ? errorText : hintText}>
          {message}
        </p>
      )}
    </div>
  )
}
