export const isChunkLoadError = error => /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk .* failed|error loading dynamically imported module/i.test(error?.message || '');

// A deployed update can remove the chunk referenced by an already-open tab.
// Retry once per tab, through a URL excluded from the service worker app shell.
export async function loadManagement(importer, browser = window) {
  try {
    const module = await importer();
    try { browser.sessionStorage.removeItem('brave-management-recovery'); } catch {}
    const url = new URL(browser.location.href);
    if (url.searchParams.has('app-update')) {
      url.searchParams.delete('app-update');
      browser.history.replaceState(browser.history.state, '', url.href);
    }
    return module;
  } catch (error) {
    if (!isChunkLoadError(error) || browser.navigator.onLine === false) throw error;
    try {
      const url = new URL(browser.location.href);
      if (browser.sessionStorage.getItem('brave-management-recovery') || url.searchParams.has('app-update')) throw error;
      browser.sessionStorage.setItem('brave-management-recovery', '1');
      url.searchParams.set('app-update', String(Date.now()));
      browser.location.replace(url.href);
    } catch {
      throw error;
    }
    return new Promise(() => {});
  }
}

