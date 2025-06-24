'use client'
import Head from 'next/head';
import SocialMediaCard from './SocialMediaCard';
import { useEffect, useState } from 'react';

interface SocialMediaEntry {
  platform: string;
  count: number;
  link: string;
}

type SocialMediaMap = {
  [platform: string]: {
    count: number;
    link: string;
  };
};

const SocialMediaPage = () => {
  const [data, setData] = useState<SocialMediaMap>({});
  const [loading, setLoading] = useState(true);

  async function fetchSocialMedia() {
    const res = await fetch("/api/social-media");
    const array: SocialMediaEntry[] = await res.json();

    // Transform array to object
    const mapped: SocialMediaMap = {};
    array.forEach(({ platform, count, link }) => {
      mapped[platform] = { count, link };
    });

    setData(mapped);
    setLoading(false);
  }

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-auto">
      <Head>
        <title>Social Media Dashboard</title>
        <meta name="description" content="Social media platform UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Social Media Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Manage your social media links and track engagement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <SocialMediaCard
            platform="facebook"
            content={data.facebook?.link || ''}
            clicks={data.facebook?.count || 0}
          />

          <SocialMediaCard
            platform="linkedin"
            content={data.linkedin?.link || ''}
            clicks={data.linkedin?.count || 0}
          />

          <SocialMediaCard
            platform="whatsapp"
            content={data.whatsapp?.link || ''}
            clicks={data.whatsapp?.count || 0}
          />
        </div>
      </main>
    </div>
  );
};

export default SocialMediaPage;