import React from 'react';

// Monogram: an engraved double ring with an italic serif "E", like a seal on a drawing plate.
const IconLogo = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 84 96">
    <title>Logo</title>
    <circle cx="42" cy="48" r="38" fill="#f6f1e6" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="42" cy="48" r="32.5" fill="none" stroke="currentColor" strokeWidth="0.7" />
    <text
      x="42.5"
      y="62"
      textAnchor="middle"
      fontFamily="'Cormorant Garamond', Garamond, Georgia, serif"
      fontSize="44"
      fontStyle="italic"
      fontWeight="500"
      fill="currentColor">
      E
    </text>
    <circle cx="61" cy="60" r="2.4" fill="#cf602b" />
  </svg>
);

export default IconLogo;
