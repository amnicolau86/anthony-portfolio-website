'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectGrid from '@/components/ProjectGrid';
import styles from '@/app/styles/layout.module.css';
import { projects } from '@/data/projects';

function HomeContent() {
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('filter');

  useEffect(() => {
    // Restore scroll position if coming back from video
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  return (
    <main className={styles.pageContent}>
      <section>
        <ProjectGrid projects={projects} activeFilter={activeFilter} />
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className={styles.pageContent} />}>
      <HomeContent />
    </Suspense>
  );
}