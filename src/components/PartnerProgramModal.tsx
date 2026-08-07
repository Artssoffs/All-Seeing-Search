import React, { useState } from 'react';
import { X, Copy, Check, Users, Gift, Share2 } from 'lucide-react';
import { UserStats } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
}

export const PartnerProgramModal: React.FC<Props> = ({ isOpen, onClose, stats }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const referralLink = `https://t.me/AllSeeingSearchBot?start=ref_${stats.userId}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(referralLink);
      }
    } catch (e) {
      console.warn("Copy link error:", e);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-[#17212b] border border-[#2b3a4d] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl text-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-[#2b3a4d] pb-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
            🤝
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Партнерская программа</h3>
            <p className="text-xs text-gray-400">Приглашайте друзей и получайте бесплатные запросы</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747] space-y-2">
            <span className="text-gray-400 block">Ваша реферальная ссылка:</span>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-[#182533] border border-[#2b3a4d] rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg shrink-0 transition-colors"
                title="Скопировать"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747]">
              <span className="text-gray-400 block text-[11px]">Приглашено:</span>
              <strong className="text-amber-400 text-base font-bold">{stats.referrals} чел</strong>
            </div>
            <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747]">
              <span className="text-gray-400 block text-[11px]">Заработано:</span>
              <strong className="text-emerald-400 text-base font-bold">{stats.referrals * 3} запросов</strong>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed bg-purple-950/30 p-2.5 rounded-lg border border-purple-900/40">
            🎁 Вы получаете <strong className="text-purple-300">+3 бесплатных поиска</strong> за каждого пользователя, перешедшего по вашей ссылке и запустившего бота!
          </p>
        </div>
      </div>
    </div>
  );
};
