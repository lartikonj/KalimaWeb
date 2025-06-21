
import { getArticles, getCategories, getStaticPages } from "./firebase-admin";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(baseUrl: string): Promise<string> {
  const urls: SitemapUrl[] = [];
  const languages = ['en', 'ar', 'fr', 'es', 'de'];

  // Add homepage
  urls.push({
    loc: baseUrl,
    changefreq: 'daily',
    priority: 1.0
  });

  // Add language-specific homepages
  languages.forEach(lang => {
    urls.push({
      loc: `${baseUrl}/${lang}`,
      changefreq: 'daily',
      priority: 1.0
    });
  });

  // Add static pages (both legacy and language-specific)
  urls.push(
    { loc: `${baseUrl}/categories`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${baseUrl}/search`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${baseUrl}/login`, changefreq: 'yearly', priority: 0.3 },
    { loc: `${baseUrl}/register`, changefreq: 'yearly', priority: 0.3 }
  );

  // Add language-specific static pages
  languages.forEach(lang => {
    urls.push(
      { loc: `${baseUrl}/${lang}/categories`, changefreq: 'weekly', priority: 0.9 },
      { loc: `${baseUrl}/${lang}/search`, changefreq: 'monthly', priority: 0.6 },
      { loc: `${baseUrl}/${lang}/favorites`, changefreq: 'monthly', priority: 0.5 },
      { loc: `${baseUrl}/${lang}/suggestions`, changefreq: 'monthly', priority: 0.4 }
    );
  });

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

    // Add categories and subcategories (both legacy and language-specific)
    const categories = await getCategories();
    categories.forEach(category => {
      // Add legacy category page
      urls.push({
        loc: `${baseUrl}/categories/${category.slug}`,
        changefreq: 'weekly',
        priority: 0.8
      });

      // Add language-specific category pages
      languages.forEach(lang => {
        urls.push({
          loc: `${baseUrl}/${lang}/categories/${category.slug}`,
          changefreq: 'weekly',
          priority: 0.8
        });
      });

      // Add subcategories
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          // Legacy subcategory
          urls.push({
            loc: `${baseUrl}/categories/${category.slug}/${subcategory.slug}`,
            changefreq: 'weekly',
            priority: 0.7
          });

          // Language-specific subcategories
          languages.forEach(lang => {
            urls.push({
              loc: `${baseUrl}/${lang}/categories/${category.slug}/${subcategory.slug}`,
              changefreq: 'weekly',
              priority: 0.7
            });
          });
        });
      }
    });

    // Add articles (both legacy and language-specific)
    const articles = await getArticles({ draft: false });
    articles.forEach(article => {
      // Legacy article URL
      urls.push({
        loc: `${baseUrl}/articles/${article.slug}`,
        lastmod: article.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      });

      // Language-specific article URLs for each available language
      if (article.availableLanguages && Array.isArray(article.availableLanguages)) {
        article.availableLanguages.forEach(lang => {
          const translation = article.translations && article.translations[lang];
          if (translation && translation.category && translation.subcategory) {
            urls.push({
              loc: `${baseUrl}/${lang}/categories/${translation.category}/${translation.subcategory}/${article.slug}`,
              lastmod: article.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              changefreq: 'monthly',
              priority: 0.9 // Higher priority for language-specific URLs
            });
          }
        });
      }
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
