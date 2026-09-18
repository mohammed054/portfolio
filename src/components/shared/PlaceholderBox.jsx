/**
 * PlaceholderBox — the ONE way any unresolved media placeholder should be
 * rendered (spec Section 2.3). Flat neutral fill, dashed border, visible
 * id/type/label — never a transparency checkerboard, never fabricated art.
 *
 * Usage:
 *   <PlaceholderBox id="HOME-HERO-PORTRAIT" type="[HERO_IMAGE]"
 *     label="Man in navy vest, professional portrait photo" className="aspect-[3/4]" />
 */
export default function PlaceholderBox({ id, type = '[IMAGE]', label, className = '', style }) {
  return (
    <div
      className={`flex min-h-[80px] items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-100 p-4 text-center ${className}`}
      style={style}
    >
      <div>
        <p className="text-[11px] font-bold tracking-wide text-ink">{type}</p>
        {label && <p className="mt-1 text-[11px] leading-snug text-muted">{label}</p>}
        {id && <p className="mt-1 text-[9px] font-medium text-primary">ID: {id}</p>}
      </div>
    </div>
  )
}
