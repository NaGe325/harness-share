import { cn } from "@/lib/cn";

type LogoProps = {
  id: string;
  size?: number;
  className?: string;
};

export default function BrandLogo({ id, size = 32, className }: LogoProps) {
  const s = size;
  const props = {
    width: s,
    height: s,
    viewBox: "0 0 32 32",
    xmlns: "http://www.w3.org/2000/svg",
    className: cn(className),
    "aria-hidden": true,
  };

  switch (id) {
    case "langgraph":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#EAF3DE" />
          <circle cx="8" cy="8" r="3.2" fill="#3B6D11" />
          <circle cx="24" cy="8" r="3.2" fill="#639922" />
          <circle cx="16" cy="24" r="3.2" fill="#3B6D11" />
          <path
            d="M8 8 L16 24 M24 8 L16 24 M8 8 L24 8"
            stroke="#639922"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "autogen":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#FFF" />
          <rect
            width="32"
            height="32"
            rx="8"
            fill="none"
            stroke="#E5E1D6"
            strokeWidth="0.5"
          />
          <rect x="6" y="6" width="8.5" height="8.5" fill="#F25022" />
          <rect x="17.5" y="6" width="8.5" height="8.5" fill="#7FBA00" />
          <rect x="6" y="17.5" width="8.5" height="8.5" fill="#00A4EF" />
          <rect x="17.5" y="17.5" width="8.5" height="8.5" fill="#FFB900" />
        </svg>
      );
    case "openai-agents":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#1A1917" />
          <g stroke="#FAF7F0" strokeWidth="1.2" fill="none">
            <path d="M16 7 L22.5 10.75 L22.5 17.25 L16 21 L9.5 17.25 L9.5 10.75 Z" />
            <path d="M16 7 L16 21" />
            <path d="M9.5 10.75 L22.5 17.25" />
            <path d="M9.5 17.25 L22.5 10.75" />
          </g>
          <circle cx="16" cy="14" r="1.2" fill="#FAF7F0" />
        </svg>
      );
    case "crewai":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#FCEBEB" />
          <circle cx="10" cy="11" r="3" fill="#A32D2D" />
          <circle cx="22" cy="11" r="3" fill="#A32D2D" />
          <circle cx="16" cy="9" r="3" fill="#E24B4A" />
          <path
            d="M4 26 Q4 20 10 20 L22 20 Q28 20 28 26"
            stroke="#A32D2D"
            strokeWidth="1.8"
            fill="none"
          />
        </svg>
      );
    case "pydantic-ai":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#FBEAF0" />
          <path
            d="M8 6 L8 26 M8 6 L19 6 Q24 6 24 12 Q24 18 19 18 L8 18"
            stroke="#993556"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "google-adk":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#FFF" />
          <rect
            width="32"
            height="32"
            rx="8"
            fill="none"
            stroke="#E5E1D6"
            strokeWidth="0.5"
          />
          <circle cx="10" cy="10" r="4" fill="#4285F4" />
          <circle cx="22" cy="10" r="4" fill="#EA4335" />
          <circle cx="10" cy="22" r="4" fill="#34A853" />
          <circle cx="22" cy="22" r="4" fill="#FBBC04" />
        </svg>
      );
    case "smolagents":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#FAEEDA" />
          <circle
            cx="16"
            cy="16"
            r="11"
            fill="#FFD21E"
            stroke="#854F0B"
            strokeWidth="0.5"
          />
          <circle cx="12" cy="14" r="1.6" fill="#2C2C2A" />
          <circle cx="20" cy="14" r="1.6" fill="#2C2C2A" />
          <path
            d="M10 19 Q16 24 22 19"
            stroke="#2C2C2A"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "letta":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#EEEDFE" />
          <rect x="5" y="6" width="22" height="5" rx="1.5" fill="#3C3489" />
          <rect x="5" y="13.5" width="22" height="5" rx="1.5" fill="#7F77DD" />
          <rect x="5" y="21" width="22" height="5" rx="1.5" fill="#AFA9EC" />
        </svg>
      );
    case "mem0":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#E1F5EE" />
          <path
            d="M5 23 L5 10 L9 10 L11.5 17 L14 10 L18 10 L18 23"
            stroke="#0F6E56"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="23.5" cy="16" r="3.2" fill="#1D9E75" />
          <text
            x="23.5"
            y="18"
            textAnchor="middle"
            fontSize="4.5"
            fill="#FFF"
            fontFamily="monospace"
            fontWeight="700"
          >
            0
          </text>
        </svg>
      );
    case "mcp":
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#FAECE7" />
          <g stroke="#712B13" strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M16 4 L16 28" />
            <path d="M16 16 L6 8" />
            <path d="M16 16 L26 8" />
            <path d="M16 16 L6 24" />
            <path d="M16 16 L26 24" />
          </g>
          <circle cx="16" cy="16" r="2.5" fill="#D85A30" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <rect width="32" height="32" rx="8" fill="#E5E1D6" />
        </svg>
      );
  }
}
