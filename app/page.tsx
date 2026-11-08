"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface CartItem {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  qty: number;
  image: string;
  detail?: string;
}

export default function Home() {
  const [lang, setLang] = useState<"EN" | "JP">("JP");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartNotification, setCartNotification] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [menuFilter, setMenuFilter] = useState<"all" | "coffee" | "kitchen">("all");
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Auto clear toast notification
  useEffect(() => {
    if (cartNotification) {
      const timer = setTimeout(() => setCartNotification(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [cartNotification]);

  // Handle escape key and body scroll lock for modals/drawer
  useEffect(() => {
    const isAnyModalOpen = isCartOpen || isVisitModalOpen || isCheckoutModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        setIsVisitModalOpen(false);
        setIsCheckoutModalOpen(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, isVisitModalOpen, isCheckoutModalOpen]);

  const totalItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const freeShippingThreshold = 5000;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);

  const handleAddToCart = (item: {
    id: string;
    name: string;
    price: number;
    priceFormatted: string;
    image: string;
    detail?: string;
  }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setCartNotification(
      lang === "EN"
        ? `Added ${item.name} (${item.priceFormatted}) to your bag.`
        : `「${item.name}」(${item.priceFormatted}) をカートに追加しました。`
    );
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setNewsletterSubscribed(true);
      setEmail("");
    }
  };

  const marqueeWords = [
    "SINGLE ORIGIN",
    "ROASTED IN NAKAMEGURO",
    "WET-HULLED PROCESS",
    "SMALL LOTS ONLY",
    "SUMATRA",
    "SULAWESI",
    "FLORES",
    "JAVA",
  ];

  return (
    <div className="min-h-screen w-full bg-[#F6EDDC] text-[#241A12] selection:bg-[#CE522A] selection:text-[#FCF7ED] flex flex-col items-center">
      {/* Toast Notification */}
      {cartNotification && (
        <div className="fixed top-5 z-50 flex items-center gap-3 bg-[#241A12] text-[#F6EDDC] px-5 py-3 rounded-full shadow-2xl border border-white/10 text-xs md:text-sm font-medium transition-all animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#CE522A] animate-ping" />
          <span>{cartNotification}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 underline text-[#F2C24E] hover:text-white"
          >
            {lang === "EN" ? "View Bag" : "カートを見る"}
          </button>
          <button
            onClick={() => setCartNotification(null)}
            className="ml-1 text-stone-400 hover:text-white text-base leading-none"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Container max 1440px */}
      <div className="w-full max-w-[1440px] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.06)] bg-[#F6EDDC] overflow-hidden">
        
        {/* ================= 1. NAV ================= */}
        <header className="sticky top-0 z-40 w-full h-[84px] md:h-[92px] px-5 sm:px-8 md:px-14 flex items-center justify-between bg-[#F6EDDC]/95 backdrop-blur-md border-b border-[#D8C7AC]/40 transition-colors">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-[30px] h-[30px] bg-[#CE522A] rounded-[3px] flex items-center justify-center text-[#FCF7ED] font-serif font-semibold text-[17px] shadow-sm transition-transform group-hover:scale-105">
              L
            </div>
            <span className="font-serif text-[18px] md:text-[19px] font-medium tracking-[1.4px] text-[#241A12]">
              LEMARI COFFEE
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-[13px] text-[#6A5747] font-normal tracking-[0.6px]">
            <a href="#philosophy" className="hover:text-[#CE522A] transition-colors">Philosophy</a>
            <a href="#beans" className="hover:text-[#CE522A] transition-colors">Beans</a>
            <a href="#menu" className="hover:text-[#CE522A] transition-colors">Menu</a>
            <a href="#space" className="hover:text-[#CE522A] transition-colors">The Space</a>
            <a href="#shop" className="hover:text-[#CE522A] transition-colors">Shop</a>
          </nav>

          {/* Nav Right */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* Lang Switcher */}
            <button
              onClick={() => setLang(lang === "EN" ? "JP" : "EN")}
              className="text-[12px] font-medium text-[#6A5747] tracking-[0.8px] hover:text-[#241A12] px-2.5 py-1 rounded border border-[#D8C7AC]/60 hover:border-[#241A12] transition-all"
              title="Toggle Language"
            >
              {lang === "EN" ? "JP / EN" : "EN / JP"}
            </button>

            {/* Visit Modal Trigger */}
            <button
              onClick={() => setIsVisitModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 bg-[#241A12] text-[#FCF7ED] px-4 md:px-5 py-2.5 rounded-full text-[12.5px] font-medium tracking-[0.6px] hover:bg-[#CE522A] active:scale-95 transition-all shadow-sm"
            >
              <span>{lang === "EN" ? "Visit the café" : "カフェへ行く"}</span>
              <svg viewBox="0 0 13 13" className="w-[12px] h-[12px] fill-current" aria-hidden="true">
                <path d="M3.666 3.263q-.13 .038-.241 .143-.112 .104-.15 .234-.05 .181 .026 .365 .079 .181 .235 .273 .079 .026 .181 .038 .158 .013 .612 .026h3.561l-2.275 2.275q-1.533 1.533-1.911 1.924-.375 .39-.403 .441-.102 .222-.013 .432 .092 .206 .298 .298 .21 .089 .432-.013 .051-.028 .441-.403 .391-.378 1.924-1.91l2.275-2.276v2.053q0 2.067 .026 2.146 .025 .168 .142 .273 .185 .181 .429 .162 .247-.019 .39-.229l.026-.025q.041-.051 .054-.168 .012-.143 .025-.638v-4.993l-.038-.089q-.025-.104-.117-.196-.093-.093-.197-.118l-.089-.038h-2.796q-2.781 0-2.847 .013z" />
              </svg>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 bg-[#CE522A] text-[#FCF7ED] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-[#b8431d] active:scale-95 transition-all"
            >
              <span>Bag</span>
              <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-[10px] min-w-[18px] text-center">
                {totalItemsCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#241A12] rounded-lg border border-[#D8C7AC]/70"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-[#F6EDDC] border-b border-[#D8C7AC] px-6 py-5 flex flex-col gap-4 text-[15px] font-medium transition-all">
            <a href="#philosophy" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">Philosophy</a>
            <a href="#beans" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">Beans & Origins</a>
            <a href="#menu" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">Signature Menu</a>
            <a href="#space" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">The Space</a>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">Shop Merchandise</a>
            <a href="#locator" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">Store Locations</a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsVisitModalOpen(true);
              }}
              className="mt-2 w-full text-center bg-[#241A12] text-[#FCF7ED] py-2.5 rounded-full text-xs font-semibold"
            >
              Visit the café
            </button>
          </div>
        )}

        {/* ================= 2. HERO ================= */}
        <section className="w-full px-5 sm:px-8 md:px-14 pt-8 md:pt-10 pb-16 md:pb-20 flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
          {/* Copy Column */}
          <div className="w-full lg:w-[560px] shrink-0 flex flex-col gap-6 md:gap-7 items-start">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="w-[7px] h-[7px] bg-[#CE522A] rounded-full inline-block" />
              <span className="text-[11px] md:text-[11.5px] text-[#6A5747] font-medium tracking-[1.6px] uppercase">
                {lang === "EN" ? "NAKAMEGURO, TOKYO — SINCE 2019" : "中目黒・東京 — 2019年創業"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-[48px] sm:text-[62px] md:text-[76px] leading-[1.02] tracking-[-1.2px] text-[#241A12] font-medium">
              {lang === "EN" ? "A cupboard full of islands." : "島々が詰まった、ひとつの食器棚。"}
            </h1>

            {/* Subhead */}
            <p className="text-[15px] md:text-[16px] leading-[26px] text-[#6A5747] max-w-[440px]">
              {lang === "EN"
                ? "Single-origin Indonesian coffee, roasted in small batches behind the bar in Tokyo. Served slow, in a room built from teak, terracotta and fifty years of patience."
                : "インドネシアの単一農園産コーヒーを、中目黒のカウンター裏で少量焙煎。チーク材と素焼きタイル、そして穏やかな時間の中で、一杯ずつ丁寧に抽出します。"}
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#menu"
                className="inline-flex items-center gap-2.5 bg-[#CE522A] text-[#FCF7ED] px-7 py-3.5 rounded-full text-[13.5px] font-semibold tracking-[0.5px] hover:bg-[#b8431d] active:scale-95 transition-all shadow-md group"
              >
                <span>{lang === "EN" ? "Explore the menu" : "メニューを見る"}</span>
                <svg viewBox="0 0 15 15" className="w-[14px] h-[14px] fill-current transition-transform group-hover:translate-x-1" aria-hidden="true">
                  <path d="M7.394 2.52q-.194 .029-.344 .179-.121 .121-.158 .3-.037 .18 .022 .344 .029 .092 .278 .348 .249 .253 1.462 1.469 1.695 1.695 1.695 1.71 0 .015-3.702 .015h-3.692l-.091 .044q-.238 .121-.322 .362-.081 .238 .007 .465 .062 .103 .15 .194 .092 .088 .179 .129 .092 .036 .572 .036h3.226q3.673 0 3.673 .015 0 .015-1.695 1.71-1.213 1.216-1.462 1.472-.249 .253-.278 .345-.059 .164-.022 .344 .037 .179 .158 .3 .194 .194 .45 .194h.044q.121 0 .212-.058 .151-.107 .553-.499l1.802-1.798q2.263-2.252 2.307-2.34 .077-.135 .077-.3 0-.165-.077-.3-.044-.088-2.303-2.337-2.256-2.252-2.333-2.289-.073-.04-.253-.069-.044 0-.135 .015z" />
                </svg>
              </a>
              <a
                href="#philosophy"
                className="inline-flex items-center px-6 py-3.5 rounded-full text-[13.5px] font-medium tracking-[0.5px] border border-[#241A12] text-[#241A12] hover:bg-[#241A12] hover:text-[#FCF7ED] active:scale-95 transition-all"
              >
                {lang === "EN" ? "Our philosophy" : "私たちの哲学"}
              </a>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-2.5 pt-2">
              <span className="w-[6px] h-[6px] bg-[#CE522A] rounded-full inline-block" />
              <span className="text-[12.5px] text-[#6A5747] font-normal">
                {lang === "EN"
                  ? "Open daily 8:00 – 19:00 · Roastery bar from 10:00"
                  : "営業時間 8:00 – 19:00 · ロースタリーバー 10:00〜"}
              </span>
            </div>
          </div>

          {/* Visual Column */}
          <div className="w-full flex-1 relative min-h-[460px] md:min-h-[580px] lg:h-[640px] rounded-[6px] overflow-hidden group">
            <Image
              src="/assets/revamp/hero-image.jpg"
              alt="Lemari Coffee café bar and counter"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 750px"
            />
            {/* Founder Card overlay */}
            <div className="absolute left-4 sm:left-7 bottom-6 sm:bottom-8 w-[calc(100%-2rem)] sm:w-[320px] bg-[#F2C24E] p-5 sm:p-6 rounded-[4px] shadow-xl flex flex-col gap-3.5 z-10 border border-[#241A12]/10 transition-transform hover:-translate-y-1 duration-300">
              <p className="font-serif text-[15px] sm:text-[16px] leading-[23px] text-[#241A12]">
                {lang === "EN"
                  ? "“Lemari is the cupboard my grandmother kept her coffee in. We just carried it across the sea.”"
                  : "「ルマリとは、祖母がコーヒーをしまっていた食器棚のこと。私たちはそれを海を越えて運んできただけなのです。」"}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-[36px] h-[36px] bg-[#CE522A] rounded-full flex items-center justify-center text-[#FCF7ED] font-bold text-[11.5px] tracking-[0.5px]">
                  RP
                </div>
                <div className="flex flex-col">
                  <span className="text-[12.5px] font-semibold text-[#241A12] leading-tight">
                    Rani Prasetyo
                  </span>
                  <span className="text-[11px] text-[#241A12]/80 leading-tight">
                    {lang === "EN" ? "Founder & Roaster" : "創業者・焙煎士"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. MARQUEE ================= */}
        <section aria-label="Ticker highlights" className="w-full h-[54px] bg-[#CE522A] overflow-hidden flex items-center shadow-inner">
          <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
            {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map((word, idx) => (
              <span
                key={idx}
                className="text-[11.5px] font-medium tracking-[1.8px] text-[#F6EDDC] select-none flex items-center gap-10"
              >
                <span>{word}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F6EDDC]/50 inline-block" />
              </span>
            ))}
          </div>
        </section>

        {/* ================= 4. PHILOSOPHY ================= */}
        <section id="philosophy" className="scroll-mt-24 w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 flex flex-col gap-14 bg-[#F6EDDC]">
          {/* Label Row */}
          <div className="w-full flex items-center justify-between border-b border-[#D8C7AC] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-[11.5px] font-semibold text-[#CE522A] tracking-[1.4px]">01</span>
              <span className="w-[26px] h-[1px] bg-[#D8C7AC]" />
              <span className="text-[11.5px] font-semibold text-[#6A5747] tracking-[1.6px] uppercase">
                {lang === "EN" ? "THE CONCEPT" : "コンセプト"}
              </span>
            </div>
            <span className="hidden sm:inline-block font-serif italic text-[13px] text-[#6A5747]">
              {lang === "EN" ? "A coffee cupboard, not a coffee chain." : "チェーン店ではなく、街の小さな珈琲戸棚。"}
            </span>
          </div>

          {/* Statement Row */}
          <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
              <p className="text-[14.5px] leading-[25px] text-[#6A5747]">
                {lang === "EN"
                  ? "Lemari means cupboard. Ours holds seventeen Indonesian farms, a 1970s Probat, and one very stubborn idea: that a cup of coffee should taste of the place it grew."
                  : "「Lemari（ルマリ）」はインドネシア語で戸棚。17箇所の単一農園、1970年代のプロバット焙煎機、そして「その土地の風土がそのまま香る一杯」という確かな情熱をしまっています。"}
              </p>
              <a
                href="#beans"
                className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#241A12] tracking-[0.4px] hover:text-[#CE522A] transition-colors group"
              >
                <span>{lang === "EN" ? "Read our sourcing notes" : "農園との直接対話を見る"}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <h2 className="font-serif text-[32px] sm:text-[40px] md:text-[46px] leading-[1.18] tracking-[-0.8px] text-[#241A12] font-normal">
                {lang === "EN"
                  ? "We bring the islands to the neighbourhood — one harvest, one roast, one cup at a time."
                  : "島々の香りを街の日常へ — 収穫から焙煎、最後の一滴まで。"}
              </h2>
              <p className="text-[15px] sm:text-[15.5px] leading-[26px] text-[#6A5747] max-w-[620px]">
                {lang === "EN"
                  ? "No blends hidden behind milk. Every bag is traceable to a single family plot, bought above market rate, and roasted the week you drink it."
                  : "ミルクでごまかすブレンドはありません。すべての豆がどの家族の畑で実ったか辿ることができ、フェアな価格で直接買い付け、飲む週に焙煎します。"}
              </p>
            </div>
          </div>

          {/* Principles 3 columns */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 border-t border-[#D8C7AC] pt-8">
            <div className="flex flex-col gap-3">
              <span className="font-serif italic text-[13px] text-[#CE522A]">i.</span>
              <h3 className="font-serif text-[21px] font-medium text-[#241A12]">
                {lang === "EN" ? "Direct trade, always" : "常にダイレクトトレード"}
              </h3>
              <p className="text-[13.5px] leading-[22px] text-[#6A5747]">
                {lang === "EN"
                  ? "We buy from eleven family plots across Sumatra, Sulawesi, Flores and Java — with the price agreed before harvest, not after."
                  : "スマトラ、スラウェシ、フローレス、ジャワの家族経営農園から、収穫前に適正価格を約束して買い付けています。"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-serif italic text-[13px] text-[#CE522A]">ii.</span>
              <h3 className="font-serif text-[21px] font-medium text-[#241A12]">
                {lang === "EN" ? "Roasted in Tokyo" : "中目黒で少量焙煎"}
              </h3>
              <p className="text-[13.5px] leading-[22px] text-[#6A5747]">
                {lang === "EN"
                  ? "Small 12kg batches on a restored Probat, profiled for filter first. Nothing is kept longer than three weeks."
                  : "レストアした12kgのプロバット焙煎機でハンドドリップに最適化。焙煎後3週間以内の新鮮な豆だけを提供します。"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-serif italic text-[13px] text-[#CE522A]">iii.</span>
              <h3 className="font-serif text-[21px] font-medium text-[#241A12]">
                {lang === "EN" ? "A room to linger in" : "ゆっくり佇むための空間"}
              </h3>
              <p className="text-[13.5px] leading-[22px] text-[#6A5747]">
                {lang === "EN"
                  ? "Teak shelves, terracotta tiles, thirty-two seats. No wifi password on the wall — talk to the person next to you."
                  : "チーク材の棚、テラコッタタイル、32席の温もり。Wi-Fiの壁紙はありません。隣の人や本との時間を楽しんでください。"}
              </p>
            </div>
          </div>
        </section>

        {/* ================= 5. FEATURED BEANS ================= */}
        <section id="beans" className="scroll-mt-24 w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#E8D8BF] flex flex-col gap-10">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#CE522A] tracking-[1.4px]">02</span>
                <span className="w-[26px] h-[1px] bg-[#C2AE90]" />
                <span className="text-[11.5px] font-semibold text-[#6A5747] tracking-[1.6px] uppercase">
                  {lang === "EN" ? "FEATURED BEANS & ORIGINS" : "今月の単一農園豆"}
                </span>
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#241A12] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "This month, from the archipelago." : "今月届いた、島々の収穫。"}
              </h2>
            </div>
            <a
              href="#shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#241A12] text-[12.5px] font-semibold tracking-[0.5px] text-[#241A12] hover:bg-[#241A12] hover:text-[#FCF7ED] transition-all"
            >
              <span>{lang === "EN" ? "Shop all lots" : "全ロットを見る"}</span>
              <span>↗</span>
            </a>
          </div>

          {/* Bean Grid (3 items) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bean 1: Aceh Gayo */}
            <div className="bg-[#FCF7ED] rounded-[4px] overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="relative w-full h-[260px] overflow-hidden">
                  <Image
                    src="/assets/revamp/bean-gayo.jpg"
                    alt="Aceh Gayo Indonesian coffee beans"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#F2C24E] text-[#241A12] text-[10px] font-bold tracking-[1.3px] px-2.5 py-1 rounded-[2px]">
                    {lang === "EN" ? "NEW HARVEST" : "新豆入荷"}
                  </span>
                </div>
                <div className="p-6 sm:p-7 flex flex-col gap-3.5">
                  <span className="text-[10.5px] font-semibold tracking-[1.4px] text-[#CE522A] uppercase">
                    SUMATRA · 1,400–1,600 M
                  </span>
                  <h3 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#241A12]">
                    Aceh Gayo
                  </h3>
                  <span className="text-[12.5px] text-[#6A5747]">
                    {lang === "EN" ? "Wet-hulled process (Giling Basah)" : "スマトラ式精製（ギリン・バサ）"}
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Cedar", "Dark chocolate", "Brown sugar"].map((note) => (
                      <span key={note} className="bg-[#E8D8BF] text-[#241A12] text-[11px] px-2.5 py-1 rounded-full">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 sm:px-7 py-4 border-t border-[#E4D5BC] flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#241A12]">¥2,400 / 250g</span>
                <button
                  onClick={() =>
                    handleAddToCart({
                      id: "bean-gayo",
                      name: "Aceh Gayo (250g)",
                      price: 2400,
                      priceFormatted: "¥2,400",
                      image: "/assets/revamp/bean-gayo.jpg",
                      detail: "Sumatra · Wet-hulled",
                    })
                  }
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-[#CE522A] hover:text-[#241A12] active:scale-95 transition-colors"
                >
                  <span>{lang === "EN" ? "Add" : "カートへ"}</span>
                  <span className="text-base font-bold leading-none">+</span>
                </button>
              </div>
            </div>

            {/* Bean 2: Toraja Sulawesi */}
            <div className="bg-[#FCF7ED] rounded-[4px] overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="relative w-full h-[260px] overflow-hidden">
                  <Image
                    src="/assets/revamp/bean-toraja.jpg"
                    alt="Toraja Sulawesi coffee harvest"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-7 flex flex-col gap-3.5">
                  <span className="text-[10.5px] font-semibold tracking-[1.4px] text-[#CE522A] uppercase">
                    SULAWESI · 1,500 M
                  </span>
                  <h3 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#241A12]">
                    Toraja Sulawesi
                  </h3>
                  <span className="text-[12.5px] text-[#6A5747]">
                    {lang === "EN" ? "Fully washed process" : "ウォッシュド精製"}
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Blackberry", "Clove", "Cane sugar"].map((note) => (
                      <span key={note} className="bg-[#E8D8BF] text-[#241A12] text-[11px] px-2.5 py-1 rounded-full">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 sm:px-7 py-4 border-t border-[#E4D5BC] flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#241A12]">¥2,600 / 250g</span>
                <button
                  onClick={() =>
                    handleAddToCart({
                      id: "bean-toraja",
                      name: "Toraja Sulawesi (250g)",
                      price: 2600,
                      priceFormatted: "¥2,600",
                      image: "/assets/revamp/bean-toraja.jpg",
                      detail: "Sulawesi · Fully washed",
                    })
                  }
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-[#CE522A] hover:text-[#241A12] active:scale-95 transition-colors"
                >
                  <span>{lang === "EN" ? "Add" : "カートへ"}</span>
                  <span className="text-base font-bold leading-none">+</span>
                </button>
              </div>
            </div>

            {/* Bean 3: Bajawa Flores */}
            <div className="bg-[#FCF7ED] rounded-[4px] overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <div className="relative w-full h-[260px] overflow-hidden">
                  <Image
                    src="/assets/revamp/bean-flores.jpg"
                    alt="Bajawa Flores natural process single lot coffee"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#F2C24E] text-[#241A12] text-[10px] font-bold tracking-[1.3px] px-2.5 py-1 rounded-[2px]">
                    {lang === "EN" ? "SMALL LOT" : "マイクロロット"}
                  </span>
                </div>
                <div className="p-6 sm:p-7 flex flex-col gap-3.5">
                  <span className="text-[10.5px] font-semibold tracking-[1.4px] text-[#CE522A] uppercase">
                    FLORES · 1,300 M
                  </span>
                  <h3 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#241A12]">
                    Bajawa Flores
                  </h3>
                  <span className="text-[12.5px] text-[#6A5747]">
                    {lang === "EN" ? "Natural sun-dried process" : "ナチュラル天日乾燥精製"}
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Jackfruit", "Cacao nib", "Honey"].map((note) => (
                      <span key={note} className="bg-[#E8D8BF] text-[#241A12] text-[11px] px-2.5 py-1 rounded-full">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 sm:px-7 py-4 border-t border-[#E4D5BC] flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#241A12]">¥2,800 / 250g</span>
                <button
                  onClick={() =>
                    handleAddToCart({
                      id: "bean-flores",
                      name: "Bajawa Flores (250g)",
                      price: 2800,
                      priceFormatted: "¥2,800",
                      image: "/assets/revamp/bean-flores.jpg",
                      detail: "Flores · Natural process",
                    })
                  }
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-[#CE522A] hover:text-[#241A12] active:scale-95 transition-colors"
                >
                  <span>{lang === "EN" ? "Add" : "カートへ"}</span>
                  <span className="text-base font-bold leading-none">+</span>
                </button>
              </div>
            </div>
          </div>

          {/* Also On Shelf */}
          <div className="w-full flex flex-wrap items-center gap-3 sm:gap-4 border-t border-[#C9B79A] pt-4 text-xs">
            <span className="text-[10.5px] font-semibold tracking-[1.4px] text-[#6A5747] uppercase">
              {lang === "EN" ? "ALSO ON THE SHELF" : "その他の取り扱い豆"}
            </span>
            <span className="font-serif italic text-[15px] text-[#241A12]">Java Preanger</span>
            <span className="w-1 h-1 rounded-full bg-[#B8A385]" />
            <span className="font-serif italic text-[15px] text-[#241A12]">Bali Kintamani</span>
            <span className="w-1 h-1 rounded-full bg-[#B8A385]" />
            <span className="font-serif italic text-[15px] text-[#241A12]">Papua Wamena</span>
            <span className="w-1 h-1 rounded-full bg-[#B8A385]" />
            <span className="font-serif italic text-[15px] text-[#241A12]">Sumbawa Tambora</span>
          </div>
        </section>

        {/* ================= 6. SIGNATURE MENU ================= */}
        <section id="menu" className="scroll-mt-24 w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#1D1610] text-[#F6EDDC] flex flex-col gap-12">
          {/* Menu Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#352A20] pb-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#F2C24E] tracking-[1.4px]">03</span>
                <span className="w-[26px] h-[1px] bg-[#4A3B2E]" />
                <span className="text-[11.5px] font-semibold text-[#A8957F] tracking-[1.6px] uppercase">
                  {lang === "EN" ? "SIGNATURE MENU" : "カフェメニュー"}
                </span>
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#F6EDDC] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "What we actually pour." : "カウンターで淹れる一杯。"}
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-2">
              <span className="text-[12.5px] text-[#A8957F] max-w-[320px] sm:text-right">
                {lang === "EN"
                  ? "Prices include tax. Oat, soy and rice milk +¥80. Every filter is brewed to order."
                  : "価格はすべて税込。オーツ・ソイ・ライスミルク変更 +¥80。ドリップは注文毎に抽出します。"}
              </span>
              {/* Category tabs */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setMenuFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    menuFilter === "all" ? "bg-[#CE522A] text-white" : "text-[#A8957F] hover:text-white"
                  }`}
                >
                  {lang === "EN" ? "All" : "すべて"}
                </button>
                <button
                  onClick={() => setMenuFilter("coffee")}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    menuFilter === "coffee" ? "bg-[#CE522A] text-white" : "text-[#A8957F] hover:text-white"
                  }`}
                >
                  {lang === "EN" ? "Coffee & Bar" : "珈琲・ドリンク"}
                </button>
                <button
                  onClick={() => setMenuFilter("kitchen")}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    menuFilter === "kitchen" ? "bg-[#CE522A] text-white" : "text-[#A8957F] hover:text-white"
                  }`}
                >
                  {lang === "EN" ? "House & Kitchen" : "フード・甘味"}
                </button>
              </div>
            </div>
          </div>

          {/* Menu Body */}
          <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-14 items-start">
            {/* Menu Photo Column */}
            <div className="w-full lg:w-[344px] shrink-0 flex flex-col gap-3">
              <div className="relative w-full h-[380px] sm:h-[470px] rounded-[4px] overflow-hidden">
                <Image
                  src="/assets/revamp/menu-pour-over.jpg"
                  alt="V60 hand pour over coffee ritual"
                  fill
                  sizes="(max-width: 1024px) 100vw, 350px"
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between items-center text-[11px] px-1 text-[#A8957F]">
                <span>V60 · 15g : 250g · 2:45</span>
                <span className="tracking-[1.2px] text-[#6E5C4A]">NO. 01</span>
              </div>
            </div>

            {/* Menu Columns */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Group 1: Coffee & Bar */}
              {(menuFilter === "all" || menuFilter === "coffee") && (
                <div className="flex flex-col">
                  <div className="flex justify-between items-center pb-3 border-b border-[#4A3B2E]">
                    <span className="text-[10.5px] font-bold tracking-[1.6px] text-[#F2C24E] uppercase">
                      {lang === "EN" ? "COFFEE & BAR" : "珈琲・ドリンク"}
                    </span>
                    <span className="text-[10.5px] text-[#6E5C4A] tracking-[1.2px]">06</span>
                  </div>
                  <div className="flex flex-col divide-y divide-[#352A20]">
                    {[
                      {
                        name: "Espresso",
                        desc: lang === "EN" ? "Single origin, 8oz" : "単一農園豆使用、濃厚な一杯",
                        price: "¥450",
                      },
                      {
                        name: "Americano",
                        desc: lang === "EN" ? "Long black over hot or iced spring water" : "エスプレッソと湧水のロングブラック（温/冷）",
                        price: "¥500",
                      },
                      {
                        name: "Café Latte",
                        desc: lang === "EN" ? "Hokkaido whole milk or oat (+¥80)" : "北海道産ミルク または オーツミルク(+¥80)",
                        price: "¥600",
                      },
                      {
                        name: "Cappuccino",
                        desc: lang === "EN" ? "Wet foam, dusted with Indonesian cocoa" : "滑らかなフォームミルク、インドネシア産ココア",
                        price: "¥600",
                      },
                      {
                        name: "V60 Pour Over",
                        desc: lang === "EN" ? "Choice of single origin from the cupboard" : "戸棚から選ぶ今月の単一農園ハンドドリップ",
                        price: "¥750",
                      },
                      {
                        name: "Tubruk",
                        desc: lang === "EN" ? "Traditional Indonesian unfiltered brew" : "伝統的なインドネシア式沈殿抽出珈琲",
                        price: "¥550",
                      },
                    ].map((item) => (
                      <div key={item.name} className="py-3.5 flex justify-between items-baseline group cursor-pointer hover:bg-white/[0.02] px-2 rounded transition-colors">
                        <div className="flex flex-col">
                          <span className="font-serif text-[17px] text-[#F6EDDC] group-hover:text-[#F2C24E] transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[11.5px] text-[#8E7C69]">{item.desc}</span>
                        </div>
                        <span className="text-[13.5px] font-medium text-[#F6EDDC]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 2: House & Kitchen */}
              {(menuFilter === "all" || menuFilter === "kitchen") && (
                <div className="flex flex-col">
                  <div className="flex justify-between items-center pb-3 border-b border-[#4A3B2E]">
                    <span className="text-[10.5px] font-bold tracking-[1.6px] text-[#F2C24E] uppercase">
                      {lang === "EN" ? "HOUSE & KITCHEN" : "フード・甘味"}
                    </span>
                    <span className="text-[10.5px] text-[#6E5C4A] tracking-[1.2px]">06</span>
                  </div>
                  <div className="flex flex-col divide-y divide-[#352A20]">
                    {[
                      {
                        name: "Kopi Susu Gula Aren",
                        desc: lang === "EN" ? "House espresso, organic palm sugar, milk" : "自家製エスプレッソ、天然椰子糖、ミルク",
                        price: "¥680",
                      },
                      {
                        name: "Es Kopi Lemari",
                        desc: lang === "EN" ? "Iced shaken espresso with pandan hint" : "シェイクエスプレッソ、パンダン香る爽快感",
                        price: "¥700",
                      },
                      {
                        name: "Klepon Latte",
                        desc: lang === "EN" ? "Pandan, toasted coconut, gula aren drizzle" : "パンダン、香ばしいココナッツ、パームシュガー",
                        price: "¥720",
                      },
                      {
                        name: "Roti Bakar Srikaya",
                        desc: lang === "EN" ? "Toasted brioche, coconut egg jam, sea salt butter" : "焼きたてブリオッシュ、カヤジャムと塩バター",
                        price: "¥650",
                      },
                      {
                        name: "Pisang Goreng",
                        desc: lang === "EN" ? "Fried caramelized banana, palm honey" : "揚げバナナのキャラメリゼ、パームハニー添え",
                        price: "¥580",
                      },
                      {
                        name: "Kue Lumpur",
                        desc: lang === "EN" ? "Warm potato coconut cake, young coconut slice" : "温かいココナッツポテトケーキ",
                        price: "¥520",
                      },
                    ].map((item) => (
                      <div key={item.name} className="py-3.5 flex justify-between items-baseline group cursor-pointer hover:bg-white/[0.02] px-2 rounded transition-colors">
                        <div className="flex flex-col">
                          <span className="font-serif text-[17px] text-[#F6EDDC] group-hover:text-[#F2C24E] transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[11.5px] text-[#8E7C69]">{item.desc}</span>
                        </div>
                        <span className="text-[13.5px] font-medium text-[#F6EDDC]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= 7. THE SPACE ================= */}
        <section id="space" className="scroll-mt-24 w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#F6EDDC] flex flex-col gap-10">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#CE522A] tracking-[1.4px]">04</span>
                <span className="w-[26px] h-[1px] bg-[#D8C7AC]" />
                <span className="text-[11.5px] font-semibold text-[#6A5747] tracking-[1.6px] uppercase">
                  {lang === "EN" ? "THE SPACE" : "空間・店舗"}
                </span>
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#241A12] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "A room that asks you to stay." : "心ゆくまで過ごせる場所。"}
              </h2>
            </div>
            <span className="text-[12.5px] text-[#6A5747] max-w-[320px] sm:text-right">
              {lang === "EN"
                ? "Built inside a 1960s timber house, five minutes from Nakameguro station. No music above a murmur."
                : "中目黒駅から徒歩5分、1960年代の木造古民家を改装。心地よい囁きのような音量で音楽が流れます。"}
            </span>
          </div>

          {/* Gallery */}
          <div className="w-full flex flex-col lg:flex-row gap-4 h-auto lg:h-[560px]">
            {/* Interior image */}
            <div className="relative w-full lg:w-[648px] h-[340px] sm:h-[420px] lg:h-full rounded-[4px] overflow-hidden group">
              <Image
                src="/assets/revamp/space-interior.jpg"
                alt="Lemari Coffee timber interior and tables"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Gallery Right */}
            <div className="flex-1 flex flex-col sm:flex-row lg:flex-col gap-4">
              <div className="relative w-full sm:w-1/2 lg:w-full h-[240px] sm:h-[268px] rounded-[4px] overflow-hidden group">
                <Image
                  src="/assets/revamp/space-counter.jpg"
                  alt="Barista brewing coffee at the counter"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Room Card */}
              <div className="w-full sm:w-1/2 lg:w-full flex-1 bg-[#CE522A] p-6 sm:p-7 rounded-[4px] text-[#F6EDDC] flex flex-col justify-between gap-5">
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10.5px] font-bold tracking-[1.6px] text-[#F6C9B6] uppercase">
                    {lang === "EN" ? "THE ROOM" : "店内の様子"}
                  </span>
                  <p className="text-[13px] leading-[21px] text-[#F6EDDC]">
                    {lang === "EN"
                      ? "Teak shelving by a Nakameguro carpenter. Terracotta from Aichi. One restored Probat sitting where the till should be."
                      : "中目黒の家具職人によるチーク棚、愛知県産のテラコッタ。レジ横にはレストアされたプロバット焙煎機が佇みます。"}
                  </p>
                </div>
                <div className="flex items-center gap-5 pt-2">
                  <div className="flex flex-col">
                    <span className="font-serif text-[26px] leading-none">32</span>
                    <span className="text-[10.5px] text-[#F6C9B6] tracking-[0.6px]">
                      {lang === "EN" ? "seats inside" : "店内席数"}
                    </span>
                  </div>
                  <span className="w-[1px] h-[34px] bg-[#E07E56]" />
                  <div className="flex flex-col">
                    <span className="font-serif text-[26px] leading-none">6</span>
                    <span className="text-[10.5px] text-[#F6C9B6] tracking-[0.6px]">
                      {lang === "EN" ? "on the terrace" : "テラス席"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Facts bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 border-t border-[#D8C7AC] pt-5 text-[12px] text-[#6A5747]">
            {[
              lang === "EN" ? "Open daily 8:00 – 19:00" : "営業時間 8:00 – 19:00",
              lang === "EN" ? "Counter seating for 8" : "カウンター8席",
              lang === "EN" ? "Long share table for 12" : "大テーブル12席",
              lang === "EN" ? "Roastery visible from the bar" : "カウンター奥に見える焙煎機",
              lang === "EN" ? "Dogs on the terrace" : "テラス席ペット同伴可",
            ].map((fact) => (
              <div key={fact} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#CE522A]" />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 8. MERCHANDISE ================= */}
        <section id="shop" className="scroll-mt-24 w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#FCF7ED] flex flex-col gap-10">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#CE522A] tracking-[1.4px]">05</span>
                <span className="w-[26px] h-[1px] bg-[#D8C7AC]" />
                <span className="text-[11.5px] font-semibold text-[#6A5747] tracking-[1.6px] uppercase">
                  {lang === "EN" ? "MERCHANDISE & RETAIL" : "オリジナルグッズ"}
                </span>
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#241A12] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "Take a little of the cupboard home." : "ご家庭でもルマリの味わいを。"}
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#241A12] text-[#F6EDDC] text-[12.5px] font-semibold tracking-[0.5px] hover:bg-[#CE522A] transition-colors"
            >
              <span>{lang === "EN" ? "View shopping bag" : "買い物かごを見る"}</span>
              <span>({totalItemsCount})</span>
            </button>
          </div>

          {/* Product Grid (4 items) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product 1: House Blend */}
            <div className="flex flex-col gap-3.5 group">
              <div className="relative w-full h-[300px] rounded-[4px] overflow-hidden bg-stone-200">
                <Image
                  src="/assets/revamp/product-house-blend.jpg"
                  alt="Lemari Coffee House Blend Canister"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#1D1610] text-[#F6EDDC] text-[9.5px] font-bold tracking-[1.2px] px-2.5 py-1 rounded-[2px]">
                  {lang === "EN" ? "BESTSELLER" : "人気No.1"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-serif text-[18px] font-medium text-[#241A12]">House Blend</span>
                  <span className="text-[11.5px] text-[#6A5747]">Sumatra · Flores · 250g</span>
                </div>
                <button
                  onClick={() =>
                    handleAddToCart({
                      id: "prod-blend",
                      name: "House Blend Tin (250g)",
                      price: 1800,
                      priceFormatted: "¥1,800",
                      image: "/assets/revamp/product-house-blend.jpg",
                      detail: "Sumatra · Flores · 250g",
                    })
                  }
                  className="text-[13px] font-semibold text-[#241A12] hover:text-[#CE522A] flex items-center gap-1 active:scale-95 transition-all"
                >
                  ¥1,800 <span className="font-bold text-[#CE522A]">+</span>
                </button>
              </div>
            </div>

            {/* Product 2: Tumbler */}
            <div className="flex flex-col gap-3.5 group">
              <div className="relative w-full h-[300px] rounded-[4px] overflow-hidden bg-stone-200">
                <Image
                  src="/assets/revamp/product-tumbler.jpg"
                  alt="Lemari Double Wall Tumbler"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-serif text-[18px] font-medium text-[#241A12]">Lemari Tumbler</span>
                  <span className="text-[11.5px] text-[#6A5747]">350 ml · double wall</span>
                </div>
                <button
                  onClick={() =>
                    handleAddToCart({
                      id: "prod-tumbler",
                      name: "Lemari Tumbler",
                      price: 3400,
                      priceFormatted: "¥3,400",
                      image: "/assets/revamp/product-tumbler.jpg",
                      detail: "350 ml · Double Wall Stainless",
                    })
                  }
                  className="text-[13px] font-semibold text-[#241A12] hover:text-[#CE522A] flex items-center gap-1 active:scale-95 transition-all"
                >
                  ¥3,400 <span className="font-bold text-[#CE522A]">+</span>
                </button>
              </div>
            </div>

            {/* Product 3: Bean Club Box */}
            <div className="flex flex-col gap-3.5 group">
              <div className="relative w-full h-[300px] rounded-[4px] overflow-hidden bg-stone-200">
                <Image
                  src="/assets/revamp/product-bean-box.jpg"
                  alt="Lemari Bean Club Box subscription"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-serif text-[18px] font-medium text-[#241A12]">Bean Club Box</span>
                  <span className="text-[11.5px] text-[#6A5747]">Two lots · 250 g each</span>
                </div>
                <button
                  onClick={() =>
                    handleAddToCart({
                      id: "prod-box",
                      name: "Bean Club Box",
                      price: 3200,
                      priceFormatted: "¥3,200",
                      image: "/assets/revamp/product-bean-box.jpg",
                      detail: "Two Seasonal Micro-Lots",
                    })
                  }
                  className="text-[13px] font-semibold text-[#241A12] hover:text-[#CE522A] flex items-center gap-1 active:scale-95 transition-all"
                >
                  ¥3,200 <span className="font-bold text-[#CE522A]">+</span>
                </button>
              </div>
            </div>

            {/* Product 4: Kasama Cup */}
            <div className="flex flex-col gap-3.5 group">
              <div className="relative w-full h-[300px] rounded-[4px] overflow-hidden bg-stone-200">
                <Image
                  src="/assets/revamp/product-kasama-cup.jpg"
                  alt="Handcrafted ceramic Kasama Cup"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#1D1610] text-[#F6EDDC] text-[9.5px] font-bold tracking-[1.2px] px-2.5 py-1 rounded-[2px]">
                  {lang === "EN" ? "LIMITED" : "数量限定"}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-serif text-[18px] font-medium text-[#241A12]">Kasama Cup</span>
                  <span className="text-[11.5px] text-[#6A5747]">180 ml · stoneware</span>
                </div>
                <button
                  onClick={() =>
                    handleAddToCart({
                      id: "prod-cup",
                      name: "Kasama Cup (Stoneware)",
                      price: 2900,
                      priceFormatted: "¥2,900",
                      image: "/assets/revamp/product-kasama-cup.jpg",
                      detail: "180 ml · Handcrafted Pottery",
                    })
                  }
                  className="text-[13px] font-semibold text-[#241A12] hover:text-[#CE522A] flex items-center gap-1 active:scale-95 transition-all"
                >
                  ¥2,900 <span className="font-bold text-[#CE522A]">+</span>
                </button>
              </div>
            </div>
          </div>

          {/* Shipping Note */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-[#D8C7AC] pt-5 text-[12.5px] text-[#6A5747]">
            <div className="flex items-center gap-2.5">
              <span className="text-[#CE522A] font-bold">🚚</span>
              <span>
                {lang === "EN"
                  ? "Ships across Japan in 2–3 days. Free over ¥5,000. In-store pickup in Nakameguro."
                  : "全国へ2〜3日でお届け。5,000円以上で送料無料。中目黒店での受取も可能。"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="font-serif italic text-[13px] text-[#241A12] hover:text-[#CE522A] transition-colors"
            >
              {lang === "EN" ? "Bean subscription from ¥1,600 / month →" : "定期便 毎月¥1,600〜 →"}
            </button>
          </div>
        </section>

        {/* ================= 9. SOCIAL PROOF ================= */}
        <section className="w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#E8D8BF] flex flex-col gap-12">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#CE522A] tracking-[1.4px]">06</span>
                <span className="w-[26px] h-[1px] bg-[#C2AE90]" />
                <span className="text-[11.5px] font-semibold text-[#6A5747] tracking-[1.6px] uppercase">
                  {lang === "EN" ? "SOCIAL PROOF" : "お客様の声"}
                </span>
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#241A12] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "Word of mouth, mostly in Japanese." : "愛され続ける、日々の評判。"}
              </h2>
            </div>
            <a
              href="#locator"
              className="text-[12.5px] font-semibold tracking-[0.4px] text-[#241A12] hover:text-[#CE522A] transition-colors flex items-center gap-1.5"
            >
              <span>{lang === "EN" ? "1,240 reviews on Google & Tabelog" : "Google・食べログで1,240件以上の高評価"}</span>
              <span>↗</span>
            </a>
          </div>

          {/* Proof Body */}
          <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-14 items-start">
            {/* Score column */}
            <div className="w-full lg:w-[370px] shrink-0 flex flex-col gap-4">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-[68px] sm:text-[76px] leading-none text-[#241A12] font-normal tracking-[-2px]">
                  4.9
                </span>
                <span className="font-serif italic text-[20px] text-[#6A5747]">/ 5</span>
              </div>
              <div className="flex items-center gap-1 text-[#CE522A] text-lg">
                {"★★★★★"}
              </div>
              <p className="text-[12.5px] leading-[20px] text-[#6A5747]">
                {lang === "EN"
                  ? "Average across Google & Tabelog, both Nakameguro & Kiyosumi Shirakawa stores, last twelve months."
                  : "中目黒店・清澄白河店の過去12ヶ月における総合評価平均。"}
              </p>
              <div className="border-t border-[#C2AE90] pt-5 mt-2 flex flex-col gap-3">
                <blockquote className="font-serif italic text-[20px] sm:text-[21px] leading-[29px] text-[#241A12]">
                  {lang === "EN"
                    ? "“The only cup in Tokyo that tastes like my grandmother’s kitchen in Bandung.”"
                    : "「バンドンにある祖母の台所を思い出す、東京で唯一の珈琲。」"}
                </blockquote>
                <span className="text-[10.5px] font-semibold tracking-[1.4px] text-[#6A5747] uppercase">
                  AYU W. · BANDUNG
                </span>
              </div>
            </div>

            {/* Reviews column */}
            <div className="flex-1 w-full flex flex-col divide-y divide-[#C2AE90]">
              <div className="py-5 flex flex-col gap-3">
                <div className="flex items-center gap-1 text-[#CE522A] text-xs">
                  {"★★★★★"}
                </div>
                <p className="text-[15px] leading-[25px] text-[#241A12]">
                  {lang === "EN"
                    ? "“I came for a flat white and stayed three hours reading. Nobody rushed me. The Sulawesi filter is the best I have had in this city.”"
                    : "「フラットホワイトを頼んで読書しながら3時間。誰も急かさず温かい空間。スラウェシのドリップは都内随一の美味しさです。」"}
                </p>
                <div className="flex items-center gap-2.5 text-xs text-[#6A5747]">
                  <span className="font-semibold text-[#241A12]">Kenji Sato</span>
                  <span className="w-4 h-[1px] bg-[#B29C7C]" />
                  <span>{lang === "EN" ? "Regular since 2021 · Tokyo" : "常連歴2021年〜 · 東京都"}</span>
                </div>
              </div>

              <div className="py-5 flex flex-col gap-3">
                <div className="flex items-center gap-1 text-[#CE522A] text-xs">
                  {"★★★★★"}
                </div>
                <p className="text-[15px] leading-[25px] text-[#241A12]">
                  {lang === "EN"
                    ? "“It smells like my mother’s kitchen the moment you open the door. Kopi susu with gula aren, exactly right — not too sweet.”"
                    : "「扉を開けた瞬間、母の台所の懐かしい香りがしました。椰子糖を使ったコピ・ススは甘すぎず本場の味。」"}
                </p>
                <div className="flex items-center gap-2.5 text-xs text-[#6A5747]">
                  <span className="font-semibold text-[#241A12]">Dewi Lestari</span>
                  <span className="w-4 h-[1px] bg-[#B29C7C]" />
                  <span>{lang === "EN" ? "Jakarta · visited in April" : "ジャカルタより来日 · 4月来店"}</span>
                </div>
              </div>

              <div className="py-5 flex flex-col gap-3">
                <div className="flex items-center gap-1 text-[#CE522A] text-xs">
                  {"★★★★★"}
                </div>
                <p className="text-[15px] leading-[25px] text-[#241A12]">
                  {lang === "EN"
                    ? "“A serious roastery hiding behind a very modest façade. Ask the barista about the Flores lot and clear your afternoon.”"
                    : "「控えめな店構えの奥にある本格派ロースタリー。バリスタにフローレスのロットについて尋ねてみてください。」"}
                </p>
                <div className="flex items-center gap-2.5 text-xs text-[#6A5747]">
                  <span className="font-semibold text-[#241A12]">Monocle Magazine</span>
                  <span className="w-4 h-[1px] bg-[#B29C7C]" />
                  <span>Coffee Issue, 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Press Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-6 border-t border-[#C2AE90] pt-6">
            <span className="text-[10px] font-bold tracking-[1.6px] text-[#6A5747] uppercase">
              {lang === "EN" ? "AS SEEN IN" : "掲載メディア"}
            </span>
            {["MONOCLE", "KINFOLK", "&Premium", "TIME OUT TOKYO", "STANDART"].map((press) => (
              <span
                key={press}
                className="font-serif text-[16px] sm:text-[17px] font-medium tracking-[1.2px] text-[#241A12]/80 hover:text-[#241A12] transition-colors"
              >
                {press}
              </span>
            ))}
          </div>
        </section>

        {/* ================= 10. STORE LOCATOR ================= */}
        <section id="locator" className="scroll-mt-24 w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#1D1610] text-[#F6EDDC] flex flex-col gap-10">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#F2C24E] tracking-[1.4px]">07</span>
                <span className="w-[26px] h-[1px] bg-[#4A3B2E]" />
                <span className="text-[11.5px] font-semibold text-[#A8957F] tracking-[1.6px] uppercase">
                  {lang === "EN" ? "STORE LOCATOR" : "店舗案内"}
                </span>
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#F6EDDC] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "Two doors, both in Tokyo." : "都内2店舗、それぞれの空間で。"}
              </h2>
            </div>
            <a
              href="https://maps.google.com/?q=Kamimeguro+Tokyo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#5A4734] text-[12.5px] font-semibold tracking-[0.5px] text-[#F6EDDC] hover:border-[#F2C24E] hover:text-[#F2C24E] transition-all"
            >
              <span>{lang === "EN" ? "Open in maps" : "Googleマップで開く"}</span>
              <span>↗</span>
            </a>
          </div>

          {/* Stores 2 cols */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store 1: Nakameguro */}
            <div className="bg-[#251C15] rounded-[4px] overflow-hidden flex flex-col group border border-[#3B2E23]">
              <div className="relative w-full h-[230px] sm:h-[240px]">
                <Image
                  src="/assets/revamp/store-nakameguro.jpg"
                  alt="Lemari Coffee Nakameguro Tokyo storefront"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3.5 left-3.5 bg-[#F2C24E] text-[#241A12] text-[9.5px] font-bold tracking-[1.3px] px-2.5 py-1 rounded-[2px]">
                  {lang === "EN" ? "THE ORIGINAL" : "1号店・本店"}
                </span>
              </div>
              <div className="p-6 sm:p-7 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#F6EDDC]">
                    {lang === "EN" ? "Nakameguro" : "中目黒本店"}
                  </h3>
                  <a
                    href="https://maps.google.com/?q=2-14-6+Kamimeguro+Meguro-ku+Tokyo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F2C24E] text-base hover:scale-110 transition-transform"
                    title="Directions to Nakameguro"
                  >
                    ↗
                  </a>
                </div>
                <div className="text-[12.5px] leading-[20px] text-[#A8957F]">
                  <p>2-14-6 Kamimeguro, Meguro-ku</p>
                  <p>Tokyo 153-0051, Japan</p>
                </div>
                <div className="border-t border-[#3B2E23] pt-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7FB069]" />
                    <span className="text-[#F6EDDC]">{lang === "EN" ? "Daily 8:00 – 19:00" : "毎日 8:00 – 19:00"}</span>
                  </div>
                  <span className="text-[#8E7C69]">{lang === "EN" ? "7 min · Nakameguro Stn (Hibiya / Tokyu)" : "中目黒駅 徒歩7分"}</span>
                </div>
              </div>
            </div>

            {/* Store 2: Kiyosumi Shirakawa */}
            <div className="bg-[#251C15] rounded-[4px] overflow-hidden flex flex-col group border border-[#3B2E23]">
              <div className="relative w-full h-[230px] sm:h-[240px]">
                <Image
                  src="/assets/revamp/store-kiyosumi.jpg"
                  alt="Lemari Coffee Kiyosumi Shirakawa roastery bar"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3.5 left-3.5 bg-[#F2C24E] text-[#241A12] text-[9.5px] font-bold tracking-[1.3px] px-2.5 py-1 rounded-[2px]">
                  {lang === "EN" ? "ROASTERY BAR" : "ロースタリーバー"}
                </span>
              </div>
              <div className="p-6 sm:p-7 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-[24px] sm:text-[26px] font-medium text-[#F6EDDC]">
                    {lang === "EN" ? "Kiyosumi Shirakawa" : "清澄白河店"}
                  </h3>
                  <a
                    href="https://maps.google.com/?q=3-1-8+Shirakawa+Koto-ku+Tokyo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F2C24E] text-base hover:scale-110 transition-transform"
                    title="Directions to Kiyosumi Shirakawa"
                  >
                    ↗
                  </a>
                </div>
                <div className="text-[12.5px] leading-[20px] text-[#A8957F]">
                  <p>3-1-8 Shirakawa, Koto-ku</p>
                  <p>Tokyo 135-0021, Japan</p>
                </div>
                <div className="border-t border-[#3B2E23] pt-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7FB069]" />
                    <span className="text-[#F6EDDC]">{lang === "EN" ? "Tue – Sun 9:00 – 18:00" : "火〜日 9:00 – 18:00"}</span>
                  </div>
                  <span className="text-[#8E7C69]">{lang === "EN" ? "4 min · Kiyosumi-shirakawa Stn" : "清澄白河駅 徒歩4分"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Band */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-[#4A3B2E] pt-5 text-[12.5px] text-[#A8957F]">
            <p>
              {lang === "EN"
                ? "Order online, pick up at the roastery in Meguro — Tuesday to Saturday, 10:00 to 17:00."
                : "オンラインで注文し、目黒ロースタリーで受取可能 — 火曜〜土曜 10:00〜17:00"}
            </p>
            <button
              onClick={() => setIsVisitModalOpen(true)}
              className="font-semibold text-[#F6EDDC] hover:text-[#F2C24E] transition-colors flex items-center gap-1.5"
            >
              <span>{lang === "EN" ? "Wholesale & private hire" : "豆の卸売り・店舗貸切について"}</span>
              <span>→</span>
            </button>
          </div>
        </section>

        {/* ================= 11. FOOTER ================= */}
        <footer className="w-full px-5 sm:px-8 md:px-14 pt-16 md:pt-20 pb-8 bg-[#F2C24E] text-[#241A12] flex flex-col gap-12">
          {/* Footer Top */}
          <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-12">
            {/* Newsletter Column */}
            <div className="w-full lg:w-[440px] flex flex-col gap-3.5">
              <span className="text-[10.5px] font-bold tracking-[1.6px] text-[#6B4A1F] uppercase">
                {lang === "EN" ? "LETTERS FROM THE CUPBOARD" : "ルマリからのお便り"}
              </span>
              <h3 className="font-serif text-[26px] sm:text-[28px] leading-[34px] tracking-[-0.4px] text-[#241A12]">
                {lang === "EN" ? "One letter a month, always about coffee." : "月に一度、コーヒーの話だけを届けるニュースレター。"}
              </h3>
              <p className="text-[12.5px] leading-[20px] text-[#4A3418]">
                {lang === "EN"
                  ? "New harvests, roasting notes and the occasional shop holiday. No noise."
                  : "新しい収穫、焙煎の記録、時折の店休日のお知らせ。不要な宣伝はありません。"}
              </p>

              {newsletterSubscribed ? (
                <div className="bg-[#241A12] text-[#F6EDDC] px-5 py-3 rounded-full text-xs font-medium">
                  {lang === "EN"
                    ? "✓ Thank you. You are on the list for our next monthly harvest letter."
                    : "✓ ご登録ありがとうございます。次回の月刊便りをお届けします。"}
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex items-center border border-[#241A12] rounded-full p-1.5 pl-5 bg-transparent max-w-[400px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={lang === "EN" ? "your@email.com" : "メールアドレスを入力"}
                    className="flex-1 bg-transparent text-[13px] text-[#241A12] placeholder-[#6B4A1F] focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="w-10 h-10 rounded-full bg-[#241A12] text-[#F2C24E] flex items-center justify-center hover:bg-[#CE522A] active:scale-95 transition-colors"
                  >
                    →
                  </button>
                </form>
              )}
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-14 text-[12.5px]">
              <div className="flex flex-col gap-2.5">
                <span className="text-[10.5px] font-bold tracking-[1.5px] text-[#6B4A1F] uppercase">{lang === "EN" ? "SHOP" : "ショップ"}</span>
                <a href="#beans" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Single origin" : "シングルオリジン"}</a>
                <a href="#shop" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Subscriptions" : "定期便"}</a>
                <a href="#shop" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Merchandise" : "グッズ・器具"}</a>
                <a href="#shop" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Gift cards" : "ギフトカード"}</a>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[10.5px] font-bold tracking-[1.5px] text-[#6B4A1F] uppercase">{lang === "EN" ? "VISIT" : "店舗情報"}</span>
                <a href="#locator" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Nakameguro" : "中目黒店"}</a>
                <a href="#locator" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Kiyosumi Shirakawa" : "清澄白河店"}</a>
                <button onClick={() => setIsVisitModalOpen(true)} className="text-left hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Wholesale" : "豆の卸売り"}</button>
                <button onClick={() => setIsVisitModalOpen(true)} className="text-left hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Private hire" : "店舗貸切"}</button>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[10.5px] font-bold tracking-[1.5px] text-[#6B4A1F] uppercase">{lang === "EN" ? "COMPANY" : "企業情報"}</span>
                <a href="#philosophy" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Our story" : "ブランドの歩み"}</a>
                <a href="#beans" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Sourcing" : "農園との直接対話"}</a>
                <a href="#philosophy" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Journal" : "ジャーナル"}</a>
                <a href="#locator" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Careers" : "採用情報"}</a>
              </div>
            </div>
          </div>

          {/* Wordmark Row */}
          <div className="w-full border-t border-[#241A12] pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <span className="font-serif text-[56px] sm:text-[84px] md:text-[112px] leading-[0.88] font-medium tracking-[-3px] text-[#241A12] select-none">
              LEMARI COFFEE
            </span>
            <div className="flex flex-col md:items-end gap-2 pb-2 text-[11.5px]">
              <span className="text-[#4A3418]">Est. 2019 · Nakameguro, Tokyo</span>
              <div className="flex items-center gap-4 font-semibold text-[#241A12]">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#CE522A]">Instagram</a>
                <a href="https://tabelog.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#CE522A]">Tabelog</a>
                <a href="https://note.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#CE522A]">Note</a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="w-full border-t border-[#241A12]/40 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11px] text-[#4A3418]">
            <span>{lang === "EN" ? "© 2025 Lemari Coffee K.K. — Coffee from Indonesia, roasted in Japan." : "© 2025 Lemari Coffee 合同会社 — インドネシア産シングルオリジン、日本国内焙煎。"}</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:underline">{lang === "EN" ? "Privacy" : "プライバシーポリシー"}</a>
              <a href="#" className="hover:underline">{lang === "EN" ? "Terms" : "利用規約"}</a>
              <a href="#" className="hover:underline">{lang === "EN" ? "Stockists" : "取扱店舗"}</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Slide-Over Shopping Bag Drawer */}
      {isCartOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCartOpen(false);
          }}
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
        >
          <div className="w-full max-w-md bg-[#F6EDDC] h-full flex flex-col justify-between shadow-2xl p-6 sm:p-8 text-[#241A12] animate-in slide-in-from-right duration-300">
            {/* Drawer Top */}
            <div>
              <div className="flex items-center justify-between border-b border-[#D8C7AC] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-medium">
                    {lang === "EN" ? "Your Cupboard" : "ショッピングバッグ"}
                  </span>
                  <span className="bg-[#CE522A] text-[#FCF7ED] text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {totalItemsCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-stone-500 hover:text-black text-xl p-1 font-bold leading-none"
                  aria-label="Close cart"
                >
                  ✕
                </button>
              </div>

              {/* Free shipping banner */}
              <div className="bg-[#E8D8BF] p-3 rounded-lg text-xs text-[#4A3418] mb-4">
                {freeShippingRemaining === 0 ? (
                  <span className="font-semibold text-emerald-800">
                    {lang === "EN" ? "✓ Free delivery unlocked across Japan!" : "✓ 日本国内送料無料が適用されました！"}
                  </span>
                ) : (
                  <span>
                    {lang === "EN" ? (
                      <>Add <strong>¥{freeShippingRemaining.toLocaleString()}</strong> more for free nationwide delivery.</>
                    ) : (
                      <>あと <strong>¥{freeShippingRemaining.toLocaleString()}</strong> のご購入で全国送料無料</>
                    )}
                  </span>
                )}
              </div>

              {/* Items List */}
              <div className="flex flex-col divide-y divide-[#D8C7AC]/70 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="py-16 text-center text-stone-500 text-sm flex flex-col items-center gap-3">
                    <span className="text-3xl">☕</span>
                    <p>{lang === "EN" ? "Your cupboard is empty." : "カートは現在空です。"}</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs font-semibold text-[#CE522A] underline"
                    >
                      {lang === "EN" ? "Explore fresh roasted lots" : "焙煎豆一覧を見る"}
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="relative w-14 h-14 rounded overflow-hidden shrink-0 bg-stone-200">
                        <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="font-serif text-[15px] font-medium leading-tight">
                          {item.name}
                        </span>
                        {item.detail && (
                          <span className="text-[11px] text-[#6A5747]">{item.detail}</span>
                        )}
                        <span className="text-xs font-semibold text-[#CE522A] mt-1">
                          {item.priceFormatted}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 border border-[#D8C7AC] rounded-full px-2 py-1 text-xs">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="text-[#6A5747] hover:text-[#241A12] px-1 font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold min-w-[12px] text-center">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="text-[#6A5747] hover:text-[#241A12] px-1 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Drawer Bottom */}
            <div className="border-t border-[#D8C7AC] pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-[#6A5747]">{lang === "EN" ? "Subtotal" : "小計"}</span>
                <span className="font-serif text-xl font-medium">¥{subtotal.toLocaleString()}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutModalOpen(true);
                }}
                className="w-full bg-[#CE522A] disabled:bg-stone-400 text-[#FCF7ED] py-3.5 rounded-full font-semibold text-sm hover:bg-[#b8431d] active:scale-95 transition-all shadow-md"
              >
                {lang === "EN" ? "Proceed to Checkout →" : "ご注文手続きへ進む →"}
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-xs text-center text-[#6A5747] hover:underline"
              >
                {lang === "EN" ? "Continue shopping" : "買い物を続ける"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Mock Modal */}
      {isCheckoutModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCheckoutModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[#FCF7ED] text-[#241A12] w-full max-w-md rounded-xl p-6 sm:p-8 shadow-2xl relative border border-[#D8C7AC]">
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 text-xl font-bold leading-none p-1"
              aria-label="Close dialog"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#CE522A]" />
              <span className="text-[11px] font-bold tracking-[1.4px] text-[#6A5747] uppercase">
                {lang === "EN" ? "SIMULATED CHECKOUT" : "ご注文確認（テストモード）"}
              </span>
            </div>
            <h3 className="font-serif text-2xl font-medium mb-3">
              {lang === "EN" ? "Order Summary" : "ご注文概要"}
            </h3>
            <div className="bg-[#F6EDDC] p-4 rounded-lg mb-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span>{lang === "EN" ? `Items (${totalItemsCount})` : `商品点数 (${totalItemsCount}点)`}</span>
                <span>¥{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === "EN" ? "Domestic Shipping" : "国内配送料"}</span>
                <span>{freeShippingRemaining === 0 ? (lang === "EN" ? "FREE" : "無料") : "¥500"}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-[#D8C7AC] pt-2 text-sm">
                <span>{lang === "EN" ? "Total" : "合計金額"}</span>
                <span>¥{(subtotal + (freeShippingRemaining === 0 ? 0 : 500)).toLocaleString()}</span>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  lang === "EN"
                    ? "Thank you for your order! We will freshly roast and dispatch your coffee within 48 hours."
                    : "ご注文ありがとうございます！48時間以内に新鮮な豆を焙煎し、発送いたします。"
                );
                setCart([]);
                setIsCheckoutModalOpen(false);
              }}
              className="flex flex-col gap-3 text-xs"
            >
              <input
                type="text"
                placeholder={lang === "EN" ? "Full Name" : "お名前（フルネーム）"}
                required
                className="p-3 bg-white border border-[#D8C7AC] rounded-md focus:outline-none"
              />
              <input
                type="email"
                placeholder={lang === "EN" ? "Email for Roasting Dispatch Note" : "メールアドレス（発送通知用）"}
                required
                className="p-3 bg-white border border-[#D8C7AC] rounded-md focus:outline-none"
              />
              <input
                type="text"
                placeholder={lang === "EN" ? "Shipping Address in Japan (Postal Code & Street)" : "お届け先ご住所（郵便番号・番地）"}
                required
                className="p-3 bg-white border border-[#D8C7AC] rounded-md focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#241A12] text-[#FCF7ED] py-3.5 rounded-full font-semibold hover:bg-[#CE522A] transition-colors mt-2"
              >
                {lang === "EN" ? "Place Coffee Order (Test Mode)" : "注文を確定する（テスト注文）"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Visit / Inquiry Modal */}
      {isVisitModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsVisitModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[#F6EDDC] text-[#241A12] w-full max-w-md rounded-xl p-6 sm:p-8 shadow-2xl relative border border-[#D8C7AC]">
            <button
              onClick={() => setIsVisitModalOpen(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 text-xl font-bold leading-none p-1"
              aria-label="Close dialog"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#CE522A]" />
              <span className="text-[11px] font-bold tracking-[1.4px] text-[#6A5747] uppercase">
                {lang === "EN" ? "VISIT & INQUIRIES" : "ご来店・お問い合わせ"}
              </span>
            </div>
            <h3 className="font-serif text-2xl font-medium mb-3">
              {lang === "EN" ? "Visit Lemari Coffee" : "ルマリコーヒーへのお問い合わせ"}
            </h3>
            <p className="text-xs text-[#6A5747] leading-relaxed mb-5">
              {lang === "EN"
                ? "We take walk-ins at both shops. For groups over 6, private cupping rituals, or bean wholesale accounts across Japan, leave us a note:"
                : "両店舗ともご予約なしで気軽にお立ち寄りいただけます。6名様以上の団体利用、プライベートカッピング体験、卸売りのご相談はこちらからどうぞ："}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  lang === "EN"
                    ? "Thank you! Rani and the roastery team will get back to you within 24 hours."
                    : "お問い合わせありがとうございます！担当者より24時間以内にご返信いたします。"
                );
                setIsVisitModalOpen(false);
              }}
              className="flex flex-col gap-3 text-xs"
            >
              <input
                type="text"
                placeholder={lang === "EN" ? "Your Name" : "お名前"}
                required
                className="p-3 bg-white/70 border border-[#D8C7AC] rounded-md focus:outline-none focus:border-[#241A12]"
              />
              <input
                type="email"
                placeholder={lang === "EN" ? "Email Address" : "メールアドレス"}
                required
                className="p-3 bg-white/70 border border-[#D8C7AC] rounded-md focus:outline-none focus:border-[#241A12]"
              />
              <select className="p-3 bg-white/70 border border-[#D8C7AC] rounded-md focus:outline-none focus:border-[#241A12]">
                <option>{lang === "EN" ? "Café Visit / Group Booking" : "カフェご来店 / 団体予約"}</option>
                <option>{lang === "EN" ? "Wholesale Roasted Beans" : "コーヒー豆の卸売り・仕入れ"}</option>
                <option>{lang === "EN" ? "Private Hire & Events" : "店舗貸切・プライベートイベント"}</option>
                <option>{lang === "EN" ? "Press & Media" : "取材・プレス関係"}</option>
              </select>
              <textarea
                rows={3}
                placeholder={lang === "EN" ? "Your message or preferred date..." : "お問い合わせ内容または希望日時..."}
                className="p-3 bg-white/70 border border-[#D8C7AC] rounded-md focus:outline-none focus:border-[#241A12]"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#241A12] text-[#FCF7ED] py-3 rounded-full font-semibold hover:bg-[#CE522A] transition-colors mt-2"
              >
                {lang === "EN" ? "Send Inquiry" : "送信する"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
