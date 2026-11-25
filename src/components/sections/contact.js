import React, { useState } from 'react';
import styled from 'styled-components';
import { StaticImage } from 'gatsby-plugin-image';
import { formAccessKey, socialMedia } from '@config';
import { Page, SectionHead, T, DISPLAY, SANS, cap } from '@components/editorial';

/*
 * Contact — a short note form that lands in my inbox through Web3Forms
 * (https://web3forms.com) — a static site cannot send email itself. The access key is
 * public by design. A honeypot field keeps most bots out.
 */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2.2vw, 32px);
  padding-bottom: clamp(96px, 10vw, 150px);

  align-items: start;

  .photo {
    grid-column: 1 / span 4;
    margin: 0;
    figcaption {
      margin-top: 10px;
      color: ${T.muted};
      font-family: ${SANS};
      font-size: 12.5px;
    }
  }
  .side {
    grid-column: 6 / span 7;
  }
  aside {
    margin-top: 56px;
  }

  @media (max-width: 900px) {
    .photo {
      grid-column: 1 / span 6;
      margin-bottom: 40px;
    }
    .side {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 560px) {
    .photo {
      grid-column: 1 / span 9;
    }
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 28px;
  font-family: ${SANS};

  label {
    display: block;
    color: ${T.muted};
    ${cap};
    font-size: 10px;
  }
  .full {
    grid-column: 1 / -1;
  }
  input,
  textarea {
    display: block;
    width: 100%;
    margin-top: 8px;
    padding: 8px 0 10px;
    border: 0;
    border-bottom: 1px solid ${T.ink};
    border-radius: 0;
    background: transparent;
    color: ${T.ink};
    font-family: ${SANS};
    font-size: 17px;
    letter-spacing: 0;
    text-transform: none;
    &::placeholder {
      color: #8b93a5;
    }
    &:focus {
      outline: 0;
      border-bottom: 2px solid ${T.vermilion};
      padding-bottom: 9px;
    }
  }
  textarea {
    min-height: 150px;
    resize: vertical;
    line-height: 1.6;
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
    gap: 20px;
  }
  .status {
    margin: 0;
    color: ${T.muted};
    font-size: 14px;
  }
  .status.error {
    color: ${T.vermilionText};
  }
  button {
    padding: 15px 30px;
    border: 0;
    border-radius: 0;
    background: ${T.ink};
    color: ${T.paper};
    cursor: pointer;
    ${cap};
    transition: background 0.2s ease;
    &:hover,
    &:focus-visible {
      background: ${T.vermilionText};
    }
    &:disabled {
      opacity: 0.6;
      cursor: progress;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Elsewhere = styled.aside`
  border-top: 1px solid ${T.rule};
  font-family: ${SANS};

  h3 {
    margin: 0;
    padding: 9px 0;
    border-bottom: 1px solid ${T.hair};
    color: ${T.ink};
    ${cap};
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid ${T.hair};
    color: ${T.muted};
    font-size: 13px;
  }
  a,
  .v {
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: 18px;
  }
  a:hover {
    color: ${T.vermilionText};
  }
`;

const Thanks = styled.div`
  h3 {
    margin: 0 0 12px;
    color: ${T.ink};
    font-family: ${DISPLAY};
    font-size: 40px;
    font-weight: 500;
  }
  p {
    color: ${T.text};
    font-family: ${SANS};
    font-size: 17px;
  }
`;

const Contact = () => {
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

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

  const linkedin = socialMedia.find(s => s.name === 'Linkedin');
  const github = socialMedia.find(s => s.name === 'GitHub');

  return (
    <Page id="contact">
      <div className="wrap">
        <SectionHead
          label="Contact"
          aside="Montréal"
          title="Write to me"
          standfirst="Leave me a note — it comes straight to my inbox, and I’ll write back."
        />
        <Grid>
          <figure className="photo">
            <StaticImage
              className="img"
              src="../../images/photos/autumn.jpg"
              alt="Ziyi (Ellen) Zhou in a red sweater, sitting under a tree among autumn leaves"
              width={480}
              aspectRatio={4 / 5}
              quality={86}
              placeholder="dominantColor"
              formats={['AUTO', 'WEBP', 'AVIF']}
            />
            <figcaption>Autumn leaves.</figcaption>
          </figure>
          <div className="side">
            {state === 'sent' ? (
              <Thanks className="thanks" role="status">
                <h3>Thank you.</h3>
                <p>Your message is on its way. I’ll write back soon.</p>
                <p>— Ellen</p>
              </Thanks>
            ) : (
              <Form onSubmit={onSubmit}>
                <label htmlFor="c-name">
                  Name
                  <input
                    id="c-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Your name"
                  />
                </label>
                <label htmlFor="c-email">
                  Email
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                  />
                </label>
                <label className="full" htmlFor="c-message">
                  Message
                  <textarea id="c-message" name="message" required placeholder="Hello Ellen…" />
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
                    {state === 'sending' ? 'Sending…' : 'Send the note'}
                  </button>
                </div>
              </Form>
            )}

            <Elsewhere>
              <h3>Elsewhere</h3>
              <ul>
                <li>
                  GitHub
                  {github && <a href={github.url}>EllenSyuu</a>}
                </li>
                <li>
                  LinkedIn
                  {linkedin && <a href={linkedin.url}>ellenziyizhou</a>}
                </li>
                <li>
                  Based in
                  <span className="v">Montréal, Québec</span>
                </li>
              </ul>
            </Elsewhere>
          </div>
        </Grid>
      </div>
    </Page>
  );
};

export default Contact;
