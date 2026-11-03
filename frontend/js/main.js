const menuToggle = document.querySelector('#menuToggle');
const mainNav = document.querySelector('#mainNav');

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const dateInput = document.querySelector('#bookingDate');
if (dateInput) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localDate;
}

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.querySelector('select[name="service"]');
    if (select) select.value = link.dataset.service;
  });
});

const form = document.querySelector('#bookingForm');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.id = (globalThis.crypto?.randomUUID?.() || String(Date.now()));
  data.status = 'Новая';
  data.createdAt = new Date().toISOString();
  const bookings = JSON.parse(localStorage.getItem('gc_bookings') || '[]');
  bookings.push(data);
  localStorage.setItem('gc_bookings', JSON.stringify(bookings));
  document.querySelector('#formMessage').textContent = 'Спасибо! Заявка сохранена в демо-режиме. Мы скоро свяжемся с вами.';
  form.reset();
  if (dateInput) {
    const today = new Date();
    dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
});