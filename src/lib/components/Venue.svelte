<script lang="ts">
	import { lang, t } from '$lib/i18n';

	let l = $derived($lang);
</script>

<section class="venue">
	<span class="label">{t(l, 'venue')}</span>
	<div class="divider"></div>
	<div class="map-container">
		<iframe
			title="2GIS Map"
			src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A42.839003%2C%22lon%22%3A74.637695%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22bishkek%22%7D%2C%22org%22%3A%2270000001039576605%22%7D"
			width="100%"
			height="100%"
			frameborder="0"
			style="border: 0;"
			allowfullscreen
		></iframe>
	</div>
	<h3 class="name">{t(l, 'venueName')}</h3>
	<p class="address">{t(l, 'venueAddress')}</p>
	<a
		class="gis-link"
		href="https://2gis.kg/bishkek/firm/70000001039576605"
		target="_blank"
		rel="noopener noreferrer"
	>
		{t(l, 'openIn2gis')}
	</a>
</section>

<style>
	.venue {
		padding: 40px 24px;
		background: var(--ivory);
		text-align: center;
	}

	.label {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 300;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--sage);
	}

	.divider {
		width: 40px;
		height: 1px;
		background: var(--gold);
		margin: 8px auto 20px;
	}

	.map-container {
		height: 280px;
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 16px;
	}

	.name {
		font-family: var(--font-serif);
		font-size: 24px;
		font-weight: 600;
		color: var(--text-dark);
		margin-bottom: 4px;
	}

	.address {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 300;
		color: #777;
	}

	.gis-link {
		display: inline-block;
		margin-top: 16px;
		padding: 10px 24px;
		border: 1px solid var(--sage);
		border-radius: 8px;
		color: var(--sage-text);
		font-size: 14px;
		font-family: var(--font-sans);
		font-weight: 400;
		text-decoration: none;
		transition: background 0.2s, color 0.2s;
	}

	.gis-link:hover {
		background: var(--sage-bg);
	}
</style>
