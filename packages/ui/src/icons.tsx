/** Inline SVG icons matching Figma line-icon style used throughout VedaAI */

type IconProps = { className?: string; size?: number };

export function IconHome({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M2.5 7.5L10 2.5L17.5 7.5V17.5H12.5V12.5H7.5V17.5H2.5V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconUsers({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="7.5" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1.5 17C1.5 14 4.5 11.5 7.5 11.5C10.5 11.5 13.5 14 13.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 11C15.8 11 17.5 12.5 17.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="13.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function IconFileText({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M11.5 2.5H5.5C4.67 2.5 4 3.17 4 4V16C4 16.83 4.67 17.5 5.5 17.5H14.5C15.33 17.5 16 16.83 16 16V7L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M11.5 2.5V7H16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 10.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 13.5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconBook({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M3.5 3.5C3.5 3.5 5.5 3 10 3C14.5 3 16.5 3.5 16.5 3.5V16.5C16.5 16.5 14.5 16 10 16C5.5 16 3.5 16.5 3.5 16.5V3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 3V16" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function IconLibrary({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="5" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="3" width="7" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function IconSettings({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.99984 8.33335C9.07936 8.33335 8.33317 9.07955 8.33317 10C8.33317 10.9205 9.07936 11.6667 9.99984 11.6667C10.9203 11.6667 11.6665 10.9205 11.6665 10C11.6665 9.07955 10.9203 8.33335 9.99984 8.33335ZM6.6665 10C6.6665 8.15907 8.15889 6.66669 9.99984 6.66669C11.8408 6.66669 13.3332 8.15907 13.3332 10C13.3332 11.841 11.8408 13.3334 9.99984 13.3334C8.15889 13.3334 6.6665 11.841 6.6665 10Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.27463 3.78422C7.27463 2.61474 8.22268 1.66669 9.39216 1.66669H10.6077C11.7772 1.66669 12.7252 2.61474 12.7252 3.78422C12.7252 3.9537 12.8421 4.17983 13.1215 4.33153C13.2074 4.37822 13.2922 4.42676 13.3757 4.47712C13.6543 4.64507 13.9159 4.63429 14.0694 4.54643C15.0892 3.96291 16.3888 4.31112 16.9803 5.32637L17.5673 6.33399C18.1599 7.35118 17.8102 8.6564 16.7884 9.24104C16.6402 9.3258 16.501 9.54139 16.5077 9.86221C16.5087 9.90804 16.5092 9.95398 16.5092 10C16.5092 10.0461 16.5087 10.092 16.5077 10.1379C16.501 10.4587 16.6402 10.6743 16.7884 10.759C17.8102 11.3436 18.1599 12.6488 17.5673 13.666L16.9803 14.6737C16.3888 15.6889 15.0892 16.0371 14.0694 15.4536C13.9158 15.3658 13.6543 15.355 13.3757 15.5229C13.2922 15.5733 13.2074 15.6218 13.1215 15.6685C12.8421 15.8202 12.7252 16.0463 12.7252 16.2158C12.7252 17.3853 11.7772 18.3334 10.6077 18.3334H9.39216C8.22268 18.3334 7.27463 17.3853 7.27463 16.2158C7.27463 16.0463 7.15775 15.8202 6.87841 15.6685C6.79245 15.6218 6.70768 15.5733 6.62415 15.5229C6.34556 15.355 6.08403 15.3658 5.93048 15.4536C4.91066 16.0371 3.61108 15.6889 3.01963 14.6737L2.43259 13.666C1.84 12.6488 2.18972 11.3436 3.2115 10.759C3.35964 10.6742 3.49892 10.4587 3.49214 10.1379C3.49117 10.092 3.49068 10.0461 3.49068 10C3.49068 9.95398 3.49117 9.90805 3.49214 9.86222C3.49892 9.5414 3.35963 9.32581 3.21149 9.24105C2.18969 8.65641 1.83997 7.35119 2.43257 6.33399L3.01959 5.32637C3.61105 4.31113 4.91063 3.96292 5.93046 4.54644C6.08401 4.6343 6.34554 4.64507 6.62414 4.47713C6.70768 4.42677 6.79245 4.37822 6.87841 4.33153C7.15775 4.17983 7.27463 3.9537 7.27463 3.78422ZM9.39216 3.33335C9.14316 3.33335 8.9413 3.53521 8.9413 3.78422C8.9413 4.70592 8.3534 5.42707 7.67384 5.79614C7.60988 5.83088 7.54678 5.86701 7.4846 5.90449C6.82172 6.30411 5.90337 6.45114 5.10275 5.99305C4.87745 5.86414 4.59036 5.94106 4.45969 6.16535L3.87268 7.17297C3.74599 7.39042 3.82075 7.66945 4.03919 7.79444C4.84112 8.25328 5.17479 9.12392 5.15843 9.89746C5.15771 9.93155 5.15735 9.96573 5.15735 10C5.15735 10.0343 5.15771 10.0685 5.15843 10.1026C5.17479 10.8761 4.84113 11.7468 4.03921 12.2056C3.82078 12.3306 3.74602 12.6096 3.8727 12.8271L4.45973 13.8347C4.59039 14.059 4.87748 14.1359 5.10278 14.007C5.90339 13.5489 6.82173 13.6959 7.48461 14.0955C7.54679 14.133 7.60988 14.1692 7.67384 14.2039C8.3534 14.573 8.9413 15.2941 8.9413 16.2158C8.9413 16.4648 9.14316 16.6667 9.39216 16.6667H10.6077C10.8567 16.6667 11.0586 16.4648 11.0586 16.2158C11.0586 15.2941 11.6465 14.573 12.326 14.2039C12.39 14.1692 12.4531 14.133 12.5153 14.0956C13.1781 13.6959 14.0965 13.5489 14.8971 14.007C15.1224 14.1359 15.4095 14.059 15.5401 13.8347L16.1272 12.8271C16.2539 12.6096 16.1791 12.3306 15.9607 12.2056C15.1587 11.7468 14.8251 10.8761 14.8414 10.1026C14.8422 10.0685 14.8425 10.0343 14.8425 10C14.8425 9.96573 14.8422 9.93154 14.8414 9.89745C14.8251 9.12391 15.1588 8.25327 15.9607 7.79443C16.1791 7.66945 16.2539 7.39042 16.1272 7.17296L15.5402 6.16534C15.4095 5.94106 15.1224 5.86413 14.8971 5.99304C14.0965 6.45113 13.1782 6.3041 12.5153 5.90449C12.4531 5.86701 12.39 5.83088 12.326 5.79614C11.6465 5.42707 11.0586 4.70592 11.0586 3.78422C11.0586 3.53521 10.8567 3.33335 10.6077 3.33335H9.39216Z" fill="currentColor"/>
    </svg>
  );
}

export function IconBell({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M10 2.5C7 2.5 5 5 5 7.5V12.5L3.5 14.5H16.5L15 12.5V7.5C15 5 13 2.5 10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8.5 14.5C8.5 15.33 9.17 16 10 16C10.83 16 11.5 15.33 11.5 14.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function IconBarChart({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="3" y="11" width="4" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="8" y="7" width="4" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="3" width="4" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function IconArrowLeft({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconChevronDown({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconPlus({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconMinus({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconX({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconCloudUpload({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10C4.24 10 2 12.24 2 15C2 17.76 4.24 20 7 20H18C20.21 20 22 18.21 22 16C22 14 20.4 12.3 18.4 12C17.6 10.8 15.9 10 14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconCalendar({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 8.5H17" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 3V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 3V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconMic({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="7" y="2" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 10C4 13.31 6.69 16 10 16C13.31 16 16 13.31 16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 16V18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconDownload({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M10 3V13M10 13L6.5 9.5M10 13L13.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.5 15.5H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconSparkle({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M8 1L9.2 5.8H14L10.4 8.5L11.6 13.3L8 10.6L4.4 13.3L5.6 8.5L2 5.8H6.8L8 1Z" fill="currentColor"/>
    </svg>
  );
}
