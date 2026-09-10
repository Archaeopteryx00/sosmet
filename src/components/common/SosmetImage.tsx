import React, { useState, useEffect } from 'react';
import { getImageFromStorage } from '../../services/imageStorage';

interface SosmetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';

export const SosmetImage: React.FC<SosmetImageProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  objectFit = 'cover',
  style,
  className,
  ...props
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    if (!src) {
      setResolvedSrc(fallbackSrc);
      setIsLoading(false);
      return;
    }

    if (src.startsWith('img_id_')) {
      getImageFromStorage(src)
        .then((data) => {
          if (isMounted) {
            if (data) {
              setResolvedSrc(data);
            } else {
              setResolvedSrc(fallbackSrc);
            }
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setResolvedSrc(fallbackSrc);
            setIsLoading(false);
          }
        });
    } else {
      setResolvedSrc(src);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setResolvedSrc(fallbackSrc);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#e4e4e7',
        overflow: 'hidden',
        ...style
      }}
      className={className}
    >
      <img
        {...props}
        src={resolvedSrc || fallbackSrc}
        alt={alt}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
          opacity: isLoading ? 0.4 : 1,
          transition: 'opacity 0.2s ease'
        }}
      />
    </div>
  );
};
