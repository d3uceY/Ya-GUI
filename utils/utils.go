package utils

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
	"os/exec"
	"path/filepath"
	goRuntime "runtime"
)

func CliExists(cmd string) bool {
	_, err := exec.LookPath(cmd)
	return err == nil
}

func getAppDataDir() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}

	appDir := filepath.Join(dir, "ya/data")
	err = os.MkdirAll(appDir, 0755)

	return appDir, err
}

// GetShortcuts retrieves all shortcuts from storage
func GetShortcuts() (map[string]string, error) {

	appDir, err := getAppDataDir()
	if err != nil {
		panic(err)
	}

	shortCutpath := filepath.Join(appDir, "shortcuts.json")

	data, err := os.ReadFile(shortCutpath)
	if err != nil {
		if os.IsNotExist(err) {
			// Create file with empty JSON object
			emptyShortcuts := map[string]string{}
			data, err := json.MarshalIndent(emptyShortcuts, "", "  ")
			if err != nil {
				return nil, err
			}
			err = os.WriteFile(shortCutpath, data, 0644)
			if err != nil {
				return nil, err
			}
			return emptyShortcuts, nil
		}
		return nil, err
	}

	var shortcuts map[string]string
	err = json.Unmarshal(data, &shortcuts)
	if err != nil {
		return nil, err
	}

	return shortcuts, nil
}

func AddShortcut(name, command string) error {
	shortcuts, err := GetShortcuts()

	if err != nil {
		return err
	}

	shortcuts[name] = command

	data, err := json.MarshalIndent(shortcuts, "", "  ")
	if err != nil {
		return err
	}

	appDir, err := getAppDataDir()
	if err != nil {
		return err
	}

	shortCutpath := filepath.Join(appDir, "shortcuts.json")
	err = os.WriteFile(shortCutpath, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func RemoveShortcut(name string) error {
	shortcuts, err := GetShortcuts()
	if err != nil {
		return err
	}
	// remove the shortcut by name
	delete(shortcuts, name)

	data, err := json.MarshalIndent(shortcuts, "", "  ")
	if err != nil {
		return err
	}

	appDir, err := getAppDataDir()
	if err != nil {
		return err
	}

	shortCutpath := filepath.Join(appDir, "shortcuts.json")
	err = os.WriteFile(shortCutpath, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func IsInvalidString(s string) bool {
	if len(s) == 0 {
		return true
	}
	return false
}

func ExportShortcuts(context context.Context) error {
	appDir, err := getAppDataDir()

	if err != nil {
		return err
	}

	shortCutpath := filepath.Join(appDir, "shortcuts.json")

	data, err := os.ReadFile(shortCutpath)

	if err != nil {
		return err
	}

	path, err := runtime.SaveFileDialog(context, runtime.SaveDialogOptions{
		Title:           "Export Shortcuts",
		DefaultFilename: "shortcuts.json",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "JSON Files",
				Pattern:     "*.json",
			},
		},
	})

	// User cancelled dialog
	if err != nil || path == "" {
		return err
	}

	return os.WriteFile(path, data, 0644)
}

func ImportShortcuts(context context.Context) error {
	path, err := runtime.OpenFileDialog(context, runtime.OpenDialogOptions{
		Title: "import shortcuts",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "JSON Files",
				Pattern:     "*.json",
			},
		},
	})

	if err != nil || path == "" {
		return err
	}

	data, err := os.ReadFile(path)

	if err != nil {
		return err
	}

	appDir, err := getAppDataDir()
	if err != nil {
		return err
	}

	shortCutpath := filepath.Join(appDir, "shortcuts.json")

	currentShortcutData, err := os.ReadFile(shortCutpath)

	// If file does not exist, create it with the imported json, umm, hopefully it's valid lmao
	if err != nil {
		if os.IsNotExist(err) {
			err := os.WriteFile(shortCutpath, data, 0644)
			if err != nil {
				return err
			}
		}
	}

	// for some reason, i forgot maps only store unique keys
	var currentShortcuts map[string]string
	err = json.Unmarshal(currentShortcutData, &currentShortcuts)

	if err != nil {
		return err
	}

	// store imported shortcuts in map
	var importedShortcuts map[string]string
	err = json.Unmarshal(data, &importedShortcuts)

	if err != nil {
		return err
	}

	// merge imported shortcuts into current shortcuts
	for key, value := range importedShortcuts {
		currentShortcuts[key] = value
	}

	// write merged shortcuts back to file
	data, err = json.MarshalIndent(currentShortcuts, "", "  ")
	if err != nil {
		return err
	}

	// this permission param lowkey threw me off ngl
	return os.WriteFile(shortCutpath, data, 0644)
}

