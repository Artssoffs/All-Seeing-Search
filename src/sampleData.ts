import { OsintReport } from './types';

export const SAMPLE_REPORTS: Record<string, OsintReport> = {
  '380933745829': {
    id: 'report_380933745829',
    query: '+380 93 374 58 29',
    queryType: 'phone',
    timestamp: '2026-08-07 23:12',
    executiveSummary: 'Обнаружено высокое количество тегов (14) и присутствие в базах утечек клиентов банка. Найдены теги, указывающие на подозрительную финансовую деятельность ("Дропы", "Заказ"). Рекомендуется проявить осторожность при взаимодействии.',
    basicInfo: {
      phone: '380933745829',
      formattedPhone: '+380 93 374 58 29',
      operator: 'lifecell',
      country: 'Украина',
      region: 'Киевская область / Ирпень',
      initials: 'MO',
      fio: 'Романенко Михаил Сергеевич',
      dob: '12.04.1994',
      age: 32,
    },
    phonebookTags: [
      '121 Рома',
      '121 Рома От',
      'Christopher Perry',
      'Michael Owen',
      'Женин Друг',
      'Миша 121 Дропы',
      'мишання',
      'Мишанямишаня',
      'папуля',
      'Рома наш',
      'РомаИрпен',
      'СЛОБОДСКИЙ',
      'Михаил Заказ',
      'Роман Авто'
    ],
    socialProfiles: [
      { service: 'TikTok', username: 'user4522166299830', link: 'https://tiktok.com/@7357455286595306502' },
      { service: 'Telegram', username: '@Thuglifepodol', id: '7239941677', link: 'https://t.me/Thuglifepodol' },
      { service: 'WhatsApp', username: '+380933745829', link: 'https://wa.me/380933745829' },
      { service: 'E-mail', username: 'thuglife.irpin@gmail.com' },
    ],
    interestedCount: 2,
    leakedRecords: [
      {
        id: 'rec_privat_1',
        source: 'Клиенты privatbank.ua',
        year: '2020',
        phone: '380933745829',
        fio: 'Романенко Михаил Сергеевич',
        dob: '12.04.1994',
        okpoOrInn: '3443819203',
        rawInfo: 'Романенко Михаил Сергеевич 12.04.1994 г 08200 UA, КИЕВСКАЯ, ИРПЕНЬ, УЛ. СОБОРНАЯ 12 ИНН: 3443819203 паспорт: ТТ 481920 выдан: ИРПЕНСКИМ ГО ВДНХ'
      },
      {
        id: 'rec_oschad_1',
        source: 'Клиенты Ощад банк',
        year: '2023',
        fio: 'ЧЕРНУХІНА АНАСТАСІЯ ВІКТОРІВНА',
        dob: '15.02.1956',
        address: '84120 Донецька Тельманівський с. Старогнатовка вул. Ворошилова буд. 38',
        passport: 'ВС688166',
        okpoOrInn: '2049916105',
        passportIssuedBy: 'Тельманівським РВ УМВС України в Донецькій області',
        passportIssueDate: '28.05.2001',
        registrationAddress: 'с. Старогнатівка',
        phone: '380508473351'
      },
      {
        id: 'rec_accord_1',
        source: 'Клиенты Accordbank.com.ua',
        year: '2022',
        fio: 'ЧЕРНУХІНА АНАСТАСІЯ ВІКТОРІВНА',
        fioEng: 'CHERNUKHINA ANASTASIIA VIKTORIVNA',
        okpoOrInn: '2049916105'
      }
    ],
    supportTickets: [
      {
        id: 'sup_1',
        year: '2025',
        telegramId: '7239941677',
        phone: '380933745829',
        username: 'Michael Owen',
        login: '@Thuglifepodol',
        messageText: 'Какой дружный коллектив в комментари'
      }
    ],
    addresses: [
      { address: 'ІНША ДРІБНА ПОБУТОВА ТЕХНІКА', count: 1, percentage: '33.33%' },
      { address: 'ДОНЕЦКАЯ ОБЛАСТЬ 51400, ДНИПРОПЕТРОВСКАЯ ОБЛ., ПАВЛОГРАДСКИЙ, МЕЖЕРИЧ, УЛ.ЛЕНИНА, 101/Д', count: 1, percentage: '33.33%' },
      { address: 'ДОНЕЦЬКА ОБЛАСТЬ 51400, ДНІПРОПЕТРОВСЬКА ОБЛ., ПАВЛОГРАДСЬКИЙ, МЕЖЕРІЧ, ВУЛ.ЛЕНІНА, 101/Д', count: 1, percentage: '33.33%' }
    ],
    registeredSites: [
      { domain: 'bon.ua', badgeName: 'bon.ua' },
      { domain: 'com.ua', badgeName: 'com.ua' },
      { domain: 'privatbank.ua', badgeName: 'privatbank.ua' }
    ],
    realEstate: [
      { cadastralNumber: '77:01:0004042:6987', address: 'г. Киев, ул. Соборная, 101', area: '68.4 кв.м', type: 'Квартира' }
    ],
    vehicles: [
      { plateNumber: 'AA7712BH', vin: '3FA6P0H70HR294812', model: 'Ford Fusion 2.0 SE', year: 2017 }
    ],
    riskScore: 'medium'
  },
  '380508473351': {
    id: 'report_380508473351',
    query: '+380 50 847 33 51',
    queryType: 'phone',
    timestamp: '2026-08-07 01:08',
    basicInfo: {
      phone: '380508473351',
      formattedPhone: '+380 50 847 33 51',
      operator: 'Vodafone Ukraine',
      country: 'Украина',
      region: 'Донецкая область / Мариуполь',
      initials: 'ЧА',
      fio: 'ЧЕРНУХІНА АНАСТАСІЯ ВІКТОРІВНА',
      dob: '15.02.1956',
      age: 70
    },
    phonebookTags: [
      'Nastenka _solnyshko_',
      'Анастасия Мариуполь',
      'Настя Ворошилова 38',
      'Чернухина Ощад',
      'Чернухина Вконтакте'
    ],
    socialProfiles: [
      { service: 'Вконтакте', username: 'Nastenka _solnyshko_', link: 'https://vk.com/nastenka_solnyshko' },
      { service: 'Telegram', username: '@toysneq', id: '1558731636', link: 'https://t.me/toysneq' },
      { service: 'E-mail', username: 'forestmigovo@gmail.com' }
    ],
    interestedCount: 3,
    leakedRecords: [
      {
        id: 'rec_oschad_2',
        source: 'Клиенты Ощад банк',
        year: '2023',
        fio: 'ЧЕРНУХІНА АНАСТАСІЯ ВІКТОРІВНА',
        dob: '15.02.1956',
        address: '84120 Донецька Тельманівський с. Старогнатовка вул. Ворошилова буд. 38',
        passport: 'ВС688166',
        okpoOrInn: '2049916105',
        passportIssuedBy: 'Тельманівським РВ УМВС України в Донецькій області',
        passportIssueDate: '28.05.2001',
        registrationAddress: 'с.Старогнатівка',
        phone: '380508473351'
      },
      {
        id: 'rec_accord_2',
        source: 'Клиенты Accordbank.com.ua',
        year: '2022',
        fio: 'ЧЕРНУХІНА АНАСТАСІЯ ВІКТОРІВНА',
        fioEng: 'CHERNUKHINA ANASTASIIA VIKTORIVNA',
        okpoOrInn: '2049916105'
      },
      {
        id: 'rec_privat_2',
        source: 'Клиенты privatbank.ua',
        year: '2020',
        phone: '380508473351',
        fio: 'Чернухина Анастасия Викторовна',
        dob: '15.02.1956',
        okpoOrInn: '2049916105',
        rawInfo: 'Чернухина Анастасия Викторовна 15.02.1956 г 87110 UA, ДОНЕЦЬКА, МАРИУПОЛЬ, М.ЖУКОВА 90-60 ИНН: 2049916105 паспорт: ВС 688166 выдан: ТЕЛЬМАНОВСКИМ РО В ДОНЕЦКОЙ ОБЛ. 28.05.2001'
      }
    ],
    addresses: [
      { address: '87110 UA, ДОНЕЦЬКА, МАРИУПОЛЬ, М.ЖУКОВА 90-60', count: 2, percentage: '66.6%' },
      { address: '84120 Донецька, Тельманівський с. Старогнатовка вул. Ворошилова 38', count: 1, percentage: '33.3%' }
    ],
    registeredSites: [
      { domain: 'privatbank.ua', badgeName: 'privatbank.ua' },
      { domain: 'accordbank.com.ua', badgeName: 'accordbank.com.ua' },
      { domain: 'vk.com', badgeName: 'vk.com' }
    ]
  },
  '2540214547': {
    id: 'report_inn_2540214547',
    query: '2540214547',
    queryType: 'inn',
    timestamp: '2026-08-07 01:04',
    basicInfo: {
      initials: 'ЮЛ',
      fio: 'ООО "АЛЬФА ТРЕЙДИНГ ГРУПП"',
      country: 'Россия'
    },
    phonebookTags: ['Юридическое лицо', 'ИНН 2540214547', 'ОГРН 1107449004464', 'Оптовая торговля'],
    socialProfiles: [],
    interestedCount: 5,
    leakedRecords: [
      {
        id: 'rec_inn_1',
        source: 'ЕГРЮЛ / ЕГРИП База',
        year: '2024',
        okpoOrInn: '2540214547',
        fio: 'ООО "АЛЬФА ТРЕЙДИНГ ГРУПП"',
        rawInfo: 'ИНН: 2540214547, ОГРН: 1107449004464, КПП: 254001001, Руководитель: Иванов Сергей Алексеевич'
      }
    ],
    addresses: [
      { address: 'г. Владивосток, ул. Светланская, д. 45, офис 302', count: 1, percentage: '100%' }
    ],
    registeredSites: [
      { domain: 'nalog.ru', badgeName: 'nalog.ru' },
      { domain: 'rusprofile.ru', badgeName: 'rusprofile.ru' }
    ]
  }
};
