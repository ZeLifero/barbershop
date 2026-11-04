const API_URL = "http://localhost:3000/api";

// ==========================================
// МОБИЛЬНОЕ МЕНЮ
// ==========================================

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
    });
});


// ==========================================
// ЭЛЕМЕНТЫ ФОРМЫ
// ==========================================

const form = document.querySelector("#bookingForm");
const serviceSelect = form?.querySelector('[name="service"]');
const masterSelect = form?.querySelector('[name="master"]');
const dateInput = document.querySelector("#bookingDate");
const timeSelect = form?.querySelector('[name="time"]');
const formMessage = document.querySelector("#formMessage");


// ==========================================
// МИНИМАЛЬНАЯ ДАТА — СЕГОДНЯ
// ==========================================

function setMinimumDate() {
    if (!dateInput) return;

    const today = new Date();
    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    dateInput.min = localDate;
}

setMinimumDate();


// ==========================================
// ЗАГРУЗКА УСЛУГ И МАСТЕРОВ ИЗ API
// ==========================================

async function loadBookingOptions() {
    try {
        const [servicesResponse, mastersResponse] = await Promise.all([
            fetch(`${API_URL}/services`),
            fetch(`${API_URL}/masters`)
        ]);

        if (!servicesResponse.ok || !mastersResponse.ok) {
            throw new Error("Не удалось получить данные с сервера");
        }

        const servicesResult = await servicesResponse.json();
        const mastersResult = await mastersResponse.json();

        if (!servicesResult.success || !mastersResult.success) {
            throw new Error("Сервер вернул некорректные данные");
        }

        // Заполняем список услуг
        serviceSelect.innerHTML =
            '<option value="">Выберите услугу</option>';

        servicesResult.data.forEach(service => {
            const option = document.createElement("option");

            option.value = service.id;
            option.textContent =
                `${service.name} — ${Number(service.price)} BYN`;

            serviceSelect.appendChild(option);
        });

        // Заполняем список мастеров
        masterSelect.innerHTML =
            '<option value="">Выберите мастера</option>';

        mastersResult.data.forEach(master => {
            const option = document.createElement("option");

            option.value = master.id;
            option.textContent = master.name;

            masterSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Ошибка загрузки данных:", error);

        formMessage.textContent =
            "Не удалось загрузить услуги и мастеров. Проверьте, запущен ли сервер.";

        formMessage.style.color = "#b42318";
    }
}

if (form && serviceSelect && masterSelect && formMessage) {
    loadBookingOptions();
}


// ==========================================
// ПЕРЕХОД К УСЛУГЕ ИЗ БЛОКА НА САЙТЕ
// ==========================================

document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
        const serviceName = link.dataset.service.trim().toLowerCase();

        const matchingOption = [...serviceSelect.options].find(option =>
            option.textContent.trim().toLowerCase().startsWith(serviceName)
        );

        if (matchingOption) {
            serviceSelect.value = matchingOption.value;
        }
    });
});


// ==========================================
// ОТПРАВКА ЗАЯВКИ
// ==========================================

form?.addEventListener("submit", async event => {
    event.preventDefault();

    formMessage.textContent = "";
    formMessage.style.color = "";

    const formData = new FormData(form);

    const clientName = formData.get("name").trim();
    const phone = formData.get("phone").trim();
    const serviceId = formData.get("service");
    const masterId = formData.get("master");
    const date = formData.get("date");
    const time = formData.get("time");

    if (!serviceId || !masterId) {
        formMessage.textContent = "Выберите услугу и мастера.";
        formMessage.style.color = "#b42318";
        return;
    }

    // Собираем дату и время в единый формат ISO
    const dateTime = new Date(`${date}T${time}`);

    if (Number.isNaN(dateTime.getTime()) || dateTime <= new Date()) {
        formMessage.textContent =
            "Выберите корректную дату и время в будущем.";

        formMessage.style.color = "#b42318";
        return;
    }

    const bookingData = {
        clientName,
        phone,
        serviceId,
        masterId,
        dateTime: dateTime.toISOString()
    };

    const submitButton = form.querySelector(".btn-submit");
    const originalButtonText = submitButton.innerHTML;

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Отправляем...";

        const response = await fetch(`${API_URL}/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Не удалось создать запись");
        }

        formMessage.textContent =
            "Спасибо! Ваша заявка успешно отправлена. Мы скоро свяжемся с вами.";

        formMessage.style.color = "#247a45";

        form.reset();
        setMinimumDate();

    } catch (error) {
        console.error("Ошибка отправки записи:", error);

        formMessage.textContent =
            error.message || "Ошибка соединения с сервером.";

        formMessage.style.color = "#b42318";

    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});