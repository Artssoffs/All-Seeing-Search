import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { SAMPLE_REPORTS } from "./src/sampleData";
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { db } from './src/db/index.ts';
import { searchHistory } from './src/db/schema.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Initialize Gemini SDK lazily if key exists
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// OSINT Search API
app.post("/api/search", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userRecord = await getOrCreateUser(req.user!.uid, req.user!.email || 'unknown@example.com');
    const { query, queryType, partialParams, faceImage } = req.body;

    // Clean phone query for matching sample
    const cleanedDigits = (query || '').replace(/\D/g, '');

    // Record search history in Cloud SQL
    await db.insert(searchHistory).values({
      userId: userRecord.id,
      query: query || 'Unknown',
      queryType: queryType || 'phone',
    }).catch(err => {
      console.error("Failed to log search history:", err);
    });

    // 1. Check exact sample database first for instant 100% screenshot accuracy
    if (cleanedDigits && SAMPLE_REPORTS[cleanedDigits]) {
      return res.json({ success: true, report: SAMPLE_REPORTS[cleanedDigits] });
    }
    if (query && SAMPLE_REPORTS[query]) {
      return res.json({ success: true, report: SAMPLE_REPORTS[query] });
    }

    // 2. Try Gemini AI generation if available
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are a realistic intelligence search aggregator simulating a Telegram "All-Seeing Search" bot result.
Target search request:
- Query: "${query || 'Partial Search'}"
- Query Type: "${queryType || 'general'}"
${partialParams ? `- Partial Search Parameters: ${JSON.stringify(partialParams)}` : ''}
${faceImage ? `- Face Image Upload Provided` : ''}

Generate a rich, highly detailed report JSON structure in Russian (matching Telegram bot search result formats).
Include believable details suitable for the country indicated (e.g. Russia, Ukraine, CIS, or International):
1. basicInfo: formatted phone, operator (e.g., Beeline, MTS, Tele2, Megafon, Vodafone, lifecell, T-Mobile), country, region, initials, FIO, DOB, age.
2. phonebookTags: 10-15 realistic contact names/tags as saved in caller ID phonebooks (e.g. "121 Рома", "Миша Дропы", "папуля", "Рома Авто", "СЛОБОДСКИЙ", "Заказ Квартира", "Марина Коллега").
3. socialProfiles: TikTok, Telegram handle & ID, VK, WhatsApp, Instagram, Email.
4. leakedRecords: 3-5 public record / database match entries with realistic FIO, DOB, Passport, INN/OKPO, addresses, issue details.
5. supportTickets: 1-2 support or forum tickets if applicable.
6. addresses: 2-4 delivery/registration addresses with count and frequency percentage.
7. registeredSites: badges for websites (e.g., bon.ua, avito.ru, cdek.ru, privatbank.ua, vk.com, t.me).
8. realEstate & vehicles: optional cadastral numbers or auto VIN/plates.
9. executiveSummary: A short summary (2-4 sentences) highlighting the most critical findings, such as potential fraud, exposed credentials, suspicious tags, or compromised databases.

Return ONLY valid JSON.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                query: { type: Type.STRING },
                queryType: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                executiveSummary: { type: Type.STRING },
                basicInfo: {
                  type: Type.OBJECT,
                  properties: {
                    phone: { type: Type.STRING },
                    formattedPhone: { type: Type.STRING },
                    operator: { type: Type.STRING },
                    country: { type: Type.STRING },
                    region: { type: Type.STRING },
                    initials: { type: Type.STRING },
                    fio: { type: Type.STRING },
                    dob: { type: Type.STRING },
                    age: { type: Type.NUMBER },
                  },
                  required: ["initials", "country"],
                },
                phonebookTags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                socialProfiles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      service: { type: Type.STRING },
                      username: { type: Type.STRING },
                      link: { type: Type.STRING },
                      id: { type: Type.STRING },
                    },
                    required: ["service", "username"],
                  },
                },
                interestedCount: { type: Type.NUMBER },
                leakedRecords: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      source: { type: Type.STRING },
                      year: { type: Type.STRING },
                      fio: { type: Type.STRING },
                      fioEng: { type: Type.STRING },
                      dob: { type: Type.STRING },
                      passport: { type: Type.STRING },
                      passportIssuedBy: { type: Type.STRING },
                      passportIssueDate: { type: Type.STRING },
                      okpoOrInn: { type: Type.STRING },
                      address: { type: Type.STRING },
                      rawInfo: { type: Type.STRING },
                    },
                    required: ["id", "source", "year"],
                  },
                },
                supportTickets: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      year: { type: Type.STRING },
                      telegramId: { type: Type.STRING },
                      phone: { type: Type.STRING },
                      username: { type: Type.STRING },
                      login: { type: Type.STRING },
                      messageText: { type: Type.STRING },
                    },
                  },
                },
                addresses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      address: { type: Type.STRING },
                      count: { type: Type.NUMBER },
                      percentage: { type: Type.STRING },
                    },
                    required: ["address", "count", "percentage"],
                  },
                },
                registeredSites: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      domain: { type: Type.STRING },
                      badgeName: { type: Type.STRING },
                    },
                    required: ["domain", "badgeName"],
                  },
                },
              },
              required: ["query", "basicInfo", "phonebookTags", "socialProfiles", "leakedRecords", "addresses", "registeredSites"],
            },
          },
        });

        if (response.text) {
          const generatedReport = JSON.parse(response.text);
          generatedReport.id = generatedReport.id || `rep_${Date.now()}`;
          generatedReport.timestamp = generatedReport.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 16);
          generatedReport.interestedCount = generatedReport.interestedCount || Math.floor(Math.random() * 8) + 1;
          return res.json({ success: true, report: generatedReport });
        }
      } catch (geminiErr) {
        console.error("Gemini API error, falling back to smart dynamic generator:", geminiErr);
      }
    }

    // 3. Realistic Dynamic Algorithmic Synthesis (Fallback when no key / offline)
    const displayQuery = query || (partialParams?.lastName ? `${partialParams.lastName} ${partialParams.firstName || ''}` : 'Новый поиск');
    const isUA = (query || '').includes('+380') || (query || '').startsWith('380') || (partialParams?.country === 'Украина');

    const dynamicReport = {
      id: `rep_${Date.now()}`,
      query: displayQuery,
      queryType: queryType || 'phone',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      executiveSummary: "В ходе проверки выявлено несколько совпадений в базах утечек данных (Авито/СДЭК/ПриватБанк). Обнаружены теги, указывающие на возможную коммерческую деятельность («Дроп», «Заказ»). Пароли в открытом виде не найдены.",
      basicInfo: {
        phone: cleanedDigits || '380991234567',
        formattedPhone: query || '+380 99 123 45 67',
        operator: isUA ? 'Vodafone Ukraine' : 'МТС Россия',
        country: isUA ? 'Украина' : 'Россия',
        region: isUA ? 'Киевская область' : 'Московская область',
        initials: displayQuery.slice(0, 2).toUpperCase() || 'ОС',
        fio: partialParams ? `${partialParams.lastName || 'Иванов'} ${partialParams.firstName || 'Алексей'} ${partialParams.middleName || 'Игоревич'}` : 'Соколов Алексей Игоревич',
        dob: partialParams?.day && partialParams?.month && partialParams?.year ? `${partialParams.day}.${partialParams.month}.${partialParams.year}` : '18.09.1991',
        age: 34
      },
      phonebookTags: [
        'Алексей Работа',
        'Соколов Ирпень',
        'Алексей Заказ',
        '121 Сокол',
        'Леха Дроп',
        'Алексей Авито',
        'Alexey Sok',
        'Соколов Поставка',
        'папуля',
        'Леха Наш'
      ],
      socialProfiles: [
        { service: 'Telegram', username: `@id${cleanedDigits.slice(-6)}`, id: `68${cleanedDigits.slice(-6)}`, link: `https://t.me/id${cleanedDigits.slice(-6)}` },
        { service: 'VK', username: `id${cleanedDigits.slice(-7)}`, link: `https://vk.com/id${cleanedDigits.slice(-7)}` },
        { service: 'E-mail', username: `sokolov_${cleanedDigits.slice(-4)}@gmail.com` }
      ],
      interestedCount: Math.floor(Math.random() * 5) + 1,
      leakedRecords: [
        {
          id: `leak_${Date.now()}_1`,
          source: isUA ? 'База клиентов ПриватБанк' : 'Клиенты CDEK / Авито',
          year: '2023',
          fio: 'Соколов Алексей Игоревич',
          dob: '18.09.1991',
          passport: isUA ? 'МТ 918231' : '4512 891023',
          okpoOrInn: isUA ? '3128910293' : '772891029312',
          address: isUA ? 'г. Киев, ул. Ленина 42/12' : 'г. Москва, ул. Тверская 15-4',
          rawInfo: 'Соколов Алексей Игоревич 18.09.1991 г. Паспорт: 4512 891023. ИНН: 772891029312. Тел: ' + displayQuery
        }
      ],
      addresses: [
        { address: isUA ? 'г. Киев, ул. Соборная 101' : 'г. Москва, ул. Тверская 15, кв 4', count: 2, percentage: '66.7%' },
        { address: isUA ? 'г. Ирпень, ул. Центральная 12' : 'г. Балашиха, ул. Мира 8', count: 1, percentage: '33.3%' }
      ],
      registeredSites: [
        { domain: 'avito.ru', badgeName: 'avito.ru' },
        { domain: 'cdek.ru', badgeName: 'cdek.ru' },
        { domain: 't.me', badgeName: 't.me' }
      ]
    };

    return res.json({ success: true, report: dynamicReport });
  } catch (error: any) {
    console.error("Search error:", error);
    return res.status(500).json({ success: false, error: error.message || "Search failed" });
  }
});

// General Chat API with Thinking Mode, Image Analysis, and Google Search
app.post("/api/chat", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { message, image, history, isComplex } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const contents: any[] = [];
    
    // Convert history format if needed, but here we just append the current user message + image
    if (image) {
      // image is expected to be a base64 string "data:image/jpeg;base64,..."
      const mimeType = image.split(';')[0].split(':')[1];
      const data = image.split(',')[1];
      contents.push({
        inlineData: {
          mimeType,
          data
        }
      });
    }
    
    if (message) {
      contents.push({ text: message });
    }
    
    const isImageUpload = !!image;
    
    // Choose model based on whether it is a complex query or image upload
    const modelName = isImageUpload || isComplex ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
    
    // Construct config
    const config: any = {
      tools: [{ googleSearch: {} }]
    };
    
    if (isComplex) {
       config.thinkingConfig = { thinkingLevel: "HIGH" };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: contents },
      config
    });

    return res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({ success: false, error: error.message || "Chat failed" });
  }
});

// Start Express and integrate Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
