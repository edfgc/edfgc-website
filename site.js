async function loadCards(){
  const grid = document.querySelector('[data-cards]');
  if(!grid) return;
  const res = await fetch('assets/events.json', {cache:'no-store'});
  const events = await res.json();

  // show only real events (skip "No meeting")
  const show = events.filter(e => e.title !== 'No meeting');

  const fmt = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'});
  };

  grid.innerHTML = show.map(ev => {
    const icon = `assets/icons/${ev.icon}.svg`;
    const title = ev.topic || ev.title;
    const date = fmt(ev.date);
    const sub = ev.topic ? ev.title : '';
    const speaker = ev.speaker ? `Speaker: ${ev.speaker}` : '';
    const desc = [
      sub ? sub : null,
      speaker ? speaker : null
    ].filter(Boolean).join(' · ');
    return `
      <div class="card">
        <div class="head">
          <img src="${icon}" alt="" aria-hidden="true">
          <div>${escapeHtml(title)}</div>
        </div>
        <div class="date">${escapeHtml(date)}</div>
        <p>${escapeHtml(desc || 'Details to follow')}</p>
      </div>
    `;
  }).join('');
}

function escapeHtml(str){
  return String(str ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;");
}

document.addEventListener('DOMContentLoaded', loadCards);
