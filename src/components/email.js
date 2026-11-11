import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { email } from '@config';
import { Side } from '@components';

const StyledLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background-color: var(--light-slate);
  }

  a,
  .place {
    margin: 20px auto;
    padding: 10px;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: var(--fz-lg);
    letter-spacing: 0.1em;
    writing-mode: vertical-rl;
  }

  .place {
    color: var(--light-slate);
  }

  a {

    &:hover,
    &:focus {
      transform: translateY(-3px);
    }
  }
`;

// Shows the email vertically on the right margin once one is set; nothing otherwise, so the
// margin stays clear of the cover drawing.
const Email = ({ isHome }) =>
  email ? (
    <Side isHome={isHome} orientation="right">
      <StyledLinkWrapper>
        <a href={`mailto:${email}`}>{email}</a>
      </StyledLinkWrapper>
    </Side>
  ) : null;

Email.propTypes = {
  isHome: PropTypes.bool,
};

export default Email;
