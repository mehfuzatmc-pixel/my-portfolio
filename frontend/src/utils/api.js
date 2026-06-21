const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

const API_URLS = Array.from(new Set([
  configuredApiUrl,
  'http://127.0.0.1:5000',
  'http://localhost:5000',
  'http://127.0.0.1:5001',
  'http://localhost:5001',
]));

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
}

function shouldTryNext(status, payload) {
  return status === 404 && String(payload.message || '').toLowerCase().includes('route not found');
}

export async function apiRequest(path, options = {}) {
  let lastError;

  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      const payload = await parseResponse(response);

      if (response.ok) {
        return payload;
      }

      if (shouldTryNext(response.status, payload)) {
        lastError = new Error(`Backend at ${baseUrl} does not have ${path}.`);
        continue;
      }

      throw new Error(payload.message || `Request failed with status ${response.status}.`);
    } catch (error) {
      lastError = error;

      if (error instanceof TypeError) {
        continue;
      }

      throw error;
    }
  }

  throw new Error(lastError?.message || 'Unable to connect to the backend.');
}
