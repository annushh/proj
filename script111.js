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
      threshold: window.matchMedia('(max-width: 700px)').matches ? 0.08 : 0.18
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
  const isTouchDevice = window.matchMedia && window.matchMedia('(hover: none)').matches;

  interactiveCards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (!isTouchDevice) return;

      interactiveCards.forEach(function (item) {
        if (item !== card) item.classList.remove('active');
      });

      card.classList.toggle('active');
    });
  });

  const answers = document.querySelectorAll('.test-answer');

  answers.forEach(function (button) {
    button.addEventListener('click', function () {
      const parent = button.closest('.test-question');
      if (!parent) return;

      parent.querySelectorAll('.test-answer').forEach(function (btn) {
        btn.classList.remove('selected');
      });

      button.classList.add('selected');
    });
  });

  const resultButton = document.getElementById('showResult');
  const resultBlock = document.getElementById('testResult');

  if (resultButton && resultBlock) {
    resultButton.addEventListener('click', function () {
      let score = 0;
      let answered = 0;
      const questions = document.querySelectorAll('.test-question');

      questions.forEach(function (question) {
        const selected = question.querySelector('.selected');

        if (selected) {
          score += Number(selected.dataset.score);
          answered += 1;
        }
      });

      resultBlock.style.display = 'block';

      if (answered < questions.length) {
        resultBlock.textContent = 'Сначала ответь на все вопросы.';
        return;
      }

      if (score <= 2) {
        resultBlock.textContent = '🙂 Возможно, тебе больше подойдут другие направления IT, но попробовать ML всё равно стоит.';
      } else if (score <= 4) {
        resultBlock.textContent = '🚀 У тебя есть хорошие предпосылки для старта в Machine Learning.';
      } else {
        resultBlock.textContent = '🔥 Отлично! Похоже, профессия ML-инженера действительно может тебе подойти.';
      }
    });
  }
});
