(() => {
  const nav = document.querySelector('.primary-nav');
  if (nav && !nav.querySelector('[data-vault-link]')) {
    const link = document.createElement('a');
    link.href = 'evidence-vault.html';
    link.className = 'nav-link';
    link.dataset.vaultLink = 'true';
    link.textContent = 'Evidence Vault';
    nav.appendChild(link);
  }

  const sideNav = document.querySelector('.side-nav');
  if (sideNav && !sideNav.querySelector('[data-vault-link]')) {
    const link = document.createElement('a');
    link.href = 'evidence-vault.html';
    link.className = 'side-link';
    link.dataset.vaultLink = 'true';
    link.innerHTML = '<span>06</span> Evidence Vault';
    const sideCard = sideNav.querySelector('.side-card');
    sideNav.insertBefore(link, sideCard || null);
  }
})();
