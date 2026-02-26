package utils

import (
"os"
"os/exec"
"path/filepath"
)

// getAppDataDir returns (and creates if needed) the app data directory.
func getAppDataDir() (string, error) {
dir, err := os.UserConfigDir()
if err != nil {
return "", err
}
appDir := filepath.Join(dir, "ya/data")
err = os.MkdirAll(appDir, 0755)
return appDir, err
}

// CliExists reports whether the named binary is on PATH.
func CliExists(cmd string) bool {
_, err := exec.LookPath(cmd)
return err == nil
}

// IsInvalidString reports whether s is empty.
func IsInvalidString(s string) bool {
return len(s) == 0
}
