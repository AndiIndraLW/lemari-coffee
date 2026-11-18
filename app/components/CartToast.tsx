"use client";

import React from "react";
import Image from "next/image";

interface CartToastProps {
  visible: boolean;
  message: string;
  image?: string;
  onOpenCart: () => void;
  onDismiss: () => void;
  lang: "EN" | "JP";
}

export default function CartToast({
  visible,
  message,
  image,
  onOpenCart,
  onDismiss,
  lang,
}: CartToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#241A12] text-[#FCF7ED] p-4 rounded-[4px] shadow-2xl border border-[#CE522A]/40 flex items-center justify-between gap-3 animate-modal-pop">
      <div className="flex items-center gap-3 min-w-0">
        {image ? (
          <div className="relative w-11 h-11 rounded-[2px] overflow-hidden shrink-0 border border-[#4A3418]">
            <Image src={image} alt="Cart item thumbnail" fill sizes="44px" className="object-cover" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#CE522A] text-[#FCF7ED] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-[#CE522A] font-bold tracking-[1.2px] uppercase">
            {lang === "EN" ? "Added to Cart" : "お買い物かごに追加"}
          </span>
          <p className="text-xs font-serif text-[#FCF7ED] truncate">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenCart}
          className="text-xs font-semibold px-3 py-1.5 rounded-[2px] bg-[#CE522A] hover:bg-[#B34522] text-[#FCF7ED] transition-colors"
        >
          {lang === "EN" ? "View Cart" : "かごを見る"}
        </button>
        <button
          onClick={onDismiss}
          className="text-[#9E8B79] hover:text-[#FCF7ED] p-1 transition-colors"
          title="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
