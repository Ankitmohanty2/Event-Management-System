export default function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 ${className}`}>
      {children}
    </span>
  );
}
