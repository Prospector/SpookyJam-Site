import rss from '@astrojs/rss';
import { TITLE, DESCRIPTION } from '../config';

export const get = () =>
	rss({
		title: TITLE,
		description: DESCRIPTION,
		site: import.meta.env.SITE,
		items: import.meta.glob('./updates/**/*.md'),
	});
