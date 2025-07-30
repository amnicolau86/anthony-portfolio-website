'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/layout.module.css';
import { Project } from '@/data/projects';

interface ProjectGridProps {
  projects: Project[];
  activeFilter?: string | null;
}

export default function ProjectGrid({ projects, activeFilter }: ProjectGridProps) {
  const router = useRouter();
  const preloadedVideos = useRef<Map<string, HTMLIFrameElement>>(new Map());

  // Filter projects first
  const filteredProjects = activeFilter
    ? projects.filter(project => project.categories?.includes(activeFilter as 'director' | 'producer' | 'narrative' | 'commercial'))
    : projects;

  // Preload video function
  const preloadVideo = (vimeoId: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `https://player.vimeo.com/video/${vimeoId}`;
    document.head.appendChild(link);
  };

  // Handle mouse enter to preload adjacent videos
  const handleMouseEnter = (index: number) => {
    // Preload previous video
    const prevProject = filteredProjects[index - 1];
    if (index > 0 && prevProject?.vimeoId) {
      preloadVideo(prevProject.vimeoId);
    }
    // Preload next video
    const nextProject = filteredProjects[index + 1];
    if (index < filteredProjects.length - 1 && nextProject?.vimeoId) {
      preloadVideo(nextProject.vimeoId);
    }
  };

  // Cascading video preload effect
  useEffect(() => {
    const preloadVideoWithIframe = (project: Project) => {
      if (!project.vimeoId) return;
      
      // Create hidden iframe to preload Vimeo player
      const iframe = document.createElement('iframe');
      iframe.src = project.vimeoHash 
        ? `https://player.vimeo.com/video/${project.vimeoId}?h=${project.vimeoHash}`
        : `https://player.vimeo.com/video/${project.vimeoId}`;
      iframe.style.position = 'absolute';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('tabindex', '-1');
      document.body.appendChild(iframe);
      
      // Store reference for cleanup
      preloadedVideos.current.set(project.id, iframe);
    };

    // Start cascading preload after images load
    const startCascadingPreload = () => {
      filteredProjects.forEach((project, index) => {
        setTimeout(() => {
          preloadVideoWithIframe(project);
        }, index * 250); // 250ms between each video
      });
    };

    // Wait 1 second for images to load, then start video preload
    const timeoutId = setTimeout(startCascadingPreload, 1000);

    // Cleanup on unmount or when filteredProjects change
    return () => {
      clearTimeout(timeoutId);
      const videos = preloadedVideos.current;
      videos.forEach(iframe => iframe.remove());
      videos.clear();
    };
  }, [filteredProjects]);

  const handleProjectClick = (project: Project) => {
    // Save current scroll position
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    }
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    
    if (isMobile && project.vimeoId) {
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
      
      // Create iframe with proper fullscreen parameters
      const iframe = document.createElement('iframe');
      iframe.src = project.vimeoHash 
        ? `https://player.vimeo.com/video/${project.vimeoId}?h=${project.vimeoHash}&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&fullscreen=1&playsinline=0`
        : `https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&autopause=0&background=0&fullscreen=1&playsinline=0`;
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
      `;
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        font-size: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10000;
      `;
      closeBtn.onclick = () => document.body.removeChild(container);
      
      container.appendChild(iframe);
      container.appendChild(closeBtn);
      document.body.appendChild(container);
      
      // Request fullscreen on the iframe after a slight delay
      setTimeout(() => {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        }
      }, 100);
    } else {
      // Desktop: keep modal
      router.push(`/work/${project.id}`);
    }
  };

  return (
    <div className={styles.projectGrid}>
      {filteredProjects.map((project, index) => (
        <div
          key={project.id}
          className={styles.projectCard}
          onClick={() => handleProjectClick(project)}
          onMouseEnter={() => handleMouseEnter(index)}
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
            <p className={styles.projectRole}>{project.type}</p>
            <p className={styles.projectType}>{project.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}