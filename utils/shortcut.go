package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// shortcutMeta holds GUI-only metadata that is not needed by the CLI.
type shortcutMeta struct {
	Description string   `json:"description,omitempty"`
	Tags        []string `json:"tags,omitempty"`
	Pinned      bool     `json:"pinned,omitempty"`
	RunCount    int      `json:"runCount,omitempty"`
	LastRun     string   `json:"lastRun,omitempty"`
}

//  file paths

func shortcutFilePath() (string, error) {
	appDir, err := getAppDataDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(appDir, "shortcuts.json"), nil
}

func metaFilePath() (string, error) {
	appDir, err := getAppDataDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(appDir, "shortcuts-meta.json"), nil
}

//  commands (CLI-compatible map[string]string)

// loadCommands reads shortcuts.json as map[string]string.
// If the file was previously written in the richer object format (accidental
// migration), it is transparently converted back and re-saved.
func loadCommands() (map[string]string, error) {
	path, err := shortcutFilePath()
	if err != nil {
		return nil, err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return map[string]string{}, nil
		}
		return nil, err
	}

	// Strip UTF-8 BOM if present (e.g. written by Notepad or PowerShell).
	data = bytes.TrimPrefix(data, []byte{0xEF, 0xBB, 0xBF})

	// Happy path: plain string map (CLI format).
	var cmds map[string]string
	if json.Unmarshal(data, &cmds) == nil {
		return cmds, nil
	}

	// Recovery path: object format was written by an earlier GUI version.
	// Extract commands, save the metadata side, and restore the plain format.
	var rich map[string]ShortcutData
	if err := json.Unmarshal(data, &rich); err != nil {
		return nil, fmt.Errorf("shortcuts.json is in an unrecognised format: %w", err)
	}
	cmds = make(map[string]string, len(rich))
	meta := make(map[string]shortcutMeta, len(rich))
	for name, s := range rich {
		cmds[name] = s.Command
		if s.Description != "" || len(s.Tags) > 0 || s.Pinned || s.RunCount > 0 {
			meta[name] = shortcutMeta{
				Description: s.Description,
				Tags:        s.Tags,
				Pinned:      s.Pinned,
				RunCount:    s.RunCount,
				LastRun:     s.LastRun,
			}
		}
	}
	// Persist both files in the correct format.
	_ = saveCommands(cmds)
	_ = saveMeta(meta)
	return cmds, nil
}

