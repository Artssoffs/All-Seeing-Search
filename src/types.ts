export type QueryType = 'phone' | 'name' | 'photo' | 'inn' | 'cadastral' | 'email' | 'username' | 'domain';

export interface SocialProfile {
  service: string;
  username: string;
  link?: string;
  id?: string;
}

export interface LeakedRecord {
  id: string;
  source: string;
  year: string;
  fio?: string;
  fioEng?: string;
  dob?: string;
  age?: number;
  passport?: string;
  passportIssuedBy?: string;
  passportIssueDate?: string;
  okpoOrInn?: string;
  address?: string;
  registrationAddress?: string;
  phone?: string;
  rawInfo?: string;
}

export interface SupportTicket {
  id: string;
  year: string;
  telegramId?: string;
  phone?: string;
  username?: string;
  login?: string;
  messageText?: string;
}

export interface AddressFrequency {
  address: string;
  count: number;
  percentage: string;
}

export interface RegisteredSite {
  domain: string;
  badgeName: string;
}

export interface RealEstateItem {
  cadastralNumber: string;
  address: string;
  area?: string;
  type?: string;
}

export interface VehicleItem {
  plateNumber: string;
  vin: string;
  model: string;
  year: number;
}

export interface OsintReport {
  id: string;
  query: string;
  queryType: QueryType;
  timestamp: string;
  basicInfo: {
    phone?: string;
    formattedPhone?: string;
    operator?: string;
    country?: string;
    region?: string;
    initials: string;
    fio?: string;
    dob?: string;
    age?: number;
    avatarUrl?: string;
  };
  executiveSummary?: string;
  phonebookTags: string[];
  socialProfiles: SocialProfile[];
  interestedCount: number;
  leakedRecords: LeakedRecord[];
  supportTickets?: SupportTicket[];
  addresses: AddressFrequency[];
  registeredSites: RegisteredSite[];
  realEstate?: RealEstateItem[];
  vehicles?: VehicleItem[];
  riskScore?: 'low' | 'medium' | 'high';
}

export interface TelegramMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  time: string;
  type?: 'text' | 'report_summary' | 'partial_form' | 'profile' | 'packages' | 'stats';
  report?: OsintReport;
  keyboard?: Array<Array<{ text: string; callback_data: string; url?: string }>>;
}

export interface PartialSearchParams {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  day?: string;
  month?: string;
  year?: string;
  ageFrom?: string;
  ageExact?: string;
  ageTo?: string;
  birthPlace?: string;
  country?: string;
}

export interface UserStats {
  queriesLeft: number;
  totalSearches: number;
  referrals: number;
  userId: number;
  userTag: string;
}
