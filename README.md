# Azure Video Upload

Video upload service built with **NestJS** that streams files to **Azure Blob Storage**.

## Features
- Upload videos straight to Azure Blob Storage as a stream
- Custom Multer storage engine to stream without saving to disk (`multer-direct-stream` branch)
- Sync and async upload modes
- Upload progress logging
- GitHub Actions workflow for auto-deploy to Azure

## Tech
NestJS · TypeScript · Azure Blob Storage · Multer · GitHub Actions

## Run

```bash
npm install
# set AZURE_CONNECTION_STRING in .env
npm run start:dev
```
