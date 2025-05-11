// LocalStorage Functions
function savePreferences(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function loadPreferences(key, defaultValue) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return defaultValue;
    }
}

// Ensure DOM is fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeBtn = document.getElementById('theme-btn');
    const themeMessage = document.getElementById('theme-message');
    const body = document.body;

    function applyTheme(theme) {
        body.classList.toggle('dark', theme === 'dark');
        themeMessage.textContent = `Current theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} mode`;
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = body.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            applyTheme(newTheme);
            savePreferences('theme', newTheme);
        });
    }

    // Load theme on page load
    const savedTheme = loadPreferences('theme', 'light');
    applyTheme(savedTheme);

    // Animated Image Gallery
    const imageGallery = document.querySelector('.image-gallery');
    const galleryImages = document.querySelectorAll('.gallery-img');
    let currentImageIndex = 0;

    function showImage(index) {
        galleryImages.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }

    if (imageGallery) {
        imageGallery.addEventListener('click', () => {
            galleryImages[currentImageIndex].classList.add('animate');
            setTimeout(() => {
                galleryImages[currentImageIndex].classList.remove('animate');
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                showImage(currentImageIndex);
            }, 500); // Match animation duration
        });
    }

    // Form Handling
    const prefForm = document.getElementById('prefForm');
    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('username-error');
    const prefMessage = document.getElementById('pref-message');

    function validateUsername(username) {
        return username.trim().length > 0;
    }

    function validateField(input, errorElement, validationFn, errorMessage) {
        const value = input.value.trim();
        if (!validationFn(value)) {
            errorElement.textContent = errorMessage;
            return false;
        }
        errorElement.textContent = '';
        return true;
    }

    if (usernameInput) {
        usernameInput.addEventListener('input', () => {
            validateField(usernameInput, usernameError, validateUsername, 'Username is required');
        });
    }

    // Load saved username
    const savedUsername = loadPreferences('username', '');
    if (savedUsername && usernameInput) {
        usernameInput.value = savedUsername;
        prefMessage.textContent = `Welcome back, ${savedUsername}!`;
    }

    if (prefForm) {
        prefForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isValid = validateField(usernameInput, usernameError, validateUsername, 'Username is required');
            
            if (isValid) {
                const username = usernameInput.value.trim();
                savePreferences('username', username);
                prefMessage.textContent = `Preferences saved for ${username}!`;
                prefForm.classList.add('animate');
                setTimeout(() => {
                    prefForm.classList.remove('animate');
                }, 500);
            }
        });
    }
});