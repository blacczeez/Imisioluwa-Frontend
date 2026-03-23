'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import slides from '@/data/heroSlides.json';

interface Slide {
  id: string;
  tag: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  bgColor: string;
}

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalSlides = (slides as Slide[]).length;

  const goToSlide = useCallback((index: number) => {
    if (index < 0) {
      setCurrentSlide(totalSlides - 1);
    } else if (index >= totalSlides) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const goNext = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const goPrev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [isHovered, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {(slides as Slide[]).map((slide, index) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0"
            style={{ backgroundColor: slide.bgColor }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 aspect-[3/2] md:aspect-auto md:h-[270px]">
              <div className="p-5 sm:p-8 md:py-8 md:px-10 flex flex-col justify-center order-2 md:order-1">
                <span className="text-xs uppercase tracking-widest font-semibold opacity-70 text-brand-dark">
                  {slide.tag}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-brand-dark mt-2 whitespace-pre-line">
                  {slide.heading}
                </h2>
                <p className="text-sm sm:text-base opacity-80 mt-3 text-brand-dark max-w-md">
                  {slide.description}
                </p>
                <div className="mt-2">
                  <a
                    href={slide.buttonLink}
                    className="inline-flex px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    {slide.buttonText}
                  </a>
                </div>
              </div>

              <div className="relative flex items-center justify-center p-3 md:p-0 order-1 md:order-2 min-h-[160px] sm:min-h-[220px] md:min-h-full">
                <Image
                  src={slide.imageUrl}
                  alt={slide.heading.replace('\n', ' ')}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain md:object-cover"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/60 hover:bg-white/90 flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/60 hover:bg-white/90 flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {(slides as Slide[]).map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all ${
              index === currentSlide
                ? 'w-2.5 h-2.5 bg-brand-dark'
                : 'w-2 h-2 bg-brand-dark/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
