//go:build windows

package utils

import (
	"os/exec"
	"syscall"
)

func hideWindowForCmd(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
}
