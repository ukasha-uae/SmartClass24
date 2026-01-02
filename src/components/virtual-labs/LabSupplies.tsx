'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export interface SupplyItem {
  id: string;
  name: string;
  icon?: string; // Emoji or icon name
  emoji?: string; // Emoji for display
  description?: string;
  required?: boolean; // If false, item is optional
}

interface LabSuppliesProps {
  supplies: SupplyItem[];
  collectedItems: string[];
  onCollect: (itemId: string) => void;
  showSupplies?: boolean;
  title?: string;
  description?: string;
  requiredCount?: number; // Number of required items to proceed
  onAllCollected?: () => void;
  className?: string;
}

/**
 * Standardized Premium Lab Supplies Component
 * Used across all virtual labs for consistent supplies collection
 */
export function LabSupplies({
  supplies,
  collectedItems,
  onCollect,
  showSupplies = true,
  title = 'Lab Supplies - Click to Collect',
  description = 'Click on each item in order to collect them for your experiment',
  requiredCount,
  onAllCollected,
  className
}: LabSuppliesProps) {
  const collectedCount = collectedItems.length;
  const totalCount = requiredCount || supplies.length;
  const allCollected = collectedCount >= totalCount;

  React.useEffect(() => {
    if (allCollected && onAllCollected && collectedCount === totalCount) {
      // Small delay to show the last item being collected
      const timer = setTimeout(() => {
        onAllCollected();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [allCollected, collectedCount, totalCount, onAllCollected]);

  const handleCollect = (itemId: string) => {
    if (!collectedItems.includes(itemId)) {
      onCollect(itemId);
      // Celebration effect
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.6 },
      });
    }
  };

  if (!showSupplies) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn('w-full', className)}
    >
      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/80 via-yellow-50/80 to-orange-50/80 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 backdrop-blur-sm shadow-xl overflow-hidden relative">
        {/* Premium animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/10 via-yellow-200/10 to-orange-200/10 dark:from-amber-800/5 dark:via-yellow-800/5 dark:to-orange-800/5 animate-pulse"></div>
        
        <CardHeader className="relative z-10 border-b border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-r from-amber-100/50 to-yellow-100/50 dark:from-amber-900/20 dark:to-yellow-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  {title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              </div>
            </div>
            {allCollected && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg animate-pulse">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                All Collected!
              </Badge>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                Progress: {collectedCount} / {totalCount}
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400">
                {Math.round((collectedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-amber-200/50 dark:bg-amber-800/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(collectedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {supplies.map((supply, index) => {
                const isCollected = collectedItems.includes(supply.id);
                const isRequired = supply.required !== false; // Default to required

                return (
                  <motion.div
                    key={supply.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: isCollected ? 1 : 1.05, y: isCollected ? 0 : -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => handleCollect(supply.id)}
                      disabled={isCollected}
                      className={cn(
                        'w-full p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group',
                        isCollected
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg cursor-default'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-xl cursor-pointer',
                        !isRequired && 'opacity-75'
                      )}
                    >
                      {/* Premium glow effect */}
                      {!isCollected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-yellow-400/0 to-orange-400/0 group-hover:from-amber-400/10 group-hover:via-yellow-400/10 group-hover:to-orange-400/10 transition-all duration-300"></div>
                      )}

                      {/* Checkmark overlay for collected items */}
                      {isCollected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute top-2 right-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-1.5 shadow-lg"
                        >
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </motion.div>
                      )}

                      {/* Item icon/emoji */}
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className={cn(
                          'text-4xl mb-1 transition-transform duration-300',
                          isCollected ? 'scale-90 grayscale-[20%]' : 'group-hover:scale-110'
                        )}>
                          {supply.emoji || supply.icon || '📦'}
                        </div>
                        
                        <h4 className={cn(
                          'font-semibold text-sm text-center transition-colors',
                          isCollected
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-gray-700 dark:text-gray-300 group-hover:text-amber-700 dark:group-hover:text-amber-400'
                        )}>
                          {supply.name}
                        </h4>

                        {supply.description && (
                          <p className="text-xs text-muted-foreground text-center line-clamp-2">
                            {supply.description}
                          </p>
                        )}

                        {!isRequired && (
                          <Badge variant="outline" className="text-xs mt-1 border-amber-300 text-amber-600">
                            Optional
                          </Badge>
                        )}
                      </div>

                      {/* Ripple effect on click */}
                      {!isCollected && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-amber-400/20"
                          initial={{ scale: 0, opacity: 0 }}
                          whileTap={{ scale: 2, opacity: [0, 0.5, 0] }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Collection complete message */}
          {allCollected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-400/50 dark:border-green-600/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-300">
                    All supplies collected! 🎉
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    You're ready to start the experiment!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}



