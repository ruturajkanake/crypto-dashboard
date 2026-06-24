const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#2563eb"/>
  <path d="M8 21V11h3.2c2.2 0 3.6 1.1 3.6 2.9 0 1.2-.6 2.1-1.6 2.5l2.3 4.6h-2.4l-2-4.2H11v4.2H8zm3 -6.6h1.8c1 0 1.5-.4 1.5-1.2 0-.8-.5-1.2-1.5-1.2H11v2.4zM18.5 21l4.5-10h2.6l4.5 10h-2.6l-.8-2h-4.8l-.8 2h-2.6zm3.5-7.7l-1.5 3.8h3l-1.5-3.8z" fill="white"/>
</svg>`;

export function loader() {
  return new Response(FAVICON_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
