import { env } from '$env/dynamic/private';

function token() {
	return env.BOT_TOKEN || '8925412854:AAHy8HVwyFG62hlwPmOWhJWb5z-PYFj0YOU';
}

function chatId() {
	return env.CHAT_ID || '445908404';
}

function h(text: string) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function tg(method: string, payload: Record<string, unknown>) {
	const res = await fetch(`https://api.telegram.org/bot${token()}/${method}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	return res.json();
}

export async function sendNotification(guest: {
	fullName: string;
	side: string | null;
	relationship: string | null;
	comment: string;
}, totalGuests: number) {
	const sideMap: Record<string, string> = { groom: 'Жениха', bride: 'Невесты' };
	const relMap: Record<string, string> = {
		relative: 'Родственник',
		friend: 'Друг',
		colleague: 'Коллега',
		neighbor: 'Сосед',
		other: 'Другое'
	};

	const side = sideMap[guest.side ?? ''] ?? '—';
	const rel = relMap[guest.relationship ?? ''] ?? guest.relationship ?? '—';

	const lines = [
		'💍 <b>Новое подтверждение!</b>',
		'',
		`👤 <b>ФИО:</b> ${h(guest.fullName)}`,
		`🤝 <b>Сторона:</b> ${side}`,
		`📋 <b>Кем приходится:</b> ${rel}`
	];
	if (guest.comment?.trim()) {
		lines.push(`💬 <b>Комментарий:</b> ${h(guest.comment)}`);
	}
	lines.push(`\n<i>Всего гостей: ${totalGuests}</i>`);

	await tg('sendMessage', {
		chat_id: chatId(),
		text: lines.join('\n'),
		parse_mode: 'HTML'
	});
}

export async function sendMessage(chatId: string, text: string, markup?: unknown) {
	return tg('sendMessage', {
		chat_id: chatId,
		text,
		parse_mode: 'HTML',
		...(markup ? { reply_markup: markup } : {})
	});
}

export async function editMessage(chatId: string, msgId: number, text: string, markup?: unknown) {
	return tg('editMessageText', {
		chat_id: chatId,
		message_id: msgId,
		text,
		parse_mode: 'HTML',
		...(markup ? { reply_markup: markup } : {})
	});
}

export async function answerCallback(cbId: string) {
	return tg('answerCallbackQuery', { callback_query_id: cbId });
}
