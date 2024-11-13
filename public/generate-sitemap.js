import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// الروابط الخاصة بموقعك
const pages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
];


(async () => {
  const sitemapStream = new SitemapStream({ hostname: 'https://alpt.org/' });

  pages.forEach((page) => {
    sitemapStream.write(page);
  });
  sitemapStream.end();

  const sitemapData = await streamToPromise(sitemapStream).then((data) => data.toString());

  const outputPath = resolve(__dirname, 'sitemap.xml');
  createWriteStream(outputPath).write(sitemapData);

  console.log('Sitemap created successfully!');
})();
