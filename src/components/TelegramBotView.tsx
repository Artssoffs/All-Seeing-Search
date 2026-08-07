import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  ChevronLeft,
  MoreVertical,
  Globe,
  Camera,
  Search,
  User,
  X,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Shield,
  FileSearch,
  Image as ImageIcon
} from 'lucide-react';
import { TelegramMessage, OsintReport, PartialSearchParams } from '../types';

interface Props {
  messages: TelegramMessage[];
  onSendMessage: (text: string, photoBase64?: string) => void;
  onPartialSearch: (params: PartialSearchParams) => void;
  onOpenReport: (report: OsintReport) => void;
  onOpenBuyModal: () => void;
  onOpenProfileModal: () => void;
  onOpenPartnerModal: () => void;
  onOpenStatsModal: () => void;
  isLoading: boolean;
}

export const TelegramBotView: React.FC<Props> = ({
  messages,
  onSendMessage,
  onPartialSearch,
  onOpenReport,
  onOpenBuyModal,
  onOpenProfileModal,
  onOpenPartnerModal,
  onOpenStatsModal,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [showPartialSearchModal, setShowPartialSearchModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [partialParams, setPartialParams] = useState<PartialSearchParams>({
    lastName: '',
    firstName: '',
    middleName: '',
    day: '',
    month: '',
    year: '',
    ageFrom: '',
    ageExact: '',
    ageTo: '',
    birthPlace: '',
    country: 'Россия',
  });
  const [activeFieldKey, setActiveFieldKey] = useState<keyof PartialSearchParams | null>(null);
  const [fieldValueInput, setFieldValueInput] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() && !selectedPhoto) return;
    onSendMessage(inputText.trim(), selectedPhoto || undefined);
    setInputText('');
    setSelectedPhoto(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePartialSubmit = () => {
    onPartialSearch(partialParams);
    setShowPartialSearchModal(false);
  };

  const handleResetPartial = () => {
    setPartialParams({
      lastName: '',
      firstName: '',
      middleName: '',
      day: '',
      month: '',
      year: '',
      ageFrom: '',
      ageExact: '',
      ageTo: '',
      birthPlace: '',
      country: 'Россия',
    });
  };

  const setSampleNumber = (phone: string) => {
    onSendMessage(phone);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] max-w-4xl mx-auto bg-[#0f1721] text-gray-100 font-sans shadow-2xl overflow-hidden border-x border-gray-800">
      {/* Telegram Chat Top Bar (Matching Screenshot 1 & 2) */}
      <div className="bg-[#17212b] px-3 py-2 flex items-center justify-between border-b border-[#242f3d] z-20">
        <div className="flex items-center space-x-3">
          <button className="text-gray-400 hover:text-white p-1 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-base shadow-inner">
            T
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sm text-white flex items-center gap-1.5">
              Trace started
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            </div>
            <div className="text-[11px] text-gray-400">бот</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSendMessage('/start')}
            className="hidden sm:flex items-center space-x-1 bg-[#2b3748] hover:bg-[#38485e] text-xs px-2.5 py-1 rounded-full text-gray-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Перевести на русский</span>
          </button>
          <button className="text-gray-400 hover:text-white p-1">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Target Presets Bar */}
      <div className="bg-[#131b26] border-b border-[#242f3d] px-3 py-1.5 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-gray-400 flex items-center gap-1 shrink-0 font-medium text-[11px]">
          <Sparkles className="w-3 h-3 text-amber-400" /> Тест данные:
        </span>
        <button
          onClick={() => setSampleNumber('+380 93 374 58 29')}
          className="shrink-0 bg-[#212d3b] hover:bg-[#2b3a4d] border border-cyan-800/40 text-cyan-300 px-2.5 py-1 rounded-md transition-colors font-mono"
        >
          +380 93 374 58 29
        </button>
        <button
          onClick={() => setSampleNumber('+380 50 847 33 51')}
          className="shrink-0 bg-[#212d3b] hover:bg-[#2b3a4d] border border-indigo-800/40 text-indigo-300 px-2.5 py-1 rounded-md transition-colors font-mono"
        >
          +380 50 847 33 51
        </button>
        <button
          onClick={() => setSampleNumber('2540214547')}
          className="shrink-0 bg-[#212d3b] hover:bg-[#2b3a4d] border border-purple-800/40 text-purple-300 px-2.5 py-1 rounded-md transition-colors font-mono"
        >
          ИНН 2540214547
        </button>
        <button
          onClick={() => setShowPartialSearchModal(true)}
          className="shrink-0 bg-purple-900/60 hover:bg-purple-800/80 border border-purple-700/60 text-purple-200 px-2.5 py-1 rounded-md transition-colors"
        >
          📄 Поиск по неполным данным
        </button>
      </div>

      {/* Chat Wallpaper Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-[#0e1621] bg-opacity-95 relative"
           style={{
             backgroundImage: `radial-gradient(#1e2c3a 1px, transparent 1px)`,
             backgroundSize: '24px 24px'
           }}
      >
        {/* Intro Telegram Command Help Banner */}
        <div className="max-w-xl mx-auto bg-[#182533]/90 backdrop-blur-sm border border-[#2b3a4d] rounded-xl p-3.5 text-xs text-gray-200 space-y-2.5 shadow-lg">
          <div className="font-semibold text-cyan-400 flex items-center justify-between border-b border-[#2b3a4d] pb-1.5">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" /> Система поисковой аналитики и открытых данных
            </span>
            <span className="text-[10px] text-gray-400">All-Seeing Search v5.0</span>
          </div>

          <div className="space-y-1 text-gray-300 font-mono text-[11px] leading-relaxed">
            <p><span className="text-purple-400 font-bold">/tag</span> хирург москва — Поиск по телефонным книгам</p>
            <p><span className="text-purple-400 font-bold">sherlock.com</span> или <span className="text-purple-400 font-bold">1.1.1.1</span> — домен или IP</p>
            <p className="pt-1"><span className="text-amber-400">🏘 Недвижимость:</span></p>
            <p><span className="text-purple-400 font-bold">/adr</span> Город, Улица, 1</p>
            <p><span className="text-cyan-300 font-bold">77:01:0004042:6987</span> — кадастровый номер</p>
            <p className="pt-1"><span className="text-emerald-400">🏢 Юридическое лицо:</span></p>
            <p><span className="text-purple-400 font-bold">/inn</span> 2540214547 — ИНН или ОГРН</p>
            <p className="pt-1 text-cyan-300 font-sans flex items-center gap-1 font-semibold">
              <Camera className="w-3.5 h-3.5 text-cyan-400" /> Отправьте лицо человека, чтобы попробовать найти его.
            </p>
          </div>
        </div>

        {/* Message Loop */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* User Bubble */}
            {msg.sender === 'user' && (
              <div className="max-w-[85%] sm:max-w-[70%] bg-[#2b5278] text-white rounded-2xl rounded-tr-none px-3.5 py-2 text-sm shadow-md space-y-1">
                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                <div className="text-[10px] text-cyan-200/80 text-right font-mono flex items-center justify-end gap-1">
                  <span>{msg.time}</span>
                  <span className="text-cyan-300">✓✓</span>
                </div>
              </div>
            )}

            {/* Bot Response Bubble / Summary Card (Matching Screenshots 3 & 9) */}
            {msg.sender === 'bot' && (
              <div className="max-w-[92%] sm:max-w-[82%] bg-[#182533] border border-[#2b3a4d] rounded-2xl rounded-tl-none p-3.5 text-xs text-gray-100 shadow-xl space-y-3">
                {msg.text && (
                  <p className="text-gray-200 text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                )}

                {/* Report Summary Card inside Telegram Chat */}
                {msg.report && (
                  <div className="bg-[#0f1923] border border-[#233345] rounded-xl p-3 space-y-2.5">
                    {/* Header Phone & Operator */}
                    <div className="flex items-start justify-between border-b border-[#233345] pb-2">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-cyan-300 font-mono flex items-center gap-1.5">
                          📱 Телефон: {msg.report.basicInfo.phone || msg.report.query}
                        </div>
                        <div className="text-[11px] text-gray-300">
                          ├ <strong>Оператор:</strong> {msg.report.basicInfo.operator || 'Не определен'}
                        </div>
                        <div className="text-[11px] text-gray-300">
                          └ <strong>Страна:</strong> {msg.report.basicInfo.country || 'Не определена'}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 font-bold flex items-center justify-center text-xs">
                        {msg.report.basicInfo.initials}
                      </div>
                    </div>

                    {/* Phonebook Tags */}
                    {msg.report.phonebookTags && msg.report.phonebookTags.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-gray-300 font-semibold flex items-center gap-1 text-[11px]">
                          🔎 <strong>Телефонные книги:</strong>
                        </div>
                        <p className="text-[11px] text-purple-200 bg-purple-950/40 p-2 rounded-lg border border-purple-900/40 leading-relaxed font-sans">
                          {msg.report.phonebookTags.slice(0, 10).join(', ')}
                          {msg.report.phonebookTags.length > 10 ? ` и еще ${msg.report.phonebookTags.length - 10}...` : ''}
                        </p>
                      </div>
                    )}

                    {/* Social Profiles */}
                    {msg.report.socialProfiles && msg.report.socialProfiles.length > 0 && (
                      <div className="space-y-1 text-[11px] text-gray-300 border-t border-[#233345] pt-2">
                        {msg.report.socialProfiles.map((prof, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-amber-400">👤 {prof.service}:</span>
                            <span className="font-mono text-cyan-300">{prof.username}</span>
                            {prof.id && <span className="text-gray-400 text-[10px]">[{prof.id}]</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interested Count */}
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 border-t border-[#233345] pt-1.5">
                      <span>👁 Интересовались этим:</span>
                      <strong className="text-amber-400">{msg.report.interestedCount}</strong>
                    </div>

                    {/* BIG CTA Button: OPEN SHERLOCK REPORT (Screenshots 3 & 9) */}
                    <button
                      onClick={() => onOpenReport(msg.report!)}
                      className="w-full mt-2 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-2.5 px-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] text-xs sm:text-sm border border-red-400/30"
                    >
                      <FileSearch className="w-4 h-4 text-white animate-bounce" />
                      <span>📄 Открыть полный отчет ({msg.report.leakedRecords.length + 4} шт) ↗</span>
                    </button>

                    {/* Secondary direct buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      {msg.report.socialProfiles.find(s => s.service === 'Telegram') && (
                        <a
                          href={msg.report.socialProfiles.find(s => s.service === 'Telegram')?.link || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#212f3e] hover:bg-[#2b3e52] text-cyan-300 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 border border-cyan-800/40 text-center"
                        >
                          <span>💬 Telegram ↗</span>
                        </a>
                      )}
                      <a
                        href={`https://wa.me/${(msg.report.basicInfo.phone || '').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#1f382a] hover:bg-[#284a38] text-emerald-300 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 border border-emerald-800/40 text-center"
                      >
                        <span>📱 WhatsApp ↗</span>
                      </a>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-gray-400 text-right font-mono">
                  {msg.time}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#182533] border border-[#2b3a4d] rounded-xl px-4 py-3 text-xs text-cyan-300 flex items-center space-x-2 shadow-lg animate-pulse">
              <Search className="w-4 h-4 animate-spin text-purple-400" />
              <span>Поиск и интеллектуальный анализ (All-Seeing Search)...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Telegram Interactive Inline Keyboard Menu (Matching Screenshot 1 & 2) */}
      <div className="bg-[#17212b] border-t border-[#242f3d] p-2.5 space-y-2 z-10">
        <div className="grid grid-cols-1 gap-1.5">
          {/* Main Action 1 */}
          <button
            onClick={onOpenBuyModal}
            className="w-full bg-[#2b3a4d] hover:bg-[#374b63] text-purple-200 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border border-purple-800/30 shadow transition-colors"
          >
            <span>🔮 Купить поисковые запросы</span>
          </button>

          {/* Main Action 2 (Triggers Partial Search Form) */}
          <button
            onClick={() => setShowPartialSearchModal(true)}
            className="w-full bg-[#243242] hover:bg-[#2d3f54] text-cyan-200 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border border-cyan-800/30 shadow transition-colors"
          >
            <span>📄 Поиск по неполным данным</span>
          </button>
        </div>

        {/* Navigation Grid Buttons */}
        <div className="grid grid-cols-2 gap-1.5 text-xs font-medium text-gray-200">
          <button
            onClick={onOpenProfileModal}
            className="bg-[#202b36] hover:bg-[#2a3847] py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 border border-[#2a3847]"
          >
            <span>🕵️ Мой профиль</span>
          </button>
          <button
            onClick={() => onSendMessage('/mybots')}
            className="bg-[#202b36] hover:bg-[#2a3847] py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 border border-[#2a3847]"
          >
            <span>🤖 Мои боты</span>
          </button>
          <button
            onClick={onOpenPartnerModal}
            className="col-span-2 bg-[#202b36] hover:bg-[#2a3847] py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 border border-[#2a3847] text-amber-200"
          >
            <span>🤝 Партнерская программа</span>
          </button>
          <button
            onClick={onOpenStatsModal}
            className="col-span-2 bg-[#202b36] hover:bg-[#2a3847] py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 border border-[#2a3847] text-emerald-200"
          >
            <span>📊 Статистика и настройки бота</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Загрузить фото для поиска лица"
            className={`p-2 rounded-full transition-colors ${
              selectedPhoto ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#202b36]'
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedPhoto ? "Фото выбрано. Нажмите отправить..." : "Введите телефон, ФИО, ИНН, домен или /команду..."}
              className="w-full bg-[#0f1721] text-gray-100 text-xs sm:text-sm rounded-full px-4 py-2.5 pr-8 border border-[#293747] focus:outline-none focus:border-cyan-500 placeholder-gray-500"
            />
            {selectedPhoto && (
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute right-3 text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={isLoading || (!inputText.trim() && !selectedPhoto)}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-full transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PARTIAL SEARCH FORM MODAL (Exact match to Screenshot 2) */}
      {showPartialSearchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3">
          <div className="bg-[#17212b] border border-[#2b3a4d] w-full max-w-lg rounded-2xl p-4 space-y-4 shadow-2xl text-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2b3a4d] pb-2.5">
              <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                📄 Поиск по неполным данным
              </h3>
              <button
                onClick={() => setShowPartialSearchModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-[#0e1621] p-3 rounded-xl border border-[#223142]">
              Вы можете указать любое количество данных: фамилию, имя, отчество, дату или год рождения, возраст, место рождения и т. д.<br/>
              <strong className="text-purple-300">Достаточно заполнить то, что у вас есть — все поля необязательны.</strong>
            </p>

            {/* Inputs Grid matching Screenshot 2 */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Фамилия</label>
                <input
                  type="text"
                  placeholder="Чернухина"
                  value={partialParams.lastName}
                  onChange={(e) => setPartialParams({ ...partialParams, lastName: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Имя</label>
                <input
                  type="text"
                  placeholder="Анастасия"
                  value={partialParams.firstName}
                  onChange={(e) => setPartialParams({ ...partialParams, firstName: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Отчество</label>
                <input
                  type="text"
                  placeholder="Викторовна"
                  value={partialParams.middleName}
                  onChange={(e) => setPartialParams({ ...partialParams, middleName: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">День</label>
                <input
                  type="text"
                  placeholder="15"
                  value={partialParams.day}
                  onChange={(e) => setPartialParams({ ...partialParams, day: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Месяц</label>
                <input
                  type="text"
                  placeholder="02"
                  value={partialParams.month}
                  onChange={(e) => setPartialParams({ ...partialParams, month: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Год</label>
                <input
                  type="text"
                  placeholder="1956"
                  value={partialParams.year}
                  onChange={(e) => setPartialParams({ ...partialParams, year: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Возраст от</label>
                <input
                  type="text"
                  placeholder="20"
                  value={partialParams.ageFrom}
                  onChange={(e) => setPartialParams({ ...partialParams, ageFrom: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Возраст</label>
                <input
                  type="text"
                  placeholder="70"
                  value={partialParams.ageExact}
                  onChange={(e) => setPartialParams({ ...partialParams, ageExact: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Возраст до</label>
                <input
                  type="text"
                  placeholder="75"
                  value={partialParams.ageTo}
                  onChange={(e) => setPartialParams({ ...partialParams, ageTo: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="col-span-3">
                <label className="text-[11px] text-gray-400 block mb-1">Место рождения</label>
                <input
                  type="text"
                  placeholder="Мариуполь / Донецк / Москва..."
                  value={partialParams.birthPlace}
                  onChange={(e) => setPartialParams({ ...partialParams, birthPlace: e.target.value })}
                  className="w-full bg-[#0e1621] border border-[#293747] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Form Actions matching Screenshot 2 */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2b3a4d]">
              <button
                type="button"
                onClick={handleResetPartial}
                className="bg-[#202b36] hover:bg-[#293747] text-gray-300 py-2 px-2 rounded-xl text-xs flex items-center justify-center space-x-1 border border-[#293747]"
              >
                <span>🗑 Сбросить</span>
              </button>
              <button
                type="button"
                onClick={() => setPartialParams({
                  ...partialParams,
                  country: partialParams.country === 'Россия' ? 'Украина' : 'Россия'
                })}
                className="bg-[#202b36] hover:bg-[#293747] text-cyan-300 py-2 px-2 rounded-xl text-xs flex items-center justify-center space-x-1 border border-[#293747]"
              >
                <span>{partialParams.country === 'Россия' ? '🇷🇺 Россия' : '🇺🇦 Украина'}</span>
              </button>
              <button
                type="button"
                onClick={handlePartialSubmit}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-2 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-lg"
              >
                <Search className="w-3.5 h-3.5" />
                <span>🔍 Искать</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
