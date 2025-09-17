const base = "inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50 disabled:pointer-events-none";
const variants = {
  primary: "bg-black text-white hover:bg-black/90 shadow-sm",
  secondary: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
  danger: "bg-red-600 text-white hover:bg-red-500",
};
const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export default function Button({ children, className = "", variant = "primary", size = "md", ...props }) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
