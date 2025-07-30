'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/app/styles/layout.module.css';
import { Project } from '@/data/projects';

interface ProjectGridProps {
  projects: Project[];
  activeFilter?: string | null;
}

export default function ProjectGrid({ projects, activeFilter }: ProjectGridProps) {
  const router = useRouter();

  const handleProjectClick = (project: Project) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    
    if (isMobile && project.vimeoId) {
      // Create a fullscreen iframe player instead of redirecting
      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&playsinline=0`;
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.zIndex = '9999';
      iframe.style.border = 'none';
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('allow', 'autoplay; fullscreen');
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.position = 'fixed';
      closeBtn.style.top = '20px';
      closeBtn.style.right = '20px';
      closeBtn.style.zIndex = '10000';
      closeBtn.style.background = 'rgba(0,0,0,0.5)';
      closeBtn.style.color = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.fontSize = '30px';
      closeBtn.style.width = '50px';
      closeBtn.style.height = '50px';
      closeBtn.style.borderRadius = '50%';
      closeBtn.style.cursor = 'pointer';
      closeBtn.onclick = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeBtn);
      };
      
      document.body.appendChild(iframe);
      document.body.appendChild(closeBtn);
    } else {
      // Desktop: keep modal
      router.push(`/work/${project.id}`);
    }
  };

  const filteredProjects = activeFilter
    ? projects.filter(project => project.categories?.includes(activeFilter as 'director' | 'producer' | 'narrative' | 'commercial'))
    : projects;

  return (
    <div className={styles.projectGrid}>
      {filteredProjects.map((project) => (
        <div
          key={project.id}
          className={styles.projectCard}
          onClick={() => handleProjectClick(project)}
        >
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
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