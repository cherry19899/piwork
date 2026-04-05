'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Briefcase, Calendar, CheckCircle, Upload, Plus, X } from 'lucide-react';

export function Week9UserProfile({ userId, userProfile }) {
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [uploadMode, setUploadMode] = useState(false);

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && portfolioImages.length < 5) {
      const urls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setPortfolioImages([...portfolioImages, ...urls].slice(0, 5));
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Card className="bg-card border-border p-6">
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-accent flex-shrink-0" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{userProfile?.name}</h1>
            <p className="text-sm text-muted-foreground">Joined {new Date(userProfile?.registeredAt).toLocaleDateString()}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm">KYC: <span className="text-accent font-semibold">{userProfile?.kycStatus}</span></span>
              <span className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-accent fill-accent" />
                {userProfile?.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-secondary p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Completed Deals</p>
            <p className="text-lg font-bold text-foreground">{userProfile?.completedDeals}</p>
          </div>
          <div className="bg-secondary p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Average Rating</p>
            <p className="text-lg font-bold text-foreground">{userProfile?.averageRating.toFixed(1)}/5</p>
          </div>
        </div>
      </Card>

      <Card className="bg-card border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Portfolio</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {portfolioImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img} alt="portfolio" className="w-full aspect-square object-cover rounded-lg" />
              <button
                onClick={() => setPortfolioImages(portfolioImages.filter((_, i) => i !== idx))}
                className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          {portfolioImages.length < 5 && (
            <label className="flex items-center justify-center aspect-square border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent">
              <Plus className="w-6 h-6 text-muted-foreground" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePortfolioUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </Card>
    </div>
  );
}
