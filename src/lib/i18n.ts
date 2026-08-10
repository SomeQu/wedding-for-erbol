import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

export type Lang = 'ru' | 'ky';

export const lang = writable<Lang>('ru');

export function setLang(l: Lang) {
	lang.set(l);
	const path = l === 'ru' ? '/ru' : '/kg';
	goto(path, { replaceState: true });
}

export function initLangFromPath(pathname: string) {
	if (pathname.startsWith('/kg')) {
		lang.set('ky');
	} else {
		lang.set('ru');
	}
}

const translations = {
	ru: {
		invitation: 'Приглашение на свадьбу',
		schedule: 'Программа дня',
		venue: 'Место проведения',
		venueAddress: 'ул. 7 апреля, 174/1, г. Бишкек',
		venueName: 'Асман',
		confirmation: 'Подтверждение',
		iWillCome: 'Я приду ✓',
		clickToConfirm: 'Нажмите, чтобы подтвердить',
		fullName: 'ФИО',
		whoseSide: 'С чьей стороны',
		groom: 'Жениха',
		bride: 'Невесты',
		relationship: 'Кем приходитесь',
		relative: 'Родственник',
		friend: 'Друг',
		colleague: 'Коллега',
		neighbor: 'Сосед',
		other: 'Другое',
		leaveComment: 'Оставить комментарий',
		commentPlaceholder: 'Ваши пожелания молодожёнам...',
		send: 'Отправить',
		thankYou: 'Спасибо!',
		countdown: 'До нашей свадьбы',
		days: 'дней',
		hours: 'часов',
		minutes: 'мин',
		seconds: 'сек',
		footer: 'С любовью ждём вас!',
		gathering: 'Сбор гостей',
		gatheringSub: 'Тёплая встреча и фотографии на память',
		celebration: 'Начало торжества',
		celebrationSub: 'Торжественное открытие вечера',
		program: 'Праздничная программа',
		programSub: 'Тёплые слова и особенные мгновения',
		dancing: 'Танцы и пожелания',
		dancingSub: 'Музыка, радость и танцы с близкими',
		fullNamePlaceholder: 'Введите ваше ФИО',
		openIn2gis: 'Открыть в 2ГИС',
		scrollHint: 'Листайте вниз'
	},
	ky: {
		invitation: 'Тойго чакыруу',
		schedule: 'Күндүн программасы',
		venue: 'Өткөрүлө турган жер',
		venueAddress: '7 апрель көч., 174/1, Бишкек ш.',
		venueName: 'Асман',
		confirmation: 'Ырастоо',
		iWillCome: 'Мен келем ✓',
		clickToConfirm: 'Ырастоо үчүн басыңыз',
		fullName: 'Аты-жөнү',
		whoseSide: 'Кимдин тарабынан',
		groom: 'Күйөө жигиттин',
		bride: 'Келиндин',
		relationship: 'Ким болосуз',
		relative: 'Туугандар',
		friend: 'Дос',
		colleague: 'Кесиптеш',
		neighbor: 'Коңшу',
		other: 'Башка',
		leaveComment: 'Комментарий калтыруу',
		commentPlaceholder: 'Жаңы үй-бүлөгө тилектериңиз...',
		send: 'Жөнөтүү',
		thankYou: 'Рахмат!',
		countdown: 'Биздин тойго чейин',
		days: 'күн',
		hours: 'саат',
		minutes: 'мүн',
		seconds: 'сек',
		footer: 'Сүйүү менен күтөбүз!',
		gathering: 'Коноктордун чогулушу',
		gatheringSub: 'Жылуу жолугушуу жана сүрөткө түшүү',
		celebration: 'Тойдун башталышы',
		celebrationSub: 'Кечени салтанаттуу ачуу',
		program: 'Майрамдык программа',
		programSub: 'Жылуу сөздөр жана өзгөчө учурлар',
		dancing: 'Бий жана каалоолор',
		dancingSub: 'Музыка, кубаныч жана жакындар менен бий',
		fullNamePlaceholder: 'Аты-жөнүңүздү жазыңыз',
		openIn2gis: '2ГИСте ачуу',
		scrollHint: 'Ылдый сүрүңүз'
	}
} as const;

export type TranslationKey = keyof (typeof translations)['ru'];

export function t(l: Lang, key: TranslationKey): string {
	return translations[l][key];
}
