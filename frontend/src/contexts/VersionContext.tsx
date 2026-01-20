import { createContext, useContext, useEffect, useState } from "react";
import { GetVersion, CliExists } from "../../wailsjs/go/main/App";
import { LogPrint } from "../../wailsjs/runtime/runtime";

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

const CliContext = createContext<boolean | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [cliExists, setCliExists] = useState<boolean>(false);

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
    const checkCliExists = async () => {
      await CliExists("ya").then((exists) => {
        setCliExists(exists),
          LogPrint(`CLI exists check returned: ${exists}`)
      }).catch((error) => {
        LogPrint(`Error checking CLI existence: ${error}`)
      });
    }

    checkVersion();
    checkCliExists();
  }, []);

  return (
    <CliContext.Provider value={cliExists}>
      <VersionContext.Provider value={{ currentVersion, updateAvailable, isChecking }}>
        {children}
      </VersionContext.Provider>
    </CliContext.Provider>
  );
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
};

export const useCli = () => {
  const context = useContext(CliContext);
  if (context === undefined) {
    throw new Error("useCli must be used within a VersionProvider");
  }
  return context;
};