import React, { ComponentProps } from 'react';
import { styled } from '@mui/material/styles';

const StatementContent = styled('div')({
  position: 'relative',
  padding: '25px 50px',
  display: 'inline-block',
  border: '2px solid white',
  borderRadius: '15px',
  maxWidth: '35vw',

  '&:after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    width: 0,
    height: 0,
    borderTop: '15px solid transparent',
    borderBottom: '15px solid transparent',
    borderLeft: '15px solid white',
    right: '-15px',
    bottom: '50%',
    transform: 'translateY(50%)'
  }
});

export const BubbleStatement = (props: ComponentProps<any>) => {
  return (
    <div {...props}>
      <StatementContent>
        {props.children}
      </StatementContent>
    </div>
  );
};

export default BubbleStatement;
