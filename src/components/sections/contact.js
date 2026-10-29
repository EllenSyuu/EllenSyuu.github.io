import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig, formAccessKey } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

/*
 * Contact: a short note form. Messages go to Ellen's inbox through Web3Forms
 * (https://web3forms.com) — a static site cannot send email itself. The access key in
 * config.js is public by design and does not reveal the address.
 */

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 8px;
    color: var(--lightest-slate);
    font-family: var(--font-serif);
    font-size: clamp(34px, 5vw, 46px);
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;

    &:before {
      bottom: 0;
    }

    &:after {
      display: none;
    }
  }

  .note {
    margin: 0 auto 30px;
    max-width: 440px;
    color: var(--slate);
    font-family: var(--font-serif);
    font-size: clamp(20px, 2.4vw, 23px);
    font-style: italic;
  }
`;

const StyledForm = styled.form`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 28px;
  padding: 40px 38px 30px;
  background: var(--light-navy);
  box-shadow: 0 0 0 0.75px var(--ink), 0 24px 44px -34px var(--navy-shadow);
  outline: 0.75px solid var(--hairline);
  outline-offset: -8px;
  text-align: left;

  .stamp {
    position: absolute;
    top: -22px;
    right: 26px;
    width: 64px;
    height: 76px;
    transform: rotate(4deg);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--dark-slate);
    font-family: var(--font-serif);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .full {
    grid-column: 1 / -1;
  }

  input,
  textarea {
    width: 100%;
    padding: 8px 2px 6px;
    border: 0;
    border-bottom: 0.75px solid var(--ink);
    border-radius: 0;
    background: transparent;
    color: var(--lightest-slate);
    font-family: var(--font-sans);
    font-size: var(--fz-md);
    text-transform: none;
    letter-spacing: normal;
    transition: var(--transition);

    &::placeholder {
      color: var(--dark-slate);
      font-family: var(--font-hand);
      font-size: 17px;
      opacity: 0.75;
    }

    &:focus {
      outline: none;
      border-color: var(--green);
      box-shadow: 0 1px 0 0 var(--maple);
    }
  }

  textarea {
    min-height: 132px;
    resize: vertical;
    line-height: 32px;
    background-image: repeating-linear-gradient(transparent 0 31px, var(--hairline) 31px 32px);
    border-bottom: 0;
  }

  .hp {
    position: absolute;
    left: -9999px;
  }

  .actions {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .status {
    margin: 0;
    color: var(--slate);
    font-size: var(--fz-sm);
  }

  .status.error {
    color: var(--cranberry);
  }

  button {
    ${({ theme }) => theme.mixins.button};
    margin-left: auto;

    &:disabled {
      opacity: 0.6;
      cursor: wait;
    }
  }
`;

const StyledThanks = styled.div`
  padding: 38px 30px;
  background: var(--light-navy);
  box-shadow: 0 0 0 0.75px var(--ink);
  outline: 0.75px solid var(--hairline);
  outline-offset: -8px;

  .sig {
    margin-top: 10px;
    color: var(--green);
    font-family: var(--font-hand);
    font-size: 22px;
  }

  h3 {
    margin: 0 0 6px;
    font-size: clamp(22px, 3vw, 28px);
  }

  p {
    margin: 0;
    color: var(--slate);
  }
`;

// A small postage stamp: perforated edge, a maple in warm watercolour, drawn in ink.
const MAPLE =
  'M0 -1 L.14 -.6 L.34 -.74 L.3 -.42 L.64 -.5 L.54 -.28 L.96 -.12 L.64 .06 L.74 .3 L.4 .22 L.34 .46 L.08 .32 L.04 .98 L-.04 .98 L-.08 .32 L-.34 .46 L-.4 .22 L-.74 .3 L-.64 .06 L-.96 -.12 L-.54 -.28 L-.64 -.5 L-.3 -.42 L-.34 -.74 L-.14 -.6 Z';
const Stamp = () => (
  <svg className="stamp" viewBox="0 0 64 76" aria-hidden="true">
    <defs>
      <mask id="perf">
        <rect width="64" height="76" fill="#fff" />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} fill="#000">
            <circle cx={4 + i * 7} cy="0" r="2.4" />
            <circle cx={4 + i * 7} cy="76" r="2.4" />
          </g>
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <g key={`v${i}`} fill="#000">
            <circle cx="0" cy={4 + i * 7} r="2.4" />
            <circle cx="64" cy={4 + i * 7} r="2.4" />
          </g>
        ))}
      </mask>
    </defs>
    <rect width="64" height="76" fill="#fbf8f1" mask="url(#perf)" style={{ filter: 'drop-shadow(0 2px 3px rgba(34,49,74,.18))' }} />
    <rect x="7" y="7" width="50" height="62" fill="none" stroke="#22314a" strokeWidth="0.6" />
    <path d={MAPLE} transform="translate(32 34) scale(15)" fill="#cf602b" opacity="0.7" />
    <path d={MAPLE} transform="translate(32 34) scale(15)" fill="none" stroke="#22314a" strokeWidth="0.05" />
    <text x="32" y="63" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="7" fontWeight="600" letterSpacing="1.2" fill="#22314a">
      MONTRÉAL
    </text>
  </svg>
);

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  const onSubmit = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return;
    if (!formAccessKey) {
      setState('error');
      setError('The form isn’t connected yet — please try again soon.');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: formAccessKey,
          subject: `New message from ${data.name} via ellensyuu.github.io`,
          from_name: 'Personal website',
          replyto: data.email,
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Something went wrong.');
      form.reset();
      setState('sent');
    } catch (err) {
      setState('error');
      setError('Sorry — that didn’t go through. Please try again in a moment.');
    }
  };

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">Contact</h2>

      <p className="note">Leave me a note — it comes straight to my inbox.</p>

      {state === 'sent' ? (
        <StyledThanks role="status">
          <h3>Thank you.</h3>
          <p>Your message is on its way. I’ll write back soon.</p>
          <p className="sig">— Ellen</p>
        </StyledThanks>
      ) : (
        <StyledForm onSubmit={onSubmit}>
          <Stamp />
          <label>
            Name
            <input name="name" type="text" autoComplete="name" required placeholder="Your name" />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </label>
          <label className="full">
            Message
            <textarea name="message" required placeholder="Hello Ellen…" />
          </label>
          <input
            className="hp"
            type="checkbox"
            name="botcheck"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />
          <div className="actions">
            <p className={`status${state === 'error' ? ' error' : ''}`} aria-live="polite">
              {state === 'error' ? error : state === 'sending' ? 'Sending…' : ''}
            </p>
            <button type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </div>
        </StyledForm>
      )}
    </StyledContactSection>
  );
};

export default Contact;
