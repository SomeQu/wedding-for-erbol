interface RsvpData {
	fullName: string;
	side: 'groom' | 'bride' | null;
	relationship: string | null;
	comment: string;
}

export async function sendRsvp(data: RsvpData): Promise<boolean> {
	try {
		const res = await fetch('/api/rsvp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		return res.ok;
	} catch {
		return false;
	}
}
