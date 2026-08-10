#!/usr/bin/env python3
"""
Telegram bot for wedding RSVP management.
Run: python3 bot.py
"""

import json
import os
import time
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.request import urlopen, Request

BOT_TOKEN = '8925412854:AAHy8HVwyFG62hlwPmOWhJWb5z-PYFj0YOU'
CHAT_ID = '445908404'
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'guests.json')
HTTP_PORT = 3001
PAGE_SIZE = 10


# ── Data ──────────────────────────────────────────────

_lock = threading.Lock()


def load_data():
    with _lock:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    return {'guests': []}


def save_data(data):
    with _lock:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


def add_guest(guest):
    data = load_data()
    data['guests'].append(guest)
    save_data(data)
    return len(data['guests'])


# ── Telegram API ──────────────────────────────────────

def tg(method, payload=None):
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/{method}'
    body = json.dumps(payload or {}).encode()
    req = Request(url, data=body, headers={'Content-Type': 'application/json'})
    try:
        with urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f'[TG] {method} error: {e}')
        return None


def send_msg(chat_id, text, markup=None):
    payload = {'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}
    if markup:
        payload['reply_markup'] = markup
    return tg('sendMessage', payload)


def edit_msg(chat_id, msg_id, text, markup=None):
    payload = {
        'chat_id': chat_id,
        'message_id': msg_id,
        'text': text,
        'parse_mode': 'HTML',
    }
    if markup:
        payload['reply_markup'] = markup
    return tg('editMessageText', payload)


def answer_cb(cb_id):
    tg('answerCallbackQuery', {'callback_query_id': cb_id})


# ── Keyboards ─────────────────────────────────────────

def main_kb():
    return {'inline_keyboard': [[
        {'text': '👥 Гости', 'callback_data': 'guests:0'},
        {'text': '💬 Комментарии', 'callback_data': 'comments:0'},
    ]]}


def nav_kb(prefix, page, total_pages):
    nav = []
    if page > 0:
        nav.append({'text': '« Назад', 'callback_data': f'{prefix}:{page - 1}'})
    if page < total_pages - 1:
        nav.append({'text': 'Вперёд »', 'callback_data': f'{prefix}:{page + 1}'})
    rows = []
    if nav:
        rows.append(nav)
    rows.append([{'text': '↩ Меню', 'callback_data': 'menu'}])
    return {'inline_keyboard': rows}


# ── Handlers ──────────────────────────────────────────

SIDE = {'groom': 'жениха', 'bride': 'невесты'}
REL = {
    'relative': 'Родственник',
    'friend': 'Друг',
    'colleague': 'Коллега',
    'neighbor': 'Сосед',
    'other': 'Другое',
}


def h(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def show_menu(chat_id, msg_id=None):
    data = load_data()
    count = len(data.get('guests', []))
    text = f'💍 <b>Свадьба Эрбола и Сайкал</b>\n\nПодтвердили: {count} гостей'
    if msg_id:
        edit_msg(chat_id, msg_id, text, main_kb())
    else:
        send_msg(chat_id, text, main_kb())


def show_guests(chat_id, msg_id, page):
    guests = load_data().get('guests', [])

    if not guests:
        text = '👥 <b>Список гостей</b>\n\nПока никто не подтвердил.'
        if msg_id:
            edit_msg(chat_id, msg_id, text, main_kb())
        else:
            send_msg(chat_id, text, main_kb())
        return

    total = len(guests)
    total_pages = max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE)
    page = min(page, total_pages - 1)
    start = page * PAGE_SIZE

    lines = [f'👥 <b>Список гостей</b> ({total})\n']
    for i, g in enumerate(guests[start:start + PAGE_SIZE], start + 1):
        side = SIDE.get(g.get('side', ''), '—')
        rel = REL.get(g.get('relationship', ''), g.get('relationship') or '—')
        lines.append(f'{i}. {h(g.get("fullName", "—"))} — со стороны {side}, {rel.lower()}')

    if total_pages > 1:
        lines.append(f'\nСтраница {page + 1}/{total_pages}')

    text = '\n'.join(lines)
    kb = nav_kb('guests', page, total_pages)
    if msg_id:
        edit_msg(chat_id, msg_id, text, kb)
    else:
        send_msg(chat_id, text, kb)


def show_comments(chat_id, msg_id, page):
    guests = load_data().get('guests', [])
    comments = [(g['fullName'], g['comment']) for g in guests if g.get('comment', '').strip()]

    if not comments:
        text = '💬 <b>Комментарии</b>\n\nПока нет комментариев.'
        if msg_id:
            edit_msg(chat_id, msg_id, text, main_kb())
        else:
            send_msg(chat_id, text, main_kb())
        return

    total = len(comments)
    total_pages = max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE)
    page = min(page, total_pages - 1)
    start = page * PAGE_SIZE

    lines = [f'💬 <b>Комментарии</b> ({total})\n']
    for name, comment in comments[start:start + PAGE_SIZE]:
        lines.append(f'<b>{h(name)}:</b>\n{h(comment)}\n')

    if total_pages > 1:
        lines.append(f'Страница {page + 1}/{total_pages}')

    text = '\n'.join(lines)
    kb = nav_kb('comments', page, total_pages)
    if msg_id:
        edit_msg(chat_id, msg_id, text, kb)
    else:
        send_msg(chat_id, text, kb)


