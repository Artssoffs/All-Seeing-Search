import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, CreditCard, Coins } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBuySuccess: (creditsAdded: number) => void;
}

export const BuyPackagesModal: React.FC<Props> = ({ isOpen, onClose, onBuySuccess }) => {
  const [selectedPkg, setSelectedPkg] = useState<number>(20);
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card' | 'stars'>('crypto');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const packages = [
    { id: 10, queries: 10, price: '490 ₽', popular: false },
    { id: 20, queries: 25, price: '890 ₽', popular: true, bonus: '+5 бонусом' },
    { id: 50, queries: 75, price: '1,990 ₽', popular: false, bonus: '+25 бонусом' },
    { id: 100, queries: 200, price: '3,990 ₽', popular: false, bonus: '+100 безлимит' },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const pkg = packages.find(p => p.id === selectedPkg);
      onBuySuccess(pkg ? pkg.queries : 20);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-[#17212b] border border-[#2b3a4d] w-full max-w-md rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl text-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-400 border border-purple-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Купить поисковые запросы</h3>
            <p className="text-xs text-gray-400">Выберите подходящий пакет для мгновенного зачисления</p>
          </div>
        </div>

        {/* Packages List */}
        <div className="grid grid-cols-1 gap-2.5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPkg(pkg.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between relative ${
                selectedPkg === pkg.id
                  ? 'bg-purple-950/50 border-purple-500 shadow-md ring-1 ring-purple-500'
                  : 'bg-[#0f1721] border-[#293747] hover:border-gray-600'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2 right-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Хит продаж
                </span>
              )}
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className={`w-5 h-5 ${selectedPkg === pkg.id ? 'text-purple-400' : 'text-gray-600'}`} />
                <div>
                  <div className="font-bold text-sm text-white">
                    {pkg.queries} запросов
                  </div>
                  {pkg.bonus && <div className="text-[10px] text-emerald-400 font-medium">{pkg.bonus}</div>}
                </div>
              </div>
              <div className="font-extrabold text-sm text-cyan-300 font-mono">
                {pkg.price}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="space-y-1.5 pt-2 border-t border-[#2b3a4d]">
          <span className="text-xs text-gray-400 block font-medium">Способ оплаты:</span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setPaymentMethod('crypto')}
              className={`py-2 px-2 rounded-xl border flex flex-col items-center justify-center space-y-1 ${
                paymentMethod === 'crypto'
                  ? 'bg-purple-900/60 border-purple-500 text-white'
                  : 'bg-[#0f1721] border-[#293747] text-gray-400'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Crypto / USDT</span>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`py-2 px-2 rounded-xl border flex flex-col items-center justify-center space-y-1 ${
                paymentMethod === 'card'
                  ? 'bg-purple-900/60 border-purple-500 text-white'
                  : 'bg-[#0f1721] border-[#293747] text-gray-400'
              }`}
            >
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Карта МИР/Visa</span>
            </button>
            <button
              onClick={() => setPaymentMethod('stars')}
              className={`py-2 px-2 rounded-xl border flex flex-col items-center justify-center space-y-1 ${
                paymentMethod === 'stars'
                  ? 'bg-purple-900/60 border-purple-500 text-white'
                  : 'bg-[#0f1721] border-[#293747] text-gray-400'
              }`}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>TG Stars</span>
            </button>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
        >
          {isProcessing ? (
            <span>Обработка платежа...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Оплатить и пополнить баланс</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
