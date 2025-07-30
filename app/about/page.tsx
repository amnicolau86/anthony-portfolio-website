import styles from '@/app/styles/layout.module.css';

export default function About() {
  return (
    <main className={styles.pageContent}>
      <div className={`${styles.container} ${styles.aboutContainer}`}>
        <div className={styles.aboutText}>
          <p className={styles.paragraph}>
            Anthony Nicolau is a Cuban-American director, producer and writer. Born and raised in the Midwest, he spent 15 years honing his craft in New York City before trading subway delays for mountain views in the Catskill Mountains just north of NYC. He creates award-winning narrative films that have screened at festivals nationally and internationally.
          </p>
          
          <p className={styles.paragraph}>
            As a commercial director and producer, Anthony has collaborated with major brands including BMW, Spotify, Adidas, Dell, Cointreau, Maybelline, Lexus, Kellogg&apos;s, Rémy Martin, and the PGA. His recent brand film for Marriott Bonvoy&apos;s Le Méridien hotels earned five Telly Awards in 2025.
          </p>
          
          <p className={styles.paragraph}>
            Anthony&apos;s narrative work has garnered significant recognition. His short film &ldquo;The Night Owl&rdquo; was selected for Sundance&apos;s prestigious Short Film Connection program. &ldquo;Corners&rdquo; featured the late Lynn Cohen (Munich, Sex and the City) and Aida Turturro (The Sopranos). Most recently, &ldquo;Push To Enter&rdquo;—starring Laith Nakli from the critically acclaimed series &ldquo;Ramy&rdquo;—premiered on Short of the Week and was featured as a Vimeo Staff Pick.
          </p>
          
          <p className={`${styles.paragraph} ${styles.paragraphLast}`}>
            He is currently developing his first feature film.
          </p>
          
          <div className={styles.contactInfo}>
            <p className={styles.contactLink}>
              e. <a href="mailto:contact@anthonynicolau.com">contact@anthonynicolau.com</a>
            </p>
            <p className={styles.contactLink}>
              p. <a href="tel:636.485.6465">636.485.6465</a>
            </p>
            <p className={styles.contactLink}>
              <a href="https://instagram.com/anthonymnicolau" rel="noopener noreferrer">@anthonymnicolau</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}