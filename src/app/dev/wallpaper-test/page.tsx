"use client";

import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { RefreshCw } from "lucide-react";
import { useHasMounted } from "@/hooks/useHasMounted";
import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { themes, type ThemeName } from "@/data/themes";
import { getCompatibleWallpapers, type WallpaperOption } from "@/data/wallpapers";
import { formatAttribution } from "@/components/theme";

type WallpaperSource = "none" | "optimized" | "candidates";

// Module-level constant (themes registry doesn't change at runtime)
const themeNames = Object.keys(themes) as ThemeName[];

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
  const [previewWallpaper, setPreviewWallpaper] = useState<WallpaperOption | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle source change - reset file selection
  const handleSourceChange = (source: WallpaperSource) => {
    setSelectedSource(source);
    setSelectedFile("");
  };

  // Extract photographer name from filename (e.g., "anne-nygard-K6FlqZs4Dec.webp" -> "anne-nygard")
  const formatFileName = (file: string) => {
    return file.replace(/\.(webp|jpg|jpeg|png)$/i, "").replace(/(-unsplash)?(-[a-zA-Z0-9_]+)?$/, "");
  };

  // Get files for current source
  const currentFiles = selectedSource === "optimized" ? optimizedFiles : candidateFiles;

  // Compute wallpapers per theme (in production order)
  // refreshKey forces re-read after source file changes (intentional cache invalidation)
  const wallpapersPerTheme = useMemo(() => {
    return themeNames.map((name) => ({
      name,
      wallpapers: getCompatibleWallpapers(name),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

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
      <div className="space-y-4">
        {/* Override Section */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Override</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
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

            <p className="mt-2 text-xs text-muted-foreground">
              Select a source (Optimized or Candidates) then pick a file. The wallpaper displays in the actual app
              layout. Select &quot;None&quot; to clear the override.
            </p>
          </CardContent>
        </Card>

        {/* Attribution */}
        {selectedAttribution && (
          <div className="text-sm mt-2">
            <span className="text-muted-foreground">Photo by: </span>
            <span className="font-medium text-foreground">{selectedAttribution}</span>
          </div>
        )}

        {/* Preview Order Section */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Preview Order</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRefreshKey((k) => k + 1)}
                title="Refresh wallpaper data from source"
                className="h-7 px-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Horizontal row of theme lists */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {wallpapersPerTheme.map(({ name, wallpapers }) => (
                <div key={name} className="flex-shrink-0 w-[130px]">
                  <div className="text-xs font-medium text-muted-foreground mb-2 capitalize">
                    {name} ({wallpapers.length})
                  </div>
                  <div className="space-y-0.5">
                    {wallpapers.map((wallpaper, index) => (
                      <button
                        key={wallpaper.id}
                        onClick={() => setPreviewWallpaper(wallpaper)}
                        className={`w-full text-left px-1.5 py-0.5 text-xs rounded transition-colors truncate ${
                          previewWallpaper?.id === wallpaper.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        }`}
                        title={formatAttribution(wallpaper.id)}
                      >
                        <span className="text-muted-foreground mr-1">{index + 1}.</span>
                        {formatAttribution(wallpaper.id)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Thumbnail Preview - always visible */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {previewWallpaper?.thumbnailSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- Dev page preview */
                    <img
                      src={previewWallpaper.thumbnailSrc}
                      alt={`Preview of ${previewWallpaper.id}`}
                      className="w-[200px] h-[150px] object-cover rounded border border-border"
                    />
                  ) : (
                    <div className="w-[200px] h-[150px] bg-muted/30 rounded border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                      Preview
                    </div>
                  )}
                </div>
                <div className="text-sm space-y-1 min-h-[60px]">
                  {previewWallpaper ? (
                    <>
                      <div>
                        <span className="text-muted-foreground">ID: </span>
                        <span className="font-mono text-foreground">{previewWallpaper.id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Photo by: </span>
                        <span className="text-foreground">{formatAttribution(previewWallpaper.id)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Compatible: </span>
                        <span className="text-foreground">
                          {wallpapersPerTheme
                            .filter(({ wallpapers }) => wallpapers.some((w) => w.id === previewWallpaper.id))
                            .map(({ name }) => name)
                            .join(", ")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-muted-foreground">ID:</div>
                      <div className="text-muted-foreground">Photo by:</div>
                      <div className="text-muted-foreground">Compatible:</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
