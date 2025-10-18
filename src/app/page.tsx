export default function Home() {
  return (
    <div className="flex-1 flex flex-col p-8">
      {/* Hero Section now lives in AdaptiveHero component (see layout.tsx) */}

      {/* Featured Project Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono text-muted-foreground">Featured Projects</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {["CineXplorer", "TaskFocus"].map((project) => (
            <div key={project} className="p-4 border border-border rounded-sm hover:border-primary transition-colors">
              <p className="text-xs font-mono text-primary mb-2">{"[project]"}</p>
              <h4 className="font-semibold mb-2">{project}</h4>
              <p className="text-sm text-muted-foreground">Project description goes here</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
