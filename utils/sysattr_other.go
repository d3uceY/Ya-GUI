//go:build !windows

package utils

import "os/exec"

func hideWindowForCmd(cmd *exec.Cmd) {
	// no-op: HideWindow is Windows-only
}
