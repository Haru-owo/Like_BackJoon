
document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submitBtn');
    const popup = document.getElementById('popupMessage');

    submitBtn.addEventListener('click', function () {
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 2000);
    });
});


// 화면 전환 제어
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.textContent.trim() === '제출') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('problemSection').style.display = 'none';
                document.getElementById('submitSection').style.display = 'block';
            });
        }
    });
});
