export default function WorkspaceIcon() {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white"
      >
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />

        <circle cx="12" cy="4" r="1.5" fill="currentColor" />
        <circle cx="20" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="20" r="1.5" fill="currentColor" />
        <circle cx="4" cy="12" r="1.5" fill="currentColor" />

        <path d="M12 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
