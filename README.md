# Getting Started

## Attribution and modifications

This project is based on the Chef Claude project from
[Scrimba](https://scrimba.com/). The original project and course materials
belong to Scrimba. This version has been substantially reworked with a Chef
Gemini identity, Gemini API integration, loading animation, gradient styling,
automatic scrolling, and input validation.

Install the dependencies and run the project:

```bash
npm install
npm start
```

## Google Gemini setup

Create a Gemini API key in Google AI Studio, then add it to `.env` in the
project root:

```env
GEMINI_API_KEY=isi_gemini_api_key_kamu_di_sini
VITE_GEMINI_MODEL=gemini-3.8-flash
```

The app sends a `POST` request to Gemini through the local Vite proxy
configured in [vite.config.js](./vite.config.js). The request implementation
is in [ai.js](./ai.js). Restart the Vite server after changing `.env`.

You can change `VITE_GEMINI_MODEL` to another model available to your Gemini
API account.

> `GEMINI_API_KEY` does not use the `VITE_` prefix, so it is not included in
> the browser bundle. Do not commit the key or share it publicly. For
> production, move this proxy to a real backend or serverless function.

## Vercel deployment

The production API endpoint is the Vercel Function in
[api/gemini.js](./api/gemini.js). Add these Environment Variables in the
Vercel project settings:

```text
GEMINI_API_KEY=your_new_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash
```

Do not upload `.env` or put the API key in a `VITE_` variable. The key must
remain server-side.
