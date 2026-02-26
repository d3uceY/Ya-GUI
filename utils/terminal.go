package utils

import (
	"errors"
	"os/exec"
	goRuntime "runtime"
)

// LaunchInTerminal opens a new terminal window in dirPath and runs command.
// preferredTerminal may be "auto", "wt", "powershell", "cmd", or "bash".
func LaunchInTerminal(command, dirPath, preferredTerminal string) error {
	if goRuntime.GOOS == "windows" {
		return launchWindows(command, dirPath, preferredTerminal)
	}
	return launchUnix(command, dirPath, preferredTerminal)
}

func launchWindows(command, dirPath, preferred string) error {
	// Resolve which terminal to use.
	type launcher struct {
		key string
		try func() (*exec.Cmd, bool)
	}

	wtLauncher := func() (*exec.Cmd, bool) {
		p, err := exec.LookPath("wt")
		if err != nil {
			return nil, false
		}
		return exec.Command(p, "-d", dirPath, "powershell", "-NoExit", "-Command", command), true
	}
	psLauncher := func() (*exec.Cmd, bool) {
		p, err := exec.LookPath("powershell")
		if err != nil {
			return nil, false
		}
		c := exec.Command(p, "-NoExit", "-Command", command)
		c.Dir = dirPath
		return c, true
	}
	cmdLauncher := func() (*exec.Cmd, bool) {
		p, err := exec.LookPath("cmd")
		if err != nil {
			return nil, false
		}
		c := exec.Command(p, "/K", command)
		c.Dir = dirPath
		return c, true
	}

	var order []func() (*exec.Cmd, bool)
	switch preferred {
	case "wt":
		order = []func() (*exec.Cmd, bool){wtLauncher, psLauncher, cmdLauncher}
	case "powershell":
		order = []func() (*exec.Cmd, bool){psLauncher, cmdLauncher}
	case "cmd":
		order = []func() (*exec.Cmd, bool){cmdLauncher}
	default: // "auto"
		order = []func() (*exec.Cmd, bool){wtLauncher, psLauncher, cmdLauncher}
	}

	for _, fn := range order {
		if cmd, ok := fn(); ok {
			return cmd.Start()
		}
	}
	return errors.New("no suitable terminal found (wt, powershell, or cmd)")
}

func launchUnix(command, dirPath, preferred string) error {
	candidates := []string{"gnome-terminal", "x-terminal-emulator", "konsole", "xterm"}
	if preferred == "bash" {
		candidates = nil // skip GUI terminals, use bash directly
	}

	for _, t := range candidates {
		p, err := exec.LookPath(t)
		if err != nil {
			continue
		}
		cmd := exec.Command(p, "--", "bash", "-c", command+"; exec bash")
		cmd.Dir = dirPath
		return cmd.Start()
	}

	// Fallback: bash in-place
	p, err := exec.LookPath("bash")
	if err != nil {
		return errors.New("no suitable terminal found")
	}
	cmd := exec.Command(p, "-c", command+"; exec bash")
	cmd.Dir = dirPath
	return cmd.Start()
}
