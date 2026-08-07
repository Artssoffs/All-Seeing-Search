import React from 'react';
import { Bot, FileText, Zap, ShieldCheck } from 'lucide-react';

interface Props {
  activeView: 'telegram' | 'sherlock' | 'presets';
  setActiveView: (view: 'telegram' | 'sherlock' | 'presets') => void;
  hasActiveReport: boolean;
  queriesLeft: number;
}

export const HeaderNavigation: React.FC<Props> = ({
  activeView,
  setActiveView,
  hasActiveReport,
  queriesLeft,
}) => {
  return (
    <header className="bg-[#111827] border-b border-gray-800 text-white px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
          🔍
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-semibold leading-tight flex items-center gap-1.5">
            All-Seeing Search Bot
            <span className="text-[10px] bg-purple-900/80 text-purple-300 px-1.5 py-0.5 rounded border border-purple-700/50">
              v5.0 AI
            </span>
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">
            Всевидящий поиск и интеллектуальный анализ цифрового следа
          </p>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="flex items-center bg-gray-900/90 p-1 rounded-lg border border-gray-800 text-xs font-medium">
        <button
          onClick={() => setActiveView('telegram')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
            activeView === 'telegram'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Телеграм Бот</span>
        </button>

        <button
          onClick={() => setActiveView('sherlock')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
            activeView === 'sherlock'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="relative">
            All-Seeing Report
            {hasActiveReport && (
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            )}
          </span>
        </button>

        <button
          onClick={() => setActiveView('presets')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition-all ${
            activeView === 'presets'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Примеры</span>
        </button>
      </div>

      {/* Credit Counter */}
      <div className="hidden lg:flex items-center space-x-2 bg-purple-950/40 border border-purple-800/50 text-purple-200 text-xs px-2.5 py-1 rounded-full">
        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
        <span>Запросов: <strong className="text-white">{queriesLeft}</strong></span>
      </div>
    </header>
  );
};
