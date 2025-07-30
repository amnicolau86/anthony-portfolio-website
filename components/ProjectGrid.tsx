'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/layout.module.css';
import { Project } from '@/data/projects';

interface ProjectGridProps {
  projects: Project[];
  activeFilter?: string | null;
}

export default function ProjectGrid({ projects, activeFilter }: ProjectGridProps) {
  const router = useRouter();
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter projects first
  const filteredProjects = activeFilter
    ? projects.filter(project => project.categories?.includes(activeFilter as 'director' | 'producer' | 'narrative' | 'commercial'))
    : projects;

  const handleProjectClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Mobile two-tap interaction
    if (isMobile) {
      if (activeOverlay === project.id) {
        // Second tap - open video
        handleVideoOpen(project);
      } else {
        // First tap - show overlay
        setActiveOverlay(project.id);
      }
      return;
    }
    
    // Desktop - direct to video
    handleVideoOpen(project);
  };

  const handleVideoOpen = (project: Project) => {
    // Save current scroll position
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    }
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    
    if (isMobile && project.vimeoId) {
      console.log('[Video Debug] Starting mobile video handler for:', project.title);
      console.log('[Video Debug] Vimeo ID:', project.vimeoId);
      console.log('[Video Debug] Has privacy hash:', !!project.vimeoHash);
      
      try {
        // Create fullscreen container with black background
        const container = document.createElement('div');
        container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = 'Loading video...';
        loadingDiv.style.cssText = `
          color: white;
          font-size: 18px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        `;
        container.appendChild(loadingDiv);
        
        // Create iframe with proper fullscreen parameters and all permissions
        const iframe = document.createElement('iframe');
        const vimeoUrl = project.vimeoHash 
          ? `https://player.vimeo.com/video/${project.vimeoId}?h=${project.vimeoHash}&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&fullscreen=1&playsinline=0`
          : `https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=1&autopause=0&background=0&fullscreen=1&playsinline=0`;
        
        console.log('[Video Debug] Iframe URL:', vimeoUrl);
        
        iframe.src = vimeoUrl;
        iframe.style.cssText = `
          width: 100%;
          height: 100%;
          border: none;
        `;
        
        // Add all possible permissions for maximum compatibility
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; camera; microphone');
        iframe.setAttribute('webkitallowfullscreen', 'true');
        iframe.setAttribute('mozallowfullscreen', 'true');
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-presentation');
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        
        let hasLoaded = false;
        
        const handleVideoError = () => {
          console.log('[Video Debug] Falling back to Vimeo.com');
          // Remove container
          if (container.parentNode) {
            document.body.removeChild(container);
          }
          
          // Open Vimeo directly
          const vimeoWebUrl = project.vimeoHash 
            ? `https://vimeo.com/${project.vimeoId}/${project.vimeoHash}`
            : `https://vimeo.com/${project.vimeoId}`;
          
          window.open(vimeoWebUrl, '_blank');
        };
        
        // Timeout fallback (10 seconds)
        const loadTimeout = setTimeout(() => {
          if (!hasLoaded) {
            console.error('[Video Debug] Iframe load timeout');
            handleVideoError();
          }
        }, 10000);
        
        // Success handler
        iframe.onload = () => {
          console.log('[Video Debug] Iframe loaded successfully');
          hasLoaded = true;
          clearTimeout(loadTimeout);
          if (loadingDiv.parentNode) {
            loadingDiv.remove();
          }
        };
        
        // Error handler
        iframe.onerror = (error) => {
          console.error('[Video Debug] Iframe error:', error);
          clearTimeout(loadTimeout);
          handleVideoError();
        };
        
        // Add swipe detection for back gesture
        let touchStartX = 0;
        let touchStartY = 0;
        
        container.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        });
        
        container.addEventListener('touchend', (e) => {
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = Math.abs(touchEndY - touchStartY);
          
          // Detect right swipe (back gesture)
          if (deltaX > 100 && deltaY < 50) {
            clearTimeout(loadTimeout);
            document.body.removeChild(container);
            setActiveOverlay(null);
          }
        });
        
        container.appendChild(iframe);
        document.body.appendChild(container);
        
        // Request fullscreen on the iframe after a slight delay
        setTimeout(() => {
          if (iframe.requestFullscreen) {
            iframe.requestFullscreen().catch(err => {
              console.log('[Video Debug] Fullscreen request failed:', err);
            });
          }
        }, 100);
        
      } catch (error) {
        console.error('[Video Debug] Critical error in video handler:', error);
        // Fallback: open Vimeo.com
        const vimeoWebUrl = project.vimeoHash 
          ? `https://vimeo.com/${project.vimeoId}/${project.vimeoHash}`
          : `https://vimeo.com/${project.vimeoId}`;
        
        window.open(vimeoWebUrl, '_blank');
      }
    } else {
      // Desktop: keep modal
      router.push(`/work/${project.id}`);
    }
  };

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobile) {
        setActiveOverlay(null);
      }
    };
    
    if (isMobile && activeOverlay) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, activeOverlay]);

  return (
    <div className={styles.projectGrid}>
      {filteredProjects.map((project, index) => (
        <div
          key={project.id}
          className={`${styles.projectCard} ${isMobile && activeOverlay === project.id ? styles.projectCardActive : ''}`}
          onClick={(e) => handleProjectClick(project, e)}
        >
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            quality={85}
            loading={index < 6 ? "eager" : "lazy"}
            priority={index < 3}
          />
          <div className={styles.projectOverlay} />
          <div className={styles.projectInfo}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectType}>{project.subtitle}</p>
            <p className={styles.projectRole}>{project.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
}