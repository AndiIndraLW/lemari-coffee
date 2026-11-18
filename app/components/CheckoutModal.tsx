"use client";

import React, { useState, useEffect } from "react";
import { CartItem, OrderDetails } from "../types/commerce";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryMethod: "shipping" | "pickup";
  setDeliveryMethod: (method: "shipping" | "pickup") => void;
  onCompleteOrder: (order: OrderDetails) => void;
  lang: "EN" | "JP";
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  deliveryMethod,
  setDeliveryMethod,
  onCompleteOrder,
  lang,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [prefecture, setPrefecture] = useState("Tokyo");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = deliveryMethod === "pickup" ? 0 : subtotal >= 5000 ? 0 : 600;
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep("details");
      setIsSubmitting(false);
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "success") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, step]);

  if (!isOpen) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (deliveryMethod === "shipping" && (!postalCode.trim() || !address.trim())) return;
    setStep("payment");
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `LMR-${Math.floor(100000 + Math.random() * 900000)}`;
      const order: OrderDetails = {
        orderId,
        items,
        subtotal,
        shipping: shippingFee,
        total,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        deliveryMethod,
        postalCode: deliveryMethod === "shipping" ? postalCode : undefined,
        prefecture: deliveryMethod === "shipping" ? prefecture : undefined,
        address: deliveryMethod === "shipping" ? address : undefined,
        paymentMethod,
        note: note.trim() || undefined,
        createdAt: new Date().toLocaleDateString(lang === "EN" ? "en-US" : "ja-JP", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setCompletedOrder(order);
      setIsSubmitting(false);
      setStep("success");
      onCompleteOrder(order);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== "success") onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FAF5EC] text-[#241A12] w-full max-w-2xl rounded-[14px] shadow-[0_24px_80px_rgba(36,26,18,0.25)] relative max-h-[94vh] flex flex-col overflow-hidden animate-modal-pop">
        
        {/* Modal Top Header */}
        <div className="px-6 sm:px-8 pt-7 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-[18px] font-medium tracking-[1.4px] text-[#241A12]">
              LEMARI
            </span>
            <span className="text-[#C4B29F]">·</span>
            <span className="font-serif italic text-xs text-[#8C7663]">
              {step === "details"
                ? lang === "EN" ? "1. Destination & Roasting Note" : "1. お届け先・連絡先"
                : step === "payment"
                ? lang === "EN" ? "2. Secure Settlement" : "2. お支払い方法"
                : lang === "EN" ? "3. Confirmed & Sealed" : "3. ご注文完了"}
            </span>
          </div>
          {step !== "success" && (
            <button
              onClick={onClose}
              className="text-[#8C7663] hover:text-[#241A12] p-1.5 rounded-full hover:bg-[#EADCC8] transition-colors cursor-pointer"
              title="Close checkout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-8 pt-2">
          
          {/* STEP 1: CONTACT & SHIPPING */}
          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-6">
              <div>
                <h3 className="font-serif text-[26px] font-normal text-[#241A12] leading-tight">
                  {lang === "EN" ? "Where shall we send your coffee?" : "お届け先をご入力ください"}
                </h3>
                <p className="font-serif italic text-xs text-[#8C7663] mt-1">
                  {lang === "EN"
                    ? "Carefully roasted in Tokyo, packaged in protective aroma-sealed craft pouches."
                    : "神宮前ロースタリーにて丁寧に焙煎、香り逃さぬアロマシールパックでお届けします。"}
                </p>
              </div>

              {/* Delivery method toggle — seamless pill */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F2E7D5] rounded-full text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("shipping")}
                  className={`flex-1 py-2 px-3 rounded-full text-center transition-all cursor-pointer ${
                    deliveryMethod === "shipping"
                      ? "bg-[#241A12] text-[#FAF5EC] font-medium shadow-xs"
                      : "text-[#6A5747] hover:text-[#241A12]"
                  }`}
                >
                  📦 {lang === "EN" ? "Nationwide Takkyubin Delivery" : "宅急便配送（全国）"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`flex-1 py-2 px-3 rounded-full text-center transition-all cursor-pointer ${
                    deliveryMethod === "pickup"
                      ? "bg-[#241A12] text-[#FAF5EC] font-medium shadow-xs"
                      : "text-[#6A5747] hover:text-[#241A12]"
                  }`}
                >
                  🏪 {lang === "EN" ? "In-Store Pickup (Free)" : "店舗受取（無料）"}
                </button>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-serif italic text-[11px] text-[#7A6453]">
                    {lang === "EN" ? "Full Name *" : "お名前 *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === "EN" ? "Aoi Tanaka" : "田中 葵"}
                    className="py-2.5 px-3.5 bg-[#F2E7D5]/70 rounded-[6px] text-xs text-[#241A12] focus:outline-hidden focus:bg-[#EFE2D0]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-serif italic text-[11px] text-[#7A6453]">
                    {lang === "EN" ? "Email Address *" : "メールアドレス *"}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aoi@example.jp"
                    className="py-2.5 px-3.5 bg-[#F2E7D5]/70 rounded-[6px] text-xs text-[#241A12] focus:outline-hidden focus:bg-[#EFE2D0]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-serif italic text-[11px] text-[#7A6453]">
                  {lang === "EN" ? "Phone Number" : "電話番号"}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="080-1234-5678"
                  className="py-2.5 px-3.5 bg-[#F2E7D5]/70 rounded-[6px] text-xs text-[#241A12] focus:outline-hidden focus:bg-[#EFE2D0]"
                />
              </div>

              {/* Address Fields if shipping */}
              {deliveryMethod === "shipping" && (
                <div className="flex flex-col gap-4 pt-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-serif italic text-[11px] text-[#7A6453]">
                        {lang === "EN" ? "Postal Code (Japan) *" : "郵便番号 *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="150-0001"
                        className="py-2.5 px-3.5 bg-[#F2E7D5]/70 rounded-[6px] text-xs text-[#241A12] focus:outline-hidden focus:bg-[#EFE2D0]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-serif italic text-[11px] text-[#7A6453]">
                        {lang === "EN" ? "Prefecture *" : "都道府県 *"}
                      </label>
                      <select
                        value={prefecture}
                        onChange={(e) => setPrefecture(e.target.value)}
                        className="py-2.5 px-3.5 bg-[#F2E7D5]/70 rounded-[6px] text-xs text-[#241A12] focus:outline-hidden focus:bg-[#EFE2D0] cursor-pointer"
                      >
                        <option value="Tokyo">Tokyo / 東京都</option>
                        <option value="Kanagawa">Kanagawa / 神奈川県</option>
                        <option value="Osaka">Osaka / 大阪府</option>
                        <option value="Kyoto">Kyoto / 京都府</option>
                        <option value="Hokkaido">Hokkaido / 北海道</option>
                        <option value="Fukuoka">Fukuoka / 福岡県</option>
                        <option value="Other">Other / その他道府県</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-serif italic text-[11px] text-[#7A6453]">
                      {lang === "EN" ? "Street Address & Building / Apt *" : "住所・番地・建物名・部屋番号 *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={lang === "EN" ? "2-14-6 Jingumae, Shibuya-ku #301" : "渋谷区神宮前2-14-6 #301"}
                      className="py-2.5 px-3.5 bg-[#F2E7D5]/70 rounded-[6px] text-xs text-[#241A12] focus:outline-hidden focus:bg-[#EFE2D0]"
                    />
                  </div>
                </div>
              )}

              {/* Roasting or Gift Note */}
              <div className="flex flex-col gap-1.5">
                <label className="font-serif italic text-[11px] text-[#7A6453]">
                  {lang === "EN" ? "Roaster's Note or Gift Dedication (Optional)" : "焙煎指定・ギフトメッセージ（任意）"}
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    lang === "EN"
                      ? "e.g. Please grind one bag for Aeropress, or include a gift wrap."
                      : "例：1袋はエアロプレス用に中細挽き希望、ギフト用に紙袋を同封希望など"
                  }
                  className="py-2.5 px-3.5 bg-[#F2E7D5]/70 rounded-[6px] text-xs text-[#241A12] focus:outline-hidden focus:bg-[#EFE2D0] resize-none"
                />
              </div>

              {/* Order summary bar */}
              <div className="p-4 bg-[#F2E7D5]/70 rounded-[8px] flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif text-[#241A12] text-sm">
                    {items.length} {lang === "EN" ? "item(s)" : "点の品物"}
                  </span>
                  <span className="text-[#8C7663] ml-2 font-serif italic">
                    {deliveryMethod === "pickup" ? "(Nakameguro Pickup)" : shippingFee === 0 ? "(Free Shipping)" : "(+¥600 Shipping)"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-[18px] font-bold text-[#CE522A]">¥{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-full bg-[#241A12] hover:bg-[#CE522A] text-[#FAF5EC] font-serif text-[13.5px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{lang === "EN" ? "Continue to Payment" : "お支払い手続きへ進む"}</span>
                <span>→</span>
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT */}
          {step === "payment" && (
            <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-[26px] font-normal text-[#241A12]">
                    {lang === "EN" ? "Payment Method" : "お支払い方法を選択"}
                  </h3>
                  <p className="font-serif italic text-xs text-[#8C7663] mt-0.5">
                    {lang === "EN" ? "Encrypted and processed instantly." : "安全な暗号化決済にて承ります。"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="font-serif italic text-xs text-[#CE522A] hover:underline cursor-pointer"
                >
                  ← {lang === "EN" ? "Edit details" : "お届け先を変更"}
                </button>
              </div>

              {/* Seamless payment options */}
              <div className="space-y-3">
                {/* Credit Card */}
                <label className={`p-4 rounded-[8px] flex flex-col gap-3 cursor-pointer transition-all ${
                  paymentMethod === "credit-card"
                    ? "bg-[#F2E7D5] shadow-xs"
                    : "bg-[#F2E7D5]/40 hover:bg-[#F2E7D5]/70"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "credit-card"}
                        onChange={() => setPaymentMethod("credit-card")}
                        className="accent-[#CE522A]"
                      />
                      <span className="text-xs font-serif font-medium text-[#241A12]">
                        💳 {lang === "EN" ? "Credit Card (Visa, Mastercard, JCB, Amex)" : "クレジットカード (VISA, Master, JCB, AMEX)"}
                      </span>
                    </div>
                  </div>

                  {paymentMethod === "credit-card" && (
                    <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full py-2 px-3 bg-[#FAF5EC] rounded-[4px] text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full py-2 px-3 bg-[#FAF5EC] rounded-[4px] text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full py-2 px-3 bg-[#FAF5EC] rounded-[4px] text-xs"
                        />
                      </div>
                    </div>
                  )}
                </label>

                {/* Apple Pay */}
                <label className={`p-3.5 rounded-[8px] flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "apple-pay"
                    ? "bg-[#F2E7D5] shadow-xs"
                    : "bg-[#F2E7D5]/40 hover:bg-[#F2E7D5]/70"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "apple-pay"}
                      onChange={() => setPaymentMethod("apple-pay")}
                      className="accent-[#CE522A]"
                    />
                    <span className="text-xs font-serif font-medium text-[#241A12]">
                      🍏 Apple Pay / Google Pay
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8C7663] font-serif italic">Instant</span>
                </label>

                {/* PayPay */}
                <label className={`p-3.5 rounded-[8px] flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "paypay"
                    ? "bg-[#F2E7D5] shadow-xs"
                    : "bg-[#F2E7D5]/40 hover:bg-[#F2E7D5]/70"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "paypay"}
                      onChange={() => setPaymentMethod("paypay")}
                      className="accent-[#CE522A]"
                    />
                    <span className="text-xs font-serif font-medium text-[#241A12]">
                      📱 PayPay / コンビニ決済
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8C7663] font-serif italic">Japan</span>
                </label>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 bg-[#F2E7D5]/70 rounded-[8px] flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-[#7A6453]">
                  <span className="font-serif italic">{lang === "EN" ? "Customer" : "ご注文者様"}</span>
                  <span className="text-[#241A12]">{name} ({email})</span>
                </div>
                <div className="flex justify-between text-[#7A6453]">
                  <span className="font-serif italic">{lang === "EN" ? "Delivery to" : "配送先"}</span>
                  <span className="text-[#241A12]">
                    {deliveryMethod === "pickup"
                      ? lang === "EN" ? "Nakameguro Store" : "中目黒ロースタリー店頭"
                      : `${postalCode} ${prefecture} ${address}`}
                  </span>
                </div>
                <div className="pt-2 flex justify-between items-baseline">
                  <span className="font-serif text-sm font-medium text-[#241A12]">{lang === "EN" ? "Total Amount" : "ご請求総額"}</span>
                  <span className="font-serif text-[22px] font-bold text-[#CE522A]">
                    ¥{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-full bg-[#CE522A] hover:bg-[#B34522] text-[#FAF5EC] font-serif text-[13.5px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>{lang === "EN" ? "Sealing Order..." : "注文を処理しています..."}</span>
                ) : (
                  <span>
                    {lang === "EN"
                      ? `Complete Order · ¥${total.toLocaleString()}`
                      : `注文を確定する · ¥${total.toLocaleString()}`}
                  </span>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
          {step === "success" && completedOrder && (
            <div className="flex flex-col items-center text-center py-6 gap-6">
              <div className="w-16 h-16 rounded-full bg-[#2D6A4F] text-[#FAF5EC] flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="flex flex-col gap-1.5 max-w-md">
                <span className="font-serif italic text-xs tracking-wider text-[#CE522A]">
                  {lang === "EN" ? "THANK YOU" : "ありがとうございます"}
                </span>
                <h3 className="font-serif text-[28px] sm:text-[32px] font-normal text-[#241A12] leading-tight">
                  {lang === "EN" ? "A little of the cupboard is on its way." : "戸棚の温もりをお届けします。"}
                </h3>
                <p className="text-xs text-[#8C7663] mt-1 leading-[20px]">
                  {lang === "EN"
                    ? `A confirmation receipt has been sent to ${completedOrder.customerEmail}. We will roast and pack your lot fresh.`
                    : `確認メールを ${completedOrder.customerEmail} 宛に送信いたしました。焙煎したての豆を大切に梱包してお届けします。`}
                </p>
              </div>

              {/* Order receipt card — borderless warm paper */}
              <div className="w-full max-w-md bg-[#F2E7D5]/70 p-5 rounded-[10px] text-left text-xs flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2">
                  <span className="font-serif text-[#241A12]">
                    {lang === "EN" ? "Order Reference" : "注文番号"}
                  </span>
                  <span className="font-mono text-[#CE522A] font-bold text-sm">
                    {completedOrder.orderId}
                  </span>
                </div>

                <div className="space-y-1.5 py-1">
                  {completedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center font-serif">
                      <span className="text-[#241A12] truncate max-w-[240px]">
                        {lang === "EN" ? item.name : item.nameJP} × {item.quantity}
                      </span>
                      <span className="text-[#241A12]">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col gap-1 text-[11.5px]">
                  <div className="flex justify-between text-[#8C7663]">
                    <span>{lang === "EN" ? "Shipping" : "配送料"}</span>
                    <span>{completedOrder.shipping === 0 ? "Complimentary / 無料" : `¥${completedOrder.shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-serif text-[#241A12] text-sm pt-1">
                    <span>{lang === "EN" ? "Total Paid" : "お支払い総額"}</span>
                    <span className="text-[#CE522A] font-bold text-[18px]">¥{completedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="py-3 px-8 rounded-full bg-[#241A12] hover:bg-[#CE522A] text-[#FAF5EC] font-serif text-xs transition-colors cursor-pointer"
              >
                {lang === "EN" ? "Return to the Shop" : "ショップへ戻る"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
