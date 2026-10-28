(function(){
  function ready(fn){ if(document.readyState!=='loading'){fn()} else {document.addEventListener('DOMContentLoaded',fn)} }
  ready(function(){
    var cfg = window.MHP || {};
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
