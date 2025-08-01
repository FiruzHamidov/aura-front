'use client';

import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

const images = [
  '/images/extra-pages/cleaning-slider-1.jpg',
  '/images/extra-pages/cleaning-slider-2.jpg',
  '/images/extra-pages/cleaning-slider-3.jpg',
  '/images/extra-pages/cleaning-slider-2.jpg',
  '/images/extra-pages/cleaning-slider-1.jpg',
];

export const PhotoCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="mb-10">
      <div className="container">
        <div className="flex justify-between items-center mb-11">
          <div className="text-[32px] font-bold">Фото наших работ</div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollPrev}
              className="rounded-full bg-white w-16 h-16 flex items-center justify-center cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-[#0036A5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="rounded-full bg-white w-16 h-16 flex items-center justify-center cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-[#0036A5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex gap-5 pl-[calc((100vw-1400px)/2)] pr-[calc((100vw-1400px)/2)]">
          {images.map((image, index) => (
            <div
              key={index}
              className="embla__slide flex-none bg-white px-9 py-[43px] rounded-[22px]"
            >
              <Image
                src={image}
                alt={`Cleaning photo ${index + 1}`}
                width={448}
                height={624}
                className="rounded-lg object-cover w-[448px] h-[624px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
