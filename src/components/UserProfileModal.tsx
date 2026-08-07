import React from 'react';
import { X, User, ShieldCheck, Search, Key, Sparkles } from 'lucide-react';
import { UserStats } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onBuyClick: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ isOpen, onClose, stats, onBuyClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-[#17212b] border border-[#2b3a4d] w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl text-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-[#2b3a4d] pb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-inner">
            🕵️
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Мой профиль Sherlock</h3>
            <p className="text-xs text-cyan-400 font-mono">ID: {stats.userId}</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747] flex items-center justify-between">
            <span className="text-gray-400">Осталось запросов:</span>
            <strong className="text-emerald-400 text-sm font-mono font-bold">{stats.queriesLeft} шт</strong>
          </div>

          <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747] flex items-center justify-between">
            <span className="text-gray-400">Всего выполнено поисков:</span>
            <strong className="text-white font-mono">{stats.totalSearches}</strong>
          </div>

          <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747] flex items-center justify-between">
            <span className="text-gray-400">Приглашено рефералов:</span>
            <strong className="text-amber-400 font-mono">{stats.referrals} чел</strong>
          </div>

          <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747] flex items-center justify-between">
            <span className="text-gray-400">Статус аккаунта:</span>
            <span className="text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full">
              PRO ACCESS
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            onBuyClick();
          }}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Пополнить баланс запросов</span>
        </button>
      </div>
    </div>
  );
};
