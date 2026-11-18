// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('active');
        burger.classList.toggle('active', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on a link
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove('active');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq__question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq__item');
        const isActive = item.classList.contains('faq__item--active');

        // Close all items
        document.querySelectorAll('.faq__item').forEach(el => {
            el.classList.remove('faq__item--active');
            el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        });

        // Open clicked item if it was closed
        if (!isActive) {
            item.classList.add('faq__item--active');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== GOOGLE APPS SCRIPT URL =====
// Замените на свой URL после публикации веб-приложения Google Apps Script
const GOOGLE_SCRIPT_URL = ''; // Public portfolio: connect your own endpoint.

// ===== SEND DATA TO GOOGLE SHEETS =====
function sendToGoogleSheets(data) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', GOOGLE_SCRIPT_URL, true);
        xhr.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve({ success: true });
                } else {
                    console.error('Ошибка отправки:', xhr.status, xhr.responseText);
                    resolve({ success: false });
                }
            }
        };
        xhr.onerror = function () {
            console.error('Ошибка сети при отправке');
            resolve({ success: false });
        };
        xhr.send(JSON.stringify(data));
    });
}

// ===== ORDER FORM =====
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const packageSelect = document.getElementById('package');

        if (!name) {
            showError('name', 'Введите ваше имя');
            return;
        }

        if (!phone || phone.length < 10) {
            showError('phone', 'Введите корректный номер телефона');
            return;
        }

        const btn = orderForm.querySelector('.order__submit');
        const originalText = btn.textContent;
        btn.textContent = 'ОТПРАВКА...';
        btn.disabled = true;

        const formData = {
            name: name,
            phone: phone,
            package: packageSelect.options[packageSelect.selectedIndex].text,
            source: 'Форма заказа'
        };

        const result = await sendToGoogleSheets(formData);

        if (result.success) {
            btn.textContent = 'ЗАЯВКА ОТПРАВЛЕНА!';
            btn.style.background = '#10b981';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                orderForm.reset();
            }, 3000);
        } else {
            btn.textContent = 'ОШИБКА ОТПРАВКИ';
            btn.style.background = '#ef4444';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}

// ===== CTA FORM =====
const ctaForm = document.getElementById('ctaForm');
if (ctaForm) {
    ctaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const phone = document.getElementById('ctaPhone').value.trim();

        if (!phone || phone.length < 10) {
            ctaForm.querySelector('input').style.borderColor = '#ef4444';
            return;
        }

        const btn = ctaForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'ОТПРАВКА...';
        btn.disabled = true;

        const formData = {
            name: '',
            phone: phone,
            package: '',
            source: 'Консультация'
        };

        const result = await sendToGoogleSheets(formData);

        if (result.success) {
            btn.textContent = 'ЗАЯВКА ОТПРАВЛЕНА!';
            btn.style.background = '#10b981';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                ctaForm.reset();
            }, 3000);
        } else {
            btn.textContent = 'ОШИБКА ОТПРАВКИ';
            btn.style.background = '#ef4444';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}

// ===== PRODUCT SELECTION =====
document.querySelectorAll('.order__product').forEach(product => {
    product.addEventListener('click', () => {
        const productType = product.dataset.product;
        const select = document.getElementById('package');
        if (select) {
            select.value = productType;
            // Scroll to form
            document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// ===== HELPER FUNCTIONS =====
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#ef4444';
        field.focus();

        // Remove error style on input
        field.addEventListener('input', () => {
            field.style.borderColor = '';
        }, { once: true });
    }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
