import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addGuest } from '$lib/server/db';
import { sendNotification } from '$lib/server/telegram';

export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	if (!data.fullName?.trim()) {
		return json({ error: 'fullName required' }, { status: 400 });
	}

	const guest = {
		fullName: data.fullName,
		side: data.side ?? null,
		relationship: data.relationship ?? null,
		comment: data.comment ?? '',
		timestamp: new Date().toISOString()
	};

	const count = await addGuest(guest);
	await sendNotification(guest, count);

	return json({ ok: true, count });
};
