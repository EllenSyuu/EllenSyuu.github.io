import { css } from 'styled-components';

const variables = css`
  :root {
    /* Atelier theme — an engineer's drawing plate: blue-black ink and graphite on warm paper,
       with orange kept for autumn things and for the data that matters.
       Variable names are kept from v4 so every component keeps working:
       "navy" = paper, "slate" = ink, "green" = the warm accent. */
    --dark-navy: #eef1f4;
    --navy: #ffffff;
    --light-navy: #ffffff;
    --lightest-navy: #e2e6eb;
    --navy-shadow: rgba(20, 33, 58, 0.14);
    --dark-slate: #66708a;
    --slate: #3f4c66;
    --light-slate: #2a3856;
    --lightest-slate: #14213a;
    --white: #14213a;
    --green: #c8431f;
    --green-tint: rgba(200, 67, 31, 0.08);
    --photo-tint: #eef1f4;
    --amber: #e0ad4a;
    --gold: #e0ad4a;
    --maple: #c8431f;
    --cranberry: #a3432a;
    --sage: #7c8a5c;
    --coffee: #14213a;
    --pink: #b4318c;
    --blue: #1d6fb8;
    --ink: #14213a;
    --graphite: #6f7b8c;
    --faint: #b4bcc7;
    --hairline: rgba(20, 33, 58, 0.28);

    /* Type: Cormorant Garamond (display, labels in small caps) · Inter (text) ·
       La Belle Aurore (hand-lettered notes) · JetBrains Mono (code only).
       All open-licensed and self-hosted via Fontsource. CJK falls back to system fonts. */
    --font-serif: 'Bodoni Moda Variable', 'Cormorant Garamond', Didot, 'Times New Roman', 'Songti SC', serif;
    --font-display: var(--font-serif);
    --font-hand: var(--font-sans);
    --font-sans: 'Inter Variable', 'Inter Fallback', 'Inter', -apple-system, system-ui, 'PingFang SC',
      'Hiragino Sans', 'Microsoft YaHei', sans-serif;
    --font-mono: var(--font-sans);
    --font-code: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 17px;
    --fz-xl: 18px;
    --fz-xxl: 23px;
    --fz-heading: 46px;

    --border-radius: 2px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.4s cubic-bezier(0.22, 0.8, 0.3, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
