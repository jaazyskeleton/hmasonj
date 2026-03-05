let lastScrollTop = 0;
const topbar = document.querySelector('.topbar');
        
window.addEventListener('scroll', () => {
    let currentScroll = window.pageYOffset;
    if (currentScroll > lastScrollTop) {
        topbar.classList.add('hidden');
    } else {
        topbar.classList.remove('hidden');
    }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});