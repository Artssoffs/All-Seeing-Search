import React, { useState } from 'react';
import { HeaderNavigation } from './components/HeaderNavigation';
import { TelegramBotView } from './components/TelegramBotView';
import { SherlockReportView } from './components/SherlockReportView';
import { BuyPackagesModal } from './components/BuyPackagesModal';
import { UserProfileModal } from './components/UserProfileModal';
import { PartnerProgramModal } from './components/PartnerProgramModal';
import { BotStatsModal } from './components/BotStatsModal';
import { TelegramMessage, OsintReport, PartialSearchParams, UserStats } from './types';
import { SAMPLE_REPORTS } from './sampleData';
import { Search, Sparkles, FileText, Phone, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from './components/AuthContext';

export default function App() {
  const { user, signInWithGoogle, getToken, loading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState<'telegram' | 'sherlock' | 'presets'>('telegram');
  const [currentReport, setCurrentReport] = useState<OsintReport | null>(SAMPLE_REPORTS['380933745829']);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // User Stats state
  const [userStats, setUserStats] = useState<UserStats>({
    queriesLeft: 15,
    totalSearches: 4,
    referrals: 2,
    userId: 7239941677,
    userTag: '@Thuglifepodol',
  });

  // Initial Chat Messages matching Telegram UI
  const [messages, setMessages] = useState<TelegramMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: `👁 Добро пожаловать в All-Seeing Search Bot v5.0 AI!

Всевидящий поисковый бот анализирует данные по номеру телефона, ФИО, авто, кадастру, домену или ИНН из доступных баз данных и публичных источников.

👇 Воспользуйтесь меню или просто введите номер телефона в формате +380... или +7...`,
      time: '12:00',
    },
    {
      id: 'msg_sample_user',
      sender: 'user',
      text: '+380 93 374 58 29',
      time: '12:01',
    },
    {
      id: 'msg_sample_bot',
      sender: 'bot',
      text: '👁 Выполнен поиск All-Seeing Search:',
      report: SAMPLE_REPORTS['380933745829'],
      time: '12:01',
    },
  ]);

  // Handle Search Request to Express Backend
  const executeSearch = async (queryStr: string, partialParams?: PartialSearchParams, photoBase64?: string) => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Необходима авторизация. Войдите через Google.');
      }
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: queryStr,
          queryType: photoBase64 ? 'photo' : partialParams ? 'name' : 'phone',
          partialParams,
          faceImage: photoBase64 ? true : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера (код ${response.status})`);
      }

      const data = await response.json();
      if (data.success && data.report) {
        const report: OsintReport = data.report;
        setCurrentReport(report);

        // Add user message to chat
        const timeNow = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        const userMsgText = photoBase64
          ? '📷 [Загружено фото лица для распознавания]'
          : partialParams
          ? `📄 [Поиск по неполным данным: ${partialParams.lastName || ''} ${partialParams.firstName || ''}]`
          : queryStr;

        const newMsgUser: TelegramMessage = {
          id: `msg_u_${Date.now()}`,
          sender: 'user',
          text: userMsgText,
          time: timeNow,
        };

        const newMsgBot: TelegramMessage = {
          id: `msg_b_${Date.now()}`,
          sender: 'bot',
          text: `🔍 Результат поиска для "${report.query}":`,
          report: report,
          time: timeNow,
        };

        setMessages((prev) => [...prev, newMsgUser, newMsgBot]);

        setUserStats((prev) => ({
          ...prev,
          queriesLeft: Math.max(0, prev.queriesLeft - 1),
          totalSearches: prev.totalSearches + 1,
        }));
      } else {
        throw new Error(data.error || 'Данные по запросу не найдены');
      }
    } catch (err: any) {
      console.error("Search execution error:", err);
      const timeNow = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'bot',
          text: `⚠️ Не удалось выполнить поиск: ${err?.message || 'Неизвестная ошибка'}. Попробуйте еще раз.`,
          time: timeNow,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (text: string, photoBase64?: string) => {
    if (text === '/start') {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_cmd_${Date.now()}`,
          sender: 'bot',
          text: '🤖 Бот перезапущен. Введите телефон, ФИО, ИНН или фото:',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }
    if (text === '/mybots') {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_bots_${Date.now()}`,
          sender: 'bot',
          text: '🤖 Подключенные боты системы:\n1. @AllSeeingSearchBot (Главный)\n2. @AllSeeingSearch_backup_bot (Резерв)\n3. @CryptoInvestCheckBot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }
    executeSearch(text, undefined, photoBase64);
  };

  const handlePartialSearch = (params: PartialSearchParams) => {
    const summaryStr = [params.lastName, params.firstName, params.middleName, params.year].filter(Boolean).join(' ');
    executeSearch(summaryStr || 'Поиск по параметрам', params);
  };

  const handleOpenReport = (report: OsintReport) => {
    setCurrentReport(report);
    setActiveView('sherlock');
  };

  const handleBuySuccess = (added: number) => {
    setUserStats((prev) => ({ ...prev, queriesLeft: prev.queriesLeft + added }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-cyan-400">
        <Sparkles className="w-8 h-8 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex flex-col items-center justify-center text-gray-100 font-sans p-4">
        <div className="max-w-md w-full bg-[#131d2a] border border-[#233345] rounded-2xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto border border-cyan-500/20">
            <ShieldAlert className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold">Доступ закрыт</h2>
          <p className="text-gray-400 text-sm">
            Для использования All-Seeing Search Bot необходимо авторизоваться в системе.
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-cyan-900/20"
          >
            Войти через Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <HeaderNavigation
        activeView={activeView}
        setActiveView={setActiveView}
        hasActiveReport={!!currentReport}
        queriesLeft={userStats.queriesLeft}
      />

      <main className="flex-1">
        {/* VIEW 1: TELEGRAM BOT INTERFACE */}
        {activeView === 'telegram' && (
          <TelegramBotView
            messages={messages}
            onSendMessage={handleSendMessage}
            onPartialSearch={handlePartialSearch}
            onOpenReport={handleOpenReport}
            onOpenBuyModal={() => setShowBuyModal(true)}
            onOpenProfileModal={() => setShowProfileModal(true)}
            onOpenPartnerModal={() => setShowPartnerModal(true)}
            onOpenStatsModal={() => setShowStatsModal(true)}
            isLoading={isLoading}
          />
        )}

        {/* VIEW 2: SHERLOCK REPORT FULLSCREEN WEBAPP */}
        {activeView === 'sherlock' && (
          <SherlockReportView
            report={currentReport}
            onClose={() => setActiveView('telegram')}
          />
        )}

        {/* VIEW 3: PRESETS & SAMPLE TEST TARGETS */}
        {activeView === 'presets' && (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="text-center space-y-2 border-b border-gray-800 pb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span>Готовые тестовые мишени OSINT</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
                Выбирайте любые сохраненные тестовые данные, чтобы мгновенно просмотреть карточки в Телеграм боте или развернуть WebApp отчет All-Seeing Search!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preset 1 */}
              <div className="bg-[#131d2a] border border-[#233345] rounded-2xl p-5 space-y-3 hover:border-cyan-500/50 transition-all shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                    +380 93 374 58 29
                  </span>
                  <span className="text-[10px] text-gray-400">lifecell, Украина</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Михаил (Рома) / @Thuglifepodol</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    14+ тегов в телефонных книгах, TikTok, PrivatBank 2020, Ощадбанк 2023, обращение в поддержку.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      executeSearch('+380 93 374 58 29');
                      setActiveView('telegram');
                    }}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-3 rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Запустить в боте</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentReport(SAMPLE_REPORTS['380933745829']);
                      setActiveView('sherlock');
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-3 rounded-xl text-xs shadow transition-colors"
                  >
                    Открыть WebApp отчет
                  </button>
                </div>
              </div>

              {/* Preset 2 */}
              <div className="bg-[#131d2a] border border-[#233345] rounded-2xl p-5 space-y-3 hover:border-indigo-500/50 transition-all shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-800/50">
                    +380 50 847 33 51
                  </span>
                  <span className="text-[10px] text-gray-400">Vodafone, Украина</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Чернухина Анастасия Викторовна</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    15.02.1956 г.р., Ощад банк 2023, Accordbank 2022, PrivatBank 2020, паспорт ВС688166, ИНН 2049916105.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      executeSearch('+380 50 847 33 51');
                      setActiveView('telegram');
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-3 rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Запустить в боте</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentReport(SAMPLE_REPORTS['380508473351']);
                      setActiveView('sherlock');
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-3 rounded-xl text-xs shadow transition-colors"
                  >
                    Открыть WebApp отчет
                  </button>
                </div>
              </div>

              {/* Preset 3 */}
              <div className="bg-[#131d2a] border border-[#233345] rounded-2xl p-5 space-y-3 hover:border-purple-500/50 transition-all shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-purple-950 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-800/50">
                    2540214547
                  </span>
                  <span className="text-[10px] text-gray-400">ИНН Юр. лица</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">ООО "АЛЬФА ТРЕЙДИНГ ГРУПП"</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ЕГРЮЛ реестр, ОГРН 1107449004464, юридический адрес г. Владивосток.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      executeSearch('2540214547');
                      setActiveView('telegram');
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-3 rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Запустить в боте</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentReport(SAMPLE_REPORTS['2540214547']);
                      setActiveView('sherlock');
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-3 rounded-xl text-xs shadow transition-colors"
                  >
                    Открыть WebApp отчет
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <BuyPackagesModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onBuySuccess={handleBuySuccess}
      />
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        stats={userStats}
        onBuyClick={() => setShowBuyModal(true)}
      />
      <PartnerProgramModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        stats={userStats}
      />
      <BotStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
      />
    </div>
  );
}

