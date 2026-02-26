package main

import (
	"context"
	"yagui/utils"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetVersion() string {
	return AppVersion
}

//  Shortcuts

func (a *App) GetShortcuts() (map[string]utils.ShortcutData, error) {
	return utils.GetShortcuts()
}

// AddShortcut creates or replaces a shortcut. tags is comma-separated.
func (a *App) AddShortcut(name, command, description, tags string) (map[string]utils.ShortcutData, error) {
	if err := utils.AddShortcut(name, command, description, tags); err != nil {
		return nil, err
	}
	return utils.GetShortcuts()
}

// UpdateShortcut edits an existing shortcut's metadata.
func (a *App) UpdateShortcut(name, command, description, tags string) error {
	return utils.UpdateShortcut(name, command, description, tags)
}

func (a *App) RemoveShortcut(name string) error {
	return utils.RemoveShortcut(name)
}

func (a *App) TogglePinShortcut(name string) error {
	return utils.TogglePinShortcut(name)
}

func (a *App) DuplicateShortcut(name string) (map[string]utils.ShortcutData, error) {
	return utils.DuplicateShortcut(name)
}

func (a *App) ExportShortcuts() error {
	return utils.ExportShortcuts(a.ctx)
}

func (a *App) ImportShortcuts() error {
	err := utils.ImportShortcuts(a.ctx)
	if a.ctx != nil {
		runtime.EventsEmit(a.ctx, "shortcuts:changed")
	}
	return err
}

//  Terminal & directory

// SelectDirectory opens the native directory picker and returns the chosen path.
func (a *App) SelectDirectory() (string, error) {
	cfg, _ := utils.GetConfig()
	opts := runtime.OpenDialogOptions{Title: "Select Directory"}
	if cfg.DefaultDir != "" {
		opts.DefaultDirectory = cfg.DefaultDir
	}
	return runtime.OpenDirectoryDialog(a.ctx, opts)
}

// ApplyShortcut launches shortcutName's command in dirPath, records history.
func (a *App) ApplyShortcut(shortcutName, command, dirPath string) bool {
	cfg, _ := utils.GetConfig()
	if err := utils.LaunchInTerminal(command, dirPath, cfg.PreferredTerminal); err != nil {
		return false
	}
	_ = utils.UpdateDefaultDir(dirPath)
	_ = utils.AddRunHistoryEntry(shortcutName, command, dirPath)
	_ = utils.IncrementRunCount(shortcutName)
	return true
}

func (a *App) CliExists(cmd string) bool {
	return utils.CliExists(cmd)
}

//  Config

func (a *App) GetConfig() (utils.AppConfig, error) {
	return utils.GetConfig()
}

func (a *App) SetPreferredTerminal(terminal string) error {
	return utils.SetPreferredTerminal(terminal)
}

func (a *App) SetStartOnBoot(enabled bool) error {
	return utils.SetStartOnBoot(enabled)
}

func (a *App) GetStartOnBoot() bool {
	return utils.GetStartOnBoot()
}

func (a *App) AddSavedDirectory(name, path string) error {
	return utils.AddSavedDirectory(name, path)
}

func (a *App) RemoveSavedDirectory(name string) error {
	return utils.RemoveSavedDirectory(name)
}

//  History

func (a *App) GetRunHistory() ([]utils.RunHistoryEntry, error) {
	return utils.GetRunHistory()
}

func (a *App) ClearRunHistory() error {
	return utils.ClearRunHistory()
}
