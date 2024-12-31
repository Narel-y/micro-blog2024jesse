document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll(".animate-text");

    const observerOptions = {
        root: null,
        threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible");
            }
        });
    }, observerOptions);

    animatedElements.forEach((element) => observer.observe(element));
});
