"use client";

import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { useHasMounted } from "@/hooks/useHasMounted";
import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { themes, type ThemeName } from "@/data/themes";
import { getCompatibleWallpapers } from "@/data/wallpapers";
import { formatAttribution } from "@/components/theme";

type WallpaperSource = "none" | "optimized" | "candidates";

/**
 * Wallpaper Test Page
 *
 * Development tool for testing wallpaper candidates against theme/mode combinations.
 * Uses dev override in WallpaperContext to display arbitrary wallpaper files
 * in the actual app layout (not a separate preview).
 *
 * Route: /dev/wallpaper-test
 */
export default function WallpaperTestPage() {
  const { theme: colorMode, setTheme } = useTheme();
  const { activeTheme, setActiveTheme } = useThemeContext();
  const { setDevOverrideSrc } = useWallpaperContext();

  const mounted = useHasMounted();
  const [optimizedFiles, setOptimizedFiles] = useState<string[]>([]);
  const [candidateFiles, setCandidateFiles] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<WallpaperSource>("none");
  const [selectedFile, setSelectedFile] = useState<string>("");

  // Fetch wallpaper files from API
  useEffect(() => {
    fetch("/api/dev/wallpapers")
      .then((res) => res.json())
      .then((data) => {
        setOptimizedFiles(data.optimized || []);
        setCandidateFiles(data.candidates || []);
      })
      .catch(() => {
        setOptimizedFiles([]);
        setCandidateFiles([]);
      });
  }, []);

  // Set dev override when selection changes
  useEffect(() => {
    if (!setDevOverrideSrc) return;
    if (selectedSource !== "none" && selectedFile) {
      const dir = selectedSource === "optimized" ? "optimized" : "candidates";
      setDevOverrideSrc(`/wallpaper/${dir}/${selectedFile}`);
    } else {
      setDevOverrideSrc(null);
    }
  }, [selectedSource, selectedFile, setDevOverrideSrc]);

  // Clean up override on unmount
  useEffect(() => {
    return () => {
      setDevOverrideSrc?.(null);
    };
  }, [setDevOverrideSrc]);

  // Handle source change - reset file selection
  const handleSourceChange = (source: WallpaperSource) => {
    setSelectedSource(source);
    setSelectedFile("");
  };

  const themeNames = Object.keys(themes) as ThemeName[];

  // Extract photographer name from filename (e.g., "anne-nygard-K6FlqZs4Dec.webp" -> "anne-nygard")
  const formatFileName = (file: string) => {
    return file.replace(/\.(webp|jpg|jpeg|png)$/i, "").replace(/(-unsplash)?(-[a-zA-Z0-9_]+)?$/, "");
  };

  // Get files for current source
  const currentFiles = selectedSource === "optimized" ? optimizedFiles : candidateFiles;

  // Compute wallpaper counts per theme
  const themeCounts = useMemo(() => {
    return themeNames.map((name) => ({
      name,
      count: getCompatibleWallpapers(name).length,
    }));
  }, [themeNames]);

  // Get attribution for selected file
  const selectedAttribution = useMemo(() => {
    if (!selectedFile) return null;
    const baseName = formatFileName(selectedFile);
    // Use formatAttribution but pass a sanitized ID (convert filename format to ID format)
    return formatAttribution(baseName);
  }, [selectedFile]);

  if (!mounted) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <PageLayout header={<DevPageHeader title="Wallpaper Test" jumpLinks={[]} showEnvPreview />}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6">
              {/* Source Toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Source</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSourceChange("none")}
                    className={`rounded px-2 py-1.5 text-xs transition-colors ${
                      selectedSource === "none"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    None
                  </button>
                  <button
                    onClick={() => handleSourceChange("optimized")}
                    className={`rounded px-2 py-1.5 text-xs transition-colors ${
                      selectedSource === "optimized"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Optimized ({optimizedFiles.length})
                  </button>
                  <button
                    onClick={() => handleSourceChange("candidates")}
                    className={`rounded px-2 py-1.5 text-xs transition-colors ${
                      selectedSource === "candidates"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Candidates ({candidateFiles.length})
                  </button>
                </div>
              </div>

              {/* File Selector (only when source selected) */}
              {selectedSource !== "none" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">File</label>
                  <select
                    value={selectedFile}
                    onChange={(e) => setSelectedFile(e.target.value)}
                    className="rounded border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                  >
                    <option value="">(select file)</option>
                    {currentFiles.map((file) => (
                      <option key={file} value={file}>
                        {formatFileName(file)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Theme Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Theme</label>
                <select
                  value={activeTheme}
                  onChange={(e) => setActiveTheme(e.target.value as ThemeName)}
                  className="rounded border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                >
                  {themeNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`rounded px-3 py-1.5 text-sm transition-colors ${
                      colorMode === "light"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`rounded px-3 py-1.5 text-sm transition-colors ${
                      colorMode === "dark"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Current State */}
            <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
              Theme: <span className="font-medium text-foreground">{activeTheme}</span>
              {" | "}
              Mode: <span className="font-medium text-foreground">{colorMode}</span>
              {" | "}
              Override:{" "}
              <span className="font-medium text-foreground">
                {selectedSource !== "none" && selectedFile
                  ? `${selectedSource}/${formatFileName(selectedFile)}`
                  : "(none)"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Attribution */}
        {selectedAttribution && (
          <div className="text-sm">
            <span className="text-muted-foreground">Photo by: </span>
            <span className="font-medium text-foreground">{selectedAttribution}</span>
          </div>
        )}

        {/* Theme Wallpaper Counts */}
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">Wallpapers per theme</div>
            <div className="flex flex-wrap gap-4">
              {themeCounts.map(({ name, count }) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="text-sm text-foreground capitalize">{name}:</span>
                  <span className="text-sm font-medium text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Select a source (Optimized or Candidates) then pick a file. The wallpaper displays in the actual app layout.
          Select &quot;None&quot; to clear the override and use current settings.
        </p>
      </div>
    </PageLayout>
  );
}
