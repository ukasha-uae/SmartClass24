'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';

interface IntroSection {
  title: string;
  type: 'accordion' | 'text' | 'list';
  items?: Array<{
    title: string;
    content: string;
  }>;
  content?: string;
}

interface IntroData {
  title: string;
  introduction: string;
  sections: IntroSection[];
}

interface AdvancedLessonIntroProps {
  lessonSlug: string;
  onComplete: () => void;
}

export default function AdvancedLessonIntro({ lessonSlug, onComplete }: AdvancedLessonIntroProps) {
  const [introData, setIntroData] = useState<IntroData | null>(null);
  const [loading, setLoading] = useState(true);
  const { localizeContent } = useLocalization();

  useEffect(() => {
    // Try to load the JSON file for this lesson
    const loadIntroData = async () => {
      try {
        const response = await fetch(`/content/${lessonSlug}.json`);
        if (response.ok) {
          const data = await response.json();
          setIntroData(data);
        }
      } catch (error) {
        console.log('No advanced intro found for', lessonSlug);
      } finally {
        setLoading(false);
      }
    };

    loadIntroData();
  }, [lessonSlug]);

  // If no intro data, skip to main lesson
  useEffect(() => {
    if (!loading && !introData) {
      onComplete();
    }
  }, [loading, introData, onComplete]);

  if (loading || !introData) {
    return null;
  }

  const processContent = (content: string) => {
    return localizeContent(content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-4xl w-full"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {processContent(introData.title)}
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed">
                  {processContent(introData.introduction)}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-6 mb-8">
                {introData.sections.map((section, sectionIdx) => (
                  <motion.div
                    key={sectionIdx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIdx * 0.1 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <BookOpen className="w-6 h-6" />
                      {processContent(section.title)}
                    </h2>

                    {section.type === 'accordion' && section.items && (
                      <Accordion type="single" collapsible className="space-y-2">
                        {section.items.map((item, itemIdx) => (
                          <AccordionItem
                            key={itemIdx}
                            value={`item-${sectionIdx}-${itemIdx}`}
                            className="bg-white/5 border-white/10 rounded-lg px-4"
                          >
                            <AccordionTrigger className="text-white hover:text-purple-300">
                              {processContent(item.title)}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-200 prose prose-invert max-w-none">
                              <div dangerouslySetInnerHTML={{ __html: processContent(item.content).replace(/\n/g, '<br/>') }} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}

                    {section.type === 'text' && section.content && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <p className="text-gray-200 leading-relaxed">
                          {processContent(section.content)}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Start Learning Button */}
              <div className="text-center">
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Start Learning
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
