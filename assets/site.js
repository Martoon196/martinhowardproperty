(function(){
  function ready(fn){ if(document.readyState!=='loading'){fn()} else {document.addEventListener('DOMContentLoaded',fn)} }
  ready(function(){
    var cfg = window.MHP || {};
    // ---- level (from /start/) carried into every form
    var level = '';
    try { level = localStorage.getItem('mhp_level') || ''; } catch (e) {}
    document.querySelectorAll('form[data-mhp-form]').forEach(function(form){
      if (!form.querySelector('input[name="LEVEL"]')) {
        var h = document.createElement('input'); h.type = 'hidden'; h.name = 'LEVEL'; h.value = level; form.appendChild(h);
      }
    });
    // ---- levels quiz
    var quiz = document.getElementById('level-quiz');
    if (quiz) {
      var LEVELS = [
        { key: 'L1', title: 'Level 1: starting from the beginning', text: 'You are where most people start, and the course now starts there too. Module 0 teaches the words, how a purchase really happens, mortgages and deposits from zero, and what a deal is, before anything clever. Read the One Lane Picker first; it is written for you.', sheet: ['The One Lane Picker (free)', '/cheat-sheets/01/'], next: ['Save a seat at the free webinar', '/webinar/'] },
        { key: 'L2', title: 'Level 2: one property, or one deal, done properly', text: 'You know the words and you have done something real. The course starts you at Module 2 (funding) and Module 5 (the money-out test) so your second move is better than your first. The Deal Desk is the fastest way to get a verdict on the deal in your head.', sheet: ['The BRRR Money-Out Test (free)', '/cheat-sheets/05/'], next: ['See the Deal Desk, £47', '/join/'] },
        { key: 'L3', title: 'Level 3: building a system', text: 'You are past the first deal and the question is scale, structure and compliance. The course starts you at Module 8 (running it as a business) and Module 9 (doing it properly), with Modules 11 to 16 as your lanes. The Members Room and mentoring are where your questions get answered live.', sheet: ['The Property Compliance Checklist (free)', '/cheat-sheets/09/'], next: ['The course, the Room and mentoring', '/join/'] }
      ];
      quiz.addEventListener('submit', function(e){
        e.preventDefault();
        var total = 0, n = 0;
        new FormData(quiz).forEach(function(v){ total += parseInt(v, 10) || 0; n++; });
        var avg = total / Math.max(n, 1);
        var L = avg < 1.0 ? LEVELS[0] : (avg < 2.1 ? LEVELS[1] : LEVELS[2]);
        try { localStorage.setItem('mhp_level', L.key); } catch (err) {}
        var r = document.getElementById('level-result');
        r.querySelector('[data-level-title]').textContent = L.title;
        r.querySelector('[data-level-text]').textContent = L.text;
        var a = r.querySelector('[data-level-sheet]'); a.textContent = L.sheet[0]; a.href = L.sheet[1];
        var b = r.querySelector('[data-level-next]'); b.textContent = L.next[0]; b.href = L.next[1];
        r.hidden = false; r.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('input[name="LEVEL"]').forEach(function(i){ i.value = L.key; });
      });
    }
    // ---- testimonial form: POST to an endpoint when configured, otherwise open a pre-filled email
    var story = document.querySelector('form[data-mhp-story]');
    if (story) {
      if (cfg.storyFormAction) { story.action = cfg.storyFormAction; story.method = 'POST'; }
      else {
        story.addEventListener('submit', function(e){
          e.preventDefault();
          var fd = new FormData(story), lines = [];
          fd.forEach(function(v, k){ if (k !== 'FORM' && k !== 'CONSENT') lines.push(k.replace(/_/g, ' ') + ': ' + v); });
          lines.push('CONSENT: given on ' + new Date().toISOString().slice(0,10) + ' via martinhowardproperty.co.uk/stories/share/');
          var subject = 'Member story: ' + (fd.get('NAME') || '') + ', ' + (fd.get('TOWN') || '');
          var href = 'mailto:' + (cfg.storyEmail || '') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join(String.fromCharCode(10)));
          var s = story.querySelector('[role="status"]');
          if (s) s.textContent = 'Opening your email app with your answers filled in. Press send and it is with Martin. If nothing opens, email martin@propinvestuk.co.uk with the same answers.';
          window.location.href = href;
        });
      }
    }
    var live = document.getElementById('mhp-live');
    if (live) {
      if (cfg.zoomJoinUrl) {
        live.querySelector('[data-join]').href = cfg.zoomJoinUrl;
        live.querySelector('[data-state]').textContent = 'Opening Zoom. If nothing happens, press the button.';
        setTimeout(function(){ window.location.href = cfg.zoomJoinUrl; }, 1500);
      } else {
        live.querySelector('[data-state]').textContent = 'The Zoom link goes live on the day. Check the email you registered with, or register below.';
        live.querySelector('[data-join]').style.display = 'none';
      }
    }
    document.querySelectorAll('[data-window-ends]').forEach(function(el){ el.textContent = cfg.windowEnds ? ('The current window ends on ' + cfg.windowEnds + '.') : ''; });
    document.querySelectorAll('[data-founders-count]').forEach(function(el){ el.textContent = String(cfg.foundersTaken || 0); });
    document.querySelectorAll('[data-cohort-date]').forEach(function(el){ if (cfg.cohortDate) el.textContent = cfg.cohortDate; });
    var rep = document.getElementById('mhp-replay');
    if (rep) {
      if (cfg.replayUrl) {
        var isEmbed = /youtube[.]com[/]embed|player[.]vimeo[.]com/.test(cfg.replayUrl);
        if (isEmbed) {
          var f = document.createElement('iframe'); f.src = cfg.replayUrl; f.title = 'Webinar replay'; f.allow = 'fullscreen'; f.setAttribute('allowfullscreen',''); f.style.cssText='width:100%;aspect-ratio:16/9;border:0;border-radius:12px;background:#142019';
          rep.querySelector('[data-player]').replaceWith(f);
        } else {
          var a = rep.querySelector('[data-open]'); a.href = cfg.replayUrl; a.style.display='inline-flex';
          if (cfg.replayPasscode) rep.querySelector('[data-passcode]').textContent = 'Passcode: ' + cfg.replayPasscode;
        }
        rep.querySelector('[data-state]').textContent = '';
      } else {
        rep.querySelector('[data-state]').textContent = 'The replay goes up the morning after the webinar (Thursday 5 November). Register below and it comes to your inbox.';
      }
    }
    document.querySelectorAll('form[data-mhp-form]').forEach(function(form){
      if (cfg.brevoFormAction) {
        form.action = cfg.brevoFormAction;
        form.method = 'POST';
      } else {
        form.addEventListener('submit', function(e){
          e.preventDefault();
          var s = form.parentElement.querySelector('[role="status"]');
          if (s) s.textContent = 'Sign-up opens shortly. Email martin@propinvestuk.co.uk with the sheet name and it will be sent by hand.';
        });
      }
    });
  });
})();
