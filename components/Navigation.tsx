'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/styles/layout.module.css';

function NavigationContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('filter');
  const [isWorkHovered, setIsWorkHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFilterClick = (filter: string) => {
    if (activeFilter === filter) {
      router.push('/');
    } else {
      router.push(`/?filter=${filter}`);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.navLogo}>
          ANTHONY NICOLAU
        </Link>
        
        <button 
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          ☰
        </button>
        
        <div className={styles.navLinks}>
          <div 
            className={styles.workContainer}
            onMouseEnter={() => setIsWorkHovered(true)}
            onMouseLeave={() => setIsWorkHovered(false)}
          >
            <div className={`${styles.filters} ${isWorkHovered ? styles.filtersVisible : ''}`}>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'director' ? styles.filterButtonActive : ''}`}
                onClick={() => handleFilterClick('director')}
              >
                DIRECTOR
              </button>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'producer' ? styles.filterButtonActive : ''}`}
                onClick={() => handleFilterClick('producer')}
              >
                PRODUCER
              </button>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'narrative' ? styles.filterButtonActive : ''}`}
                onClick={() => handleFilterClick('narrative')}
              >
                NARRATIVE
              </button>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'commercial' ? styles.filterButtonActive : ''}`}
                onClick={() => handleFilterClick('commercial')}
              >
                COMMERCIAL
              </button>
            </div>
            <Link 
              href="/"
              className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
            >
              WORK
            </Link>
          </div>
          <Link 
            href="/about"
            className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}
          >
            ABOUT
          </Link>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link 
            href="/" 
            className={`${styles.mobileMenuLink} ${pathname === '/' ? styles.mobileMenuLinkActive : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            WORK
          </Link>
          <Link 
            href="/about" 
            className={`${styles.mobileMenuLink} ${pathname === '/about' ? styles.mobileMenuLinkActive : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            ABOUT
          </Link>
        </div>
      )}
    </nav>
  );
}

export default function Navigation() {
  return (
    <Suspense fallback={<nav className={styles.nav}><div className={styles.navContent}><Link href="/" className={styles.navLogo}>ANTHONY NICOLAU</Link></div></nav>}>
      <NavigationContent />
    </Suspense>
  );
}