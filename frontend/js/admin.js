const DEMO_PASSWORD = 'club2026';
const loginPanel = document.querySelector('#loginPanel');
const dashboard = document.querySelector('#dashboard');
const rows = document.querySelector('#bookingRows');
const getBookings = () => JSON.parse(localStorage.getItem('gc_bookings') || '[]');

document.querySelector('#loginForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const password = document.querySelector('#adminPassword').value;
  if (password !== DEMO_PASSWORD) {
    document.querySelector('#loginMessage').textContent = 'Неверный пароль. Попробуйте ещё раз.';
    return;
  }
  sessionStorage.setItem('gc_demo_admin', 'true');
  showDashboard();
});
function showDashboard() {
  loginPanel.classList.add('hidden');
  dashboard.classList.remove('hidden');
  renderBookings();
}
function renderBookings() {
  const bookings = getBookings();
  const today = new Date().toISOString().slice(0, 10);
  document.querySelector('#totalCount').textContent = bookings.length;
  document.querySelector('#pendingCount').textContent = bookings.filter(x => x.status === 'Новая').length;
  document.querySelector('#todayCount').textContent = bookings.filter(x => x.date === today).length;
  rows.innerHTML = '';
  if (!bookings.length) {
    rows.innerHTML = '<tr><td colspan="7">Пока нет заявок. Отправьте тестовую запись с главной страницы.</td></tr>';
    return;
  }
  bookings.slice().reverse().forEach(item => {
    const tr = document.createElement('tr');
    [item.name, item.phone, item.service, item.master, `${item.date} · ${item.time}`].forEach(value => {
      const td = document.createElement('td'); td.textContent = value || '—'; tr.appendChild(td);
    });
    const status = document.createElement('td'); status.innerHTML = '<span class="status"></span>'; status.querySelector('span').textContent = item.status || 'Новая'; tr.appendChild(status);
    const action = document.createElement('td'); const button = document.createElement('button'); button.className = 'table-action'; button.textContent = 'Удалить'; button.addEventListener('click', () => deleteBooking(item.id)); action.appendChild(button); tr.appendChild(action);
    rows.appendChild(tr);
  });
}
function deleteBooking(id) {
  localStorage.setItem('gc_bookings', JSON.stringify(getBookings().filter(item => item.id !== id)));
  renderBookings();
}
document.querySelector('#logoutBtn')?.addEventListener('click', () => {
  sessionStorage.removeItem('gc_demo_admin'); dashboard.classList.add('hidden'); loginPanel.classList.remove('hidden');
});
document.querySelector('#clearBookings')?.addEventListener('click', () => {
  if (confirm('Удалить все демонстрационные заявки?')) { localStorage.removeItem('gc_bookings'); renderBookings(); }
});
if (sessionStorage.getItem('gc_demo_admin') === 'true') showDashboard();