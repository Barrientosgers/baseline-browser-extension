# Baseline Browser Extension

A browser extension that checks web feature compatibility and uses AI to provide insights. Built with React, TypeScript, and Vite.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Edge, or Firefox)

## Setup and Development

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repository-url>
   cd baseline-browser-extension
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   This will start the Vite development server, typically on `http://localhost:5173`

3. **Build the extension for production:**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with the built extension files.

## Loading the Extension in Your Browser

Since this is a browser extension, you need to load it into your browser:

### For Chrome/Edge:
1. Open Chrome/Edge and go to `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `dist` folder (after running `npm run build`)

### For Firefox:
1. Open Firefox and go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the `dist` folder

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview the built app
- `npm run lint` - Run ESLint

## Project Structure

This extension includes:
- **Popup UI**: React app that serves as the extension's popup (when you click the extension icon)
- **Background script**: `public/background.js` - runs in the background
- **Content script**: `public/content.js` - runs on web pages
- **Manifest**: `public/manifest.json` - extension configuration

## Development Notes

This project uses:
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling
- **ESLint** for code linting

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
