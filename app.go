package main

import (
	"context"
	"fmt"
	"yagui/utils"
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

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
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
