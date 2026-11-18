"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, CartItem } from "../types/commerce";
import { beanGrindOptions } from "../data/products";

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, "id">) => void;
  lang: "EN" | "JP";
}

export default function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  lang,
}: ProductQuickViewModalProps) {
  const [selectedGrind, setSelectedGrind] = useState("whole-bean");
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedGrind("whole-bean");
      setSelectedWeightIndex(0);
      setQuantity(1);
      setIsAdded(false);
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

  if (!isOpen || !product) return null;

  const currentWeightOption = product.availableWeights
    ? product.availableWeights[selectedWeightIndex]
    : null;

  const unitPrice = currentWeightOption
    ? Math.round(product.price * currentWeightOption.multiplier)
    : product.price;

  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const grindLabel =
      product.category === "beans" || product.subCategory === "blend"
        ? beanGrindOptions.find((g) => g.id === selectedGrind)?.[lang === "EN" ? "labelEN" : "labelJP"] || selectedGrind
        : undefined;

    const weightLabel = currentWeightOption
      ? lang === "EN"
        ? currentWeightOption.label
        : currentWeightOption.labelJP
      : undefined;

    onAddToCart({
      productId: product.id,
      name: product.name,
      nameJP: product.nameJP,
      category: product.category,
      price: unitPrice,
      quantity,
      image: product.image,
      grind: grindLabel,
      weight: weightLabel,
      weightGrams: currentWeightOption?.grams,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FAF5EC] text-[#241A12] w-full max-w-3xl rounded-[12px] shadow-[0_24px_80px_rgba(36,26,18,0.25)] relative max-h-[92vh] flex flex-col md:flex-row overflow-hidden animate-modal-pop">
        
        {/* Minimalist Floating Close Glyph */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF5EC]/90 hover:bg-[#EADCC8] text-[#241A12] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          title="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product Image Half — Borderless & Cinematic */}
        <div className="relative w-full md:w-1/2 h-[260px] md:h-auto min-h-[300px] bg-[#EADCC8] shrink-0">
          <Image
            src={product.image}
            alt={lang === "EN" ? product.name : product.nameJP}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent md:hidden" />
          {product.tag && (
            <span className="absolute top-4 left-4 bg-[#241A12] text-[#FAF5EC] text-[10px] font-bold tracking-[1.4px] px-3 py-1 rounded-full">
              {lang === "EN" ? product.tag : product.tagJP || product.tag}
            </span>
          )}
        </div>

        {/* Details Half — Generous, Borderless Editorial Layout */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[85vh] bg-[#FAF5EC]">
          <div className="flex flex-col gap-4">
            <div>
              <span className="font-serif italic text-xs tracking-wider text-[#CE522A]">
                {product.region || (product.category === "beans" ? "Micro-lot Sourcing" : "Lemari Handcraft")}
              </span>
              <h2 className="font-serif text-[28px] sm:text-[32px] font-normal text-[#241A12] mt-0.5 leading-tight">
                {lang === "EN" ? product.name : product.nameJP}
              </h2>
              <p className="text-[12.5px] text-[#7A6453] mt-1 font-serif italic">
                {lang === "EN" ? product.detail : product.detailJP}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-[28px] font-bold text-[#241A12] tracking-tight">
                ¥{unitPrice.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#8C7663]">
                {lang === "EN" ? "tax included" : "（税込）"}
              </span>
            </div>

            {/* Tasting Notes */}
            {product.notes && product.notes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {(lang === "EN" ? product.notes : product.notesJP || product.notes).map((note) => (
                  <span
                    key={note}
                    className="bg-[#EFE2D0] text-[#241A12] text-[11px] font-serif px-3 py-1 rounded-full"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-[12.5px] leading-[22px] text-[#5A4535]">
              {lang === "EN" ? product.description : product.descriptionJP}
            </p>

            {/* Bean Specifications — borderless warm tint */}
            {product.category === "beans" && (
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F2E7D5]/70 rounded-[8px] text-xs">
                <div>
                  <span className="text-[#8C7663] text-[10px] uppercase tracking-wider block font-serif">
                    {lang === "EN" ? "Process" : "精製"}
                  </span>
                  <span className="font-medium text-[#241A12] text-[12px]">
                    {lang === "EN" ? product.process : product.processJP}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C7663] text-[10px] uppercase tracking-wider block font-serif">
                    {lang === "EN" ? "Roast Profile" : "焙煎"}
                  </span>
                  <span className="font-medium text-[#241A12] text-[12px]">
                    {lang === "EN" ? product.roast : product.roastJP}
                  </span>
                </div>
              </div>
            )}

            {/* Size / Weight Selector — Borderless Soft Pills */}
            {product.availableWeights && product.availableWeights.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="font-serif italic text-xs text-[#7A6453]">
                  {lang === "EN" ? "Select Weight" : "容量を選択"}
                </span>
                <div className="flex gap-2">
                  {product.availableWeights.map((w, idx) => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => setSelectedWeightIndex(idx)}
                      className={`flex-1 py-2 px-3 text-xs rounded-full font-serif transition-all cursor-pointer ${
                        selectedWeightIndex === idx
                          ? "bg-[#241A12] text-[#FAF5EC] shadow-xs font-semibold"
                          : "bg-[#EFE2D0] text-[#6A5747] hover:bg-[#E4D4C0]"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grind Selector */}
            {product.availableGrinds && (
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="font-serif italic text-xs text-[#7A6453]">
                  {lang === "EN" ? "Grind Profile" : "挽き目"}
                </span>
                <select
                  value={selectedGrind}
                  onChange={(e) => setSelectedGrind(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#F2E7D5]/70 rounded-[6px] text-xs text-[#241A12] focus:outline-hidden font-serif cursor-pointer"
                >
                  {beanGrindOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {lang === "EN" ? opt.labelEN : opt.labelJP}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity Stepper — borderless pill */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-serif italic text-xs text-[#7A6453]">
                {lang === "EN" ? "Quantity" : "数量"}
              </span>
              <div className="flex items-center gap-2 bg-[#F2E7D5]/70 px-3 py-1 rounded-full text-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-5 h-5 flex items-center justify-center text-[#7A6453] hover:text-[#241A12] text-sm cursor-pointer"
                >
                  —
                </button>
                <span className="w-6 text-center font-serif font-semibold text-[#241A12]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-5 h-5 flex items-center justify-center text-[#7A6453] hover:text-[#241A12] text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 mt-4 flex flex-col gap-2">
            <button
              onClick={handleAdd}
              disabled={isAdded}
              className={`w-full py-4 px-6 rounded-full font-medium text-[13.5px] tracking-[0.6px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isAdded
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-[#CE522A] hover:bg-[#B34522] active:scale-[0.99] text-[#FAF5EC]"
              }`}
            >
              {isAdded ? (
                <>
                  <span>✓</span>
                  <span>{lang === "EN" ? "Added to Cart" : "かごに追加しました"}</span>
                </>
              ) : (
                <span className="font-serif">
                  {lang === "EN"
                    ? `Add to Cart · ¥${totalPrice.toLocaleString()}`
                    : `かごに追加する · ¥${totalPrice.toLocaleString()}`}
                </span>
              )}
            </button>
            <span className="text-center text-[10.5px] text-[#8C7663]">
              {lang === "EN"
                ? "Dispatched within 2–3 business days from Tokyo"
                : "ご注文より2〜3営業日以内に都内焙煎所より発送"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
