import React, { ComponentProps } from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import {
  styled,
  experimental_sx as sx
} from '@mui/material/styles';

const Card = styled('div')(sx({
  margin: '0 15px',
  padding: '15px',
  borderRadius: '3px',
  backgroundColor: 'action.hover',
  cursor: 'pointer',
  '&:active': {
    transform: 'scale(0.99)'
  },
  '.image': {
    transition: 'all 100ms ease-in-out'
  },
  '&:hover .image': {
    transform: 'scale(1.02)'
  }
}));

const ImageWrapper = styled('div')(sx({
  position: 'relative',
  width: '100%',
  paddingTop: '125%',
  background: 'linear-gradient(45deg, #c04848, #480048)'
}));

const Image = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: '0',
  top: '0',
  backgroundSize: '150%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
});

const Details = styled('div')({
  paddingTop: '15px',
});

export interface AnimeCardProps extends ComponentProps<any> {
  image: string
  title: string
  description: string
  owner: string
}

export const AnimeCard = (props: AnimeCardProps) => {
  const {
    image,
    title,
    description,
    owner,
    ..._props
  } = props;

  return (
    <div {..._props}>
      <Card>
        <ImageWrapper className="image">
          <Image style={{backgroundImage: `url(${image})`}} />
        </ImageWrapper>
        <Details>
          <Typography fontWeight="bold" variant="h5">{title}</Typography>
          <Typography>{description}</Typography>

          <Box mt={2}>
            <Typography fontSize="12px">Owner: </Typography>
            <Typography fontSize="12px" style={{opacity: 0.5}}>{owner}</Typography>
          </Box>
        </Details>
      </Card>
    </div>
  );
};

export default AnimeCard;
