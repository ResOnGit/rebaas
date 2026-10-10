const stroke = 'currentColor'
const mutedFill = 'hsl(var(--background-surface-200))'
const accentFill = 'hsl(var(--background-surface-300))'

export const How2PostgresHierarchy = () => (
  <figure className="my-6 rounded-lg border bg-surface-100 p-4">
    <figcaption className="mb-3 text-sm font-medium text-foreground">
      One database, many entity schemas (no schema inside a schema)
    </figcaption>
    <svg
      viewBox="0 0 520 220"
      className="mx-auto w-full max-w-lg text-foreground-light"
      role="img"
      aria-label="Postgres hierarchy: one database containing schemas res, k1, and k2, each with multiple tables"
    >
      <rect
        x="40"
        y="12"
        width="440"
        height="196"
        rx="8"
        fill={mutedFill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <text x="260" y="36" textAnchor="middle" className="fill-foreground text-[13px] font-medium">
        database: postgres
      </text>
      {[0, 1, 2].map((i) => {
        const labels = ['res', 'k1', 'k2']
        const x = 72 + i * 140
        return (
          <g key={labels[i]}>
            <rect
              x={x}
              y="52"
              width="116"
              height="140"
              rx="6"
              fill={accentFill}
              stroke={stroke}
              strokeWidth="1.2"
            />
            <text
              x={x + 58}
              y="72"
              textAnchor="middle"
              className="fill-foreground text-[12px] font-medium"
            >
              schema {labels[i]}
            </text>
            <rect
              x={x + 14}
              y="84"
              width="88"
              height="22"
              rx="4"
              fill="hsl(var(--background-default))"
              stroke={stroke}
              strokeWidth="1"
            />
            <text
              x={x + 58}
              y="99"
              textAnchor="middle"
              className="fill-foreground-light text-[10px]"
            >
              orders
            </text>
            <rect
              x={x + 14}
              y="112"
              width="88"
              height="22"
              rx="4"
              fill="hsl(var(--background-default))"
              stroke={stroke}
              strokeWidth="1"
            />
            <text
              x={x + 58}
              y="127"
              textAnchor="middle"
              className="fill-foreground-light text-[10px]"
            >
              products
            </text>
            <rect
              x={x + 14}
              y="140"
              width="88"
              height="22"
              rx="4"
              fill="hsl(var(--background-default))"
              stroke={stroke}
              strokeWidth="1"
              opacity="0.85"
            />
            <text
              x={x + 58}
              y="155"
              textAnchor="middle"
              className="fill-foreground-lighter text-[10px]"
            >
              … more tables
            </text>
          </g>
        )
      })}
    </svg>
  </figure>
)

export const How2ApiAndApps = () => (
  <figure className="my-6 rounded-lg border bg-surface-100 p-4">
    <figcaption className="mb-3 text-sm font-medium text-foreground">
      One API URL, many Revits apps — schema picks the drawer
    </figcaption>
    <svg
      viewBox="0 0 520 160"
      className="mx-auto w-full max-w-lg text-foreground-light"
      role="img"
      aria-label="Revits apps connect through one API gateway to different schemas"
    >
      <rect x="20" y="50" width="90" height="44" rx="6" fill={accentFill} stroke={stroke} />
      <text x="65" y="76" textAnchor="middle" className="fill-foreground text-[11px]">
        Revits IMS
      </text>
      <rect x="20" y="104" width="90" height="44" rx="6" fill={accentFill} stroke={stroke} />
      <text x="65" y="130" textAnchor="middle" className="fill-foreground text-[11px]">
        Revits SCFN
      </text>
      <path
        d="M 110 72 L 175 80"
        stroke={stroke}
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#how2-arrow)"
      />
      <path
        d="M 110 126 L 175 100"
        stroke={stroke}
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#how2-arrow)"
      />
      <rect
        x="180"
        y="55"
        width="100"
        height="50"
        rx="6"
        fill="hsl(var(--brand-default))"
        fillOpacity="0.15"
        stroke="hsl(var(--brand-default))"
        strokeWidth="1.5"
      />
      <text x="230" y="84" textAnchor="middle" className="fill-foreground text-[11px] font-medium">
        /rest/v1
      </text>
      <path
        d="M 280 80 L 345 80"
        stroke={stroke}
        strokeWidth="1.5"
        fill="none"
        className="animate-pulse"
        markerEnd="url(#how2-arrow)"
      />
      <rect x="350" y="40" width="70" height="36" rx="5" fill={accentFill} stroke={stroke} />
      <text x="385" y="62" textAnchor="middle" className="fill-foreground text-[10px]">
        k1
      </text>
      <rect x="350" y="84" width="70" height="36" rx="5" fill={accentFill} stroke={stroke} />
      <text x="385" y="106" textAnchor="middle" className="fill-foreground text-[10px]">
        k2
      </text>
      <rect x="430" y="62" width="70" height="36" rx="5" fill={accentFill} stroke={stroke} />
      <text x="465" y="84" textAnchor="middle" className="fill-foreground text-[10px]">
        res
      </text>
      <defs>
        <marker id="how2-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  </figure>
)

export const How2SecurityFlow = () => (
  <figure className="my-6 rounded-lg border bg-surface-100 p-4">
    <figcaption className="mb-3 text-sm font-medium text-foreground">
      Security: membership + RLS (not “the app picked the right schema”)
    </figcaption>
    <svg
      viewBox="0 0 520 100"
      className="mx-auto w-full max-w-lg text-foreground-light"
      role="img"
      aria-label="Request flow from user through JWT and row level security"
    >
      {[
        { x: 24, label: 'User\nOTP login' },
        { x: 124, label: 'JWT\nauth.users' },
        { x: 224, label: 'API\n.schema(k1)' },
        { x: 324, label: 'tenant_\nmembers' },
        { x: 424, label: 'RLS on\nk1 tables' },
      ].map((step, i) => (
        <g key={step.label}>
          <rect
            x={step.x}
            y="20"
            width="80"
            height="56"
            rx="6"
            fill={i === 4 ? 'hsl(var(--brand-default))' : accentFill}
            fillOpacity={i === 4 ? 0.2 : 1}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <text x={step.x + 40} y="52" textAnchor="middle" className="fill-foreground text-[9px]">
            {step.label.split('\n').map((line, j) => (
              <tspan key={line} x={step.x + 40} dy={j === 0 ? 0 : 12}>
                {line}
              </tspan>
            ))}
          </text>
          {i < 4 && (
            <path
              d={`M ${step.x + 82} 48 L ${step.x + 118} 48`}
              stroke={stroke}
              strokeWidth="1.5"
              fill="none"
              className={i === 2 ? 'animate-pulse' : undefined}
              markerEnd="url(#how2-arrow2)"
            />
          )}
        </g>
      ))}
      <defs>
        <marker id="how2-arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
    <p className="mt-2 text-center text-xs text-foreground-lighter">
      Changing the schema in the browser must still fail without a membership row.
    </p>
  </figure>
)

export const How2TwoAppLayouts = () => (
  <figure className="my-6 grid gap-4 sm:grid-cols-2">
    <div className="rounded-lg border bg-surface-100 p-4">
      <p className="mb-2 text-sm font-medium text-foreground">Option A — one schema per entity</p>
      <svg viewBox="0 0 200 120" className="w-full text-foreground-light" aria-hidden>
        <rect x="10" y="10" width="180" height="100" rx="6" fill={mutedFill} stroke={stroke} />
        <text x="100" y="32" textAnchor="middle" className="fill-foreground text-[11px]">
          schema k1
        </text>
        <text x="100" y="58" textAnchor="middle" className="fill-foreground-light text-[10px]">
          orders, products (IMS)
        </text>
        <text x="100" y="78" textAnchor="middle" className="fill-foreground-light text-[10px]">
          scfn_jobs, … (SCFN)
        </text>
      </svg>
      <p className="mt-2 text-xs text-foreground-lighter">Prefix SCFN tables if names clash.</p>
    </div>
    <div className="rounded-lg border bg-surface-100 p-4">
      <p className="mb-2 text-sm font-medium text-foreground">Option B — schema per entity × app</p>
      <svg viewBox="0 0 200 120" className="w-full text-foreground-light" aria-hidden>
        <rect x="10" y="10" width="85" height="100" rx="6" fill={accentFill} stroke={stroke} />
        <text x="52" y="32" textAnchor="middle" className="fill-foreground text-[10px]">
          k1_ims
        </text>
        <text x="52" y="58" textAnchor="middle" className="fill-foreground-light text-[9px]">
          orders…
        </text>
        <rect x="105" y="10" width="85" height="100" rx="6" fill={accentFill} stroke={stroke} />
        <text x="147" y="32" textAnchor="middle" className="fill-foreground text-[10px]">
          k1_scfn
        </text>
        <text x="147" y="58" textAnchor="middle" className="fill-foreground-light text-[9px]">
          jobs…
        </text>
      </svg>
      <p className="mt-2 text-xs text-foreground-lighter">Same table names in each template.</p>
    </div>
  </figure>
)
