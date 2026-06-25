export default function SearchIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16.5 16.5L21 21" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}