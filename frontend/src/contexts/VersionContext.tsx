import { createContext, useContext, useEffect, useState } from "react";
import { GetVersion } from "../../wailsjs/go/main/App";

interface UpdateInfo {
  version: string;
  releaseUrl: string;
  releaseDate: string;
}

interface VersionContextType {
  currentVersion: string;
  updateAvailable: UpdateInfo | null;
  isChecking: boolean;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const VersionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    const checkVersion = async () => {
      setIsChecking(true);
      try {
        // Get current version
        const localVersion = await GetVersion();
        setCurrentVersion(localVersion);

        // Fetch latest release from GitHub
        const response = await fetch("https://api.github.com/repos/d3uceY/Ya-GUI/releases/latest");
        if (!response.ok) {
          throw new Error("Failed to fetch latest release");
        }

        const data = await response.json();
        const latestVersion = data.tag_name;

        // Compare versions
        if (latestVersion !== localVersion) {
          setUpdateAvailable({
            version: latestVersion,
            releaseUrl: data.html_url,
            releaseDate: data.published_at,
          });
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkVersion();
  }, []);

  return (
    <VersionContext.Provider value={{ currentVersion, updateAvailable, isChecking }}>
      {children}
    </VersionContext.Provider>
  );
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
};