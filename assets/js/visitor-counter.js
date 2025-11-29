ensureCounter().finally(() => {
  const seen = localStorage.getItem(FLAG) === '1';
  getOrHit(seen)
    .then(({ value }) => {
      el.textContent = Number(value).toLocaleString();
      if (!seen) localStorage.setItem(FLAG, '1');
    })
    .catch(() => { el.textContent = '—'; });
});
