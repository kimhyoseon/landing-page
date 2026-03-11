(function(){
  'use strict';

  /* === 1. SCROLL PROGRESS === */
  var scrollEl = document.getElementById('scrollProgress');
  function updateProgress(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    scrollEl.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});

  /* === 2. HERO ANIMATION === */
  var hero = document.querySelector('.hero');
  function animateNumber(el, target, dur){
    var t0 = performance.now();
    (function tick(now){
      var p = Math.min((now - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if(p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  window.addEventListener('load', function(){
    setTimeout(function(){
      hero.classList.add('animated');
      var nums = hero.querySelectorAll('.hero__headline .num-accent');
      if(nums[0]){nums[0].style.opacity='1';nums[0].style.transform='translateY(0)';setTimeout(function(){animateNumber(nums[0],15,1200)},200)}
      if(nums[1]){nums[1].style.opacity='1';nums[1].style.transform='translateY(0)';setTimeout(function(){animateNumber(nums[1],5,1000)},650)}
      setTimeout(function(){
        hero.querySelectorAll('.btn-primary').forEach(function(b){b.classList.add('cta-pulse')});
      },2800);
    },150);
  });

  /* === 3. INTERSECTION OBSERVER === */
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}
    });
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.fade-up').forEach(function(el){obs.observe(el)});

  /* Pain cards: alternate slide */
  document.querySelectorAll('.pain__card').forEach(function(c,i){
    c.classList.remove('fade-up');c.classList.add(i%2===0?'slide-left':'slide-right');
    c.style.transitionDelay=(i*.15)+'s';obs.observe(c);
  });
  /* Skill cards stagger */
  document.querySelectorAll('.skill-card').forEach(function(c,i){c.style.transitionDelay=(i*.12)+'s'});
  /* Portfolio: scale-in */
  document.querySelectorAll('.portfolio-card').forEach(function(c,i){
    c.classList.remove('fade-up');c.classList.add('scale-in');c.style.transitionDelay=(i*.15)+'s';obs.observe(c);
  });
  /* Testimonials */
  document.querySelectorAll('.testimonial').forEach(function(t,i){
    t.classList.add(i%2===0?'slide-left':'slide-right');t.style.transitionDelay=(i*.12)+'s';obs.observe(t);
  });
  /* Specs */
  document.querySelectorAll('.spec').forEach(function(s,i){
    s.classList.add('scale-in');s.style.transitionDelay=(i*.08)+'s';obs.observe(s);
  });
  /* Reason cards */
  document.querySelectorAll('.reason-card').forEach(function(c,i){
    c.classList.remove('fade-up');c.classList.add(i%2===0?'slide-left':'slide-right');
    c.style.transitionDelay=(i*.12)+'s';obs.observe(c);
  });
  /* Checklist & seller */
  var cl=document.querySelector('.checklist');if(cl)obs.observe(cl);
  var sc=document.querySelector('.seller-card');if(sc)obs.observe(sc);
  /* Section reveals */
  document.querySelectorAll('.section').forEach(function(s){s.classList.add('section-reveal');obs.observe(s)});

  /* === 4. FAQ ACCORDION (Event Delegation + ARIA) === */
  var faqWrap = document.querySelector('#faq .mt-32');
  if(faqWrap){
    faqWrap.addEventListener('click', function(e){
      var btn = e.target.closest('.faq-q');
      if(!btn) return;
      var item = btn.parentElement;
      var isOpen = item.classList.contains('open');
      /* Close all */
      faqWrap.querySelectorAll('.faq-item').forEach(function(i){
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if(!isOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  }

  /* === 5. TIMELINE === */
  var tl=document.getElementById('timeline'),tlProg=document.getElementById('timelineProgress');
  var tlItems=tl?tl.querySelectorAll('.timeline__item'):[];
  if(tl&&tlItems.length){
    function updateTL(){
      var r=tl.getBoundingClientRect(),mid=window.innerHeight*.65;
      var p=Math.max(0,Math.min(1,(mid-r.top)/r.height));
      tlProg.style.height=(p*(r.height-16))+'px';
      tlItems.forEach(function(it,i){
        if(p>=(i+1)/tlItems.length*.85)it.classList.add('active');else it.classList.remove('active');
      });
    }
    new IntersectionObserver(function(e){if(e[0].isIntersecting)updateTL()},{threshold:.2}).observe(tl);
    window.addEventListener('scroll',function(){
      var r=tl.getBoundingClientRect();if(r.bottom>0&&r.top<window.innerHeight)updateTL();
    },{passive:true});
  }

  /* === 6. COUNTER ANIMATIONS === */
  function animateCounter(el,target,suffix,dur){
    var t0=performance.now();
    (function tick(now){
      var p=Math.min((now-t0)/dur,1);
      var e=p===1?1:1-Math.pow(2,-10*p);
      el.textContent=Math.round(target*e)+suffix;
      if(p<1)requestAnimationFrame(tick);
    })(performance.now());
  }
  var sBox=document.querySelector('.stats-box');
  if(sBox){
    var sAnim=false;
    new IntersectionObserver(function(e){
      if(e[0].isIntersecting&&!sAnim){
        sAnim=true;var vals=sBox.querySelectorAll('.stat__value');
        [{v:280,s:'%'},{v:50,s:'%'},{v:130,s:'%'}].forEach(function(t,i){
          if(vals[i])setTimeout(function(){animateCounter(vals[i],t.v,t.s,2000)},i*200);
        });
      }
    },{threshold:.4}).observe(sBox);
  }
  var sRes=document.querySelector('.savings-result');
  if(sRes){
    new IntersectionObserver(function(e){
      if(e[0].isIntersecting){sRes.classList.add('animated')}
    },{threshold:.5}).observe(sRes);
  }
  /* Metric counters */
  document.querySelectorAll('.metric__value').forEach(function(el){
    var done=false;
    new IntersectionObserver(function(e){
      if(e[0].isIntersecting&&!done){
        done=true;var txt=el.textContent.trim();
        var pm=txt.match(/^\+?(\d+)%$/),rm=txt.match(/^(\d+)위$/);
        if(pm){
          var tgt=parseInt(pm[1]),pfx=txt.startsWith('+')?'+':'';
          animateCounter(el,tgt,'%',1800);
          if(pfx){var iv=setInterval(function(){if(!el.textContent.startsWith(pfx))el.textContent=pfx+el.textContent;if(el.textContent===pfx+tgt+'%')clearInterval(iv)},50)}
        }else if(rm){animateCounter(el,parseInt(rm[1]),'위',1200)}
      }
    },{threshold:.5}).observe(el);
  });

  /* === 7. BUTTON RIPPLE === */
  document.addEventListener('click',function(e){
    var btn=e.target.closest('.btn');if(!btn)return;
    var old=btn.querySelector('.ripple');if(old)old.remove();
    var rip=document.createElement('span');rip.classList.add('ripple');
    var r=btn.getBoundingClientRect(),sz=Math.max(r.width,r.height);
    rip.style.width=rip.style.height=sz+'px';
    rip.style.left=(e.clientX-r.left-sz/2)+'px';
    rip.style.top=(e.clientY-r.top-sz/2)+'px';
    btn.appendChild(rip);setTimeout(function(){rip.remove()},600);
  });

  /* === 8. FINAL CTA PULSE === */
  var mainCta=document.getElementById('mainCta');
  if(mainCta){
    new IntersectionObserver(function(e){
      if(e[0].isIntersecting)setTimeout(function(){mainCta.classList.add('cta-pulse')},600);
      else mainCta.classList.remove('cta-pulse');
    },{threshold:.5}).observe(mainCta);
  }

  /* === 9. SMOOTH SCROLL === */
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]');if(!a)return;
    var t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });

  /* === 10. STICKY MOBILE CTA === */
  var sticky=document.getElementById('stickyCta');
  if(sticky&&window.innerWidth<1024){
    var heroBottom=0;
    function checkSticky(){
      heroBottom=hero.getBoundingClientRect().bottom;
      if(heroBottom<-100)sticky.classList.add('show');else sticky.classList.remove('show');
    }
    window.addEventListener('scroll',checkSticky,{passive:true});
    checkSticky();
  }

  /* === 11. SUBTLE PARALLAX === */
  var pSections=document.querySelectorAll('.section .section__inner');
  var prefersReduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!prefersReduced){
    window.addEventListener('scroll',function(){
      pSections.forEach(function(inner){
        var r=inner.getBoundingClientRect(),vh=window.innerHeight;
        if(r.top<vh&&r.bottom>0){
          var off=(r.top+r.height/2-vh/2)/vh;
          inner.style.transform='translateY('+(off*-12).toFixed(1)+'px)';
        }
      });
    },{passive:true});
  }

})();
