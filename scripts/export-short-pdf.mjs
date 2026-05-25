import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distDir = join(rootDir, 'dist');
const outputDir = join(rootDir, 'exports');
const outputPath = join(outputDir, 'bnext-short-5-slide-deck.pdf');
const port = Number(process.env.PORT || 4177);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

if (!existsSync(distDir)) {
  throw new Error('Missing dist directory. Run `npm run build` before exporting.');
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', `http://127.0.0.1:${port}`);
    const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
    const requestedPath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
    let filePath = join(distDir, requestedPath);

    if (!existsSync(filePath)) {
      filePath = join(distDir, 'index.html');
    }

    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(content);
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(error instanceof Error ? error.message : String(error));
  }
});

await new Promise((resolveServer) => server.listen(port, '127.0.0.1', resolveServer));

let browser;

try {
  browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(`http://127.0.0.1:${port}/?deck=short&print=1`, {
    waitUntil: 'networkidle0',
  });
  await page.emulateMediaType('print');
  await page.evaluate(() => document.fonts?.ready);

  const slideCount = await page.$$eval('.slide', (slides) => slides.length);
  if (slideCount !== 5) {
    throw new Error(`Expected 5 short-deck slides, found ${slideCount}.`);
  }

  const fs = await import('node:fs/promises');
  await fs.mkdir(outputDir, { recursive: true });

  await page.pdf({
    path: outputPath,
    printBackground: true,
    preferCSSPageSize: true,
  });

  const bytes = await readFile(outputPath);
  const pdf = await PDFDocument.load(bytes);
  const pageCount = pdf.getPageCount();

  if (pageCount !== 5) {
    throw new Error(`Expected 5 PDF pages, generated ${pageCount}.`);
  }

  console.log(`Exported ${outputPath}`);
} finally {
  if (browser) {
    await browser.close();
  }

  await new Promise((resolveClose) => server.close(resolveClose));
}
