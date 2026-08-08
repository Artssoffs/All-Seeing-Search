import requests
import phonenumbers
from phonenumbers import geocoder, carrier, timezone

def analyze_phone(phone_number):
    try:
        # Пытаемся распарсить номер
        if not phone_number.startswith('+'):
            phone_number = '+' + phone_number
        parsed = phonenumbers.parse(phone_number)
        
        if not phonenumbers.is_valid_number(parsed):
            return "Неверный формат номера."
            
        region = geocoder.description_for_number(parsed, "ru")
        oper = carrier.name_for_number(parsed, "ru")
        tz = timezone.time_zones_for_number(parsed)
        
        return f"📞 **Анализ номера {phone_number}**\n" \
               f"Страна/Регион: {region}\n" \
               f"Оператор: {oper}\n" \
               f"Часовые пояса: {', '.join(tz)}\n" \
               f"(Для глубокого поиска по базам утечек требуется подключение платных API, например LeakCheck или EyeOfGod)"
    except Exception as e:
        return f"Ошибка при анализе номера: {e}"

def analyze_ip(ip_address):
    try:
        r = requests.get(f"http://ip-api.com/json/{ip_address}?lang=ru").json()
        if r['status'] == 'success':
            return f"🌐 **Анализ IP: {ip_address}**\n" \
                   f"Страна: {r['country']} ({r['countryCode']})\n" \
                   f"Город: {r['city']}\n" \
                   f"Провайдер: {r['isp']}\n" \
                   f"Организация: {r['org']}"
        return "Не удалось получить информацию об IP."
    except Exception as e:
        return f"Ошибка при анализе IP: {e}"
