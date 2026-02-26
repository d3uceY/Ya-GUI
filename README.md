<div align="center">
    <img src="build/windows/icon.ico" alt="ya logo" />
    <h1>Ya - GUI</h1>
</div>

A modern desktop application for managing command-line shortcuts and aliases for the [Ya CLI](https://github.com/d3uceY/Ya-CLI) tool.

## About

Ya-GUI is a sleek, user-friendly graphical interface built with Wails (Go + React + TypeScript) that helps you manage your command-line shortcuts efficiently. No more memorizing complex commands or editing configuration files manually - Ya-GUI provides an intuitive way to create, edit, and organize your CLI aliases.

<img  alt="image" src="https://github.com/user-attachments/assets/258c0012-6944-43e7-95ee-a5f147ceca2b" width="100%"/>

[![Latest Release](https://img.shields.io/github/v/release/d3uceY/Ya-GUI?style=for-the-badge)](https://github.com/d3uceY/Ya-GUI/releases/latest)
[![macOS](https://img.shields.io/badge/macOS-Supported-blue?style=for-the-badge&logo=apple)](https://github.com/d3uceY/Ya-GUI/releases/latest)
[![Windows](https://img.shields.io/badge/Windows-Supported-brightgreen?style=for-the-badge&logo=windows)](https://github.com/d3uceY/Ya-GUI/releases/latest)
[![Linux](https://img.shields.io/badge/Linux-Supported-orange?style=for-the-badge&logo=linux)](https://github.com/d3uceY/Ya-GUI/releases/latest)

Get the latest release here:  
👉 **https://github.com/d3uceY/Ya-GUI/releases/latest**

---

## 📦 Download

You can download prebuilt binaries for:

- **macOS**
- **Windows**
- **Linux** (Ubuntu 22.04+ compatible)

Visit the link above to grab the latest version for your platform.

---



## Features

- **Shortcut Management**: Create, edit, delete, export and import command-line shortcuts with ease
- **Real-time Search**: Quickly find shortcuts by name, command, description or tag
- **Visual Feedback**: Clean, modern dark-themed UI with color-coded elements
- **Confirmation Dialogs**: Safe deletion with confirmation prompts to prevent accidental removals
- **Edit Dialog**: Edit shortcuts — command, description and tags — in a focused dialog
- **Persistent Storage**: All shortcuts are saved and synced with your [Ya CLI](https://github.com/d3uceY/Ya-CLI) configuration
- **Run Shortcut in Terminal**: Instantly open a new terminal window in your chosen directory and run the shortcut command interactively
- **Tags & Filtering**: Attach comma-separated tags to shortcuts and filter the list instantly with tag pills
- **Descriptions**: Add a plain-English description to any shortcut so you always know what it does
- **Pin / Favourite**: Pin important shortcuts to the top of the list so they're always within reach
- **Duplicate Shortcut**: Clone an existing shortcut as a starting point for a new one
- **Variable Substitution**: Use `{placeholder}` syntax in commands — the GUI prompts you for each value before running
- **Saved Workspace Directories**: Save frequently-used directories by name so you can pick them quickly when running a shortcut
- **Run History**: Every shortcut execution is logged with a timestamp and the directory it ran in; browse or clear the history from the sidebar
- **Preferred Terminal**: Choose which terminal (Windows Terminal, PowerShell, cmd, Bash, or auto-detect) is used when running shortcuts
- **Start on Boot**: Optionally launch Ya-GUI automatically when you log into your computer

<img src="https://github.com/user-attachments/assets/173a5639-7cee-4adc-b6a3-72c34cc78227"/>

## What is Ya CLI?

[Ya CLI](https://github.com/d3uceY/Ya-CLI) is a command-line tool that allows you to create shortcuts for frequently used commands. Instead of typing long commands repeatedly, you can define short aliases that Ya CLI will expand and execute for you.

For example:
- `ya gp` → `git push`
- `ya dev` → `npm run dev`
- `ya build` → `npm run build && npm run test`

## How to Use

### Adding a Shortcut

1. Scroll to the "Add New Shortcut" section at the bottom
2. Enter a **Shortcut Name** (e.g., `gp`, `dev`, `deploy`)
3. Enter the full **Command** (e.g., `git push`, `npm run dev`)
4. Optionally add a **Description** and comma-separated **Tags**
5. Click the **Add Shortcut** button

<img width="518" height="269" alt="image" src="https://github.com/user-attachments/assets/61ed6319-9f27-4560-8e99-a3bb74633e06" />


### Editing a Shortcut

1. Click the **Edit** (pencil) icon next to the shortcut you want to modify
2. A dialog opens where you can update the **Command**, **Description**, and **Tags**
3. Click **Save** to apply your changes or **Cancel** to discard them

<img width="500" height="270" alt="image" src="https://github.com/user-attachments/assets/4ff1624f-4b25-4d90-9374-48b0ef10985e" />


### Using Tags & Filtering

1. When adding or editing a shortcut, enter comma-separated tags in the **Tags** field (e.g., `git, deploy`)
2. Tag pills appear below the search bar once any shortcut has tags
3. Click a tag pill to filter the list to only shortcuts with that tag; click **All** to reset

### Pinning a Shortcut

- Click the **Star** icon on any row to pin that shortcut to the top of the list
- A filled yellow star and a subtle highlight indicate a pinned shortcut
- Click the star again to unpin

### Duplicating a Shortcut

- Click the **Copy** icon on any row to create an exact copy of that shortcut
- The copy is named `<name> (copy)` and appears in the list immediately, ready to edit

### Running a Shortcut with Variable Substitution

You can embed placeholders in a command using curly braces, e.g. `git checkout {branch}` or `docker build -t {image}:{tag} .`

1. Click the **Run** (terminal) icon next to a shortcut that has `{placeholders}`
2. A dialog appears asking you to fill in each variable
3. Once all fields are filled, click **Continue** to proceed to directory selection

### Running a Shortcut in a Terminal

1. Click the **Run** (terminal) icon next to the shortcut you want to execute
2. If the command has variables, fill them in first (see above)
3. Choose the directory where you want the command to run — pick a **Saved Directory** or click **Browse** to pick any folder
4. A new terminal window will open in that directory and run the command interactively

<img width="499" height="299" alt="image" src="https://github.com/user-attachments/assets/7fae1afe-29c9-4ebd-b700-22affbd45d55" />


### Saved Workspace Directories

Save directories you use often so they appear as one-click options in the run dialog.

1. Go to **Settings → Saved Directories**
2. Enter a name (e.g., `my-project`) and the full path, or click **Browse** to pick the folder
3. Click **Add Directory**
4. The directory now appears as a quick-pick button every time you run a shortcut

To remove a saved directory, click the **Trash** icon next to it.


### Run History

Every shortcut execution is recorded automatically.

1. Click **Run History** in the sidebar to view the log
2. Each entry shows the shortcut name, command, directory, and timestamp
3. Click **Clear All** to wipe the history if needed


### Searching Shortcuts

1. Use the search bar at the top of the shortcuts table
2. Type any part of the shortcut name, command, description, or tag
3. Results filter in real-time as you type

<img width="491" height="51" alt="image" src="https://github.com/user-attachments/assets/9edf3f3b-2986-44e9-8a8e-da8f452bec7d" />


### Importing and Exporting Shortcuts (JSON)

1. Go to **Settings → Data Management**
2. Click **Export Shortcuts** to save a `shortcuts.json` file you can back up or share
3. Click **Import Shortcuts** to merge shortcuts from a previously exported file

<img width="765" height="183" alt="image" src="https://github.com/user-attachments/assets/fdbefebd-6c3e-49e6-9ccc-3086810bc10c" />


### Preferred Terminal

1. Go to **Settings → Terminal Preference**
2. Choose from **Auto-detect**, **Windows Terminal (wt)**, **PowerShell**, **Command Prompt**, or **Bash**
3. Your choice is saved and used for every subsequent shortcut run


### Start on Boot

1. Go to **Settings → Start on Boot**
2. Toggle the switch to have Ya-GUI launch automatically when you log into your computer


### Deleting a Shortcut

1. Click the **Delete** (trash) icon next to the shortcut
2. Confirm the deletion in the dialog that appears
3. The shortcut will be permanently removed

<img width="509" height="270" alt="image" src="https://github.com/user-attachments/assets/110bc1c7-a2fe-4a8c-b847-43e446ed247e" />

## Installation

### Prerequisites

- Go 1.23 or higher
- Node.js 18 or higher
- Wails CLI (`go install github.com/wailsapp/wails/v2/cmd/wails@latest`)

### Building from Source

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ya-gui
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. Build the application:
   ```bash
   wails build
   ```

4. The executable will be in the `build/bin` directory

## Development

### Live Development Mode

Run the application in development mode with hot reload:

```bash
wails dev
```

This will start:
- A Vite development server for the frontend
- A dev server on http://localhost:34115 where you can test Go methods from the browser

### Project Structure

```
ya-gui/
├── frontend/                 # React + TypeScript frontend
│   └── src/
│       ├── components/       # Reusable UI components (dialogs, layout, sidebar)
│       ├── contexts/         # React contexts (version, config)
│       ├── features/
│       │   ├── home/         # Shortcuts page
│       │   ├── history/      # Run history page
│       │   └── settings/     # Settings page
│       ├── hooks/            # Custom React hooks
│       ├── lib/              # Helper utilities
│       └── types/            # Shared TypeScript interfaces
├── utils/                    # Go backend utilities
│   ├── shortcut.go           # Shortcut CRUD (CLI-compatible storage)
│   ├── config.go             # App config & saved directories
│   ├── history.go            # Run history
│   ├── terminal.go           # Terminal launch logic
│   └── types.go              # Shared Go structs
├── app.go                    # Wails-exposed API methods
├── main.go                   # Entry point
└── wails.json                # Wails configuration
```

## Technologies Used

- **Frontend**: React, TypeScript
- **Backend**: Go
- **Framework**: Wails v2
- **Build Tool**: Vite

## Configuration

The project can be configured by editing `wails.json`. More information about project settings can be found in the [Wails documentation](https://wails.io/docs/reference/project-config).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[[MIT License](https://github.com/d3uceY/Ya-GUI?tab=MIT-1-ov-file#)]


## Support

For issues, questions, or feature requests, please [open an issue](https://github.com/d3uceY/Ya-GUI/issues) on GitHub.
