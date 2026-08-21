/**
 * A value the user supplied, or the template's own bracketed hint when they
 * have not supplied it yet. The document always renders, and anything still
 * outstanding reads as outstanding.
 */
export function DocumentValue({
  value,
  placeholder,
  multiline = false,
}: {
  value: string;
  placeholder: string;
  multiline?: boolean;
}) {
  if (!value.trim()) {
    return <span className="doc-placeholder">{placeholder}</span>;
  }
  return (
    <span className={multiline ? "whitespace-pre-line" : undefined}>{value}</span>
  );
}
