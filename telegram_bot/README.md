# Real OSINT Telegram Bot (Python)

Этот бот использует **настоящие** (бесплатные) инструменты для анализа:
1. `phonenumbers` — для определения реального оператора и региона по номеру.
2. `ip-api` — для геолокации и провайдера по IP-адресу.
3. `Gemini 3.5 Flash + Google Search` — для поиска упоминаний в открытом интернете.
4. `Gemini 3.1 Pro Preview (Thinking Mode)` — для глубокого анализа, если написать слово "подумай".

## Как запустить на своем сервере / компьютере:

1. Скачайте этот код (или перенесите в GitHub).
2. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
3. Получите токен бота в Telegram у [@BotFather](https://t.me/BotFather) и ключ API от Gemini.
4. Установите их как переменные окружения:
   - В Linux/macOS:
     ```bash
     export TELEGRAM_BOT_TOKEN="ваш_токен"
     export GEMINI_API_KEY="ваш_ключ"
     ```
   - В Windows (CMD):
     ```cmd
     set TELEGRAM_BOT_TOKEN=ваш_токен
     set GEMINI_API_KEY=ваш_ключ
     ```
5. Запустите бота:
   ```bash
   python bot.py
   ```

*Примечание: Для поиска по слитым базам (пароли, почты, Глаз Бога) вам потребуется купить доступ к API специализированных сервисов (например, LeakCheck) и добавить запросы к ним (через `requests.get`) в файл `osint_tools.py`.*
