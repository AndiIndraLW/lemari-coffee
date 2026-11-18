"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CartItem } from "../types/commerce";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  lang: "EN" | "JP";
  deliveryMethod: "shipping" | "pickup";
  setDeliveryMethod: (method: "shipping" | "pickup") => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  lang,
  deliveryMethod,
  setDeliveryMethod,
}: CartDrawerProps) {
  const FREE_SHIPPING_THRESHOLD = 5000;
  const STANDARD_SHIPPING_FEE = 600;

  // Lock scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || deliveryMethod === "pickup";
  const shippingFee = deliveryMethod === "pickup" ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      <div className="w-full max-w-[500px] h-full bg-[#FAF5EC] text-[#241A12] flex flex-col shadow-[0_0_80px_rgba(36,26,18,0.25)] animate-modal-pop relative overflow-hidden">
        
        {/* Soft background watermark/insignia */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#EADCC8]/30 blur-2xl pointer-events-none" />
        <div className="absolute bottom-24 -left-12 w-56 h-56 rounded-full bg-[#CE522A]/5 blur-3xl pointer-events-none" />

        {/* ================= 1. HEADER ================= */}
        <div className="pt-8 pb-5 px-6 sm:px-8 flex items-center justify-between relative z-10">
          <h2 className="font-serif text-[28px] sm:text-[32px] font-normal tracking-[-0.6px] text-[#241A12] leading-none">
            {lang === "EN" ? "Cart" : "お買い物かご"}
          </h2>

          {/* Minimalist Close Glyph */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6A5747] hover:text-[#241A12] hover:bg-[#E8D9C5]/50 transition-all cursor-pointer"
            title="Close Cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ================= 2. BORDERLESS PRODUCT LIST ================= */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-7 relative z-10">
          {items.length === 0 ? (
            /* Atmospheric Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-5">
              <div className="relative w-20 h-20 rounded-full bg-[#EADCC8]/50 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#A67C52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#CE522A] text-white text-[10px] flex items-center justify-center font-bold">
                  0
                </div>
              </div>
              <div className="flex flex-col gap-1.5 max-w-[300px]">
                <h3 className="font-serif text-[22px] text-[#241A12] font-normal">
                  {lang === "EN" ? "Your cart is empty." : "お買い物かごは空です。"}
                </h3>
                <p className="text-xs text-[#8C7663] leading-[21px]">
                  {lang === "EN"
                    ? "Fresh batches of Sumatra and Flores coffee are cooling behind the bar. Choose a lot to begin."
                    : "焙煎されたてのインドネシア産マイクロロットや、手仕事の器をお選びください。"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 text-xs font-semibold px-6 py-3 rounded-full bg-[#241A12] text-[#FAF5EC] hover:bg-[#CE522A] transition-all cursor-pointer shadow-sm tracking-[0.5px]"
              >
                {lang === "EN" ? "Browse Fresh Roasts" : "珈琲豆をさがす"}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="group flex gap-4 sm:gap-5 items-start transition-all"
              >
                {/* Image */}
                <div className="relative shrink-0">
                  <div className="relative w-20 h-24 sm:w-22 sm:h-26 rounded-[6px] overflow-hidden bg-[#EADCC8] shadow-xs group-hover:shadow-md transition-shadow">
                    <Image
                      src={item.image}
                      alt={lang === "EN" ? item.name : item.nameJP}
                      fill
                      sizes="96px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Content Column — completely borderless */}
                <div className="flex-1 flex flex-col justify-between min-h-[96px] sm:min-h-[104px] min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif text-[17px] sm:text-[18px] font-medium text-[#241A12] leading-tight truncate">
                        {lang === "EN" ? item.name : item.nameJP}
                      </h3>
                      
                      {/* Subtle metadata without boxed tags */}
                      {(item.weight || item.grind) && (
                        <p className="text-[11.5px] text-[#7A6453] mt-1 font-serif italic leading-tight">
                          {item.weight && <span>{item.weight}</span>}
                          {item.weight && item.grind && <span className="mx-1 text-[#C4B29F]">·</span>}
                          {item.grind && <span>{item.grind}</span>}
                        </p>
                      )}
                    </div>

                    {/* Subtle, non-card remove button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[11px] text-[#A89684] hover:text-[#CE522A] transition-colors p-1"
                      title={lang === "EN" ? "Remove item" : "削除"}
                    >
                      <span className="sr-only">Remove</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Price & Borderless Tactile Stepper */}
                  <div className="flex justify-between items-end pt-2">
                    {/* Creative borderless typography stepper */}
                    <div className="flex items-center gap-2 text-xs bg-[#F0E4D2]/60 px-2.5 py-1 rounded-full">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-[#7A6453] hover:text-[#241A12] transition-colors font-medium text-sm cursor-pointer"
                        title="Decrease"
                      >
                        —
                      </button>
                      <span className="font-serif font-semibold text-[#241A12] text-xs px-1 min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#7A6453] hover:text-[#241A12] transition-colors font-medium text-sm cursor-pointer"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>

                    {/* Elegant Numerals */}
                    <div className="text-right">
                      <span className="font-serif text-[17px] font-bold text-[#241A12] tracking-tight">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= 3. EDITORIAL FOOTER & ORDER SUMMARY ================= */}
        {items.length > 0 && (
          <div className="p-6 sm:p-8 bg-[#F4ECDD]/90 backdrop-blur-md relative z-10 flex flex-col gap-5">
            
            {/* Seamless Delivery Switcher (Typographic toggle, zero borders) */}
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="font-serif italic text-[#8C7663]">
                {lang === "EN" ? "Dispatch method:" : "受取方法:"}
              </span>
              <div className="flex items-center gap-1 bg-[#E8DAC6]/70 p-1 rounded-full text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("shipping")}
                  className={`px-3 py-1 rounded-full text-[11.5px] transition-all cursor-pointer ${
                    deliveryMethod === "shipping"
                      ? "bg-[#241A12] text-[#FAF5EC] font-medium shadow-xs"
                      : "text-[#6A5747] hover:text-[#241A12]"
                  }`}
                >
                  {lang === "EN" ? "Ship to Address" : "宅配（全国）"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`px-3 py-1 rounded-full text-[11.5px] transition-all cursor-pointer ${
                    deliveryMethod === "pickup"
                      ? "bg-[#241A12] text-[#FAF5EC] font-medium shadow-xs"
                      : "text-[#6A5747] hover:text-[#241A12]"
                  }`}
                >
                  {lang === "EN" ? "Pick Up in Tokyo" : "店舗受取"}
                </button>
              </div>
            </div>

            {/* Seamless Breakdown */}
            <div className="flex flex-col gap-1.5 text-xs text-[#7A6453]">
              <div className="flex justify-between items-baseline">
                <span>{lang === "EN" ? "Subtotal" : "商品小計"}</span>
                <span className="font-serif text-sm text-[#241A12]">¥{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span>
                  {deliveryMethod === "pickup"
                    ? lang === "EN" ? "Store Pickup (Nakameguro)" : "神宮前・中目黒受取"
                    : lang === "EN" ? "Takkyubin Shipping" : "宅急便配送料"}
                </span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-[#CE522A] font-semibold tracking-wide">
                      {lang === "EN" ? "COMPLIMENTARY" : "無料"}
                    </span>
                  ) : (
                    `¥${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-3 mt-1 text-[#241A12]">
                <div className="flex flex-col">
                  <span className="font-serif text-[15px] font-medium">
                    {lang === "EN" ? "Total Due" : "お支払い総額"}
                  </span>
                  <span className="text-[10px] text-[#8C7663]">
                    {lang === "EN" ? "Tax inclusive" : "消費税込み"}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-[28px] font-bold text-[#CE522A] tracking-tight leading-none">
                    ¥{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bold, tactile seal checkout button */}
            <button
              onClick={onCheckout}
              className="w-full py-4 px-6 rounded-full bg-[#CE522A] hover:bg-[#B34522] active:scale-[0.99] text-[#FAF5EC] font-medium text-[13.5px] tracking-[0.8px] shadow-md hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="font-serif">
                {lang === "EN" ? "Proceed to Checkout" : "ご購入手続きへ進む"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-90 font-mono">¥{total.toLocaleString()}</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
