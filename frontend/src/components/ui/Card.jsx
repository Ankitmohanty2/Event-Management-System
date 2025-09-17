export function Card({ children, className = "" }) {
  return <div className={`rounded-xl border bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="mb-2 font-medium text-lg">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="text-sm text-gray-700 space-y-2">{children}</div>;
}
