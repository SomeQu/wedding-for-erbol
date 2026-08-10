import { createClient } from '@vercel/kv';
import { env } from '$env/dynamic/private';

interface Guest {
	fullName: string;
	side: string | null;
	relationship: string | null;
	comment: string;
	timestamp: string;
}

function getKv() {
	return createClient({
		url: env.KV_REST_API_URL!,
		token: env.KV_REST_API_TOKEN!
	});
}

export async function addGuest(guest: Guest): Promise<number> {
	const kv = getKv();
	await kv.rpush('guests', JSON.stringify(guest));
	return await kv.llen('guests');
}

export async function getGuests(): Promise<Guest[]> {
	const kv = getKv();
	const raw = await kv.lrange('guests', 0, -1);
	return raw.map((item) => (typeof item === 'string' ? JSON.parse(item) : item) as Guest);
}
