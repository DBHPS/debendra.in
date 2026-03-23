"use client";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function MediaCard({ src, type = "video", alt = "", className = "" }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current || type !== "video") return;
    if (isVisible && isHovered) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isVisible, isHovered, type]);

  if (!src) {
    return (
      <div
        ref={cardRef}
        className={`rounded-2xl overflow-hidden shadow-md transition-all duration-500 ${
          theme === "systems"
            ? "bg-slate-100 border border-slate-200"
            : "bg-[#F0EBE4] border border-[#DDD7CF]"
        } ${className}`}
      >
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center opacity-40">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Media placeholder</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ${
        theme === "systems"
          ? "bg-white border border-slate-200"
          : "bg-[#FFFDF9] border border-[#E8E4DF]"
      } ${className}`}
    >
      {type === "youtube" ? (() => {
        const videoId = src.includes('embed/') ? src.split('embed/')[1].split('?')[0] : '';
        const autoPlaySrc = src + (src.includes('?') ? '&' : '?') + `autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}`;
        return (
          <iframe
            src={autoPlaySrc}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full aspect-video object-cover border-none"
          />
        );
      })() : type === "video" ? (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          className="w-full aspect-video object-cover"
        />
      ) : (
        <img src={src} alt={alt} className="w-full aspect-video object-cover" />
      )}
    </div>
  );
}
