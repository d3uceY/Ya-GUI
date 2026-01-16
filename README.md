<div align="center">
    <img src="build/windows/icon.ico" alt="ya logo" />
    <h1>Ya - GUI</h1>
</div>

A modern desktop application for managing command-line shortcuts and aliases for the [Ya CLI](https://github.com/d3uceY/Ya-CLI) tool.

## About

Ya-GUI is a sleek, user-friendly graphical interface built with Wails (Go + React + TypeScript) that helps you manage your command-line shortcuts efficiently. No more memorizing complex commands or editing configuration files manually - Ya-GUI provides an intuitive way to create, edit, and organize your CLI aliases.

<div align="center">
    <img width="769" height="553" alt="image" src="https://github.com/user-attachments/assets/00b93756-43d1-4761-9ad5-8cc1f594ced2" />
</div>



## Features

- **Shortcut Management**: Create, edit, and delete command-line shortcuts with ease
- **Real-time Search**: Quickly find shortcuts by name or command using the built-in search functionality
- **Visual Feedback**: Clean, modern dark-themed UI with color-coded elements
- **Command Truncation**: Long commands are automatically truncated in the table view with full text visible on hover
- **Confirmation Dialogs**: Safe deletion with confirmation prompts to prevent accidental removals
- **Inline Editing**: Edit shortcuts directly in the table without switching views
- **Persistent Storage**: All shortcuts are saved and synced with your [Ya CLI](https://github.com/d3uceY/Ya-CLI) configuration

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
3. Enter the full **Command Line** (e.g., `git push`, `npm run dev`)
4. Click the **Add Shortcut** button

<img width="518" height="269" alt="image" src="https://github.com/user-attachments/assets/61ed6319-9f27-4560-8e99-a3bb74633e06" />


### Importing and Exporting Shortcuts (JSON)

1. Go to settings page
2. Click **Export Shortcuts** or **Import Shortcuts**
   
<img width="765" height="183" alt="image" src="https://github.com/user-attachments/assets/fdbefebd-6c3e-49e6-9ccc-3086810bc10c" />

### Searching Shortcuts

1. Use the search bar at the top of the shortcuts table
2. Type any part of the shortcut name or command
3. Results filter in real-time as you type

<img width="491" height="51" alt="image" src="https://github.com/user-attachments/assets/9edf3f3b-2986-44e9-8a8e-da8f452bec7d" />

### Editing a Shortcut

1. Click the **Edit** (pencil) icon next to the shortcut you want to modify
2. Change the command in the input field that appears
3. Click the **Save** (checkmark) icon to save your changes

<img width="500" height="270" alt="image" src="https://github.com/user-attachments/assets/4ff1624f-4b25-4d90-9374-48b0ef10985e" />

### Deleting a Shortcut

1. Click the **Delete** (trash) icon next to the shortcut
2. Confirm the deletion in the dialog that appears
3. The shortcut will be permanently removed

<img width="509" height="270" alt="image" src="https://github.com/user-attachments/assets/110bc1c7-a2fe-4a8c-b847-43e446ed247e" />

## Installation

### Prerequisites

- Go 1.21 or higher
- Node.js 16 or higher
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
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── features/  # Feature-based components
│   │   └── components/# Reusable UI components
├── main.go            # Go backend
├── app.go             # Application logic
└── wails.json         # Wails configuration
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