// GetConfig retrieves all configuration from storage
func GetConfig() (map[string]string, error) {

	appDir, err := getAppDataDir()
	if err != nil {
		panic(err)
	}

	configPath := filepath.Join(appDir, "config.json")

	data, err := os.ReadFile(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			// Create file with empty JSON object
			emptyConfig := map[string]string{}
			data, err := json.MarshalIndent(emptyConfig, "", "  ")
			if err != nil {
				return nil, err
			}
			err = os.WriteFile(configPath, data, 0644)
			if err != nil {
				return nil, err
			}
			return emptyConfig, nil
		}
		return nil, err
	}

	var config map[string]string
	err = json.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}

	return config, nil
}

func getDefaultDirFromConfig() (string, error) {
	config, err := GetConfig()

	if err != nil {
		return "", err
	}

	defaultDir, exists := config["defaultDir"]
	if !exists {
		return "", errors.New("defaultDir not found in config")
	}

	return defaultDir, nil
}

func UpdateDefaultDir(newDir string) error {
	config, err := GetConfig()

	if err != nil {
		return err
	}
	config["defaultDir"] = newDir

	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return err
	}

	appDir, err := getAppDataDir()
	if err != nil {
		return err
	}

	err = os.WriteFile(filepath.Join(appDir, "config.json"), data, 0644)
	if err != nil {
		return err
	}
	return nil
}

func ApplyShortcut(command string, context context.Context) error {
	       defaultDir, _ := getDefaultDirFromConfig()

	       var dialogOptions runtime.OpenDialogOptions
	       dialogOptions.Title = "Select Directory"

	       if defaultDir != "" {
		       dialogOptions.DefaultDirectory = defaultDir
	       }

	       path, err := runtime.OpenDirectoryDialog(context, dialogOptions)

	       if err != nil || path == "" {
		       return err
	       }

	       // Open a new terminal window in the selected directory, running the command interactively
	       var termCmd *exec.Cmd
	       if goRuntime.GOOS == "windows" {
		       // Prefer Windows Terminal if available, fallback to PowerShell, then cmd
		       // Try Windows Terminal
		       wtPath, wtErr := exec.LookPath("wt")
		       if wtErr == nil {
			       // wt -d <dir> powershell -NoExit -Command <command>
			       termCmd = exec.Command(wtPath, "-d", path, "powershell", "-NoExit", "-Command", command)
		       } else {
			       // Fallback to PowerShell
			       psPath, psErr := exec.LookPath("powershell")
			       if psErr == nil {
				       // powershell -NoExit -Command <command>
				       termCmd = exec.Command(psPath, "-NoExit", "-Command", command)
				       termCmd.Dir = path
			       } else {
				       // Fallback to cmd.exe
				       cmdPath, cmdErr := exec.LookPath("cmd")
				       if cmdErr == nil {
					       // cmd.exe /K <command>
					       termCmd = exec.Command(cmdPath, "/K", command)
					       termCmd.Dir = path
				       } else {
					       return errors.New("No suitable terminal found (wt, powershell, or cmd)")
				       }
			       }
		       }
	       } else {
		       // For Linux/macOS: open a new terminal emulator if possible
		       // Try gnome-terminal, x-terminal-emulator, konsole, xterm, or fallback to bash
		       termCandidates := []string{"gnome-terminal", "x-terminal-emulator", "konsole", "xterm"}
		       found := false
		       for _, t := range termCandidates {
			       tPath, tErr := exec.LookPath(t)
			       if tErr == nil {
				       // e.g. gnome-terminal -- bash -c '<command>; exec bash'
				       termCmd = exec.Command(tPath, "--", "bash", "-c", command+"; exec bash")
				       termCmd.Dir = path
				       found = true
				       break
			       }
		       }
		       if !found {
			       // Fallback: just run bash interactively in the directory
			       bashPath, bashErr := exec.LookPath("bash")
			       if bashErr == nil {
				       termCmd = exec.Command(bashPath, "-c", command+"; exec bash")
				       termCmd.Dir = path
			       } else {
				       return errors.New("No suitable terminal found (gnome-terminal, xterm, bash, etc.)")
			       }
		       }
	       }

	       // Start the terminal process detached from the current process
	       if err := termCmd.Start(); err != nil {
		       return err
	       }

	       // Update the default directory
	       err = UpdateDefaultDir(path)
	       if err != nil {
		       return err
	       }

	       return nil
}