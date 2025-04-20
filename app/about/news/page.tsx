'use client';

import NewsBanner from './_components/banner';
import NewsGrid from './_components/news-grid';

export default function NewsPage() {
  return (
    <div className="container pt-10 pb-[130px]">
      <NewsBanner />
      <NewsGrid />
    </div>
  );
}
