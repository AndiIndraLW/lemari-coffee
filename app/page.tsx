"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-neutral-950 text-neutral-100 p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center">
      {/* 
        Main Grid Container:
        - Background: cabinet-bg.jpeg
        - Matches exact shelf proportions of cabinet-bg.jpeg (2752 x 1536):
          * Left margin: 0.87%
          * Right margin: 8.43%
          * Top margin: 1.30%
          * Columns: Col 1 (20.67%), Col 2 (17.43%), Col 3 (25.44%), Col 4 (36.46%)
          * Rows: Row 1 (30.67%), Row 2 (34.63%), Row 3 (34.70%)
        - Empty grid cells: opacity-0
        - Interactive items: Framer Motion whileHover={{ scale: 1.05 }}
      */}
      <div
        className="relative grid grid-cols-1 md:grid-cols-[20.67%_17.43%_25.44%_36.46%] md:grid-rows-[30.67%_34.63%_34.70%] gap-4 md:gap-0 w-full max-w-[1720px] aspect-auto md:aspect-[2752/1536] max-h-none md:max-h-[calc(100vh-3rem)] rounded-2xl overflow-hidden bg-cover bg-center bg-no-repeat shadow-2xl border border-stone-800/80 p-4 md:p-0 md:pl-[0.87%] md:pr-[8.43%] md:pt-[1.3%] md:pb-0"
        style={{ backgroundImage: "url('/assets/cabinet-bg.jpeg')" }}
      >

        {/* ================= ROW 1 ================= */}

        {/* ROW 1 · COL 1: Empty Grid (Top-Left Plant & Cups) -> opacity-0 */}
        <div
          aria-hidden="true"
          className="hidden md:block md:col-start-1 md:row-start-1 opacity-0 pointer-events-none"
        />

        {/* ROW 1 · COL 2: Empty Grid (Top-Center Shelf) -> opacity-0 */}
        <div
          aria-hidden="true"
          className="hidden md:block md:col-start-2 md:row-start-1 opacity-0 pointer-events-none"
        />

        {/* ROW 1 · COL 3: Empty Grid (Top Lamp Shelf) -> opacity-0 */}
        <div
          aria-hidden="true"
          className="hidden md:block md:col-start-3 md:row-start-1 opacity-0 pointer-events-none"
        />

        {/* ROW 1 · COL 4: SOCIALS (Interactive Item) */}
        <motion.section
          aria-label="Socials Section"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border border-white/5 md:border-transparent hover:border-amber-400/60 bg-black/40 md:bg-black/10 hover:bg-black/30 backdrop-blur-[2px] hover:shadow-2xl hover:shadow-amber-950/40 transition-all min-h-[140px] md:min-h-0 md:col-start-4 md:row-start-1 cursor-pointer overflow-hidden z-10 m-1 md:m-2"
        >
          <div className="text-center">
            <h2 className="font-serif text-lg md:text-xl lg:text-2xl font-bold tracking-[0.25em] uppercase text-amber-100 group-hover:text-amber-50 drop-shadow-lg transition-colors">
              Socials
            </h2>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300/80 mt-1 block opacity-80 group-hover:opacity-100 transition-opacity">
              Connect With Us ↗
            </span>
          </div>
        </motion.section>

        {/* ================= ROW 2 ================= */}

        {/* ROW 2 · COL 1: PHONE (Next.js <Image /> & Interactive Item) */}
        <motion.section
          aria-label="Phone and Contact Section"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col items-center justify-center rounded-xl border border-white/5 md:border-transparent hover:border-amber-400/60 bg-black/40 md:bg-black/10 hover:bg-black/20 hover:shadow-2xl hover:shadow-amber-950/50 transition-all min-h-[170px] md:min-h-0 md:col-start-1 md:row-start-2 cursor-pointer overflow-hidden z-10 m-1 md:m-2"
        >
          <div className="relative w-full h-full min-h-[160px] md:min-h-0 rounded-lg overflow-hidden">
            <Image
              src="/assets/phone.png"
              alt="Vintage rotary telephone for contact and inquiries"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 20vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-70 group-hover:opacity-40 transition-opacity" />
            <div className="absolute bottom-2.5 left-2 right-2 text-center z-10">
              <span className="font-serif text-xs md:text-sm lg:text-base font-bold tracking-[0.2em] uppercase text-stone-100 drop-shadow-md block">
                Phone
              </span>
              <span className="text-[9px] md:text-[10px] font-mono tracking-wider uppercase text-amber-300/80">
                Contact & Inquiries
              </span>
            </div>
          </div>
        </motion.section>

        {/* ROW 2 · COL 2: MENU BOOK (Next.js <Image /> & Interactive Item) */}
        <motion.section
          aria-label="Menu Book Section"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col items-center justify-center rounded-xl border border-white/5 md:border-transparent hover:border-amber-400/60 bg-black/40 md:bg-black/10 hover:bg-black/20 hover:shadow-2xl hover:shadow-amber-950/50 transition-all min-h-[180px] md:min-h-0 md:col-start-2 md:row-start-2 cursor-pointer overflow-hidden z-10 m-1 md:m-2"
        >
          <div className="relative w-full h-full min-h-[170px] md:min-h-0 rounded-lg overflow-hidden">
            <Image
              src="/assets/menu-book.png"
              alt="Handcrafted Lemari Coffee Menu Book"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 20vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-70 group-hover:opacity-40 transition-opacity" />
            <div className="absolute bottom-2.5 left-2 right-2 text-center z-10">
              <span className="font-serif text-sm md:text-base lg:text-lg font-bold tracking-[0.25em] uppercase text-amber-100 drop-shadow-md block">
                Menu Book
              </span>
              <span className="text-[9px] md:text-[10px] font-mono tracking-wider uppercase text-amber-300/80">
                Artisan Brews & Treats
              </span>
            </div>
          </div>
        </motion.section>

        {/* ROW 2 · COL 3: THE STORY (Interactive Item) */}
        <motion.section
          aria-label="The Story Section"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border border-white/5 md:border-transparent hover:border-amber-400/60 bg-black/40 md:bg-black/10 hover:bg-black/30 backdrop-blur-[2px] hover:shadow-2xl hover:shadow-amber-950/40 transition-all min-h-[150px] md:min-h-0 md:col-start-3 md:row-start-2 cursor-pointer overflow-hidden z-10 m-1 md:m-2"
        >
          <div className="text-center">
            <h2 className="font-serif text-base md:text-lg lg:text-xl font-bold tracking-[0.25em] uppercase text-amber-100 group-hover:text-amber-50 drop-shadow-lg transition-colors">
              The Story
            </h2>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300/80 mt-1 block opacity-80 group-hover:opacity-100 transition-opacity">
              Our Heritage ↗
            </span>
          </div>
        </motion.section>

        {/* ROW 2 & 3 · COL 4: SHIRT / MERCH (Next.js <Image />, Spans 2 Rows on Desktop & Interactive Item) */}
        <motion.section
          aria-label="Merch Section"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col items-center justify-center rounded-xl border border-white/5 md:border-transparent hover:border-amber-400/70 bg-black/40 md:bg-black/10 hover:bg-black/20 hover:shadow-2xl hover:shadow-amber-950/60 transition-all min-h-[260px] md:min-h-0 md:col-start-4 md:row-start-2 md:row-span-2 cursor-pointer overflow-hidden z-10 m-1 md:m-2"
        >
          <div className="relative w-full h-full min-h-[250px] md:min-h-0 rounded-lg overflow-hidden">
            <Image
              src="/assets/shirt.png"
              alt="Lemari Coffee Signature Merchandise T-Shirts"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 35vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-75 group-hover:opacity-45 transition-opacity" />
            <div className="absolute bottom-3.5 left-3 right-3 text-center z-10">
              <span className="font-serif text-lg md:text-2xl lg:text-3xl font-bold tracking-[0.25em] uppercase text-amber-100 drop-shadow-xl block">
                Merch
              </span>
              <span className="text-[10px] md:text-[11px] font-mono tracking-widest uppercase text-amber-300/80 mt-0.5 block">
                Signature Shirts & Goods
              </span>
            </div>
          </div>
        </motion.section>

        {/* ================= ROW 3 ================= */}

        {/* ROW 3 · COL 1: Empty Grid (Bottom-Left Drawers) -> opacity-0 */}
        <div
          aria-hidden="true"
          className="hidden md:block md:col-start-1 md:row-start-3 opacity-0 pointer-events-none"
        />

        {/* ROW 3 · COL 2: LOCATION & HOURS (Interactive Item) */}
        <motion.section
          aria-label="Location and Hours Section"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border border-white/5 md:border-transparent hover:border-amber-400/60 bg-black/40 md:bg-black/10 hover:bg-black/30 backdrop-blur-[2px] hover:shadow-2xl hover:shadow-amber-950/40 transition-all min-h-[160px] md:min-h-0 md:col-start-2 md:row-start-3 cursor-pointer overflow-hidden z-10 m-1 md:m-2"
        >
          <div className="text-center font-serif text-sm md:text-base lg:text-lg font-bold tracking-[0.25em] uppercase text-stone-100 flex flex-col items-center group-hover:text-amber-50 transition-colors drop-shadow-md">
            <span>Location</span>
            <span className="text-xs font-light my-0.5 text-amber-400/80 tracking-normal">&</span>
            <span>Hours</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300/80 mt-1 block opacity-80 group-hover:opacity-100 transition-opacity">
            View Schedule ↗
          </span>
        </motion.section>

        {/* ROW 3 · COL 3: RESERVATION (Interactive Item) */}
        <motion.section
          aria-label="Reservation Section"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border border-white/5 md:border-transparent hover:border-amber-400/60 bg-black/40 md:bg-black/10 hover:bg-black/30 backdrop-blur-[2px] hover:shadow-2xl hover:shadow-amber-950/40 transition-all min-h-[150px] md:min-h-0 md:col-start-3 md:row-start-3 cursor-pointer overflow-hidden z-10 m-1 md:m-2"
        >
          <div className="text-center">
            <h2 className="font-serif text-base md:text-lg lg:text-xl font-bold tracking-[0.25em] uppercase text-amber-100 group-hover:text-amber-50 drop-shadow-lg transition-colors">
              Reservation
            </h2>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300/80 mt-1 block opacity-80 group-hover:opacity-100 transition-opacity">
              Book a Table ↗
            </span>
          </div>
        </motion.section>

      </div>
    </main>
  );
}
