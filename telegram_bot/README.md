# Telegram order notifications

This bot sends a Telegram message to specified chat IDs whenever a new order is created.

## Setup

1) Create a Telegram bot via @BotFather and get BOT_TOKEN.
2) Get your CHAT_ID:
   - For a private chat: write to your bot, then use any "getUpdates" helper to see chat id
   - Or add the bot to a group and use the group chat id

## Run locally

```bash
cd telegram_bot
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export BOT_TOKEN="YOUR_TOKEN"
export CHAT_IDS="123456789,987654321"
export DATABASE_URL="mongodb+srv://..."
python notify_orders.py
```

The bot watches the `orders` collection in your MongoDB database.
