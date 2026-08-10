import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getGuests } from '$lib/server/db';
import { sendMessage, editMessage, answerCallback } from '$lib/server/telegram';

export const prerender = false;

const PAGE_SIZE = 10;

const SIDE: Record<string, string> = { groom: 'жениха', bride: 'невесты' };
const REL: Record<string, string> = {
	relative: 'Родственник',
	friend: 'Друг',
	colleague: 'Коллега',
	neighbor: 'Сосед',
	other: 'Другое'
};

function h(text: string) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function mainKb() {
	return {
		inline_keyboard: [[
			{ text: '👥 Гости', callback_data: 'guests:0' },
			{ text: '💬 Комментарии', callback_data: 'comments:0' }
		]]
	};
}

function navKb(prefix: string, page: number, totalPages: number) {
	const nav: { text: string; callback_data: string }[] = [];
	if (page > 0) nav.push({ text: '« Назад', callback_data: `${prefix}:${page - 1}` });
	if (page < totalPages - 1) nav.push({ text: 'Вперёд »', callback_data: `${prefix}:${page + 1}` });
	const rows: { text: string; callback_data: string }[][] = [];
	if (nav.length) rows.push(nav);
	rows.push([{ text: '↩ Меню', callback_data: 'menu' }]);
	return { inline_keyboard: rows };
}

async function showMenu(chatId: string, msgId?: number) {
	const guests = await getGuests();
	const text = `💍 <b>Свадьба Эрбола и Сайкал</b>\n\nПодтвердили: ${guests.length} гостей`;
	if (msgId) {
		await editMessage(chatId, msgId, text, mainKb());
	} else {
		await sendMessage(chatId, text, mainKb());
	}
}

async function showGuests(chatId: string, msgId: number, page: number) {
	const guests = await getGuests();
	if (!guests.length) {
		await editMessage(chatId, msgId, '👥 <b>Список гостей</b>\n\nПока никто не подтвердил.', mainKb());
		return;
	}
	const totalPages = Math.max(1, Math.ceil(guests.length / PAGE_SIZE));
	page = Math.min(page, totalPages - 1);
	const start = page * PAGE_SIZE;
	const slice = guests.slice(start, start + PAGE_SIZE);

	const lines = [`👥 <b>Список гостей</b> (${guests.length})\n`];
	slice.forEach((g, i) => {
		const side = SIDE[g.side ?? ''] ?? '—';
		const rel = REL[g.relationship ?? ''] ?? g.relationship ?? '—';
		lines.push(`${start + i + 1}. ${h(g.fullName)} — со стороны ${side}, ${rel.toLowerCase()}`);
	});
	if (totalPages > 1) lines.push(`\nСтраница ${page + 1}/${totalPages}`);

	await editMessage(chatId, msgId, lines.join('\n'), navKb('guests', page, totalPages));
}

async function showComments(chatId: string, msgId: number, page: number) {
	const guests = await getGuests();
	const comments = guests
		.filter((g) => g.comment?.trim())
		.map((g) => ({ name: g.fullName, comment: g.comment }));

	if (!comments.length) {
		await editMessage(chatId, msgId, '💬 <b>Комментарии</b>\n\nПока нет комментариев.', mainKb());
		return;
	}
	const totalPages = Math.max(1, Math.ceil(comments.length / PAGE_SIZE));
	page = Math.min(page, totalPages - 1);
	const start = page * PAGE_SIZE;
	const slice = comments.slice(start, start + PAGE_SIZE);

	const lines = [`💬 <b>Комментарии</b> (${comments.length})\n`];
	slice.forEach(({ name, comment }) => {
		lines.push(`<b>${h(name)}:</b>\n${h(comment)}\n`);
	});
	if (totalPages > 1) lines.push(`Страница ${page + 1}/${totalPages}`);

	await editMessage(chatId, msgId, lines.join('\n'), navKb('comments', page, totalPages));
}

export const POST: RequestHandler = async ({ request }) => {
	const secret = env.WEBHOOK_SECRET;
	if (secret) {
		const header = request.headers.get('x-telegram-bot-api-secret-token');
		if (header !== secret) {
			return json({ error: 'unauthorized' }, { status: 403 });
		}
	}

	const update = await request.json();

	if (update.message?.text?.startsWith('/start')) {
		await showMenu(String(update.message.chat.id));
	} else if (update.callback_query) {
		const cb = update.callback_query;
		const chatId = String(cb.message.chat.id);
		const msgId = cb.message.message_id;
		const data = cb.data as string;

		await answerCallback(cb.id);

		if (data === 'menu') {
			await showMenu(chatId, msgId);
		} else if (data.startsWith('guests:')) {
			await showGuests(chatId, msgId, parseInt(data.split(':')[1]));
		} else if (data.startsWith('comments:')) {
			await showComments(chatId, msgId, parseInt(data.split(':')[1]));
		}
	}

	return json({ ok: true });
};
