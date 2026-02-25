package main

import (
	"context"
	"yagui/utils"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// shortcuts map[string]string
type shortcuts map[string]string

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) GetVersion() string {
	return AppVersion
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// AddShortcut adds a new shortcut and returns all shortcuts
func (a *App) AddShortcut(name, command string) (shortcuts, error) {
	err := utils.AddShortcut(name, command)
	if err != nil {
		return nil, err
	}

	// Get all shortcuts after adding
	shortcuts, err := utils.GetShortcuts()
	if err != nil {
		return nil, err
	}

	return shortcuts, nil
}

// GetShortcuts returns all shortcuts
func (a *App) GetShortcuts() (shortcuts, error) {
	return utils.GetShortcuts()
}

// getRemoveShortcut removes a shortcut by name and returns all shortcuts
func (a *App) RemoveShortcut(name string) error {
	err := utils.RemoveShortcut(name)
	if err != nil {
		return err
	}
	return nil
}

func (a *App) ExportShortcuts() error {
	return utils.ExportShortcuts(a.ctx)
}

func (a *App) ImportShortcuts() error {
	err := utils.ImportShortcuts(a.ctx)
	if a.ctx != nil {
		runtime.EventsEmit(a.ctx, "shortcuts:changed")
	}
	if err != nil {
		return err
	}
	return nil
}

func (a *App) CliExists(cmd string) bool {
	return utils.CliExists(cmd)
}

func (a *App) ApplyShortcut(command string) bool {
	return utils.ApplyShortcut(command, a.ctx) == nil
}
