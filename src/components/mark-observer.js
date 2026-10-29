import { useEffect } from 'react';

/*
 * Sweeps the watercolour highlighter (.mark, see GlobalStyle) in behind subtitles as they
 * scroll into view. Runs on every device; marks added later (another job tab, "show more")
 * are picked up too. With reduced motion or no IntersectionObserver they are simply shown.
 */
const useMarks = deps => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supported = 'IntersectionObserver' in window && 'MutationObserver' in window;
    const showAll = () => document.querySelectorAll('.mark:not(.is-marked), .mark-trigger:not(.is-marked)').forEach(m => m.classList.add('is-marked'));
    if (reduced || !supported) {
      showAll();
      return undefined;
    }
    const onSeen = entries =>
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-marked');
          entry.target.dataset.watched = 'done';
        }
      });
    // Short titles wait until fully in view; tall figures start once a slice shows.
    const ioMark = new IntersectionObserver(onSeen, { threshold: 1, rootMargin: '0px 0px -15% 0px' });
    const ioFig = new IntersectionObserver(onSeen, { threshold: 0.12 });
    const io = {
      observe: el => (el.classList.contains('mark-trigger') ? ioFig : ioMark).observe(el),
      disconnect: () => {
        ioMark.disconnect();
        ioFig.disconnect();
      },
    };
    const watched = new WeakSet();
    const scan = () =>
      document.querySelectorAll('.mark:not(.is-marked), .mark-trigger:not(.is-marked)').forEach(m => {
        if (!watched.has(m)) {
          watched.add(m);
          io.observe(m);
        }
      });
    scan();
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (!pending) pending = requestAnimationFrame(() => {
        pending = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(pending);
    };
  }, deps);
};

export default useMarks;
