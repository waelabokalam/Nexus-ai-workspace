import Image from "next/image";

interface TqMonogramProps {
  /**
   * Intrinsic render height in px (also the largest responsive step).
   * Pass `className` (e.g. "h-8 w-auto sm:h-9 lg:h-10") to display smaller
   * at narrower breakpoints; aspect is always preserved, downscaling only.
   */
  size?: number;
  className?: string;
}

const ASPECT = 832 / 676;

// Approved TQEN mark, tightly cropped derivative (public/tqen-icon-tight.png).
// Rendered unaltered and uncontained: no tile, border, glow, shadow, or animation.
export default function TqMonogram({ size = 30, className = "" }: TqMonogramProps) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={`tq-monogram ${className}`.trim()}
      height={size}
      src="/tqen-icon-tight.png"
      width={Math.round(size * ASPECT)}
    />
  );
}
