package utils

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	goRuntime "runtime"
)

func configFilePath() (string, error) {
	appDir, err := getAppDataDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(appDir, "config.json"), nil
}

// GetConfig reads config.json, bootstrapping it if absent.
func GetConfig() (AppConfig, error) {
	path, err := configFilePath()
	if err != nil {
		return AppConfig{}, err
	}

	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			cfg := AppConfig{PreferredTerminal: "auto"}
			_ = saveConfig(cfg)
			return cfg, nil
		}
		return AppConfig{}, err
	}

	// Try new struct format.
	var cfg AppConfig
	if json.Unmarshal(data, &cfg) == nil {
		return cfg, nil
	}

	// Migrate legacy map[string]string format.
	var legacy map[string]string
	if err := json.Unmarshal(data, &legacy); err != nil {
		return AppConfig{}, err
	}
	cfg = AppConfig{
		DefaultDir:        legacy["defaultDir"],
		PreferredTerminal: "auto",
	}
	_ = saveConfig(cfg)
	return cfg, nil
}

func saveConfig(cfg AppConfig) error {
	path, err := configFilePath()
	if err != nil {
		return err
	}
	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

// UpdateDefaultDir persists the last-used directory.
func UpdateDefaultDir(dir string) error {
	cfg, err := GetConfig()
	if err != nil {
		return err
	}
	cfg.DefaultDir = dir
	return saveConfig(cfg)
}

// SetPreferredTerminal saves the preferred terminal choice.
func SetPreferredTerminal(terminal string) error {
	cfg, err := GetConfig()
	if err != nil {
		return err
	}
	cfg.PreferredTerminal = terminal
	return saveConfig(cfg)
}

// AddSavedDirectory adds a named directory preset.
func AddSavedDirectory(name, path string) error {
	cfg, err := GetConfig()
	if err != nil {
		return err
	}
	for i, d := range cfg.SavedDirectories {
		if d.Name == name {
			cfg.SavedDirectories[i].Path = path
			return saveConfig(cfg)
		}
	}
	cfg.SavedDirectories = append(cfg.SavedDirectories, SavedDir{Name: name, Path: path})
	return saveConfig(cfg)
}

// RemoveSavedDirectory removes a named directory preset.
func RemoveSavedDirectory(name string) error {
	cfg, err := GetConfig()
	if err != nil {
		return err
	}
	filtered := cfg.SavedDirectories[:0]
	for _, d := range cfg.SavedDirectories {
		if d.Name != name {
			filtered = append(filtered, d)
		}
	}
	cfg.SavedDirectories = filtered
	return saveConfig(cfg)
}

// SetStartOnBoot registers or unregisters autostart at login (cross-platform)
// and persists the setting to config.json.
func SetStartOnBoot(enabled bool) error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}

	var osErr error
	switch goRuntime.GOOS {
	case "windows":
		osErr = setStartOnBootWindows(enabled, exePath)
	case "darwin":
		osErr = setStartOnBootMacOS(enabled, exePath)
	default:
		osErr = setStartOnBootLinux(enabled, exePath)
	}
	if osErr != nil {
		return osErr
	}

	// Persist to config.json.
	cfg, err := GetConfig()
	if err != nil {
		return err
	}
	cfg.StartOnBoot = enabled
	return saveConfig(cfg)
}

// GetStartOnBoot reports whether autostart is currently registered.
func GetStartOnBoot() bool {
	switch goRuntime.GOOS {
	case "windows":
		cmd := exec.Command("reg", "query",
			`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`,
			"/v", "YaGUI")
		return cmd.Run() == nil
	case "darwin":
		home, err := os.UserHomeDir()
		if err != nil {
			return false
		}
		_, err = os.Stat(filepath.Join(home, "Library", "LaunchAgents", "com.yagui.app.plist"))
		return err == nil
	default:
		home, err := os.UserHomeDir()
		if err != nil {
			return false
		}
		_, err = os.Stat(filepath.Join(home, ".config", "autostart", "yagui.desktop"))
		return err == nil
	}
}

func setStartOnBootWindows(enabled bool, exePath string) error {
	var cmd *exec.Cmd
	if enabled {
		cmd = exec.Command("reg", "add",
			`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`,
			"/v", "YaGUI", "/t", "REG_SZ", "/d", exePath, "/f")
	} else {
		cmd = exec.Command("reg", "delete",
			`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`,
			"/v", "YaGUI", "/f")
	}
	return cmd.Run()
}

func setStartOnBootMacOS(enabled bool, exePath string) error {
	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	dir := filepath.Join(home, "Library", "LaunchAgents")
	plist := filepath.Join(dir, "com.yagui.app.plist")

	if !enabled {
		return os.Remove(plist)
	}
	content := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key><string>com.yagui.app</string>
    <key>ProgramArguments</key>
    <array><string>%s</string></array>
    <key>RunAtLoad</key><true/>
</dict>
</plist>`, exePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	return os.WriteFile(plist, []byte(content), 0644)
}

func setStartOnBootLinux(enabled bool, exePath string) error {
	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	dir := filepath.Join(home, ".config", "autostart")
	desktop := filepath.Join(dir, "yagui.desktop")

	if !enabled {
		return os.Remove(desktop)
	}
	content := fmt.Sprintf("[Desktop Entry]\nType=Application\nName=YaGUI\nExec=%s\nHidden=false\nNoDisplay=false\nX-GNOME-Autostart-enabled=true\n", exePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	return os.WriteFile(desktop, []byte(content), 0644)
}
