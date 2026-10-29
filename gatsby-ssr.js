import React from 'react';
import Serif500 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2';
import Serif600 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2';
import Serif500i from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2';
import Hand400 from '@fontsource/la-belle-aurore/files/la-belle-aurore-latin-400-normal.woff2';
import Inter from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';

// Preload the fonts the cover uses, so text does not reflow when they arrive.
export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: 'en' });
  setHeadComponents(
    [Serif500, Serif600, Serif500i, Hand400, Inter].map(href => (
      <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
    )),
  );
};
