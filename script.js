const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const scene = document.getElementById('heroScene');
const layers = scene ? [...scene.querySelectorAll('[data-depth]')] : [];

function parallax(x, y) {
  layers.forEach(layer => {
    const depth = Number(layer.dataset.depth || 0);
    const tx = x * 24 * depth;
    const ty = y * 18 * depth;
    if (layer.classList.contains('cup-wrap')) {
      layer.style.transform = `translate(calc(-50% + ${tx}px), calc(-48% + ${ty}px))`;
    } else {
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }
  });
}

if (scene && window.matchMedia('(pointer:fine)').matches) {
  scene.addEventListener('mousemove', e => {
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    parallax(x, y);
  });
  scene.addEventListener('mouseleave', () => parallax(0, 0));
}

document.querySelectorAll('.tilt').forEach(card => {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

const form = document.getElementById('leadForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const WEBHOOK_URL = '';

  if (!WEBHOOK_URL) {
    status.textContent = 'Форма готова. Для реальной отправки укажите WEBHOOK_URL в script.js.';
    return;
  }

  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  }).then(r => {
    if (!r.ok) throw new Error();
    form.reset();
    status.textContent = 'Спасибо! Сообщение отправлено.';
  }).catch(() => {
    status.textContent = 'Не удалось отправить. Позвоните нам по телефону из блока контактов.';
  });
});
