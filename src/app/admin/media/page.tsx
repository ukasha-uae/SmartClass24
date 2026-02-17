'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Download, Image as ImageIcon, Video, Search, Megaphone, Layers } from 'lucide-react';

type MediaType = 'flyer' | 'social' | 'video' | 'logo' | 'other';

interface MediaAsset {
  id: string;
  title: string;
  description: string;
  type: MediaType;
  tags: string[];
  format: string;
  size?: string;
  url: string;
}

// NOTE: Place actual files under /public/media/... matching these URLs.
const MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'global-flyer-1',
    title: 'Global SmartClass24 Flyer (A4)',
    description: 'Printable flyer for international schools and students (global branding, Arena + Labs).',
    type: 'flyer',
    tags: ['global', 'schools', 'print', 'arena', 'labs'],
    format: 'SVG (A4 layout)',
    size: 'Lightweight vector',
    url: '/media/flyers/global/smartclass24-global-flyer-a4.svg',
  },
  {
    id: 'ghana-flyer-1',
    title: 'Ghana BECE/WASSCE Flyer',
    description: 'Ghana-focused flyer highlighting BECE & WASSCE preparation with Arena + Virtual Labs.',
    type: 'flyer',
    tags: ['ghana', 'bece', 'wassce', 'print'],
    format: 'SVG (A5 layout)',
    size: 'Lightweight vector',
    url: '/media/flyers/ghana/smartclass24-ghana-bece-wassce-flyer.svg',
  },
  {
    id: 'rocket-race-reel',
    title: 'Rocket Race Arena – Promo Reel',
    description: 'Short vertical video showing the 3D Rocket Race mode for social media ads (Reels/TikTok/Shorts).',
    type: 'video',
    tags: ['rocket race', 'arena', 'social', 'video', '3d'],
    format: 'MP4 (1080x1920, 30s)',
    size: '12 MB',
    url: '/media/videos/arena/rocket-race-promo.mp4',
  },
  {
    id: 'wisdom-flyer-uae',
    title: 'Wisdom Warehouse – UAE Campus Flyer',
    description: 'Custom flyer for Wisdom Warehouse (Dubai) with alternative holistic positioning.',
    type: 'flyer',
    tags: ['wisdom warehouse', 'uae', 'middle east', 'schools'],
    format: 'SVG (A4 layout)',
    size: 'Lightweight vector',
    url: '/media/flyers/wisdom/wisdom-warehouse-uae-flyer.svg',
  },
  {
    id: 'logo-pack',
    title: 'SmartClass24 Logo Pack',
    description: 'Official logos (light/dark) in PNG + SVG for marketing materials.',
    type: 'logo',
    tags: ['logo', 'brand', 'global'],
    format: 'ZIP (SVG + PNG)',
    size: '1.2 MB',
    url: '/media/brand/smartclass24-logo-pack.zip',
  },
  {
    id: 'social-carousel-1',
    title: 'Social Carousel – “Master Your Curriculum”',
    description: '5-slide square carousel (1080x1080) for Instagram/LinkedIn campaigns.',
    type: 'social',
    tags: ['social', 'carousel', 'global', 'students'],
    format: 'ZIP (5 PNG slides)',
    size: '4.5 MB',
    url: '/media/social/carousels/master-your-curriculum-carousel.zip',
  },
];

function getTypeIcon(type: MediaType) {
  switch (type) {
    case 'flyer':
      return <ImageIcon className="h-4 w-4" />;
    case 'video':
      return <Video className="h-4 w-4" />;
    case 'social':
      return <Megaphone className="h-4 w-4" />;
    case 'logo':
      return <Layers className="h-4 w-4" />;
    default:
      return <ImageIcon className="h-4 w-4" />;
  }
}

export default function AdminMediaPage() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<'all' | MediaType>('all');

  const filteredAssets = useMemo(() => {
    const q = search.toLowerCase().trim();
    return MEDIA_ASSETS.filter((asset) => {
      const matchesType = activeType === 'all' || asset.type === activeType;
      const matchesQuery =
        !q ||
        asset.title.toLowerCase().includes(q) ||
        asset.description.toLowerCase().includes(q) ||
        asset.tags.some((t) => t.toLowerCase().includes(q));
      return matchesType && matchesQuery;
    });
  }, [search, activeType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-purple-950/40 dark:to-indigo-950/40 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Media Library
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">
              Download AI-generated **flyers, social graphics, and promo videos** for SmartClass24 and partner schools.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Admin Only
            </Badge>
            <p className="text-xs text-muted-foreground max-w-xs text-left md:text-right">
              Files are served from `/public/media`. Ask the tech team to drop new assets there and update this list.
            </p>
          </div>
        </header>

        <Card className="border-2 border-purple-100/60 dark:border-purple-900/60 bg-white/80 dark:bg-slate-950/70 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Ready-to-use marketing assets
                </CardTitle>
                <CardDescription>
                  Filter by type or search by keyword (e.g. “Ghana”, “Rocket”, “UAE”).
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full md:w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, tag, or description…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeType}
              onValueChange={(v) => setActiveType(v as any)}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="flyer">Flyers</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="logo">Logos</TabsTrigger>
              </TabsList>

              <TabsContent value={activeType} className="space-y-4">
                {filteredAssets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No assets match your filters yet. Ask the team to add files under `/public/media/...`.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAssets.map((asset) => (
                      <Card
                        key={asset.id}
                        className="flex flex-col justify-between border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/80 dark:bg-slate-900/70"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="flex items-center gap-2 text-sm">
                                {getTypeIcon(asset.type)}
                                <span>{asset.title}</span>
                              </CardTitle>
                              <CardDescription className="mt-1 text-xs line-clamp-3">
                                {asset.description}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                              {asset.type.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 flex-1 flex flex-col justify-between gap-3">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {asset.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{asset.format}</span>
                            {asset.size && <span>{asset.size}</span>}
                          </div>
                          <a href={asset.url} download className="mt-2 block">
                            <Button
                              type="button"
                              size="sm"
                              className="w-full flex items-center justify-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

