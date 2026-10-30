(function(){
  function ready(fn){ if(document.readyState!=='loading'){fn()} else {document.addEventListener('DOMContentLoaded',fn)} }
  var cfg = window.MHP || {};
  function beacon(name){
    if (!cfg.eventEndpoint) return;
    try {
      var body = 'e=' + encodeURIComponent(name) + '&p=' + encodeURIComponent(location.pathname.slice(0,120));
      if (navigator.sendBeacon) navigator.sendBeacon(cfg.eventEndpoint, new Blob([body], {type:'text/plain'}));
      else fetch(cfg.eventEndpoint, {method:'POST', body: body, mode:'no-cors', keepalive:true, headers:{'content-type':'text/plain'}});
    } catch (e) {}
  }
  function store(k, v){ try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  ready(function(){
    var ev = document.querySelector('[data-mhp-event]');
    if (ev) beacon(ev.getAttribute('data-mhp-event'));

    // ---- webinar registration: marketing box is optional once the app accepts it
    var wf = document.querySelector('form[data-webinar-form]');
    if (wf && !cfg.webinarConsentOptional) {
      var box = wf.querySelector('#w-consent'); box.required = true;
      wf.querySelector('[data-consent-label]').textContent = 'Send me the webinar link, the replay and occasional property tips from Martin. Unsubscribe any time.';
      wf.querySelector('[data-consent-note]').innerHTML = 'No card details. See the <a href="/privacy/">privacy policy</a>.';
    }

    // ---- application received: booking link
    var bk = document.querySelector('[data-booking]');
    if (bk && cfg.bookingUrl) {
      bk.innerHTML = '<a class="w-btn" style="align-self:flex-start" href="' + esc(cfg.bookingUrl) + '">Book your 20-minute call</a><p class="w-p">A confirmation email with the same link is on its way.</p>';
    }

    // ---- application form
    var af = document.querySelector('form[data-apply-form]');
    if (af) {
      var qs = new URLSearchParams(location.search);
      var src = qs.get('src'); if (['live','replay','site','email'].indexOf(src) >= 0) af.SOURCE.value = src;
      var door = qs.get('door') || store('mhp_door');
      if (door && ['Refer','Source','Run','Own','Not sure yet'].indexOf(door) >= 0) af.DOOR.value = door;
      var started = false;
      af.addEventListener('focusin', function(){ if (!started) { started = true; beacon('application_started'); } });
      if (cfg.applyAction) { af.action = cfg.applyAction; af.method = 'POST'; }
      else {
        af.addEventListener('submit', function(e){
          e.preventDefault();
          if (af.email_address_check.value) return;
          var lines = []; new FormData(af).forEach(function(v, k){ if (k !== 'email_address_check') lines.push(k + ': ' + v); });
          location.href = 'mailto:martin@propinvestuk.co.uk?subject=' + encodeURIComponent('Mentoring application: ' + af.NAME.value) + '&body=' + encodeURIComponent(lines.join('\n'));
          af.querySelector('[role="status"]').textContent = 'Your email app should open with your answers filled in. Press send and you will hear back within one working day.';
        });
      }
    }

    // ---- First Door Diagnostic
    var df = document.getElementById('d-form');
    if (df) {
      var total = df.querySelectorAll('fieldset').length, began = false;
      df.addEventListener('change', function(){
        if (!began) { began = true; beacon('diagnostic_started'); }
        var done = 0; df.querySelectorAll('fieldset').forEach(function(f){ if (f.querySelector('input:checked')) done++; });
        document.getElementById('d-prog').style.width = (100 * done / total) + '%';
      });
      var DOORS = {
        Refer: { why: 'Referring needs the least money and time, and it teaches you the market while you build trust.',
          req: ['A few hours a week and people who already trust you', 'Telling everyone when you are paid, every time', 'Knowing the line: introducing buyers and sellers of property is estate agency work, which brings its own rules'],
          risk: ['Fees start small and depend on your network', 'Your reputation is the asset: one bad introduction costs more than the fee'],
          d2: 'Read the Refer rules: fee disclosure, and where estate agency work begins.', d3: 'List the services your contacts actually need and who you would trust to provide them.', d6: 'Have one real conversation with someone who might need one of those services.' },
        Source: { why: 'Sourcing suits people who like finding and analysing deals, and have the hours and set-up money for it.',
          req: ['Roughly 10 to 15 hours a week once running, and the phone', 'HMRC anti-money-laundering supervision, a redress scheme, the ICO fee, insurance and written terms, before the first conversation that could lead to a fee', 'Roughly £2,000 to £5,000 of set-up costs (example figures)'],
          risk: ['Long gaps with no fee', 'Skipping the registrations is a real legal risk', 'Inviting people to invest money in deals is a financial promotion with its own rules'],
          d2: 'Read the sourcing compliance stack and price it for yourself.', d3: 'Pick one postcode area and learn its prices and rents.', d6: 'Complete one deal sheet on a real listing. Practice only: no fee conversations until the registrations are done.' },
        Run: { why: 'Running property suits people who like operations and people, and can carry monthly costs while income settles.',
          req: ['10 to 20 hours a week, and answering the phone at 9pm', 'Working capital, roughly £5,000 to £15,000 (example figures)', 'In Wales, Rent Smart Wales training and a licence; owner and lender consent in writing; HMO licensing where it applies'],
          risk: ['Costs are monthly and certain; income is monthly and not', 'Agreements without owner or lender consent can unravel'],
          d2: 'Read the licensing and consent rules for your area (Rent Smart Wales in Wales).', d3: 'Cost one month of running a property, including voids and repairs.', d6: 'Talk to one licensed letting agent or landlord about how they run their properties.' },
        Own: { why: 'Owning suits people with real capital who want long-term assets and can stand values falling for a while.',
          req: ['A deposit, buying costs and a reserve, not borrowed', 'A mortgage stress test, and Land Transaction Tax higher rates in Wales (from 5%)', 'Independent advice from a broker, solicitor and accountant'],
          risk: ['Values can fall and rates can rise', 'Refurbishments overrun; refinances can come in lower than planned'],
          d2: 'Read how buy-to-let lending and stress tests work.', d3: 'Work out your true deposit: cash minus costs, tax and a reserve.', d6: 'Speak to an independent mortgage broker about what lenders would look at.' }
      };
      df.addEventListener('submit', function(e){
        e.preventDefault();
        var a = {}; new FormData(df).forEach(function(v, k){ a[k] = v; });
        var missing = df.querySelectorAll('fieldset').length - Object.keys(a).length;
        if (missing > 0) { document.getElementById('d-err').textContent = 'Please answer every question (' + missing + ' left).'; return; }
        document.getElementById('d-err').textContent = '';
        var cashN = {'0':0,'2':1,'5':2,'25':3,'big':4}[a.cash], hrsN = {'u5':0,'5':1,'10':2,'15':3}[a.hours];
        var ok = { Refer: true, Source: cashN >= 2 && hrsN >= 1 && a.comp !== 'no', Run: cashN >= 3 && hrsN >= 2 && a.comp !== 'no', Own: cashN >= 4 };
        var want = {intro:'Refer', analysis:'Source', ops:'Run', dev:'Own'}[a.pref];
        if (a.goal === 'asset' && a.pref === 'dev') want = 'Own';
        var notReady = a.comp === 'no' || (cashN === 0 && hrsN === 0);
        var door = ok[want] ? want : (ok.Source && want !== 'Refer' ? 'Source' : 'Refer');
        var gap = '';
        if (!ok[want] && want !== door) {
          var need = { Source: 'set-up money of around £2,000 or more, at least 5 to 10 hours a week and the compliance work', Run: 'working capital of £5,000 or more, at least 10 hours a week and the licensing work', Own: 'more than £25,000 of your own money, not borrowed' }[want];
          gap = 'You leaned towards ' + want + ', which needs ' + need + '. ' + door + ' is a sensible place to start while that changes.';
        }
        var html = '';
        if (notReady) {
          store('mhp_door', 'Not sure yet');
          html = '<p class="w-eyebrow">YOUR RESULT</p><h2 class="w-h2">Not ready yet, and that is a useful answer</h2>' +
            '<p class="w-p">' + (a.comp === 'no' ? 'Every door has rules: registrations, licences, insurance or written terms. Without the appetite for that part, any route is likely to cost you more than it pays.' : 'With no spare money and under five hours a week, the honest first step is to make some room before starting anything.') + ' That has probably just saved you money.</p>' +
            '<h3 class="w-h3">Your next seven days</h3><ol class="w-ul"><li>Write down what you spent on your last three ideas.</li><li>Decide what would need to change to free five hours a week.</li><li>Start a small buffer that is not your emergency fund.</li><li>Read the free One Lane Picker.</li><li>Watch the replay of the masterclass again with a pen.</li><li>Park every new idea on a later list.</li><li>Come back to this check in 90 days.</li></ol>' +
            '<div class="noprint" style="display:flex;flex-wrap:wrap;gap:12px"><a class="w-btn2" href="/cheat-sheets/01/">The One Lane Picker (free)</a><button type="button" class="w-btn2" onclick="window.print()">Print or save as PDF</button></div>';
        } else {
          var d = DOORS[door]; store('mhp_door', door);
          var prog = a.prog === 'income' ? '<p class="w-p" style="background:#FBEBD3;padding:12px 14px;border-radius:8px"><strong>About first income in 90 days.</strong> It can happen, but nobody honest can promise it. Measure the 90 days in actions you control; money is a lagging number.</p>' : '';
          var stopTip = {ideas:'You said too many ideas stopped you before: park every new idea on a written later list for 90 days.', research:'You said too much research stopped you: set a date after which you stop reading and act.', conf:'You said confidence stopped you: script your first calls and count small, safe reps.', time:'You said time stopped you: put the hours in your calendar as fixed appointments.', money:'You said money stopped you: this door was picked to fit the money you could responsibly use.'}[a.stop];
          html = '<p class="w-eyebrow">YOUR SUGGESTED FIRST DOOR</p><h2 class="w-h2">Door to investigate: ' + door + '</h2>' +
            '<p class="w-p">' + d.why + ' ' + gap + '</p>' + prog +
            '<div class="w-grid"><div class="w-card"><h3 class="w-h3">What it needs</h3><ul class="w-ul" style="font-size:15px">' + d.req.map(function(x){return '<li>'+x+'</li>';}).join('') + '</ul></div>' +
            '<div class="w-card"><h3 class="w-h3">The risks</h3><ul class="w-ul" style="font-size:15px">' + d.risk.map(function(x){return '<li>'+x+'</li>';}).join('') + '</ul></div></div>' +
            '<h3 class="w-h3">Your first week</h3><ol class="w-ul"><li><strong>Day 1.</strong> Save or print this result.</li><li><strong>Day 2.</strong> ' + d.d2 + '</li><li><strong>Day 3.</strong> ' + d.d3 + '</li><li><strong>Day 4.</strong> Write a one-page 90-day plan for this door.</li><li><strong>Day 5.</strong> Set up a weekly scorecard: hours, conversations, appraisals, set-up items, money out.</li><li><strong>Day 6.</strong> ' + d.d6 + '</li><li><strong>Day 7.</strong> Review the week and pick next week\'s one action.</li></ol>' +
            '<p class="w-p">' + stopTip + '</p>' +
            '<div class="noprint" style="display:flex;flex-direction:column;gap:12px;background:#142019;color:#F3F4F1;border-radius:12px;padding:22px"><h3 class="w-h3">Want guidance on this?</h3><p style="margin:0;color:#B9C2BC;font-size:15px;line-height:1.55">One Lane Mentoring is a 12-person, 90-day group programme. Founding applications close on Saturday 7 November 2026 at 11:59pm GMT. Applying books a free 20-minute call; it is not a purchase.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a class="w-btn" href="/webinar/apply/?door=' + encodeURIComponent(door) + '">Apply for a founding place</a><button type="button" class="w-btn2" style="border-color:#F3F4F1;color:#F3F4F1" onclick="window.print()">Print or save as PDF</button></div></div>';
        }
        html += '<p class="mhp-note">A starting point to investigate, not advice, and not confirmation that you are legally ready to do regulated work. Example figures for South Wales in 2026. Property Predator is Martin\'s own platform; KPUK, Ordris and Hello New Home are partners.</p>' +
          '<button type="button" class="w-btn2 noprint" style="align-self:flex-start" id="d-again">Change my answers</button>';
        var r = document.getElementById('d-result'); r.innerHTML = html; r.hidden = false; df.hidden = true; r.focus(); r.scrollIntoView({behavior:'smooth'});
        document.getElementById('d-again').addEventListener('click', function(){ r.hidden = true; df.hidden = false; df.scrollIntoView(); });
        beacon('diagnostic_completed');
      });
    }
  });
})();
