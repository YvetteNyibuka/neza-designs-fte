"use client";

import { useState } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
}

export function FallbackImage({
  src,
  alt,
  fallbackSrc = "/images/projectHero.jpeg",
  fill,
  sizes,
  priority,
  unoptimized,
  className,
  style,
  onLoad,
}: FallbackImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? fallbackSrc : src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      className={className}
      style={style}
      onLoad={onLoad}
      onError={() => setHasError(true)}
    />
  );
}