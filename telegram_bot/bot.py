import os
import asyncio
import logging
import re
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import Message
from google import genai
from google.genai import types as genai_types
from osint_tools import analyze_phone, analyze_ip

logging.basicConfig(level=logging.INFO)

# Получаем токены из переменных окружения
BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not BOT_TOKEN or not GEMINI_API_KEY:
    logging.error("Необходимо установить переменные окружения TELEGRAM_BOT_TOKEN и GEMINI_API_KEY")
    exit(1)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
client = genai.Client(api_key=GEMINI_API_KEY)

user_chats = {}

def get_chat(user_id):
    if user_id not in user_chats:
        user_chats[user_id] = client.chats.create(model="gemini-3.5-flash")
    return user_chats[user_id]

@dp.message(Command("start"))
async def cmd_start(message: Message):
    await message.answer(
        "Привет! Я настоящий OSINT-бот.\n\n"
        "Отправь мне номер телефона (в формате +1234...) или IP-адрес, "
        "и я сделаю реальный запрос по открытым базам, а также подключу Gemini с Google Search для дополнительного поиска."
    )

@dp.message(F.text | F.photo)
async def handle_message(message: Message):
    chat = get_chat(message.from_user.id)
    text = message.text or message.caption or ""
    
    # 1. Пытаемся распознать, что именно отправил пользователь (телефон или IP)
    phone_match = re.search(r'\+?\d{10,15}', text.replace(' ', '').replace('-', ''))
    ip_match = re.search(r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b', text)
    
    real_data = ""
    if ip_match:
        real_data = analyze_ip(ip_match.group(0))
        await message.answer(real_data)
    elif phone_match:
        real_data = analyze_phone(phone_match.group(0))
        await message.answer(real_data)
        
    is_complex = False
    if "подумай" in text.lower() or "сложн" in text.lower():
        is_complex = True
        
    model_name = "gemini-3.1-pro-preview" if (is_complex or message.photo) else "gemini-3.5-flash"
    
    contents = []
    
    if real_data:
        contents.append(f"Вот реальные данные, которые я нашел по API: {real_data}. Сделай дополнительный анализ в интернете по запросу пользователя: {text}")
    elif text:
        contents.append(text)
        
    if message.photo:
        photo = message.photo[-1]
        file_info = await bot.get_file(photo.file_id)
        downloaded_file = await bot.download_file(file_info.file_path)
        contents.append(
            genai_types.Part.from_bytes(
                data=downloaded_file.read(),
                mime_type="image/jpeg"
            )
        )
        
    config_dict = {}
    config_dict["tools"] = [{"google_search": {}}]
    if is_complex:
        config_dict["thinking_config"] = {"thinking_level": "HIGH"}
        
    config = genai_types.GenerateContentConfig(**config_dict)
    
    status_msg = await message.answer("Подключаю Gemini + Google Search для глубокого анализа...")
    
    try:
        response = chat.send_message(contents, config=config)
        reply_text = response.text
        if len(reply_text) > 4000:
            for x in range(0, len(reply_text), 4000):
                if x == 0:
                    await status_msg.edit_text(reply_text[x:x+4000])
                else:
                    await message.answer(reply_text[x:x+4000])
        else:
            await status_msg.edit_text(reply_text)
            
    except Exception as e:
        logging.error(f"Ошибка: {e}")
        await status_msg.edit_text(f"Произошла ошибка при поиске через Gemini: {e}")

async def main():
    print("Бот запущен. Нажмите Ctrl+C для остановки.")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
