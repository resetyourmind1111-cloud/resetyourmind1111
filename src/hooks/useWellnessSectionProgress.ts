import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "wellness-sections-read";

function getReadSections(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveReadSections(data: Record<string, string[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useWellnessSectionProgress(moduleId: string, totalSections: number) {
  const [readSections, setReadSections] = useState<string[]>([]);

  useEffect(() => {
    const all = getReadSections();
    setReadSections(all[moduleId] || []);
  }, [moduleId]);

  const markRead = useCallback((sectionId: string) => {
    setReadSections((prev) => {
      if (prev.includes(sectionId)) return prev;
      const updated = [...prev, sectionId];
      const all = getReadSections();
      all[moduleId] = updated;
      saveReadSections(all);
      return updated;
    });
  }, [moduleId]);

  const isSectionRead = useCallback((sectionId: string) => {
    return readSections.includes(sectionId);
  }, [readSections]);

  const progress = totalSections > 0 ? Math.round((readSections.length / totalSections) * 100) : 0;

  return { readSections, markRead, isSectionRead, progress, readCount: readSections.length };
}
