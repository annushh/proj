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
      threshold: 0.16,
      rootMargin: '0px 0px -40px 0px'
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

      document.querySelectorAll('.test-question').forEach(function (question) {
        const selected = question.querySelector('.selected');

        if (selected) {
          score += Number(selected.dataset.score);
          answered++;
        }
      });

      resultBlock.style.display = 'block';

      if (answered < 5) {
        resultBlock.textContent = 'Сначала ответь на все вопросы.';
        return;
      }

      if (score <= 2) {
        resultBlock.innerHTML = '🙂 Возможно, тебе больше подойдут другие направления IT, но попробовать ML всё равно стоит.';
      } else if (score <= 4) {
        resultBlock.innerHTML = '🚀 У тебя есть хорошие предпосылки для старта в Machine Learning.';
      } else {
        resultBlock.innerHTML = '🔥 Отлично! Похоже, профессия ML-инженера действительно может тебе подойти.';
      }
    });
  }

  startMlBackground();
});

function startMlBackground() {
  const canvas = document.getElementById('mlCanvas');

  if (!canvas) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) return;

  const ctx = canvas.getContext('2d');
  const nodes = [];
  const pulses = [];
  const features = [];
  const streams = [];
  let width = 0;
  let height = 0;
  let animationFrame = null;
  let lastResize = 0;

  const symbols = ['0', '1', 'Σ', '∇', 'λ', 'η', 'μ'];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = width < 560 ? 26 : width < 900 ? 42 : 62;
    nodes.length = 0;
    pulses.length = 0;
    features.length = 0;
    streams.length = 0;

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        r: Math.random() * 1.8 + 1.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    const pulseCount = width < 560 ? 5 : 11;

    for (let i = 0; i < pulseCount; i++) {
      pulses.push({
        from: Math.floor(Math.random() * count),
        to: Math.floor(Math.random() * count),
        progress: Math.random(),
        speed: Math.random() * 0.0045 + 0.002
      });
    }

    const featureCount = width < 560 ? 22 : 42;

    for (let i = 0; i < featureCount; i++) {
      const cluster = i % 2;
      const baseX = cluster ? width * 0.72 : width * 0.25;
      const baseY = cluster ? height * 0.34 : height * 0.63;

      features.push({
        x: baseX + (Math.random() - 0.5) * width * 0.22,
        y: baseY + (Math.random() - 0.5) * height * 0.18,
        r: Math.random() * 1.8 + 1.6,
        cluster: cluster,
        phase: Math.random() * Math.PI * 2
      });
    }

    const streamCount = width < 560 ? 10 : 18;

    for (let i = 0; i < streamCount; i++) {
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 0.32 + 0.12,
        char: symbols[Math.floor(Math.random() * symbols.length)],
        size: Math.random() * 12 + 14,
        alpha: Math.random() * 0.10 + 0.04
      });
    }
  }

  function drawLossCurves(time) {
    const baseY = height * 0.72;
    const startX = width * 0.06;
    const endX = width * 0.94;
    const amplitude = width < 560 ? 14 : 24;

    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 1.4;

    for (let line = 0; line < 3; line++) {
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const t = i / 90;
        const x = startX + (endX - startX) * t;
        const y = baseY - t * 120 + Math.sin(t * 10 + time * 0.001 + line) * amplitude + line * 18;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = line === 1 ? 'rgba(143, 216, 255, 0.68)' : 'rgba(17, 17, 17, 0.18)';
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawFeatureSpace(time) {
    ctx.save();
    ctx.globalAlpha = 0.5;

    features.forEach(function (point) {
      const driftX = Math.sin(time * 0.0012 + point.phase) * 5;
      const driftY = Math.cos(time * 0.001 + point.phase) * 4;
      const x = point.x + driftX;
      const y = point.y + driftY;

      ctx.beginPath();
      ctx.arc(x, y, point.r, 0, Math.PI * 2);
      ctx.fillStyle = point.cluster ? 'rgba(143, 216, 255, 0.34)' : 'rgba(17, 17, 17, 0.18)';
      ctx.fill();
    });

    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const x = width * (0.08 + t * 0.84);
      const y = height * 0.52 + Math.sin(t * Math.PI * 2 + time * 0.0008) * 26;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(112, 128, 144, 0.16)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 12]);
    ctx.stroke();
    ctx.restore();
  }

  function drawVectorField(time) {
    if (width < 700) return;

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = 'rgba(17, 17, 17, 0.35)';
    ctx.lineWidth = 1;

    const step = 94;
    for (let x = 70; x < width; x += step) {
      for (let y = 90; y < height; y += step) {
        const angle = Math.sin(x * 0.004 + time * 0.0006) + Math.cos(y * 0.004 - time * 0.0004);
        const len = 12;
        const x2 = x + Math.cos(angle) * len;
        const y2 = y + Math.sin(angle) * len;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2 - Math.cos(angle - 0.7) * 4, y2 - Math.sin(angle - 0.7) * 4);
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - Math.cos(angle + 0.7) * 4, y2 - Math.sin(angle + 0.7) * 4);
        ctx.stroke();
      }
    }

    ctx.restore();
  }


  function drawAttentionBeams(time) {
    if (width < 640) return;

    ctx.save();
    ctx.lineWidth = 1.1;

    const beams = [
      { y: 0.22, bend: -52, speed: 0.00018, alpha: 0.16 },
      { y: 0.44, bend: 68, speed: 0.00015, alpha: 0.12 },
      { y: 0.66, bend: -44, speed: 0.0002, alpha: 0.10 }
    ];

    beams.forEach(function (beam, index) {
      const y = height * beam.y + Math.sin(time * 0.0007 + index) * 12;
      const startX = width * 0.06;
      const endX = width * 0.94;
      const cx = width * 0.5;
      const cy = y + beam.bend;

      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.quadraticCurveTo(cx, cy, endX, y + Math.sin(index + time * 0.0009) * 24);
      ctx.strokeStyle = 'rgba(17, 17, 17, ' + beam.alpha + ')';
      ctx.setLineDash([7, 16]);
      ctx.lineDashOffset = -time * beam.speed * 1200;
      ctx.stroke();

      const t = (time * beam.speed + index * 0.27) % 1;
      const x1 = startX + (cx - startX) * t;
      const y1 = y + (cy - y) * t;
      const x2 = cx + (endX - cx) * t;
      const y2 = cy + (y - cy) * t;
      const x = x1 + (x2 - x1) * t;
      const dotY = y1 + (y2 - y1) * t;

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(x, dotY, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(143, 216, 255, 0.42)';
      ctx.fill();
    });

    ctx.restore();
  }

  function drawDataStreams() {
    ctx.save();
    ctx.font = '700 16px Unbounded, system-ui, sans-serif';
    ctx.textAlign = 'center';

    streams.forEach(function (stream) {
      stream.y += stream.speed;
      stream.x += Math.sin(stream.y * 0.012) * 0.15;

      if (stream.y > height + 30) {
        stream.y = -30;
        stream.x = Math.random() * width;
        stream.char = symbols[Math.floor(Math.random() * symbols.length)];
      }

      ctx.font = '700 ' + stream.size + 'px Unbounded, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(17, 17, 17, ' + stream.alpha + ')';
      ctx.fillText(stream.char, stream.x, stream.y);
    });

    ctx.restore();
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    drawDataStreams();
    drawLossCurves(time);
    drawFeatureSpace(time);
    drawVectorField(time);
    drawAttentionBeams(time);

    nodes.forEach(function (node) {
      node.x += node.vx;
      node.y += node.vy;
      node.phase += 0.01;

      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;
    });

    const connections = [];
    const maxDistance = width < 560 ? 118 : width < 900 ? 145 : 170;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          connections.push([i, j, distance]);
          const opacity = (1 - distance / maxDistance) * 0.22;
          ctx.strokeStyle = 'rgba(17, 17, 17, ' + opacity + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    pulses.forEach(function (pulse) {
      if (!nodes[pulse.from] || !nodes[pulse.to] || pulse.from === pulse.to) {
        pulse.from = Math.floor(Math.random() * nodes.length);
        pulse.to = Math.floor(Math.random() * nodes.length);
        pulse.progress = 0;
      }

      const a = nodes[pulse.from];
      const b = nodes[pulse.to];
      const x = a.x + (b.x - a.x) * pulse.progress;
      const y = a.y + (b.y - a.y) * pulse.progress;

      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(143, 216, 255, 0.62)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(143, 216, 255, 0.12)';
      ctx.fill();

      pulse.progress += pulse.speed;

      if (pulse.progress >= 1) {
        if (connections.length) {
          const next = connections[Math.floor(Math.random() * connections.length)];
          pulse.from = next[0];
          pulse.to = next[1];
        } else {
          pulse.from = Math.floor(Math.random() * nodes.length);
          pulse.to = Math.floor(Math.random() * nodes.length);
        }
        pulse.progress = 0;
      }
    });

    nodes.forEach(function (node) {
      const glow = 0.11 + Math.sin(node.phase) * 0.03;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(17, 17, 17, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r + 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(143, 216, 255, ' + glow + ')';
      ctx.fill();
    });

    animationFrame = requestAnimationFrame(draw);
  }

  function safeResize() {
    const now = Date.now();
    if (now - lastResize < 120) return;
    lastResize = now;

    if (animationFrame) cancelAnimationFrame(animationFrame);
    resize();
    draw(0);
  }

  resize();
  draw(0);

  window.addEventListener('resize', safeResize);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    if (!document.hidden && !animationFrame) {
      draw(0);
    }
  });
}
