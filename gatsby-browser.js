// Fonts: self-hosted, open-licensed (Fontsource), latin subsets. Declared here as plain CSS so
// the @font-face rules ship in the page head once and are not re-injected on hydration
// (which made the cover reflow on phones). A metric fallback for Inter is in styles/fonts.js.
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/cormorant-garamond/latin-600-italic.css';
import '@fontsource/la-belle-aurore/latin-400.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/inter/wght-italic.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';

// A reload should open on the cover, not wherever the page was last scrolled to.
// Links to a section (/#projects) still land on that section.
export const onClientEntry = () => {
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
};

export const onInitialClientRender = () => {
  if (typeof window !== 'undefined' && !window.location.hash) {
    window.scrollTo(0, 0);
  }
};
