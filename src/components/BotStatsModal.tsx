import React from 'react';
import { X, Server, Database, Activity, ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BotStatsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
            📊
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Статистика и статус системы</h3>
            <p className="text-xs text-gray-400">Параметры баз данных и текущая загрузка сервера</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747] flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-400" /> Проиндексировано записей:
            </span>
            <strong className="text-cyan-300 font-mono">1,420,890,140+</strong>
          </div>

          <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747] flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" /> Статус серверов:
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ONLINE (0.04s)
            </span>
          </div>

          <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747] flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> Версия поискового ядра:
            </span>
            <strong className="text-white font-mono">v4.8 PRO OSINT</strong>
          </div>

          <div className="bg-[#0f1721] p-3 rounded-xl border border-[#293747] flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> Активных нод:
            </span>
            <strong className="text-gray-200 font-mono">18 кластеров</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
