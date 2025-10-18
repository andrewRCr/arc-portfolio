export default function Home() {
  return (
    // <div className="flex-1 flex flex-col items-center justify-center p-8">
    //   <h1 className="text-4xl font-mono font-bold tracking-tight">Welcome</h1>
    //   <p className="mt-4 text-lg text-muted-foreground font-mono">Portfolio site - homepage content coming soon</p>
    // </div>

    <div className="flex-1 flex flex-col p-8">
      {/* Hero Section */}
      <div className="space-y-4 border-l-2 border-primary pl-6 mb-12">
        <div className="space-y-2">
          <p className="text-xs font-mono text-muted-foreground">{"> portfolio.init()"}</p>
          <h1 className="text-4xl font-bold font-mono">Andrew Creekmore</h1>
          <p className="text-lg text-muted-foreground">Full-stack developer & creative technologist</p>
        </div>
      </div>

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

      {/* Footer */}
      {/* <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground font-mono">
        {"< /portfolio >"}
      </div> */}
    </div>
  );
}
