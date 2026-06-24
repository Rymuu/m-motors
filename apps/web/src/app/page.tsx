export default function HomePage() {
  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '5rem 2rem' }}>
      <h1 style={{
        fontFamily: 'var(--font-sora), sans-serif',
        fontSize: '3rem',
        fontWeight: 700,
        color: '#0E2A6B',
        marginBottom: '1rem',
        lineHeight: 1.1,
      }}>
        Votre prochaine voiture,<br />en toute confiance.
      </h1>
      <p style={{
        fontFamily: 'var(--font-manrope), sans-serif',
        color: '#5B6B82',
        fontSize: '1.125rem',
        marginTop: '1rem',
      }}>
        Achetez ou louez un véhicule d&apos;occasion certifié — garanti, contrôlé et livré. Depuis 1987.
      </p>
    </div>
  )
}