def handle_update(update):
    if 'message' in update:
        chat_id = update['message']['chat']['id']
        if update['message'].get('text', '').startswith('/start'):
            show_menu(chat_id)

    elif 'callback_query' in update:
        cb = update['callback_query']
        chat_id = cb['message']['chat']['id']
        msg_id = cb['message']['message_id']
        data = cb['data']
        answer_cb(cb['id'])

        if data == 'menu':
            show_menu(chat_id, msg_id)
        elif data.startswith('guests:'):
            show_guests(chat_id, msg_id, int(data.split(':')[1]))
        elif data.startswith('comments:'):
            show_comments(chat_id, msg_id, int(data.split(':')[1]))


# ── Bot polling ───────────────────────────────────────

def poll():
    offset = 0
    print('[BOT] Polling started')
    while True:
        try:
            result = tg('getUpdates', {'offset': offset, 'timeout': 30})
            if result and result.get('ok'):
                for upd in result['result']:
                    offset = upd['update_id'] + 1
                    try:
                        handle_update(upd)
                    except Exception as e:
                        print(f'[BOT] Update error: {e}')
        except Exception as e:
            print(f'[BOT] Poll error: {e}')
            time.sleep(3)


# ── HTTP Server (receives RSVP from website) ─────────

class RsvpHandler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        if self.path != '/rsvp':
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)
        try:
            guest = json.loads(body)
        except Exception:
            self.send_response(400)
            self.end_headers()
            return

        count = add_guest(guest)

        side = {'groom': 'Жениха', 'bride': 'Невесты'}.get(guest.get('side', ''), '—')
        rel = REL.get(guest.get('relationship', ''), guest.get('relationship') or '—')
        lines = [
            '💍 <b>Новое подтверждение!</b>',
            '',
            f'👤 <b>ФИО:</b> {h(guest.get("fullName", "—"))}',
            f'🤝 <b>Сторона:</b> {side}',
            f'📋 <b>Кем приходится:</b> {rel}',
        ]
        comment = guest.get('comment', '').strip()
        if comment:
            lines.append(f'💬 <b>Комментарий:</b> {h(comment)}')
        lines.append(f'\n<i>Всего гостей: {count}</i>')

        send_msg(CHAT_ID, '\n'.join(lines))

        self.send_response(200)
        self._cors()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'ok': True}).encode())

    def log_message(self, fmt, *args):
        print(f'[HTTP] {fmt % args}')


def start_http():
    server = HTTPServer(('0.0.0.0', HTTP_PORT), RsvpHandler)
    print(f'[HTTP] Listening on port {HTTP_PORT}')
    server.serve_forever()


# ── Main ──────────────────────────────────────────────

if __name__ == '__main__':
    if not os.path.exists(DATA_FILE):
        save_data({'guests': []})
        print(f'[DATA] Created {DATA_FILE}')

    threading.Thread(target=start_http, daemon=True).start()
    poll()
