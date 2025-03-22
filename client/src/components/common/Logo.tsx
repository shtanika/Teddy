import Image from 'next/image';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/teddy-logo.png"
      alt="Teddy Logo"
      width={128}
      height={128}
      className={`w-8 h-8 ${className}`}
      quality={100}
    />
  );
} 