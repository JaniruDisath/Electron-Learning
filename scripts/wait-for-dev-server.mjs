const devServerUrl = process.env.ELECTRON_RENDERER_URL ?? 'http://localhost:5123';
const timeoutMs = Number(process.env.WAIT_FOR_DEV_SERVER_TIMEOUT_MS ?? 15000);
const pollIntervalMs = 250;

async function isServerReady() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), pollIntervalMs);

  try {
    const response = await fetch(devServerUrl, { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

const startTime = Date.now();

while (Date.now() - startTime < timeoutMs) {
  if (await isServerReady()) {
    process.exit(0);
  }

  await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
}

console.error(`Timed out waiting for dev server at ${devServerUrl}`);
process.exit(1);
