# Real OSINT Telegram Bot (Python)

Этот бот использует **настоящие** (бесплатные) инструменты для анализа:
1. `phonenumbers` — для определения реального оператора и региона по номеру.
2. `ip-api` — для геолокации и провайдера по IP-адресу.
3. `Gemini 3.5 Flash + Google Search` — для поиска упоминаний в открытом интернете.
4. `Gemini 3.1 Pro Preview (Thinking Mode)` — для глубокого анализа, если написать слово "подумай".

## Как запустить на своем сервере / компьютере:

1. Скачайте этот код (или перенесите в GitHub).
2. Создайте виртуальное окружение и установите зависимости:
   ```bash
   cd telegram_bot
   python3 -m venv venv
   source venv/bin/activate   # Windows: .\venv\Scripts\Activate.ps1
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
3. Получите токен бота в Telegram у [@BotFather](https://t.me/BotFather) и ключ API от Gemini.
4. Установите их как переменные окружения (или создайте telegram_bot/.env на основе telegram_bot/.env.example):
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
   - Или создайте файл telegram_bot/.env (НЕ КОМИТЬ) со строками:
     ```text
     TELEGRAM_BOT_TOKEN=your_telegram_token_here
     GEMINI_API_KEY=your_gemini_key_here
     ```
5. Запустите бота из корня репозитория:
   ```bash
   # если вы находитесь в корне репо
   python telegram_bot/bot.py
   # или из директории telegram_bot
   cd telegram_bot
   python bot.py
   ```

### Запуск в фоновом режиме (systemd пример)

Если вы деплоите на VPS, создайте виртуальное окружение, задайте переменные окружения в unit-файле systemd и используйте unit для автозапуска. Пример systemd unit описан в PR.

*Примечание: Для поиска по слитым базам (пароли, почты, Глаз Бога) вам потребуется купить доступ к API специализированных сервисов (например, LeakCheck) и добавить запросы к ним (через `requests.get`) в файл `osint_tools.py`. Также не забудьте ротацию ключей, если они были утекшими.*
