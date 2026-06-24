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
  const answers = document.querySelectorAll('.test-answer');

answers.forEach(button => {
  button.addEventListener('click', () => {
    const parent = button.parentElement;

    parent.querySelectorAll('.test-answer').forEach(btn => {
      btn.classList.remove('selected');
    });

    button.classList.add('selected');
  });
});

const resultButton = document.getElementById('showResult');
const resultBlock = document.getElementById('testResult');

if (resultButton) {
  resultButton.addEventListener('click', () => {

    let score = 0;
    let answered = 0;

    document.querySelectorAll('.test-question').forEach(question => {

      const selected = question.querySelector('.selected');

      if (selected) {
        score += Number(selected.dataset.score);
        answered++;
      }
    });

    if (answered < 5) {
      resultBlock.style.display = 'block';
      resultBlock.textContent =
        'Сначала ответь на все вопросы.';
      return;
    }

    resultBlock.style.display = 'block';

    if (score <= 2) {
      resultBlock.innerHTML =
        '🙂 Возможно, тебе больше подойдут другие направления IT, но попробовать ML всё равно стоит.';
    } else if (score <= 4) {
      resultBlock.innerHTML =
        '🚀 У тебя есть хорошие предпосылки для старта в Machine Learning.';
    } else {
      resultBlock.innerHTML =
        '🔥 Отлично! Похоже, профессия ML-инженера действительно может тебе подойти.';
    }
  });
}
});

