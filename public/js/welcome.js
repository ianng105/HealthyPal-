 // 基础参数
    const track = document.getElementById('track');
    const slides = Array.from(track.children);
    const dotsWrap = document.getElementById('dots');
    

    // 生成指示点
    slides.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.dataset.index = i;
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    // 定位到指定索引
    function goTo(index) {
      const el = slides[Math.max(0, Math.min(index, slides.length - 1))];
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setTimeout(updateDots, 250);
      restartAuto();
    }

    // 根据视口中心更新指示点
    function updateDots() {
      const mid = window.innerWidth / 2;
      let idx = 0, best = 1e9;
      slides.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const c = (r.left + r.right) / 2;
        const d = Math.abs(c - mid);
        if (d < best) { best = d; idx = i; }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      current = idx;
    }

    let current = 0;

    // 自动播放（可关）
    let timer = null;
    const interval = 2000; // 5s
    function startAuto(){
      if (timer) return;
      timer = setInterval(() => {
        const next = (current + 1) % slides.length;
        goTo(next);
      }, interval);
    }
    function stopAuto(){ clearInterval(timer); timer = null; }
    function restartAuto(){ stopAuto(); startAuto(); }
    // 鼠标/触控交互时暂停，结束后继续
    track.addEventListener('pointerdown', stopAuto, { passive: true });
    track.addEventListener('pointerup', startAuto, { passive: true });
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopAuto() : startAuto();
    });
    startAuto();
