import React, { useState } from 'react';
import {
  X,
  MoreHorizontal,
  Search,
  Download,
  Share2,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  Globe,
  User,
  Shield,
  FileText,
  MapPin,
  Building,
  Car,
  MessageSquare,
  ExternalLink,
  Check,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';
import { OsintReport } from '../types';

interface Props {
  report: OsintReport | null;
  onClose: () => void;
  onNewSearchClick?: () => void;
}

const SensitivityBadge: React.FC<{ level: 'public' | 'private' | 'confidential' }> = ({ level }) => {
  const styles = {
    public: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    private: 'bg-orange-50 text-orange-700 border-orange-200',
    confidential: 'bg-red-50 text-red-700 border-red-200'
  };
  const labels = {
    public: '🟢 Публичные',
    private: '🟠 Частные',
    confidential: '🔴 Конфиденциально'
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ml-2 shadow-sm whitespace-nowrap flex items-center shrink-0 ${styles[level]}`}>
      {labels[level]}
    </span>
  );
};

export const SherlockReportView: React.FC<Props> = ({
  report,
  onClose,
  onNewSearchClick,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string | null>(null);
  const [searchTableQuery, setSearchTableQuery] = useState('');
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    profiles: true,
    tags: true,
    support: true,
    addresses: true,
    sites: true,
    banks: true,
    estate: true,
    vehicles: true,
  });

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-400 p-6">
        <Shield className="w-16 h-16 text-purple-500 mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-gray-200">Отчет Sherlock не найден</h3>
        <p className="text-sm text-gray-500 max-w-md text-center mt-1">
          Отправьте запрос в Телеграм Боте (номер телефона, ФИО, ИНН) чтобы сформировать полный отчет.
        </p>
      </div>
    );
  }

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const safeCopyText = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (e) {
      console.warn("Clipboard copy non-fatal error:", e);
    }
  };

  const handleCopySummary = async () => {
    const text = `
All-Seeing Search Report for ${report.query}
ФИО: ${report.basicInfo.fio || 'Н/Д'}
Телефон: ${report.basicInfo.phone || report.query}
Оператор: ${report.basicInfo.operator || 'Н/Д'}, ${report.basicInfo.country || ''}
Теги: ${(report.phonebookTags || []).join(', ')}
    `.trim();
    await safeCopyText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setShowNavMenu(false);
  };

  const filteredLeakedRecords = selectedSiteFilter
    ? report.leakedRecords.filter((rec) =>
        rec.source.toLowerCase().includes(selectedSiteFilter.toLowerCase())
      )
    : report.leakedRecords;

  const filteredAddresses = report.addresses.filter((addr) =>
    addr.address.toLowerCase().includes(searchTableQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-gray-800 font-sans pb-16">
      {/* WebApp Top Browser Simulation Header Bar (Matching Screenshot 4, 5, 6) */}
      <div className="bg-[#0f1721] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors"
          title="Закрыть отчет"
        >
          <X className="w-5 h-5" />
        </button>

        {/* URL Banner Pill */}
        <div className="bg-[#1c2836] border border-gray-700 px-3.5 py-1 rounded-full text-xs font-mono text-cyan-300 flex items-center space-x-2 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>dc6.all-seeing-search.at</span>
        </div>

        <button className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-6 pt-5 space-y-4">
        {/* All-Seeing Report Brand Banner */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-bold shadow">
              👁
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1">
              All-Seeing <span className="font-light text-gray-500">Report</span>
            </h2>
          </div>

          <button
            onClick={handleCopySummary}
            className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
            <span>{copiedText ? 'Скопировано' : 'Копировать сводку'}</span>
          </button>
        </div>

        {/* Profile Big Box Badge (Matching Screenshot 4) */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-sm flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#52c41a] text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0">
            {report.basicInfo.initials || 'MO'}
          </div>

          <div className="space-y-1 overflow-hidden">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight leading-none break-all">
              {report.basicInfo.phone || report.query}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{report.basicInfo.operator || 'Оператор не указан'}</span>,
              <span>{report.basicInfo.country || 'Страна'}</span>
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        {report.executiveSummary && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
              <Sparkles className="w-16 h-16 text-indigo-500" />
            </div>
            <div className="flex items-start gap-3 relative z-10">
              <div className="mt-1 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-900 mb-1">Краткая AI-сводка</h3>
                <p className="text-sm text-indigo-800 leading-relaxed font-medium">
                  {report.executiveSummary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Data Sensitivity Legend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">Чувствительность данных:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SensitivityBadge level="public" />
            <SensitivityBadge level="private" />
            <SensitivityBadge level="confidential" />
          </div>
        </div>

        {/* Action Buttons Row (Screenshots 4 & 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-between shadow transition-all"
            >
              <span>Действия с отчетом</span>
              <MoreHorizontal className="w-4 h-4 text-gray-300" />
            </button>

            {showActionsMenu && (
              <div className="absolute left-0 right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-2xl z-30 p-2 space-y-1 text-xs">
                <button
                  onClick={() => {
                    window.print();
                    setShowActionsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center space-x-2 text-gray-700"
                >
                  <Printer className="w-4 h-4 text-purple-600" />
                  <span>Распечатать / Сохранить в PDF</span>
                </button>
                <button
                  onClick={handleCopySummary}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center space-x-2 text-gray-700"
                >
                  <Copy className="w-4 h-4 text-emerald-600" />
                  <span>Скопировать текстом</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNavMenu(!showNavMenu)}
              className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-between shadow transition-all"
            >
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">☰</span>
                <span>Навигация по отчету</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-300" />
            </button>

            {showNavMenu && (
              <div className="absolute left-0 right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-2xl z-30 p-2 space-y-1 text-xs text-gray-700">
                <button onClick={() => scrollToSection('sec-summary')} className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-700 rounded-lg">Краткая сводка</button>
                <button onClick={() => scrollToSection('sec-profiles')} className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-700 rounded-lg">Профили в интернете</button>
                <button onClick={() => scrollToSection('sec-tags')} className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-700 rounded-lg">Возможные имена (теги)</button>
                <button onClick={() => scrollToSection('sec-support')} className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-700 rounded-lg">Обращения в поддержку</button>
                <button onClick={() => scrollToSection('sec-addresses')} className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-700 rounded-lg">Адреса и доставка</button>
                <button onClick={() => scrollToSection('sec-sites')} className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-700 rounded-lg">Сайты и регистрации</button>
                <button onClick={() => scrollToSection('sec-banks')} className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-700 rounded-lg">Базы данных и утечки банков</button>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: Краткая сводка (Screenshot 4) */}
        <div id="sec-summary" className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div
            onClick={() => toggleSection('summary')}
            className="flex items-center justify-between cursor-pointer border-b border-gray-100 pb-2"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Краткая сводка</span>
            </h3>
            {expandedSections.summary ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>

          {expandedSections.summary && (
            <div className="space-y-2 text-xs sm:text-sm text-gray-700 pt-1">
              <div>
                <span className="text-gray-400 block text-[11px]">Телефон</span>
                <strong className="font-mono text-gray-900 text-sm">{report.basicInfo.formattedPhone || report.query}</strong>
              </div>

              {report.basicInfo.fio && (
                <div>
                  <span className="text-gray-400 block text-[11px]">Основное ФИО</span>
                  <strong className="text-gray-900 font-semibold">{report.basicInfo.fio}</strong>
                </div>
              )}

              {report.basicInfo.dob && (
                <div>
                  <span className="text-gray-400 block text-[11px]">Дата рождения</span>
                  <span className="text-gray-900 font-medium">{report.basicInfo.dob} {report.basicInfo.age ? `(${report.basicInfo.age} лет)` : ''}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: Профили в интернете (Screenshot 4 & 5) */}
        <div id="sec-profiles" className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div
            onClick={() => toggleSection('profiles')}
            className="flex items-center justify-between cursor-pointer border-b border-gray-100 pb-2"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <span>Профили в интернете</span>
              <SensitivityBadge level="public" />
            </h3>
            {expandedSections.profiles ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>

          {expandedSections.profiles && (
            <div className="space-y-3 text-xs sm:text-sm pt-1">
              {report.socialProfiles.map((prof, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">{prof.service}</span>
                    <strong className="text-gray-900 font-mono text-sm">{prof.username}</strong>
                    {prof.id && <span className="text-gray-400 text-xs ml-2 font-mono">[{prof.id}]</span>}
                  </div>
                  {prof.link && (
                    <a
                      href={prof.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-800 font-semibold bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 w-fit"
                    >
                      <span>Открыть профиль</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: Возможные имена (Screenshot 5) */}
        <div id="sec-tags" className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between cursor-pointer border-b border-gray-100 pb-2"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-600" />
                <span>Возможные имена <span className="text-gray-400 font-normal text-sm">({report.phonebookTags.length})</span></span>
              </div>
              <SensitivityBadge level="private" />
            </h3>
            {expandedSections.tags ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>

          {expandedSections.tags && (
            <div className="space-y-2 pt-1">
              <p className="text-xs text-gray-500 leading-relaxed">
                Ниже приведены варианты, под которыми этот контакт может быть сохранен у других пользователей.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {report.phonebookTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs transition-colors cursor-pointer"
                    title="Нажмите чтобы скопировать"
                    onClick={() => safeCopyText(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: Обращение в поддержку 2025 (Screenshot 5) */}
        {report.supportTickets && report.supportTickets.length > 0 && (
          <div id="sec-support" className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div
              onClick={() => toggleSection('support')}
              className="flex items-center justify-between cursor-pointer border-b border-gray-100 pb-2"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span>Обращение в поддержку {report.supportTickets[0]?.year}</span>
                </div>
                <SensitivityBadge level="confidential" />
              </h3>
              {expandedSections.support ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </div>

            {expandedSections.support && (
              <div className="space-y-3 pt-1 text-xs sm:text-sm">
                {report.supportTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
                    {ticket.telegramId && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">ID в Telegram</span>
                        <strong className="font-mono text-gray-900">{ticket.telegramId}</strong>
                      </div>
                    )}
                    {ticket.phone && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">Телефон</span>
                        <strong className="font-mono text-gray-900">{ticket.phone}</strong>
                      </div>
                    )}
                    {ticket.username && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">Имя пользователя</span>
                        <strong className="text-gray-900">{ticket.username}</strong>
                      </div>
                    )}
                    {ticket.login && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">Логин</span>
                        <strong className="font-mono text-purple-700">{ticket.login}</strong>
                      </div>
                    )}
                    {ticket.messageText && (
                      <div className="pt-1">
                        <span className="text-gray-400 text-[11px] block">Текст сообщения</span>
                        <p className="text-gray-800 italic bg-white p-2 rounded-lg border border-amber-200 mt-1">
                          "{ticket.messageText}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: Адреса (Screenshot 6) */}
        <div id="sec-addresses" className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div
            onClick={() => toggleSection('addresses')}
            className="flex items-center justify-between cursor-pointer border-b border-gray-100 pb-2"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Адреса <span className="text-gray-400 font-normal text-sm">({report.addresses.length})</span></span>
              </div>
              <SensitivityBadge level="private" />
            </h3>
            {expandedSections.addresses ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>

          {expandedSections.addresses && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-gray-500">
                Список найденных адресов с частотой встречаемости.
              </p>

              {/* Table controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>Показать</span>
                  <select className="border border-gray-300 rounded px-2 py-1 bg-white text-xs">
                    <option>5</option>
                    <option>10</option>
                  </select>
                  <span>записей</span>
                </div>

                <div className="flex items-center space-x-1">
                  <span className="text-gray-500">Поиск:</span>
                  <input
                    type="text"
                    value={searchTableQuery}
                    onChange={(e) => setSearchTableQuery(e.target.value)}
                    placeholder="Что ищете?"
                    className="border border-gray-300 rounded px-2.5 py-1 text-xs w-40 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Addresses Table (Screenshot 6) */}
              <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-semibold">
                    <tr>
                      <th className="p-3">Адрес</th>
                      <th className="p-3 text-center">Количество</th>
                      <th className="p-3 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-800">
                    {filteredAddresses.map((addr, idx) => (
                      <tr key={idx} className="hover:bg-purple-50/40 transition-colors">
                        <td className="p-3 font-medium text-gray-900 border-l-4 border-emerald-500">
                          {addr.address}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-gray-700">
                          {addr.count}
                        </td>
                        <td className="p-3 text-right font-mono font-semibold text-emerald-600">
                          {addr.percentage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 6: Сайты, где найдены регистрации (Screenshot 6 & 7) */}
        <div id="sec-sites" className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div
            onClick={() => toggleSection('sites')}
            className="flex items-center justify-between cursor-pointer border-b border-gray-100 pb-2"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span>Сайты, где найдены регистрации</span>
              </div>
              <SensitivityBadge level="public" />
            </h3>
            {expandedSections.sites ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>

          {expandedSections.sites && (
            <div className="space-y-2 pt-1">
              <p className="text-xs text-gray-500">
                Ниже приведены сайты, на которых обнаружена активность или регистрация.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {report.registeredSites.map((site, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setSelectedSiteFilter(
                        selectedSiteFilter === site.badgeName ? null : site.badgeName
                      )
                    }
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all ${
                      selectedSiteFilter === site.badgeName
                        ? 'bg-purple-600 text-white border-purple-600 shadow'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'
                    }`}
                  >
                    <span>🌐</span>
                    <span>{site.badgeName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 7: Клиенты и Базы данных утечек (Screenshots 7 & 8) */}
        <div id="sec-banks" className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div
            onClick={() => toggleSection('banks')}
            className="flex items-center justify-between cursor-pointer border-b border-gray-100 pb-2"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-600" />
                <span>
                  Клиенты и Базы данных <span className="text-gray-400 font-normal text-sm">({filteredLeakedRecords.length})</span>
                </span>
              </div>
              <SensitivityBadge level="confidential" />
            </h3>
            {expandedSections.banks ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>

          {expandedSections.banks && (
            <div className="space-y-4 pt-1">
              {filteredLeakedRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2.5 shadow-sm hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900">
                      {record.source} <span className="text-gray-400 font-normal text-xs">{record.year}</span>
                    </h4>
                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200 font-semibold">
                      Утечка данных
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    {record.fio && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">ФИО</span>
                        <strong className="text-gray-900 font-semibold">{record.fio}</strong>
                      </div>
                    )}

                    {record.fioEng && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">Имя (английский)</span>
                        <strong className="text-gray-900 font-mono">{record.fioEng}</strong>
                      </div>
                    )}

                    {record.dob && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">День рождения</span>
                        <span className="text-gray-900">{record.dob}</span>
                      </div>
                    )}

                    {record.okpoOrInn && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">ОКПО / ИНН</span>
                        <strong className="font-mono text-purple-700">{record.okpoOrInn}</strong>
                      </div>
                    )}

                    {record.passport && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">Паспорт</span>
                        <strong className="font-mono text-gray-900">{record.passport}</strong>
                      </div>
                    )}

                    {record.passportIssuedBy && (
                      <div className="col-span-1 sm:col-span-2">
                        <span className="text-gray-400 text-[11px] block">Кем выдан паспорт</span>
                        <span className="text-gray-800">{record.passportIssuedBy}</span>
                      </div>
                    )}

                    {record.passportIssueDate && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">Дата выдачи паспорта</span>
                        <span className="text-gray-900">{record.passportIssueDate}</span>
                      </div>
                    )}

                    {record.address && (
                      <div className="col-span-1 sm:col-span-2">
                        <span className="text-gray-400 text-[11px] block">Адрес</span>
                        <span className="text-gray-900 font-medium">{record.address}</span>
                      </div>
                    )}

                    {record.registrationAddress && (
                      <div className="col-span-1 sm:col-span-2">
                        <span className="text-gray-400 text-[11px] block">Адрес места регистрации</span>
                        <span className="text-gray-900">{record.registrationAddress}</span>
                      </div>
                    )}

                    {record.rawInfo && (
                      <div className="col-span-1 sm:col-span-2 pt-1 border-t border-gray-100">
                        <span className="text-gray-400 text-[11px] block mb-1">Информация</span>
                        <p className="text-xs font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {record.rawInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Оцените результат поиска</h3>
          <p className="text-sm text-gray-500 text-center max-w-md">Ваша оценка помогает нам улучшать качество поиска и находить более точные данные.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setRating('up')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all border ${
                rating === 'up'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${rating === 'up' ? 'fill-current' : ''}`} />
              Полезно
            </button>
            <button
              onClick={() => setRating('down')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all border ${
                rating === 'down'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ThumbsDown className={`w-5 h-5 ${rating === 'down' ? 'fill-current' : ''}`} />
              Неточно
            </button>
          </div>
          {rating && (
            <p className="text-sm text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-xl mt-2">
              Спасибо за вашу оценку!
            </p>
          )}
        </div>

        {/* Back to Top Floating Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-2 transition-all"
          >
            <span>↑ Наверх</span>
          </button>
        </div>
      </div>
    </div>
  );
};
