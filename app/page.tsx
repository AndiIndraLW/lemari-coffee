"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { products } from "./data/products";
import { Product, CartItem, OrderDetails } from "./types/commerce";
import CartDrawer from "./components/CartDrawer";
import ProductQuickViewModal from "./components/ProductQuickViewModal";
import CheckoutModal from "./components/CheckoutModal";
import CartToast from "./components/CartToast";

export default function Home() {
  const [lang, setLang] = useState<"EN" | "JP">("JP");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [menuFilter, setMenuFilter] = useState<"all" | "coffee" | "kitchen">("all");
  const [isOpenHourModalOpen, setIsOpenHourModalOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => new Date());

  // Commerce & Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("lemari_cart");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "bean-aceh-gayo-250g-whole",
        productId: "bean-aceh-gayo",
        name: "Aceh Gayo",
        nameJP: "アチェ・ガヨ",
        category: "beans",
        price: 2400,
        quantity: 1,
        image: "/assets/revamp/bean-gayo.jpg",
        grind: "Whole Bean (豆のまま)",
        weight: "250g",
        weightGrams: 250,
      },
    ];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping");
  const [shopFilter, setShopFilter] = useState<"all" | "beans" | "blends" | "goods">("all");
  const [toast, setToast] = useState<{ visible: boolean; message: string; image?: string }>({
    visible: false,
    message: "",
  });
  const shelfScrollRef = React.useRef<HTMLDivElement>(null);

  const handleShelfScroll = (direction: "left" | "right") => {
    if (shelfScrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      shelfScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("lemari_cart", JSON.stringify(cart));
      } catch (e) {
        console.error(e);
      }
    }
  }, [cart]);

  const totalCartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (newItem: Omit<CartItem, "id">) => {
    const compositeId = `${newItem.productId}-${newItem.weight || "std"}-${newItem.grind || "none"}`;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === compositeId);
      if (existing) {
        return prevCart.map((item) =>
          item.id === compositeId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prevCart, { ...newItem, id: compositeId }];
    });

    setToast({
      visible: true,
      message: `${lang === "EN" ? newItem.name : newItem.nameJP} (${newItem.weight || "250g"})`,
      image: newItem.image,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCompleteOrder = (_order: OrderDetails) => {
    setCart([]);
  };

  // Handle escape key and body scroll lock for modal
  useEffect(() => {
    if (isOpenHourModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setIsOpenHourModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpenHourModalOpen]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setNewsletterSubscribed(true);
      setEmail("");
    }
  };

  const monthNamesEN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNamesJP = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];
  const weekDayNamesMondayEN = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const weekDayNamesMondayJP = ["月", "火", "水", "木", "金", "土", "日"];

  const calendarYear = calendarMonth.getFullYear();
  const calendarMonthIndex = calendarMonth.getMonth();
  const daysInMonth = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
  const firstDayRaw = new Date(calendarYear, calendarMonthIndex, 1).getDay();
  // Monday = 0, Tuesday = 1, ..., Sunday = 6
  const firstDayOfWeekMonday = (firstDayRaw + 6) % 7;
  const totalLeadingAndDays = firstDayOfWeekMonday + daysInMonth;
  const trailingEmptyCount = (7 - (totalLeadingAndDays % 7)) % 7;

  const isDateClosed = (date: Date): boolean => {
    const y = date.getFullYear();
    const m = date.getMonth(); // 10 = November
    const d = date.getDate();
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday

    // Special schedule for November 2026 matching calendar design
    if (y === 2026 && m === 10) {
      if (d === 23) return false; // Open on Monday Nov 23 (Labor Thanksgiving Day holiday)
      if (d === 24 || d === 25 || d === 26) return true; // Closed Nov 24, 25, 26
      if (dayOfWeek === 1) return true; // Other Mondays closed
      return false; // Other days open
    }

    // Default regular schedule: Mondays closed
    return dayOfWeek === 1;
  };

  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarYear, calendarMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarYear, calendarMonthIndex + 1, 1));
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
      {/* Main Container max 1440px */}
      <div className="w-full max-w-[1440px] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.06)] bg-[#F6EDDC] overflow-hidden">
        
        {/* ================= 1. NAV ================= */}
        <header className="sticky top-0 z-40 w-full h-[84px] md:h-[92px] px-5 sm:px-8 md:px-14 flex items-center justify-between bg-[#F6EDDC]/95 backdrop-blur-md border-b border-[#D8C7AC]/40 transition-colors">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 md:w-9 md:h-9 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/assets/logo.png"
                alt="Lemari Coffee Logo"
                fill
                sizes="(max-width: 768px) 32px, 36px"
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:inline font-serif text-[18px] md:text-[19px] font-medium tracking-[1.4px] text-[#241A12]">
              LEMARI COFFEE
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-[13px] text-[#6A5747] font-normal tracking-[0.6px]">
            <a href="#philosophy" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Philosophy" : "コンセプト"}</a>
            <a href="#beans" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Beans" : "珈琲豆"}</a>
            <a href="#shop" className="hover:text-[#CE522A] transition-colors font-medium text-[#241A12] flex items-center gap-1.5">
              <span>{lang === "EN" ? "Shop" : "オンラインショップ"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE522A]" />
            </a>
            <a href="#menu" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Menu" : "メニュー"}</a>
            <a href="#space" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "The Space" : "空間"}</a>
            <a href="#locator" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Location" : "店舗情報"}</a>
          </nav>

          {/* Nav Right */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4">
            {/* Lang Switcher */}
            <button
              onClick={() => setLang(lang === "EN" ? "JP" : "EN")}
              className="text-[12px] font-medium text-[#6A5747] tracking-[0.8px] hover:text-[#241A12] px-2.5 py-1.5 rounded border border-[#D8C7AC]/60 hover:border-[#241A12] transition-all"
              title="Toggle Language"
            >
              {lang === "EN" ? "JP / EN" : "EN / JP"}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D8C7AC]/80 hover:border-[#241A12] bg-[#FCF7ED] hover:bg-[#F6EDDC] text-[#241A12] text-[12.5px] font-medium transition-all group cursor-pointer shadow-2xs"
              title="Shopping Cart"
            >
              <svg className="w-4 h-4 text-[#241A12] group-hover:text-[#CE522A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden sm:inline font-serif">{lang === "EN" ? "Cart" : "かご"}</span>
              {totalCartQuantity > 0 && (
                <span className="min-w-[19px] h-[19px] px-1 rounded-full bg-[#CE522A] text-[#FCF7ED] text-[10.5px] font-bold flex items-center justify-center">
                  {totalCartQuantity}
                </span>
              )}
            </button>

            {/* Visit the café Link */}
            <a
              href="https://maps.app.goo.gl/zkKp8CNVTi1h7p9b6"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#241A12] text-[#FCF7ED] px-4 md:px-5 py-2 rounded-full text-[12px] font-medium tracking-[0.6px] hover:bg-[#CE522A] active:scale-95 transition-all shadow-sm"
            >
              <span>{lang === "EN" ? "Visit café" : "カフェへ"}</span>
              <svg viewBox="0 0 13 13" className="w-[11px] h-[11px] fill-current" aria-hidden="true">
                <path d="M3.666 3.263q-.13 .038-.241 .143-.112 .104-.15 .234-.05 .181 .026 .365 .079 .181 .235 .273 .079 .026 .181 .038 .158 .013 .612 .026h3.561l-2.275 2.275q-1.533 1.533-1.911 1.924-.375 .39-.403 .441-.102 .222-.013 .432 .092 .206 .298 .298 .21 .089 .432-.013 .051-.028 .441-.403 .391-.378 1.924-1.91l2.275-2.276v2.053q0 2.067 .026 2.146 .025 .168 .142 .273 .185 .181 .429 .162 .247-.019 .39-.229l.026-.025q.041-.051 .054-.168 .012-.143 .025-.638v-4.993l-.038-.089q-.025-.104-.117-.196-.093-.093-.197-.118l-.089-.038h-2.796q-2.781 0-2.847 .013z" />
              </svg>
            </a>

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
            <a href="#philosophy" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">{lang === "EN" ? "Philosophy" : "コンセプト"}</a>
            <a href="#beans" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">{lang === "EN" ? "Beans & Origins" : "単一農園豆"}</a>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)} className="text-[#CE522A] font-semibold flex items-center justify-between">
              <span>{lang === "EN" ? "Shop & Goods" : "オンラインショップ・雑貨"}</span>
              <span className="text-xs bg-[#CE522A] text-[#FCF7ED] px-2 py-0.5 rounded-full font-bold">
                {totalCartQuantity}
              </span>
            </a>
            <a href="#menu" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">{lang === "EN" ? "Signature Menu" : "カフェメニュー"}</a>
            <a href="#space" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">{lang === "EN" ? "The Space" : "空間・店舗"}</a>
            <a href="#locator" onClick={() => setMobileMenuOpen(false)} className="text-[#6A5747] hover:text-[#CE522A]">{lang === "EN" ? "Store Location" : "店舗案内"}</a>
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-[3px] bg-[#CE522A] text-[#FCF7ED] text-xs font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{lang === "EN" ? `View Cart (${totalCartQuantity})` : `お買い物かごを見る (${totalCartQuantity})`}</span>
            </button>

            <a
              href="https://maps.app.goo.gl/zkKp8CNVTi1h7p9b6"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#241A12] text-[#FCF7ED] py-2.5 rounded-full text-xs font-semibold block hover:bg-[#CE522A] transition-colors"
            >
              {lang === "EN" ? "Visit the café" : "カフェへ行く"}
            </a>
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
                {lang === "EN" ? "JINGUMAE, SHIBUYA — SINCE 2019" : "神宮前・渋谷 — 2019年創業"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-[48px] sm:text-[62px] md:text-[76px] leading-[1.02] tracking-[-1.2px] text-[#241A12] font-medium">
              {lang === "EN" ? "A cupboard full of islands." : "島々が詰まった、ひとつの食器棚。"}
            </h1>

            {/* Subhead */}
            <p className="text-[15px] md:text-[16px] leading-[26px] text-[#6A5747] max-w-[440px]">
              {lang === "EN"
                ? "Single-origin Indonesian coffee, roasted in small batches and served slow in Jingumae, Tokyo. In a room built from teak, terracotta and fifty years of patience."
                : "インドネシアの単一農園産コーヒーを、神宮前の落ち着いた2階カウンターで少量焙煎・抽出。チーク材と素焼きタイル、穏やかな時間の中で一杯ずつ丁寧にお届けします。"}
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
              <button
                type="button"
                onClick={() => setIsOpenHourModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[13.5px] font-medium tracking-[0.5px] border border-[#241A12] text-[#241A12] hover:bg-[#241A12] hover:text-[#FCF7ED] active:scale-95 transition-all group"
              >
                <svg
                  className="w-4 h-4 text-[#CE522A] group-hover:text-[#F2C24E] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{lang === "EN" ? "Open hours" : "営業時間・定休日"}</span>
              </button>
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
                  LC
                </div>
                <div className="flex flex-col">
                  <span className="text-[12.5px] font-semibold text-[#241A12] leading-tight">
                    Lemari Coffee
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
              <span className="text-[11.5px] font-semibold text-[#6A5747] tracking-[1.6px] uppercase">
                {lang === "EN" ? "THE CONCEPT" : "コンセプト"}
              </span>
            </div>
          </div>

          {/* Statement Row */}
          <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
              <p className="text-[14.5px] leading-[25px] text-[#6A5747]">
                {lang === "EN"
                  ? "Lemari means cupboard. Ours holds seventeen Indonesian farms, a 1970s Probat, and one very stubborn idea: that a cup of coffee should taste of the place it grew."
                  : "「Lemari（ルマリ）」はインドネシア語で戸棚。17箇所の単一農園、1970年代のプロバット焙煎機、そして「その土地の風土がそのまま香る一杯」という確かな情熱をしまっています。"}
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <h2 className="font-serif text-[32px] sm:text-[40px] md:text-[46px] leading-[1.18] tracking-[-0.8px] text-[#241A12] font-normal">
                {lang === "EN"
                  ? "We bring the islands to the neighbourhood — one harvest, one roast, one cup at a time."
                  : "島々の香りを街の日常へ — 収穫から焙煎、最後の一滴まで。"}
              </h2>
              <p className="text-[15px] sm:text-[15.5px] leading-[26px] text-[#6A5747] max-w-[620px]">
                {lang === "EN"
                  ? "No blends hidden behind milk. Every harvest is traceable to a single family plot, bought above market rate, and roasted the week you drink it."
                  : "ミルクでごまかすブレンドはありません。すべての豆がどの家族の畑で実ったか辿ることができ、フェアな価格で直接買い付け、飲む週に焙煎します。"}
              </p>
            </div>
          </div>

          {/* Principles 3 columns */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 border-t border-[#D8C7AC] pt-8">
            <div className="flex flex-col gap-3">
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

        {/* ================= 5. ALL PRODUCTS (UNIFIED SLIDABLE SECTION) ================= */}
        <section id="beans" className="relative scroll-mt-24 w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#E8D8BF] flex flex-col gap-8">
          <div id="shop" className="absolute -top-24" />
          
          {/* Header */}
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#241A12] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "All Products" : "全商品一覧"}
              </h2>
            </div>
            <p className="text-[12.5px] text-[#6A5747] max-w-[420px] md:text-right">
              {lang === "EN"
                ? "Direct-trade Indonesian micro-lots, café signature blends, Kasama ceramics, and curated pour-over gear."
                : "インドネシア各地の単一農園豆、看板ブレンド、職人作陶の笠間焼、選りすぐりの抽出道具を揃えています。"}
            </p>
          </div>

          {/* Controls Bar: Filter Tabs + Slider Navigation */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#C9B79A]/80 pb-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { id: "all", labelEN: "All Products", labelJP: "すべての商品" },
                { id: "beans", labelEN: "Single Origins", labelJP: "単一農園豆" },
                { id: "blends", labelEN: "Blends & Boxes", labelJP: "ブレンド・ギフト" },
                { id: "goods", labelEN: "Ceramics & Gear", labelJP: "陶器・抽出器具・雑貨" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setShopFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    shopFilter === tab.id
                      ? "bg-[#241A12] text-[#FCF7ED] shadow-xs"
                      : "bg-[#FCF7ED]/80 text-[#6A5747] hover:text-[#241A12] hover:bg-[#FCF7ED]"
                  }`}
                >
                  {lang === "EN" ? tab.labelEN : tab.labelJP}
                </button>
              ))}
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShelfScroll("left")}
                  className="w-8 h-8 rounded-full bg-[#FCF7ED] hover:bg-[#241A12] text-[#241A12] hover:text-[#FCF7ED] border border-[#D8C7AC]/70 transition-all flex items-center justify-center shadow-2xs cursor-pointer"
                  title="Scroll Left"
                  aria-label="Previous products"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleShelfScroll("right")}
                  className="w-8 h-8 rounded-full bg-[#FCF7ED] hover:bg-[#241A12] text-[#241A12] hover:text-[#FCF7ED] border border-[#D8C7AC]/70 transition-all flex items-center justify-center shadow-2xs cursor-pointer"
                  title="Scroll Right"
                  aria-label="Next products"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Slidable Cards Container */}
          <div
            ref={shelfScrollRef}
            className="w-full flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products
              .filter((p) => {
                if (shopFilter === "all") return true;
                if (shopFilter === "beans") return p.category === "beans" && p.subCategory === "single-origin";
                if (shopFilter === "blends") return p.subCategory === "blend";
                if (shopFilter === "goods") return p.category === "merch" && p.subCategory !== "blend";
                return true;
              })
              .map((product) => (
                <div
                  key={product.id}
                  className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start bg-[#FCF7ED] rounded-[4px] overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-[#D8C7AC]/40"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <div className="relative w-full h-[230px] sm:h-[240px] overflow-hidden bg-[#E8D8BF]">
                      <Image
                        src={product.image}
                        alt={lang === "EN" ? product.name : product.nameJP}
                        fill
                        sizes="340px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.tag && (
                        <span className="absolute top-3.5 left-3.5 bg-[#F2C24E] text-[#241A12] text-[9.5px] font-bold tracking-[1.2px] px-2.5 py-1 rounded-[2px] z-10">
                          {lang === "EN" ? product.tag : product.tagJP || product.tag}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-[#FCF7ED] text-[#241A12] text-xs font-semibold px-4 py-2 rounded-full shadow-md">
                          {lang === "EN" ? "Quick View & Options" : "詳細・選択"}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-2.5">
                      <span className="text-[10px] font-semibold tracking-[1.4px] text-[#CE522A] uppercase">
                        {product.category === "beans"
                          ? (lang === "EN" ? product.region : product.regionJP || product.region)
                          : (lang === "EN" ? product.detail : product.detailJP || product.detail)}
                      </span>
                      <h3 className="font-serif text-[21px] sm:text-[22px] font-medium text-[#241A12] group-hover:text-[#CE522A] transition-colors leading-snug">
                        {lang === "EN" ? product.name : product.nameJP}
                      </h3>
                      <p className="text-[12px] text-[#6A5747] line-clamp-2 leading-relaxed">
                        {lang === "EN"
                          ? (product.process || product.description)
                          : (product.processJP || product.descriptionJP)}
                      </p>
                      {product.notes && product.notes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {(lang === "EN" ? product.notes : product.notesJP || product.notes).slice(0, 3).map((note) => (
                            <span key={note} className="bg-[#E8D8BF] text-[#241A12] text-[10.5px] px-2 py-0.5 rounded-full">
                              {note}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-5 py-3.5 border-t border-[#E4D5BC] flex items-center justify-between">
                    <div>
                      <span className="font-serif text-[16px] font-bold text-[#241A12] block">
                        ¥{product.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#6A5747]">
                        {product.availableWeights
                          ? `250g · ${lang === "EN" ? "Whole bean / Drip" : "豆のまま / 粉"}`
                          : (lang === "EN" ? "In stock" : "在庫あり")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(product)}
                        className="text-xs text-[#6A5747] hover:text-[#241A12] px-2 py-1.5 rounded hover:bg-[#E8D8BF]/60 transition-colors cursor-pointer"
                      >
                        {lang === "EN" ? "Options" : "選択"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleAddToCart({
                            productId: product.id,
                            name: product.name,
                            nameJP: product.nameJP,
                            category: product.category,
                            price: product.price,
                            quantity: 1,
                            image: product.image,
                            grind:
                              product.category === "beans" || product.subCategory === "blend"
                                ? lang === "EN" ? "Whole Bean" : "豆のまま"
                                : undefined,
                            weight: product.availableWeights ? "250g" : undefined,
                            weightGrams: product.availableWeights ? 250 : undefined,
                          });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CE522A] hover:bg-[#B34522] text-[#FCF7ED] rounded-[3px] text-xs font-semibold shadow-xs transition-all cursor-pointer"
                      >
                        <span>+</span>
                        <span>{lang === "EN" ? "Add" : "かごへ"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ================= 6. SIGNATURE MENU ================= */}
        <section id="menu" className="scroll-mt-24 w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#1D1610] text-[#F6EDDC] flex flex-col gap-12">
          {/* Menu Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#352A20] pb-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#A8957F] tracking-[1.6px] uppercase">
                  {lang === "EN" ? "SIGNATURE MENU" : "カフェメニュー"}
                </span>
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#F6EDDC] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "What we actually pour." : "カウンターで淹れる一杯。"}
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-2">
              
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
                      <div key={item.name} className="py-3.5 flex justify-between items-baseline group px-2 rounded transition-colors">
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
                      <div key={item.name} className="py-3.5 flex justify-between items-baseline group px-2 rounded transition-colors">
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
                ? "A second-floor retreat in Jingumae, minutes from Harajuku and Omotesando. Breezy terrace and no music above a murmur."
                : "原宿や表参道から少し離れた神宮前2丁目の路地裏、心地よい2階テラスを備えた木造の隠れ家空間。"}
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
                      ? "Custom teak shelving, sunny terrace seating, and single-origin coffee poured slow above the street."
                      : "温もりあふれるチーク材の棚、心地よい2階テラス席。通りから一歩入った静かな空間で、豆の香りが漂います。"}
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
        </section>



        {/* ================= 9. SOCIAL PROOF ================= */}
        <section className="w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#E8D8BF] flex flex-col gap-12">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#6A5747] tracking-[1.6px] uppercase">
                  {lang === "EN" ? "SOCIAL PROOF" : "お客様の声"}
                </span>
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#241A12] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "Word of mouth, mostly in Japanese." : "愛され続ける、日々の評判。"}
              </h2>
            </div>
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
                  ? "Average across Google & Tabelog for our Jingumae store, last twelve months."
                  : "神宮前店の過去12ヶ月におけるGoogle・食べログ総合評価平均。"}
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
        </section>

        {/* ================= 9. STORE LOCATION ================= */}
        <section id="locator" className="scroll-mt-24 w-full px-5 sm:px-8 md:px-14 py-20 md:py-24 bg-[#1D1610] text-[#F6EDDC] flex flex-col gap-10">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-semibold text-[#A8957F] tracking-[1.6px] uppercase">
                  {lang === "EN" ? "OUR STORE" : "店舗案内"}
                </span>
              </div>
              <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[44px] text-[#F6EDDC] font-normal tracking-[-0.8px]">
                {lang === "EN" ? "Our doors in Jingumae, Harajuku." : "神宮前の路地裏、たったひとつの空間。"}
              </h2>
            </div>
          </div>

          {/* Single Store Showcase */}
          <div className="w-full bg-[#251C15] rounded-[4px] overflow-hidden border border-[#3B2E23] grid grid-cols-1 lg:grid-cols-12">
            {/* Google Maps Interactive Embed */}
            <div className="relative w-full h-[340px] sm:h-[420px] lg:h-full min-h-[340px] lg:col-span-5 overflow-hidden bg-[#1A120C]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.136!2d139.7080357!3d35.6736546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f347986bbfbf%3A0x247a1cdf11527985!2sLemari%20Coffee!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lemari Coffee Google Maps Location"
                className="w-full h-full min-h-[340px] lg:min-h-full"
              />
              <a
                href="https://maps.app.goo.gl/zkKp8CNVTi1h7p9b6"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 left-4 bg-[#F2C24E] text-[#241A12] text-[9.5px] font-bold tracking-[1.3px] px-3 py-1.5 rounded-[2px] uppercase shadow-md hover:bg-[#e0b03e] transition-colors flex items-center gap-1.5 z-10"
              >
                <span>{lang === "EN" ? "OPEN IN MAPS" : "マップで開く"}</span>
                <span>↗</span>
              </a>
            </div>

            {/* Store Information */}
            <div className="p-7 sm:p-9 lg:p-10 flex flex-col justify-between gap-8 lg:col-span-7">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#3B2E23] pb-5">
                  <div>
                    <h3 className="font-serif text-[28px] sm:text-[32px] font-medium text-[#F6EDDC]">
                      {lang === "EN" ? "Harajuku / Jingumae" : "神宮前店（原宿）"}
                    </h3>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[13px]">
                  {/* Address */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-bold tracking-[1.4px] text-[#F2C24E] uppercase">
                      {lang === "EN" ? "ADDRESS" : "所在地"}
                    </span>
                    <p className="text-[#F6EDDC] leading-relaxed">
                      J&apos;s Vendor 2F, 2-19-2 Jingumae, Shibuya-ku<br />
                      Tokyo 150-0001, Japan
                    </p>
                    <p className="text-[11.5px] text-[#A8957F]">
                      〒150-0001 東京都渋谷区神宮前2-19-2 J&apos;s Vendor 2F
                    </p>
                  </div>

                  {/* Access */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-bold tracking-[1.4px] text-[#F2C24E] uppercase">
                      {lang === "EN" ? "ACCESS" : "アクセス"}
                    </span>
                    <p className="text-[#F6EDDC] leading-relaxed">
                      {lang === "EN"
                        ? "8 min walk from Harajuku & Meiji-jingumae Stations"
                        : "原宿駅・明治神宮前〈原宿〉駅より徒歩8分"}
                    </p>
                    <p className="text-[11.5px] text-[#A8957F]">
                      {lang === "EN"
                        ? "JR Yamanote Line / Tokyo Metro Chiyoda & Fukutoshin Lines (8 min from Kitasando)"
                        : "JR山手線 / 東京メトロ千代田線・副都心線（北参道駅からも徒歩8分）"}
                    </p>
                  </div>

                  {/* Hours */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-bold tracking-[1.4px] text-[#F2C24E] uppercase">
                      {lang === "EN" ? "HOURS & WALK-INS" : "営業時間・ご来店"}
                    </span>
                    <p className="text-[#F6EDDC] leading-relaxed">
                      {lang === "EN" ? "Tue – Fri, Sun: 11:00 – 18:00 · Sat: 11:00 – 20:00" : "火〜金・日：11:00 – 18:00 · 土曜：11:00 – 20:00"}
                    </p>
                    <p className="text-[11.5px] text-[#A8957F]">
                      {lang === "EN"
                        ? "Closed on Mondays · Walk-ins always welcome"
                        : "月曜定休日 · 予約不要でお気軽にどうぞ"}
                    </p>
                  </div>

                  {/* Space & Specialty */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-bold tracking-[1.4px] text-[#F2C24E] uppercase">
                      {lang === "EN" ? "COFFEE & ATMOSPHERE" : "空間・こだわり"}
                    </span>
                    <p className="text-[#F6EDDC] leading-relaxed">
                      {lang === "EN"
                        ? "Cozy 2F terrace & timber bar tucked off the main street"
                        : "路地裏の2階に広がる開放的なテラス席と木のカウンター"}
                    </p>
                    <p className="text-[11.5px] text-[#A8957F]">
                      {lang === "EN"
                        ? "Indonesian specialty single origins, pour-over & house cakes"
                        : "インドネシア直輸入の希少な単一農園豆と自家製スイーツ"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#3B2E23] flex flex-wrap items-center gap-3">
                <a
                  href="https://maps.app.goo.gl/zkKp8CNVTi1h7p9b6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#F2C24E] text-[#241A12] px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#e0b03e] transition-colors"
                >
                  <span>{lang === "EN" ? "Get Directions (Google Maps)" : "Googleマップで道順を見る"}</span>
                  <span>↗</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpenHourModalOpen(true)}
                  className="inline-flex items-center gap-2 border border-[#5A4734] text-[#F6EDDC] px-5 py-2.5 rounded-full text-xs font-semibold hover:border-[#F2C24E] hover:text-[#F2C24E] transition-colors"
                >
                  <span>📅</span>
                  <span>{lang === "EN" ? "Check Hours & Calendar" : "営業時間・カレンダーを確認"}</span>
                </button>
              </div>
            </div>
          </div>

        
        </section>

        {/* ================= 10. FOOTER ================= */}
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
                <span className="text-[10.5px] font-bold tracking-[1.5px] text-[#6B4A1F] uppercase">{lang === "EN" ? "SHOP" : "オンラインショップ"}</span>
                <a href="#beans" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Single origin beans" : "単一農園珈琲豆"}</a>
                <a href="#shop" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Merchandise & teaware" : "陶器・オリジナルグッズ"}</a>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="text-left hover:text-[#CE522A] transition-colors flex items-center gap-1.5"
                >
                  <span>{lang === "EN" ? "Cart" : "お買い物かご"}</span>
                  {totalCartQuantity > 0 && (
                    <span className="text-[10px] bg-[#CE522A] text-white px-1.5 py-0.2 rounded-full font-bold">
                      {totalCartQuantity}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[10.5px] font-bold tracking-[1.5px] text-[#6B4A1F] uppercase">{lang === "EN" ? "VISIT" : "店舗情報"}</span>
                <a href="#locator" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Our Location" : "神宮前店"}</a>
                <button
                  type="button"
                  onClick={() => setIsOpenHourModalOpen(true)}
                  className="text-left hover:text-[#CE522A] transition-colors"
                >
                  {lang === "EN" ? "Hours & Calendar" : "営業時間・カレンダー"}
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[10.5px] font-bold tracking-[1.5px] text-[#6B4A1F] uppercase">{lang === "EN" ? "COMPANY" : "企業情報"}</span>
                <a href="#philosophy" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Our story" : "ブランドの歩み"}</a>
                <a href="#beans" className="hover:text-[#CE522A] transition-colors">{lang === "EN" ? "Single Origin Beans" : "シングルオリジン"}</a>
              </div>
            </div>
          </div>

          {/* Wordmark Row */}
          <div className="w-full border-t border-[#241A12] pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <span className="font-serif text-[56px] sm:text-[84px] md:text-[112px] leading-[0.88] font-medium tracking-[-3px] text-[#241A12] select-none">
              LEMARI COFFEE
            </span>
            <div className="flex flex-col md:items-end gap-2 pb-2 text-[11.5px]">
              <span className="text-[#4A3418]">Est. 2019 · Jingumae, Shibuya, Tokyo</span>
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
              <a href="mailto:hello@lemaricoffee.jp" className="hover:underline">{lang === "EN" ? "Contact" : "お問い合わせ"}</a>
            </div>
          </div>
        </footer>
      </div>

      {/* ================= OPEN HOURS & CALENDAR POP-UP MODAL ================= */}
      {isOpenHourModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpenHourModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/75 backdrop-blur-sm animate-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="calendar-modal-title"
        >
          <div className="bg-[#241A12] text-[#FCF7ED] w-full max-w-2xl rounded-xl shadow-2xl relative border-2 border-[#241A12] max-h-[96vh] flex flex-col overflow-hidden animate-modal-pop">
            {/* Modal Top Control Bar */}
            <div className="px-4 sm:px-6 py-3 bg-[#1A120C] border-b border-[#3B2D21] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-[1.2px] text-[#F6EDDC] uppercase text-[11px] sm:text-xs">
                  {lang === "EN" ? "LEMARI COFFEE · OPERATING SCHEDULE" : "ルマリコーヒー · 営業カレンダー"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpenHourModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#3B2D21] hover:bg-[#CE522A] text-[#FCF7ED] flex items-center justify-center text-sm font-semibold transition-colors"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body — Inspired by calendar design with Lemari Coffee Palette */}
            <div className="overflow-y-auto flex-1 flex flex-col p-3 sm:p-5 bg-[#1A120C]">
              {/* Calendar Container with Left Sidebar & Grid */}
              <div className="w-full flex bg-[#241A12] border-2 border-[#241A12] rounded-md overflow-hidden shadow-xl">
                {/* Left Sidebar — Rotated 2026 . NOVEMBER */}
                <div className="w-11 sm:w-16 bg-[#241A12] text-[#FCF7ED] flex flex-col justify-between items-center py-4 select-none shrink-0 border-r-2 border-[#241A12]">
                  {/* Prev Month Arrow */}
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#A8957F] hover:text-[#FCF7ED] hover:bg-white/10 transition-colors text-xs"
                    aria-label="Previous Month"
                    title="Previous Month"
                  >
                    ▲
                  </button>

                  {/* Vertical Month Title */}
                  <div className="flex-1 flex items-center justify-center [writing-mode:vertical-rl] rotate-180 tracking-[4px] sm:tracking-[6px] font-sans font-extrabold text-xs sm:text-base text-[#FCF7ED] my-3">
                    <span>{calendarYear}</span>
                    <span className="my-1.5 sm:my-2 text-[#CE522A] font-extrabold text-base sm:text-lg leading-none">·</span>
                    <span className="uppercase">{monthNamesEN[calendarMonthIndex]}</span>
                  </div>

                  {/* Next Month Arrow */}
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#A8957F] hover:text-[#FCF7ED] hover:bg-white/10 transition-colors text-xs"
                    aria-label="Next Month"
                    title="Next Month"
                  >
                    ▼
                  </button>
                </div>

                {/* Right Calendar Table Grid */}
                <div className="flex-1 flex flex-col bg-[#241A12]">
                  {/* Weekday Header Row (MON to SUN) */}
                  <div className="grid grid-cols-7 bg-[#FCF7ED] border-b-2 border-[#241A12]">
                    {(lang === "EN" ? weekDayNamesMondayEN : weekDayNamesMondayJP).map((dayName, idx) => (
                      <div
                        key={dayName}
                        className={`py-2 sm:py-2.5 text-center text-[10px] sm:text-xs font-bold tracking-[1px] text-[#241A12] ${
                          idx < 6 ? "border-r border-[#241A12]" : ""
                        }`}
                      >
                        {dayName}
                      </div>
                    ))}
                  </div>

                  {/* Dates Grid with Solid 1px Gridlines */}
                  <div className="grid grid-cols-7 bg-[#241A12] gap-[1px]">
                    {/* Empty cells before month start */}
                    {Array.from({ length: firstDayOfWeekMonday }).map((_, i) => (
                      <div
                        key={`empty-leading-${i}`}
                        className="bg-white min-h-[52px] sm:min-h-[64px] md:min-h-[72px]"
                      />
                    ))}

                    {/* Month Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateObj = new Date(calendarYear, calendarMonthIndex, dayNum);
                      const isClosed = isDateClosed(dateObj);
                      const isEvent = dayNum === 21; // Standout Event Date

                      const now = new Date();
                      const isToday =
                        now.getFullYear() === calendarYear &&
                        now.getMonth() === calendarMonthIndex &&
                        now.getDate() === dayNum;

                      const isSelected =
                        selectedCalendarDate.getFullYear() === calendarYear &&
                        selectedCalendarDate.getMonth() === calendarMonthIndex &&
                        selectedCalendarDate.getDate() === dayNum;

                      if (isEvent) {
                        return (
                          <button
                            key={`day-${dayNum}`}
                            type="button"
                            onClick={() => setSelectedCalendarDate(dateObj)}
                            className={`relative flex flex-col justify-between p-1 sm:p-1.5 transition-all text-left group min-h-[52px] sm:min-h-[64px] md:min-h-[72px] cursor-pointer bg-[#F2C24E] hover:bg-[#e5b33b] ${
                              isSelected
                                ? "ring-2 ring-inset ring-[#241A12] z-20 scale-[1.03] shadow-md"
                                : "shadow-xs"
                            }`}
                          >
                            {/* Date Number + Event Pill */}
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[11px] sm:text-[12.5px] font-sans font-black text-[#241A12] leading-none">
                                {dayNum}
                              </span>
                              <span className="text-[7.5px] sm:text-[8px] font-black tracking-wider bg-[#241A12] text-[#F2C24E] px-1 py-0.5 rounded-[2px] uppercase leading-none shadow-2xs">
                                {lang === "EN" ? "EVENT" : "特 別"}
                              </span>
                            </div>

                            {/* Center Event Marker */}
                            <div className="flex-1 flex flex-col items-center justify-center py-0.5">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#241A12] text-[#F2C24E] flex items-center justify-center font-black text-[10px] sm:text-[11px] shadow-xs group-hover:scale-110 transition-transform">
                                ★
                              </div>
                              <span className="text-[7.5px] sm:text-[8.5px] font-extrabold text-[#241A12] tracking-tighter mt-0.5 leading-none uppercase">
                                {lang === "EN" ? "CUPPING" : "カッピング"}
                              </span>
                            </div>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={`day-${dayNum}`}
                          type="button"
                          onClick={() => setSelectedCalendarDate(dateObj)}
                          className={`relative flex flex-col justify-between p-1 sm:p-1.5 transition-colors text-left group min-h-[52px] sm:min-h-[64px] md:min-h-[72px] cursor-pointer ${
                            isSelected
                              ? "bg-[#F5ECE0] ring-2 ring-inset ring-[#241A12] z-10"
                              : isToday
                              ? "bg-[#FFFBF5]"
                              : "bg-white hover:bg-[#FAF4EC]"
                          }`}
                        >
                          {/* Date Number at Top-Left */}
                          <div className="flex items-center justify-between w-full">
                            <span
                              className={`text-[10px] sm:text-[11.5px] font-sans font-semibold leading-none ${
                                isToday
                                  ? "w-4 h-4 rounded-full bg-[#CE522A] text-[#FCF7ED] flex items-center justify-center font-bold text-[9.5px]"
                                  : "text-[#241A12]"
                              }`}
                            >
                              {dayNum}
                            </span>
                            {isToday && !isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F2C24E]" title="Today" />
                            )}
                          </div>

                          {/* Center Marker: Solid Circle (Open) or Red Cross (Closed) */}
                          <div className="flex-1 flex items-center justify-center py-0.5">
                            {isClosed ? (
                              <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-[#CE522A] transition-transform group-hover:scale-110 drop-shadow-2xs"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            ) : (
                              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#241A12] transition-transform group-hover:scale-110 shadow-xs" />
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {/* Empty cells after month end */}
                    {Array.from({ length: trailingEmptyCount }).map((_, i) => (
                      <div
                        key={`empty-trailing-${i}`}
                        className="bg-white min-h-[52px] sm:min-h-[64px] md:min-h-[72px]"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend & Event Details Card */}
              <div className="mt-3.5 flex flex-col gap-2.5">
                {/* Legend Marks */}
                <div className="p-3 rounded-md bg-[#241A12] border border-[#3B2D21] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-[#FCF7ED]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#FCF7ED]" />
                      <span className="font-medium text-[11px] sm:text-xs">
                        {lang === "EN" ? "Open" : "通常営業"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#CE522A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span className="font-medium text-[#CE522A] text-[11px] sm:text-xs">
                        {lang === "EN" ? "Closed" : "定休日"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-[#F2C24E] text-[#241A12] flex items-center justify-center font-black text-[9px] shadow-xs">★</span>
                      <span className="font-bold text-[#F2C24E] text-[11px] sm:text-xs">
                        {lang === "EN" ? "Event (Nov 21)" : "特別イベント (11/21)"}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10.5px] text-[#A8957F] italic hidden sm:inline">
                    {lang === "EN" ? "Click Nov 21 for event details" : "11/21をクリックでイベント詳細を表示"}
                  </span>
                </div>

                {/* Event Description Card — Only appears when the user clicks the event date */}
                {selectedCalendarDate.getFullYear() === calendarYear &&
                  selectedCalendarDate.getMonth() === calendarMonthIndex &&
                  selectedCalendarDate.getDate() === 21 && (
                    <div className="p-3.5 sm:p-4 rounded-lg bg-[#2B1F16] border-2 border-[#F2C24E] text-[#FCF7ED] flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center justify-between gap-2 border-b border-[#3B2D21] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#F2C24E] text-[#241A12] flex items-center justify-center font-black text-xs">★</span>
                          <span className="font-bold text-xs sm:text-sm text-[#F2C24E] tracking-wide">
                            {lang === "EN"
                              ? "Saturday, Nov 21 · Public Cupping Session"
                              : "11月21日（土）特別カッピングセッション"}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold tracking-wider bg-[#F2C24E] text-[#241A12] px-2 py-0.5 rounded uppercase">
                          {lang === "EN" ? "15:00 – 17:00" : "15:00〜17:00"}
                        </span>
                      </div>
                      <p className="text-[12px] sm:text-[12.5px] leading-[19px] text-[#E8D8BF]">
                        {lang === "EN"
                          ? "Join our head roaster in Jingumae for an open cupping table tasting freshly arrived Indonesian micro-lots (Aceh Gayo, Toraja, and Bajawa Honey). Free admission, 12 seats available."
                          : "神宮前店の焙煎士とともに、新豆のインドネシア・マイクロロット（アチェ・ガヨ、トラジャ、バジャワ・ハニー）の香味を比較・試飲できる特別な公開カッピング会です。参加無料・先着12名様。"}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-[#3B2D21] bg-[#1A120C] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsOpenHourModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#FCF7ED] text-[#241A12] text-xs font-semibold hover:bg-[#CE522A] hover:text-[#FCF7ED] transition-colors"
              >
                {lang === "EN" ? "Close" : "閉じる"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CART DRAWER ================= */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        lang={lang}
        deliveryMethod={deliveryMethod}
        setDeliveryMethod={setDeliveryMethod}
      />

      {/* ================= PRODUCT QUICK VIEW MODAL ================= */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        lang={lang}
      />

      {/* ================= CHECKOUT MODAL ================= */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        deliveryMethod={deliveryMethod}
        setDeliveryMethod={setDeliveryMethod}
        onCompleteOrder={handleCompleteOrder}
        lang={lang}
      />

      {/* ================= TOAST ================= */}
      <CartToast
        visible={toast.visible}
        message={toast.message}
        image={toast.image}
        onOpenCart={() => {
          setToast((prev) => ({ ...prev, visible: false }));
          setIsCartOpen(true);
        }}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
        lang={lang}
      />
    </div>
  );
}
