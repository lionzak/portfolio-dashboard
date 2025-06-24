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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 overflow-auto">
      <Head>
        <title>Social Media Dashboard</title>
        <meta name="description" content="Social media platform UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Social Media Management
        </h1>

        <div className="space-y-6">
          <SocialMediaCard
            platform="facebook"
            content={data.facebook.link}
            clicks={data.facebook.count}
          />

          <SocialMediaCard
            platform="linkedin"
            content={data.linkedin.link}
            clicks={data.linkedin.count}
          />

          <SocialMediaCard
            platform="whatsapp"
            content={data.whatsapp.link}
            clicks={data.whatsapp.count}
          />
        </div>
      </main>
    </div>
  );
};

export default SocialMediaPage;