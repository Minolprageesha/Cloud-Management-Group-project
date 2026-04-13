# Frontend

This frontend is built with React and Vite and acts as the internal operations dashboard for the project.

## Main Views

- Create new order or invoice entries
- Review existing records
- Update delivery or processing status

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## API Configuration

The frontend reads the API base URL from:

```text
VITE_API_BASE
```

If it is not set, the app uses:

```text
http://localhost:5000
```
