import { useEffect, useState } from "react";

interface BuildInfo {
  version: string;
  name: string;
  buildDate: string;
  buildTimestamp: number;
  gitCommit: string;
  gitBranch: string;
}

export function BuildInfoDisplay() {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);

  useEffect(() => {
    fetch('/build-info.json')
      .then((res) => res.json())
      .then((data) => setBuildInfo(data))
      .catch(() => setBuildInfo(null));
  }, []);

  if (!buildInfo) return null;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-900/90 dark:border-gray-800 z-10">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono font-medium">{buildInfo.name} v{buildInfo.version}</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-mono">Built: {formatDate(buildInfo.buildDate)}</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-mono">{buildInfo.gitBranch} @ {buildInfo.gitCommit}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] opacity-70">
          <span>South Africa Standard Time</span>
        </div>
      </div>
    </footer>
  );
}