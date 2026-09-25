(function () {
  const includeNodes = document.querySelectorAll('[data-include]');

  if (!includeNodes.length) {
    document.dispatchEvent(new CustomEvent('components:loaded'));
    return;
  }

  const loadIncludes = async function () {
    for (const node of includeNodes) {
      const file = node.getAttribute('data-include');
      if (!file) continue;

      try {
        const response = await fetch(file, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }

        const html = await response.text();
        node.insertAdjacentHTML('afterend', html);
        node.remove();
      } catch (error) {
        console.warn('Failed to load component:', file, error);
      }
    }

    document.dispatchEvent(new CustomEvent('components:loaded'));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes, { once: true });
  } else {
    loadIncludes();
  }
})();
