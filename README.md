# Chromatic Lens

Chromatic Lens is an original camera experiment for learning getUserMedia, video-to-canvas processing, graceful permission failures, and local-only image effects. Camera access is optional, processing stays in the browser, and a deterministic sample mode keeps the lesson useful when a camera is unavailable.

## Run locally

This is a dependency-light static project. Serve this directory over localhost with any static server, then open the displayed URL in a modern browser. For example:

```bash
python3 -m http.server 4173
```

Open http://127.0.0.1:4173 and try the controls described in the page.

## What to study

- Requesting camera access only after a user action
- Streaming video into a video element and canvas
- Deriving color fields and edge energy locally
- Stopping media tracks during cleanup
- Designing a useful no-camera fallback

## Browser notes

The project uses ordinary HTML, CSS, and JavaScript with no build step or runtime package dependency. Camera mode requires HTTPS or localhost, requests video permission only after an intentional button press, does not request audio, and processes frames locally.

## License

Released under the MIT License. See [LICENSE](LICENSE).
