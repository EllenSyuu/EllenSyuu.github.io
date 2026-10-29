import { css } from 'styled-components';

const variables = css`
  :root {
    /* Atelier theme — an engineer's drawing plate: blue-black ink and graphite on warm paper,
       with orange kept for autumn things and for the data that matters.
       Variable names are kept from v4 so every component keeps working:
       "navy" = paper, "slate" = ink, "green" = the warm accent. */
    --dark-navy: #eee7d9;
    --navy: #f6f1e6;
    --light-navy: #fbf8f1;
    --lightest-navy: #ddd5c5;
    --navy-shadow: rgba(34, 49, 74, 0.14);
    --dark-slate: #626d7d;
    --slate: #46526a;
    --light-slate: #34425a;
    --lightest-slate: #22314a;
    --white: #22314a;
    --green: #a84a26;
    --green-tint: rgba(207, 96, 43, 0.08);
    --photo-tint: #ece4d4;
    --amber: #e0a046;
    --gold: #e0a046;
    --maple: #cf602b;
    --cranberry: #a3432a;
    --sage: #7c8a5c;
    --coffee: #22314a;
    --pink: #b4318c;
    --blue: #1d6fb8;
    --ink: #22314a;
    --graphite: #6f7b8c;
    --faint: #b4bcc7;
    --hairline: rgba(34, 49, 74, 0.28);

    /* Type: Cormorant Garamond (display, labels in small caps) · Inter (text) ·
       La Belle Aurore (hand-lettered notes) · JetBrains Mono (code only).
       All open-licensed and self-hosted via Fontsource. CJK falls back to system fonts. */
    --font-serif: 'Cormorant Garamond', Garamond, 'Times New Roman', 'Songti SC', serif;
    --font-display: var(--font-serif);
    --font-hand: 'La Belle Aurore', 'Segoe Script', cursive;
    --font-sans: 'Inter Variable', 'Inter Fallback', 'Inter', -apple-system, system-ui, 'PingFang SC',
      'Hiragino Sans', 'Microsoft YaHei', sans-serif;
    --font-mono: var(--font-serif);
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
