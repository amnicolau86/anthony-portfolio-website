'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/layout.module.css';
import { Project } from '@/data/projects';

interface ProjectModalProps {
  project: Project | null;
  projects: Project[];
  onClose?: () => void;
  onNavigate?: (project: Project) => void;
  isDirectAccess?: boolean;
}

export default function ProjectModal({ 
  project, 
  projects, 
  onClose, 
  onNavigate,
  isDirectAccess = false 
}: ProjectModalProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      // If accessed directly, go back to home
      router.push('/');
    }
  }, [onClose, router]);

  const handleNavigate = useCallback((newProject: Project) => {
    if (onNavigate) {
      onNavigate(newProject);
    } else {
      // If accessed directly, navigate to the new project URL
      router.push(`/work/${newProject.id}`);
    }
  }, [onNavigate, router]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowLeft') {
      const currentIndex = projects.findIndex(p => p.id === project?.id);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : projects.length - 1;
      handleNavigate(projects[prevIndex]);
    } else if (e.key === 'ArrowRight') {
      const currentIndex = projects.findIndex(p => p.id === project?.id);
      const nextIndex = currentIndex < projects.length - 1 ? currentIndex + 1 : 0;
      handleNavigate(projects[nextIndex]);
    }
  }, [project, projects, handleClose, handleNavigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // If accessed directly, show the modal immediately
  useEffect(() => {
    if (isDirectAccess) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDirectAccess]);

  if (!project) return null;

  const currentIndex = projects.findIndex(p => p.id === project.id);
  const prevProject = projects[currentIndex > 0 ? currentIndex - 1 : projects.length - 1];
  const nextProject = projects[currentIndex < projects.length - 1 ? currentIndex + 1 : 0];

  return (
    <div className={styles.modal} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={handleClose}>
          ✕
        </button>
        
        <div className={styles.modalVideoWrapper}>
          <button 
            className={`${styles.modalNav} ${styles.modalPrev}`}
            onClick={() => handleNavigate(prevProject)}
          >
            ←
          </button>
          
          <button 
            className={`${styles.modalNav} ${styles.modalNext}`}
            onClick={() => handleNavigate(nextProject)}
          >
            →
          </button>
          
          {project.vimeoId && (
            <div className={styles.modalVideo}>
              <iframe
                src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&transcript=0&pip=0&watchlater=0`}
                style={{ width: '100%', height: '100%' }}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          )}
        </div>
        
        <div className={styles.modalInfo}>
          <h3 className={styles.modalTitle}>{project.title}</h3>
          <p className={styles.modalRole}>{project.type}</p>
          <p className={styles.modalType}>{project.subtitle}</p>
        </div>
      </div>
    </div>
  );
}