import { notFound } from 'next/navigation';
import ProjectModal from '@/components/ProjectModal';
import ProjectGrid from '@/components/ProjectGrid';
import styles from '@/app/styles/layout.module.css';
import { projects } from '@/data/projects';

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(p => p.id === slug);
  
  if (!project) {
    notFound();
  }

  return (
    <>
      {/* Render the homepage grid in the background */}
      <main className={styles.pageContent}>
        <section>
          <ProjectGrid projects={projects} />
        </section>
      </main>
      {/* Render the modal on top */}
      <ProjectModal 
        project={project} 
        projects={projects}
        isDirectAccess={true}
      />
    </>
  );
}

// Generate static params for all projects
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }));
}