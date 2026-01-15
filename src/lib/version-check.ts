/**
 * Version Check Utility
 * Compares current app version with server version
 */

const VERSION_CHECK_INTERVAL = 60000; // Check every 60 seconds
const VERSION_ENDPOINT = '/'; // Use root page as version indicator

let lastCheckedVersion: string | null = null;

/**
 * Check if a new version is available
 */
export async function checkForNewVersion(): Promise<boolean> {
  try {
    // Fetch root page with cache-busting
    const response = await fetch(`${VERSION_ENDPOINT}?_version=${Date.now()}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) return false;

    // Get ETag or Last-Modified as version identifier
    const etag = response.headers.get('etag');
    const lastModified = response.headers.get('last-modified');
    const versionId = etag || lastModified;

    if (!versionId) return false;

    // First time checking
    if (lastCheckedVersion === null) {
      lastCheckedVersion = versionId;
      return false;
    }

    // Compare with last known version
    const hasNewVersion = lastCheckedVersion !== versionId;
    
    if (hasNewVersion) {
      console.log('[Version Check] New version detected:', versionId);
      lastCheckedVersion = versionId;
    }

    return hasNewVersion;
  } catch (error) {
    console.error('[Version Check] Error checking version:', error);
    return false;
  }
}

/**
 * Start periodic version checking
 */
export function startVersionCheck(onNewVersion: () => void): () => void {
  // Initial check after 10 seconds
  const initialTimeout = setTimeout(async () => {
    await checkForNewVersion(); // Initialize lastCheckedVersion
  }, 10000);

  // Periodic checks
  const interval = setInterval(async () => {
    const hasUpdate = await checkForNewVersion();
    if (hasUpdate) {
      onNewVersion();
    }
  }, VERSION_CHECK_INTERVAL);

  // Return cleanup function
  return () => {
    clearTimeout(initialTimeout);
    clearInterval(interval);
  };
}
