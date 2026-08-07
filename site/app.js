(() => {
  const data = window.CIVICLENS_DATA;
  const views = [...document.querySelectorAll('[data-view]')];
  const viewButtons = [...document.querySelectorAll('[data-view-target]')];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sideLinks = [...document.querySelectorAll('.side-link')];
  const metricGrid = document.getElementById('metricGrid');
  const revenueMetricGrid = document.getElementById('revenueMetricGrid');
  const yearSelect = document.getElementById('yearSelect');
  const moneyFlow = document.getElementById('moneyFlow');
  const overviewSpendChart = document.getElementById('overviewSpendChart');
  const spendingChart = document.getElementById('spendingChart');
  const revenueTableBody = document.getElementById('revenueTableBody');
  const sourceList = document.getElementById('sourceList');
  const askForm = document.getElementById('askForm');
  const askInput = document.getElementById('askInput');
  const answerPanel = document.getElementById('answerPanel');
  const answerTitle = document.getElementById('answerTitle');
  const answerBody = document.getElementById('answerBody');
  const evidenceDrawer = document.getElementById('evidenceDrawer');
  const evidenceButton = document.getElementById('showEvidenceButton');
  const menuButton = document.getElementById('menuButton');
  const primaryNav = document.querySelector('.primary-nav');

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function setView(name, updateHash = true) {
    const target = views.find((view) => view.dataset.view === name) || views[0];

    views.forEach((view) => {
      const active = view === target;
      view.hidden = !active;
      view.classList.toggle('is-active', active);
    });

    viewButtons.forEach((button) => {
      const active = button.dataset.viewTarget === target.dataset.view;
      button.classList.toggle('is-active', active);
      if (button.classList.contains('nav-link')) {
        button.setAttribute('aria-current', active ? 'page' : 'false');
      }
    });

    if (updateHash) {
      history.replaceState(null, '', `#${target.dataset.view}`);
    }

    primaryNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: document.querySelector('.notice-bar').offsetTop - 76, behavior: 'smooth' });
  }

  function renderMetrics(container, metrics) {
    container.innerHTML = metrics.map((metric) => `
      <article class="metric-card ${metric.tone === 'dark' ? 'metric-card--dark' : ''}">
        <div class="metric-card__label">
          <span>${escapeHtml(metric.label)}</span>
          <span class="metric-card__icon">${escapeHtml(metric.icon)}</span>
        </div>
        <strong>${escapeHtml(metric.value)}</strong>
        <small>${escapeHtml(metric.note)}</small>
      </article>
    `).join('');
  }

  function renderBarChart(container, items) {
    const max = Math.max(...items.map((item) => item.share), 1);
    container.innerHTML = items.map((item, index) => `
      <div class="bar-row">
        <div class="bar-row__label"><span class="bar-row__dot" style="opacity:${Math.max(.45, 1 - index * .08)}"></span>${escapeHtml(item.name)}</div>
        <div class="bar-row__track" aria-label="${escapeHtml(item.name)} ${item.share}%">
          <div class="bar-row__bar" style="width:${(item.share / max) * 100}%"></div>
        </div>
        <div class="bar-row__value">${item.share}%</div>
      </div>
    `).join('');
  }

  function renderFlowColumn(title, subtitle, items) {
    return `
      <div class="flow-column">
        <div class="flow-column__title"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span></div>
        ${items.map((item) => `
          <div class="flow-item">
            <div class="flow-item__meta"><span>${escapeHtml(item.name)}</span><strong>${item.share}%</strong></div>
            <div class="flow-track"><span style="width:${item.share}%"></span></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderMoneyFlow() {
    moneyFlow.innerHTML = [
      renderFlowColumn('Revenue', 'Illustrative', data.flow.revenue),
      '<div class="flow-arrow" aria-hidden="true">→</div>',
      renderFlowColumn('Funds', 'Accounting structure', data.flow.funds),
      '<div class="flow-arrow" aria-hidden="true">→</div>',
      renderFlowColumn('Uses', 'Illustrative', data.flow.uses)
    ].join('');
  }

  function renderRevenueTable(period) {
    revenueTableBody.innerHTML = period.revenue.map((item) => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td><strong>${item.share}%</strong></td>
        <td>${escapeHtml(item.note)}</td>
        <td><span class="tag tag--amber">Pending verification</span></td>
      </tr>
    `).join('');
  }

  function renderSources() {
    sourceList.innerHTML = data.sources.map((source) => `
      <article class="source-item">
        <span class="source-item__icon" aria-hidden="true">${escapeHtml(source.code)}</span>
        <div>
          <h4>${escapeHtml(source.title)}</h4>
          <p>${escapeHtml(source.publisher)} · ${escapeHtml(source.detail)}</p>
        </div>
        <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">Open official source ↗</a>
      </article>
    `).join('');
  }

  function renderPeriod(periodKey) {
    const period = data.periods[periodKey] || data.periods.fy2025;
    renderMetrics(metricGrid, period.metrics);
    renderMetrics(revenueMetricGrid, [
      { label: 'Illustrative tax share', value: `${period.revenue[0].share}%`, note: 'Demonstration only—not an official City value', icon: 'TX', tone: 'dark' },
      { label: 'Illustrative enterprise share', value: `${period.revenue[1].share}%`, note: 'Must be separated by restricted fund', icon: 'EN' },
      { label: 'Revenue categories', value: String(period.revenue.length), note: 'Designed to prevent unlike revenues from being mixed', icon: 'CAT' },
      { label: 'Verification status', value: 'Pending', note: 'Official records have not yet been reconciled', icon: 'QA' }
    ]);
    renderBarChart(overviewSpendChart, period.spending);
    renderBarChart(spendingChart, period.spending);
    renderRevenueTable(period);
  }

  function classifyQuestion(question) {
    const normalized = question.toLowerCase();
    if (normalized.includes('property') || normalized.includes('tax')) return data.answers.propertyTax;
    if (normalized.includes('police') || normalized.includes('fire') || normalized.includes('safety')) return data.answers.publicSafety;
    if (normalized.includes('contract') || normalized.includes('vendor') || normalized.includes('payment')) return data.answers.contracts;
    return { ...data.answers.generic, title: question || data.answers.generic.title };
  }

  function openAnswer(question) {
    const answer = classifyQuestion(question.trim());
    answerTitle.textContent = answer.title;
    answerBody.innerHTML = `
      <div class="answer-alert"><strong>Prototype disclosure:</strong> CivicLens is not yet publishing verified Port St. Lucie financial totals.</div>
      <p>${escapeHtml(answer.intro)}</p>
      <h3>What the evidence currently supports</h3>
      <p>${escapeHtml(answer.explanation)}</p>
      <div class="answer-facts">
        ${answer.facts.map(([label, detail]) => `
          <div class="answer-fact"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(detail)}</span></div>
        `).join('')}
      </div>
      <div class="answer-actions">
        <button class="button button--secondary" type="button" id="answerEvidenceButton">Show the evidence plan</button>
        <button class="button button--secondary" type="button" id="answerSourcesButton">Browse official sources</button>
      </div>
    `;
    answerPanel.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => answerPanel.querySelector('.close-button').focus());

    document.getElementById('answerEvidenceButton').addEventListener('click', () => {
      closeAnswer();
      openEvidence();
    });
    document.getElementById('answerSourcesButton').addEventListener('click', () => {
      closeAnswer();
      setView('sources');
    });
  }

  function closeAnswer() {
    answerPanel.hidden = true;
    if (evidenceDrawer.hidden) document.body.classList.remove('modal-open');
  }

  function openEvidence() {
    evidenceDrawer.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => evidenceDrawer.querySelector('.close-button').focus());
  }

  function closeEvidence() {
    evidenceDrawer.hidden = true;
    if (answerPanel.hidden) document.body.classList.remove('modal-open');
  }

  function addRestrictedVaultNavigation() {
    if (primaryNav && !primaryNav.querySelector('[data-vault-link]')) {
      const topLink = document.createElement('a');
      topLink.href = 'evidence-vault.html';
      topLink.className = 'nav-link';
      topLink.dataset.vaultLink = 'true';
      topLink.textContent = 'Restricted Vault';
      topLink.setAttribute('aria-label', 'Open the restricted CivicLens Evidence Vault');
      primaryNav.appendChild(topLink);
    }

    const sideNav = document.querySelector('.side-nav');
    if (sideNav && !sideNav.querySelector('[data-vault-link]')) {
      const sideLink = document.createElement('a');
      sideLink.href = 'evidence-vault.html';
      sideLink.className = 'side-link';
      sideLink.dataset.vaultLink = 'true';
      sideLink.innerHTML = '<span>06</span> Restricted Vault 🔒';
      sideLink.setAttribute('aria-label', 'Open the restricted CivicLens Evidence Vault');
      const sideCard = sideNav.querySelector('.side-card');
      sideNav.insertBefore(sideLink, sideCard || null);
    }
  }

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.viewTarget));
  });

  yearSelect.addEventListener('change', () => renderPeriod(yearSelect.value));

  askForm.addEventListener('submit', (event) => {
    event.preventDefault();
    openAnswer(askInput.value || 'Where did my property taxes go?');
  });

  document.querySelectorAll('[data-question]').forEach((button) => {
    button.addEventListener('click', () => {
      askInput.value = button.dataset.question;
      openAnswer(button.dataset.question);
    });
  });

  document.querySelectorAll('[data-close-answer]').forEach((button) => button.addEventListener('click', closeAnswer));
  document.querySelectorAll('[data-close-evidence]').forEach((button) => button.addEventListener('click', closeEvidence));
  evidenceButton.addEventListener('click', openEvidence);

  menuButton.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!answerPanel.hidden) closeAnswer();
    if (!evidenceDrawer.hidden) closeEvidence();
  });

  const initialView = window.location.hash.replace('#', '');
  renderMoneyFlow();
  renderPeriod(yearSelect.value);
  renderSources();
  addRestrictedVaultNavigation();
  setView(['overview', 'revenue', 'spending', 'aen', 'sources'].includes(initialView) ? initialView : 'overview', false);
})();
