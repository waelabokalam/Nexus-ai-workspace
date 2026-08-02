interface LogoProps {
    className?: string;
  }

  export default function Logo({ className = "" }: LogoProps) {
    return (
      <svg
        viewBox="0 0 64 64"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 48V16L46 48V16"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
