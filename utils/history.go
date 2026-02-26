package utils

import (
	"encoding/json"
	"os"
	"path/filepath"
	"time"
)

func historyFilePath() (string, error) {
	appDir, err := getAppDataDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(appDir, "history.json"), nil
}

func loadHistory() ([]RunHistoryEntry, error) {
	path, err := historyFilePath()
	if err != nil {
		return nil, err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return []RunHistoryEntry{}, nil
		}
		return nil, err
	}
	var entries []RunHistoryEntry
	if err := json.Unmarshal(data, &entries); err != nil {
		return nil, err
	}
	return entries, nil
}

func saveHistory(entries []RunHistoryEntry) error {
	path, err := historyFilePath()
	if err != nil {
		return err
	}
	data, err := json.MarshalIndent(entries, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

// GetRunHistory returns all history entries, newest first.
func GetRunHistory() ([]RunHistoryEntry, error) {
	entries, err := loadHistory()
	if err != nil {
		return nil, err
	}
	// Reverse so newest is first.
	for i, j := 0, len(entries)-1; i < j; i, j = i+1, j-1 {
		entries[i], entries[j] = entries[j], entries[i]
	}
	return entries, nil
}

// AddRunHistoryEntry records a shortcut execution.
func AddRunHistoryEntry(shortcutName, command, directory string) error {
	entries, err := loadHistory()
	if err != nil {
		return err
	}
	entries = append(entries, RunHistoryEntry{
		ShortcutName: shortcutName,
		Command:      command,
		Directory:    directory,
		Timestamp:    time.Now().UTC().Format(time.RFC3339),
	})
	// Cap history at 500 entries.
	const maxEntries = 500
	if len(entries) > maxEntries {
		entries = entries[len(entries)-maxEntries:]
	}
	return saveHistory(entries)
}

// ClearRunHistory removes all history entries.
func ClearRunHistory() error {
	return saveHistory([]RunHistoryEntry{})
}
