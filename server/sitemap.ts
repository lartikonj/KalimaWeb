
import { getArticles, getCategories, getStaticPages } from "../client/src/lib/firebase";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(baseUrl: string): Promise<string> {
  const urls: SitemapUrl[] = [];

  // Add homepage
  urls.push({
    loc: baseUrl,
    changefreq: 'daily',
    priority: 1.0
  });

  // Add static pages
  urls.push(
    { loc: `${baseUrl}/categories`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${baseUrl}/search`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${baseUrl}/login`, changefreq: 'yearly', priority: 0.3 },
    { loc: `${baseUrl}/register`, changefreq: 'yearly', priority: 0.3 }
  );

  try {
    // Add dynamic static pages from Firestore
    const staticPages = await getStaticPages();
    staticPages.forEach(page => {
      urls.push({
        loc: `${baseUrl}/page/${page.slug}`,
        changefreq: 'monthly',
        priority: 0.7
      });
    });

    // Add categories and subcategories
    const categories = await getCategories();
    categories.forEach(category => {
      // Add category page
      urls.push({
        loc: `${baseUrl}/categories/${category.slug}`,
        changefreq: 'weekly',
        priority: 0.8
      });

      // Add subcategories
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          urls.push({
            loc: `${baseUrl}/categories/${category.slug}/${subcategory.slug}`,
            changefreq: 'weekly',
            priority: 0.7
          });
        });
      }
    });

    // Add articles
    const articles = await getArticles({ draft: false });
    articles.forEach(article => {
      urls.push({
        loc: `${baseUrl}/articles/${article.slug}`,
        lastmod: article.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      });
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
}
