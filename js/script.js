/* ========================================
   马克思主义基本原理宣传网页 - 脚本
   功能：粒子背景、打字机、数字计数、滚动动画、导航吸顶
   ======================================== */

(function () {
  "use strict";

  /* ---------- 1. 页面加载动画 ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    setTimeout(function () {
      loader.classList.add("hide");
    }, 600);
  });

  /* ---------- 2. 平滑滚动 ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#") return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      }
    });
  });

  /* ---------- 5. 打字机效果 ---------- */
  var typingEl = document.getElementById("typingText");
  var typingTexts = [
    "马克思主义是科学的理论，创造性地揭示了人类社会发展规律",
    "马克思主义是人民的理论，第一次创立了人民实现自身解放的思想体系",
    "马克思主义是实践的理论，指引着人民改造世界的行动",
    "马克思主义是不断发展的开放的理论，始终站在时代前沿"
  ];
  var textIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  function typeWriter() {
    var current = typingTexts[textIndex];
    if (isDeleting) {
      typingEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    var speed = isDeleting ? 40 : 90;

    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % typingTexts.length;
      speed = 300;
    }
    setTimeout(typeWriter, speed);
  }
  setTimeout(typeWriter, 1000);

  /* ---------- 6. 数字计数动画 ---------- */
  var statNums = document.querySelectorAll(".stat-num");
  var statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    statNums.forEach(function (num) {
      var target = parseInt(num.getAttribute("data-target"), 10);
      var duration = 1800;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        num.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- 7. 滚动渐入动画 ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* Hero 进入视口时触发数字动画 */
  var heroSection = document.getElementById("hero");
  var heroObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStats();
          heroObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  heroObserver.observe(heroSection);

  /* ---------- 8. 粒子背景 ---------- */
  var canvas = document.getElementById("particleCanvas");
  var ctx = canvas.getContext("2d");
  var particles = [];
  var particleCount = 70;
  var rafId = null;
  var isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.5 ? "200, 16, 46" : "212, 175, 55",
      alpha: Math.random() * 0.6 + 0.2
    };
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制粒子
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + p.color + "," + p.alpha + ")";
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    // 绘制连线
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(200, 16, 46, " + (0.12 * (1 - dist / 120)) + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(drawParticles);
  }

  if (canvas && !isReducedMotion) {
    resizeCanvas();
    initParticles();
    drawParticles();
    window.addEventListener("resize", function () {
      resizeCanvas();
    });
  }

  /* ---------- 9. 回到顶部按钮 ---------- */
  var backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }, { passive: true });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 10. 鼠标视差效果（Hero区） ---------- */
  var heroContent = document.querySelector(".hero-content");
  if (heroContent && !isReducedMotion) {
    document.querySelector(".hero").addEventListener("mousemove", function (e) {
      var rect = this.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroContent.style.transform = "translate(" + (x * 15) + "px, " + (y * 15) + "px)";
    });
    document.querySelector(".hero").addEventListener("mouseleave", function () {
      heroContent.style.transform = "translate(0, 0)";
    });
  }

  /* ---------- 11. 经典语录无缝滚动（复制节点实现） ---------- */
  var quotesTrack = document.getElementById("quotesTrack");
  if (quotesTrack) {
    var cards = quotesTrack.querySelectorAll(".quote-card");
    cards.forEach(function (card) {
      var clone = card.cloneNode(true);
      quotesTrack.appendChild(clone);
    });
  }

})();
