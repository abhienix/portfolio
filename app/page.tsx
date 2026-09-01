'use client';

export default function HomePage() {
  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#06060c]">
      <iframe
        src="/index.html"
        className="w-full h-full border-0 outline-none block"
        title="Abhimanyu Kumar // OSINT & Cybersecurity Operations Command"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      />
    </main>
  );
}
