type IconProps = {
  className?: string;
};

export default function AutomationIcon({ className }: IconProps) {
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
      <circle cx="5" cy="7" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
      <path d="M6.7 8.2 10.3 10.8M13.7 13.2 17.3 15.8M16.5 6.5h2.5a2 2 0 0 1 2 2v2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
