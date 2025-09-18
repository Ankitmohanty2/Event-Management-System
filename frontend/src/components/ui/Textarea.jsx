export default function Textarea({ className = "", ...props }) {
  const base = "w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black min-h-[110px]";
  return (
    <textarea
      className={`${base} ${className}`}
      {...props}
    />
  );
}
