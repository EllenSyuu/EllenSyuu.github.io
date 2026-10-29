import { css } from 'styled-components';

const button = css`
  color: var(--ink);
  background-color: transparent;
  border: 0.75px solid var(--ink);
  border-radius: 0;
  font-size: 13px;
  font-family: var(--font-serif);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  line-height: 1;
  text-decoration: none;
  padding: 1.1rem 1.6rem 1rem;
  transition: var(--transition);

  &:hover,
  &:focus-visible {
    outline: none;
    background-color: var(--ink);
    color: var(--navy);
  }
  &:after {
    display: none !important;
  }
`;

const mixins = {
  flexCenter: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  flexBetween: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  link: css`
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: inherit;
    position: relative;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--green);
      outline: 0;
    }
  `,

  inlineLink: css`
    display: inline-block;
    position: relative;
    color: var(--green);
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--green);
      outline: 0;
      &:after {
        width: 100%;
      }
      & > * {
        color: var(--green) !important;
        transition: var(--transition);
      }
    }
    &:after {
      content: '';
      display: block;
      width: 0;
      height: 1px;
      position: relative;
      bottom: 0.37em;
      background-color: var(--green);
      opacity: 0.5;
      @media (prefers-reduced-motion: no-preference) {
        transition: var(--transition);
      }
    }
  `,

  button,

  smallButton: css`
    color: var(--ink);
    background-color: transparent;
    border: 0.75px solid var(--ink);
    border-radius: 0;
    padding: 0.7rem 1rem 0.62rem;
    font-size: 12px;
    font-family: var(--font-serif);
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    line-height: 1;
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      outline: none;
      background-color: var(--ink);
      color: var(--navy);
    }
    &:after {
      display: none !important;
    }
  `,

  bigButton: css`
    color: var(--ink);
    background-color: transparent;
    border: 0.75px solid var(--ink);
    border-radius: 0;
    padding: 1.15rem 1.8rem 1.05rem;
    font-size: 13.5px;
    font-family: var(--font-serif);
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    line-height: 1;
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      outline: none;
      background-color: var(--ink);
      color: var(--navy);
    }
    &:after {
      display: none !important;
    }
  `,

  boxShadow: css`
    box-shadow: 0 0 0 0.75px var(--hairline), 0 18px 36px -28px var(--navy-shadow);
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      box-shadow: 0 0 0 0.75px var(--ink), 0 22px 40px -28px var(--navy-shadow);
    }
  `,

  fancyList: css`
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: var(--fz-lg);
    li {
      position: relative;
      padding-left: 30px;
      margin-bottom: 10px;
      &:before {
        content: '—';
        position: absolute;
        left: 0;
        color: var(--green);
      }
    }
  `,

  resetList: css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
};

export default mixins;
