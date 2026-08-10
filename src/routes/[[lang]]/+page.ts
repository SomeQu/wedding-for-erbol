import { redirect } from '@sveltejs/kit';
import { initLangFromPath } from '$lib/i18n';

export const entries = () => [{ lang: '' }, { lang: 'ru' }, { lang: 'kg' }];

export function load({ params, url }) {
	const l = params.lang;

	if (!l) {
		redirect(302, '/ru');
	}

	if (l !== 'ru' && l !== 'kg') {
		redirect(302, '/ru');
	}

	initLangFromPath(url.pathname);
}