func saveCommands(cmds map[string]string) error {
	path, err := shortcutFilePath()
	if err != nil {
		return err
	}
	data, err := json.MarshalIndent(cmds, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

//  metadata (GUI-only)

func loadMeta() (map[string]shortcutMeta, error) {
	path, err := metaFilePath()
	if err != nil {
		return nil, err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return map[string]shortcutMeta{}, nil
		}
		return nil, err
	}
	data = bytes.TrimPrefix(data, []byte{0xEF, 0xBB, 0xBF})
	var meta map[string]shortcutMeta
	if err := json.Unmarshal(data, &meta); err != nil {
		return map[string]shortcutMeta{}, nil
	}
	return meta, nil
}

func saveMeta(meta map[string]shortcutMeta) error {
	path, err := metaFilePath()
	if err != nil {
		return err
	}
	data, err := json.MarshalIndent(meta, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

//  combined load / save

func loadShortcuts() (map[string]ShortcutData, error) {
	cmds, err := loadCommands()
	if err != nil {
		return nil, err
	}
	meta, err := loadMeta()
	if err != nil {
		return nil, err
	}
	result := make(map[string]ShortcutData, len(cmds))
	for name, cmd := range cmds {
		m := meta[name]
		result[name] = ShortcutData{
			Command:     cmd,
			Description: m.Description,
			Tags:        m.Tags,
			Pinned:      m.Pinned,
			RunCount:    m.RunCount,
			LastRun:     m.LastRun,
		}
	}
	return result, nil
}

func saveShortcuts(shortcuts map[string]ShortcutData) error {
	cmds := make(map[string]string, len(shortcuts))
	meta := make(map[string]shortcutMeta, len(shortcuts))
	for name, s := range shortcuts {
		cmds[name] = s.Command
		if s.Description != "" || len(s.Tags) > 0 || s.Pinned || s.RunCount > 0 {
			meta[name] = shortcutMeta{
				Description: s.Description,
				Tags:        s.Tags,
				Pinned:      s.Pinned,
				RunCount:    s.RunCount,
				LastRun:     s.LastRun,
			}
		}
	}
	if err := saveCommands(cmds); err != nil {
		return err
	}
	return saveMeta(meta)
}

//  public API

// GetShortcuts returns all shortcuts merged with their metadata.
func GetShortcuts() (map[string]ShortcutData, error) {
	return loadShortcuts()
}

// AddShortcut creates or replaces a shortcut. tags is a comma-separated list.
func AddShortcut(name, command, description, tags string) error {
	shortcuts, err := loadShortcuts()
	if err != nil {
		return err
	}
	existing := shortcuts[name]
	shortcuts[name] = ShortcutData{
		Command:     command,
		Description: description,
		Tags:        parseTags(tags),
		Pinned:      existing.Pinned,
		RunCount:    existing.RunCount,
		LastRun:     existing.LastRun,
	}
	return saveShortcuts(shortcuts)
}

// UpdateShortcut edits an existing shortcut.
func UpdateShortcut(name, command, description, tags string) error {
	return AddShortcut(name, command, description, tags)
}

// RemoveShortcut deletes a shortcut and its metadata by name.
func RemoveShortcut(name string) error {
	shortcuts, err := loadShortcuts()
	if err != nil {
		return err
	}
	delete(shortcuts, name)
	return saveShortcuts(shortcuts)
}

// TogglePinShortcut flips the Pinned flag on a shortcut.
func TogglePinShortcut(name string) error {
	shortcuts, err := loadShortcuts()
	if err != nil {
		return err
	}
	s, ok := shortcuts[name]
	if !ok {
		return nil
	}
	s.Pinned = !s.Pinned
	shortcuts[name] = s
	return saveShortcuts(shortcuts)
}

// DuplicateShortcut creates a copy of a shortcut with " (copy)" appended.
func DuplicateShortcut(name string) (map[string]ShortcutData, error) {
	shortcuts, err := loadShortcuts()
	if err != nil {
		return nil, err
	}
	src, ok := shortcuts[name]
	if !ok {
		return shortcuts, nil
	}
	copyName := name + " (copy)"
	for i := 2; ; i++ {
		if _, exists := shortcuts[copyName]; !exists {
			break
		}
		copyName = fmt.Sprintf("%s (copy %d)", name, i)
	}
	shortcuts[copyName] = ShortcutData{
		Command:     src.Command,
		Description: src.Description,
		Tags:        append([]string(nil), src.Tags...),
	}
	return shortcuts, saveShortcuts(shortcuts)
}

// IncrementRunCount bumps RunCount and records the current time as LastRun.
func IncrementRunCount(name string) error {
	shortcuts, err := loadShortcuts()
	if err != nil {
		return err
	}
	s, ok := shortcuts[name]
	if !ok {
		return nil
	}
	s.RunCount++
	s.LastRun = time.Now().UTC().Format(time.RFC3339)
	shortcuts[name] = s
	return saveShortcuts(shortcuts)
}

// ExportShortcuts opens a save dialog and writes the CLI-compatible shortcuts.json.
func ExportShortcuts(ctx context.Context) error {
	path, err := shortcutFilePath()
	if err != nil {
		return err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	dest, err := runtime.SaveFileDialog(ctx, runtime.SaveDialogOptions{
		Title:           "Export Shortcuts",
		DefaultFilename: "shortcuts.json",
		Filters: []runtime.FileFilter{
			{DisplayName: "JSON Files", Pattern: "*.json"},
		},
	})
	if err != nil || dest == "" {
		return err
	}
	return os.WriteFile(dest, data, 0644)
}

// ImportShortcuts opens an open dialog, reads the file, and merges shortcuts.
// Accepts both the CLI format (map[string]string) and the old GUI object format.
func ImportShortcuts(ctx context.Context) error {
	path, err := runtime.OpenFileDialog(ctx, runtime.OpenDialogOptions{
		Title: "Import Shortcuts",
		Filters: []runtime.FileFilter{
			{DisplayName: "JSON Files", Pattern: "*.json"},
		},
	})
	if err != nil || path == "" {
		return err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	// Try CLI format first.
	var imported map[string]string
	if json.Unmarshal(data, &imported) != nil {
		// Fall back to old GUI object format.
		var rich map[string]ShortcutData
		if err := json.Unmarshal(data, &rich); err != nil {
			return err
		}
		imported = make(map[string]string, len(rich))
		for n, s := range rich {
			imported[n] = s.Command
		}
	}

	current, err := loadShortcuts()
	if err != nil {
		return err
	}
	for name, cmd := range imported {
		existing := current[name]
		existing.Command = cmd
		current[name] = existing
	}
	return saveShortcuts(current)
}

// parseTags splits a comma-separated tag string into a trimmed slice.
func parseTags(tags string) []string {
	if tags == "" {
		return nil
	}
	parts := strings.Split(tags, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		t := strings.TrimSpace(p)
		if t != "" {
			out = append(out, t)
		}
	}
	return out
}
