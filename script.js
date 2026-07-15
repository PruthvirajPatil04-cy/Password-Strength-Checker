const passwordInput = document.getElementById('password-input');
const togglePasswordBtn = document.getElementById('toggle-password');
const strengthText = document.getElementById('strength-text');
const bars = document.querySelectorAll('.bar');
const toggleIcon = togglePasswordBtn.querySelector('i');

const requirements = {
    length: { regex: /.{8,}/, element: document.getElementById('req-length') },
    lower: { regex: /[a-z]/, element: document.getElementById('req-lower') },
    upper: { regex: /[A-Z]/, element: document.getElementById('req-upper') },
    number: { regex: /[0-9]/, element: document.getElementById('req-number') },
    special: { regex: /[^A-Za-z0-9]/, element: document.getElementById('req-special') }
};

togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    if (type === 'text') {
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
});

passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    let strength = 0;

    // Check requirements
    for (const [key, req] of Object.entries(requirements)) {
        if (req.regex.test(password)) {
            req.element.classList.add('met');
            strength++;
        } else {
            req.element.classList.remove('met');
        }
    }

    // If password is empty, reset
    if (password.length === 0) {
        strength = 0;
    }

    updateStrengthMeter(strength);
});

function updateStrengthMeter(strength) {
    // Reset all bars
    bars.forEach(bar => {
        bar.className = 'bar';
        bar.style.backgroundColor = 'var(--strength-0)';
    });

    let text = 'Enter keyword';
    let color = 'var(--text-muted)';

    if (strength > 0) {
        let numBars = 0;

        if (strength >= 1 && strength <= 2) {
            text = 'Weak';
            color = 'var(--strength-1)';
            numBars = 1;
        } else if (strength === 3) {
            text = 'Fair';
            color = 'var(--strength-2)';
            numBars = 2;
        } else if (strength === 4) {
            text = 'Good';
            color = 'var(--strength-3)';
            numBars = 3;
        } else if (strength === 5) {
            text = 'Strong';
            color = 'var(--strength-4)';
            numBars = 4;
        }

        for (let i = 0; i < numBars; i++) {
            bars[i].classList.add('active');
            bars[i].style.backgroundColor = color;
        }

        strengthText.style.color = color;
    } else {
        strengthText.style.color = color;
    }

    strengthText.textContent = text;
}

const keywordInput = document.getElementById('keyword-input');
const generateBtn = document.getElementById('generate-btn');

generateBtn.addEventListener('click', () => {
    let baseString = keywordInput.value.trim();
    if (!baseString) {
        baseString = "Pass";
    }

    const leetMap = {
        'a': '@', 'A': '@', 'e': '3', 'E': '3',
        'i': '1', 'I': '1', 'o': '0', 'O': '0',
        's': '$', 'S': '$', 't': '7', 'T': '7'
    };

    let processedKeyword = '';
    for (let i = 0; i < baseString.length; i++) {
        const char = baseString[i];
        if (leetMap[char] && Math.random() > 0.4) {
            processedKeyword += leetMap[char];
        } else if (/[a-zA-Z]/.test(char)) {
            processedKeyword += Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
        } else {
            processedKeyword += char;
        }
    }

    processedKeyword = processedKeyword.replace(/\s+/g, '-');

    const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowers = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()_+~";

    let suffix = '';
    if (!/[A-Z]/.test(processedKeyword)) suffix += uppers[Math.floor(Math.random() * uppers.length)];
    if (!/[a-z]/.test(processedKeyword)) suffix += lowers[Math.floor(Math.random() * lowers.length)];
    if (!/[0-9]/.test(processedKeyword)) suffix += numbers[Math.floor(Math.random() * numbers.length)];
    if (!/[^A-Za-z0-9]/.test(processedKeyword)) suffix += specials[Math.floor(Math.random() * specials.length)];

    const allChars = uppers + lowers + numbers + specials;
    while ((processedKeyword.length + suffix.length) < 14) {
        suffix += allChars[Math.floor(Math.random() * allChars.length)];
    }

    let suffixArr = suffix.split('');
    for (let i = suffixArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [suffixArr[i], suffixArr[j]] = [suffixArr[j], suffixArr[i]];
    }

    const finalPassword = processedKeyword + (suffixArr.length > 0 ? '-' + suffixArr.join('') : '');

    passwordInput.value = finalPassword;
    passwordInput.setAttribute('type', 'text');
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');

    passwordInput.dispatchEvent(new Event('input'));
});

keywordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        generateBtn.click();
    }
});
