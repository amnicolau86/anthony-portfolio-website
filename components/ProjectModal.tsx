'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/layout.module.css';
import { Project } from '@/data/projects';

interface ProjectModalProps {
  project: Project | null;
  onClose?: () => void;
  isDirectAccess?: boolean;
}

export default function ProjectModal({ 
  project, 
  onClose, 
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
    
    // Restore scroll position after navigation
    setTimeout(() => {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('scrollPosition');
      }
    }, 100);
  }, [onClose, router]);


  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

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


  return (
    <div className={styles.modal} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={handleClose}>
          ✕
        </button>
        
        <div className={styles.modalVideoWrapper}>
          
          {project.vimeoId && (
            <div className={styles.modalVideo}>
              <iframe
                src={project.vimeoHash 
                  ? `https://player.vimeo.com/video/${project.vimeoId}?h=${project.vimeoHash}&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&title=0&byline=0&portrait=0`
                  : `https://player.vimeo.com/video/${project.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&title=0&byline=0&portrait=0`
                }
                style={{ width: '100%', height: '100%' }}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
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