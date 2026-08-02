type IconProps = {
  className?: string;
};

export default function KnowledgeIcon({ className }: IconProps) {
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
      <circle cx="5" cy="7" fill="currentColor" r="1.5" />
      <circle cx="19" cy="7" fill="currentColor" r="1.5" />
      <circle cx="12" cy="19" fill="currentColor" r="1.5" />
      <path d="M7 8.5 10 10.7M17 8.5 14 10.7M12 14.5V17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
