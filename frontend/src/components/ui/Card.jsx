export function Card({ children, className = "" }) {
  return <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-3 font-semibold text-lg tracking-tight ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`text-sm text-gray-700 space-y-2 ${className}`}>{children}</div>;
}
