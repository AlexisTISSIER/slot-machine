import React from 'react';

export default function Wireframe() {
  return (
    <div className="app-container">
      <header>Machine à Sous</header>

      <main>
        <div className="reels">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="reel-cell"></div>
          ))}
        </div>
      </main>

      <section className="controls">
        <button>Spin</button>
        <div>Solde: 100</div>
        <div>Mise: 1</div>
      </section>

      <footer>© 2025 Alexis</footer>
    </div>
  );
}
