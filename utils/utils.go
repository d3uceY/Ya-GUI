package utils

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

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
