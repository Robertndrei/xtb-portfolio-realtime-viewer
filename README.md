# Realtime XTB portfolio viewer

![Example](public/demo.png)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

A simple way to view your portfolio in realtime.
<br>
Based on *Nest framework*.

## Installation

```bash
$ npm install
```

## Configuration

All the configuration is stored in the `.env` file from the root directory.
<br>

```env
PORT=3000   # Webserver port

XTB_WSS_URL=wss://ws.xtb.com/real
XTB_WSS_STREAM_URL=wss://ws.xtb.com/realStream

XTB_ACCOUNT_ID=
XTB_ACCOUNT_PASSWORD=
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Viewer

Just open your browser and go to [http://localhost:3000/](http://localhost:3000/)

## Stay in touch

- Author - [Robert Cojocaru](https://github.com/Robertndrei)
- Website - [https://www.xiltec.es](https://www.xiltec.es/)

## License

This project is licensed under the MIT License - see the [License](LICENSE) file for details

