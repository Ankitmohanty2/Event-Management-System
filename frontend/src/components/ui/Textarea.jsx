export default function Textarea(props) {
  return (
    <textarea
      className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black min-h-[110px]"
      {...props}
    />
  );
}
