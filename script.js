document.addEventListener('DOMContentLoaded', function () {
  const careerButton = document.getElementById('careerButton');
  const careerSection = document.getElementById('career');

  if (careerButton && careerSection) {
    careerButton.addEventListener('click', function (event) {
      event.preventDefault();
      careerSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18
    });

    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add('visible');
    });
  }

  const interactiveCards = document.querySelectorAll('.interactive-card');

  interactiveCards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
        card.classList.toggle('active');
      }
    });
  });
});