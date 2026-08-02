type IconProps = {
  className?: string;
};

export default function GPTIcon({ className }: IconProps) {
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
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="12" cy="12" rx="8" ry="4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <circle cx="5" cy="12" fill="currentColor" r="1.25" />
      <circle cx="16.5" cy="8" fill="currentColor" r="1.25" />
    </svg>
  );
}
