type IconProps = {
  className?: string;
};

export default function CompletedIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" fill="currentColor" r="2" />
      <circle cx="12" cy="5" fill="currentColor" r="1.25" />
      <circle cx="18" cy="15.5" fill="currentColor" r="1.25" />
      <path d="M12 7v3M13.7 13.1l3.2 1.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
