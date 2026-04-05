'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JOB_CATEGORIES } from '@/lib/job-categories';

interface JobCategoryBrowserProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function JobCategoryBrowser({
  selectedCategory,
  onSelectCategory,
}: JobCategoryBrowserProps) {
  const categories = Object.values(JOB_CATEGORIES);

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-foreground text-sm">Browse by Category</h3>

      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === (category.id as string);
          return (
            <Card
              key={category.id}
              onClick={() => onSelectCategory(category.id as string)}
              className={`p-3 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-card border-border hover:border-accent/50'
              }`}
            >
              <p className="font-semibold text-xs mb-1">{category.name}</p>
              <p className="text-xs opacity-75 line-clamp-2">{category.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

interface JobCategoryDetailProps {
  categoryId: string;
}

export function JobCategoryDetail({ categoryId }: JobCategoryDetailProps) {
  const category = JOB_CATEGORIES[categoryId as keyof typeof JOB_CATEGORIES];

  if (!category) {
    return <div className="text-xs text-muted-foreground">Category not found</div>;
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border p-4">
        <h2 className="font-bold text-foreground text-lg mb-1">{category.name}</h2>
        <p className="text-xs text-muted-foreground mb-4">{category.description}</p>

        {/* Subcategories */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Types:</p>
          <div className="flex flex-wrap gap-1.5">
            {category.subcategories.map((sub) => (
              <Badge key={sub.id} className="bg-secondary text-foreground text-xs">
                {sub.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Common Skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {category.skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-accent/10 text-accent text-xs border border-accent/30"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="bg-secondary border-border p-4">
        <p className="text-xs font-semibold text-foreground mb-2">Pro Tips:</p>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li>• Build a strong portfolio in this category</li>
          <li>• Respond quickly to job inquiries</li>
          <li>• Deliver high-quality work consistently</li>
          <li>• Request reviews after completing jobs</li>
        </ul>
      </Card>
    </div>
  );
}

interface JobListingCardProps {
  title: string;
  category: string;
  subcategory: string;
  budget: number;
  timeframe: string;
  requiredSkills: string[];
  isUrgent?: boolean;
  isPremium?: boolean;
  applicants?: number;
}

export function JobListingCard({
  title,
  category,
  subcategory,
  budget,
  timeframe,
  requiredSkills,
  isUrgent,
  isPremium,
  applicants = 0,
}: JobListingCardProps) {
  const categoryObj = JOB_CATEGORIES[category as keyof typeof JOB_CATEGORIES];

  return (
    <Card
      className={`p-3.5 cursor-pointer transition-all ${
        isUrgent
          ? 'bg-red-950/20 border-red-500/50'
          : 'bg-card border-border hover:border-accent/50'
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-bold text-sm text-foreground truncate">{title}</h3>
            {isUrgent && (
              <Badge className="bg-red-500 text-white text-xs flex-shrink-0">Urgent</Badge>
            )}
            {isPremium && (
              <Badge className="bg-accent text-accent-foreground text-xs flex-shrink-0">
                Featured
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {categoryObj?.name} • {subcategory}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-accent text-sm">{budget} π</p>
          <p className="text-xs text-muted-foreground">{timeframe}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {requiredSkills.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              className="bg-secondary text-foreground text-xs"
            >
              {skill}
            </Badge>
          ))}
          {requiredSkills.length > 3 && (
            <Badge className="bg-secondary text-muted-foreground text-xs">
              +{requiredSkills.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">{applicants} applications</p>
        <p className="text-xs font-semibold text-accent">View Details →</p>
      </div>
    </Card>
  );
}
