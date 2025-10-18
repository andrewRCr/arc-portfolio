// Assumes parent container (e.g., in layout.tsx) uses 'flex flex-col min-h-screen' and header/footer are siblings.
export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <p className="mt-4 text-lg text-muted-foreground">Portfolio site - homepage content coming soon</p>
    </div>
  );
}
