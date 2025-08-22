import Link from "next/link";
import styles from './styles/home.module.css';
import { orbitron } from './fonts';

export default function Home() {
  // Add your prototypes to this array
  const prototypes = [
    {
      title: 'Getting started',
      description: 'How to create a prototype',
      path: '/prototypes/example'
    },
    {
      title: 'Confetti button',
      description: 'An interactive button that creates a colorful confetti explosion',
      path: '/prototypes/confetti-button'
    },
    {
      title: 'TE Digital Piano',
      description: 'A digital piano inspired by Teenage Engineering\'s minimalist design aesthetic',
      path: '/prototypes/te-piano'
    },
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  return (
    <div className={`${styles.container} ${orbitron.className}`}>
      {/* Orbiting Spacepunk Globe */}
      <div className={styles.orbitContainer}>
        <div className={styles.orbitingGlobe}>
          <div className={styles.globe}></div>
        </div>
      </div>

      <header className={styles.header}>
        <h1>Stephanie's prototypes</h1>
      </header>

      <main>
        <section className={styles.grid}>
          {/* Goes through the prototypes list (array) to create cards */}
          {prototypes.map((prototype, index) => (
            <Link 
              key={index}
              href={prototype.path} 
              className={styles.card}
            >
              <h3>{prototype.title}</h3>
              <p>{prototype.description}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
