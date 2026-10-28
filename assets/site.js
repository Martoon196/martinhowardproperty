(function(){
  function ready(fn){ if(document.readyState!=='loading'){fn()} else {document.addEventListener('DOMContentLoaded',fn)} }
  ready(function(){
    var cfg = window.MHP || {};
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
