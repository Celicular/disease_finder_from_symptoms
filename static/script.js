document.addEventListener('DOMContentLoaded', function () {
    const categoryLinks = document.querySelectorAll('.category-link');
    const symptomSections = document.querySelectorAll('.symptom-section');
    const form = document.getElementById('prediction-form');
    const modal = document.getElementById('result-modal');
    const resultEl = document.getElementById('result');
    const closeButton = document.querySelector('.close-button');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    // Category switching
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Deactivate all links and sections
            categoryLinks.forEach(l => l.classList.remove('active'));
            symptomSections.forEach(s => s.classList.remove('active'));

            // Activate the clicked link and corresponding section
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');

            // If on mobile, close the sidebar after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const symptoms = [];
        const checkboxes = document.querySelectorAll('input[name="symptom"]:checked');
        checkboxes.forEach(checkbox => {
            symptoms.push(checkbox.value);
        });

        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symptoms: symptoms })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    resultEl.textContent = `Error: ${data.error}`;
                } else {
                    resultEl.textContent = data.prediction;
                }
                modal.style.display = 'block';
            })
            .catch(error => {
                resultEl.textContent = 'An error occurred. Please try again.';
                modal.style.display = 'block';
                console.error('Error:', error);
            });
    });

    // Modal handling
    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Responsive sidebar toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }
});