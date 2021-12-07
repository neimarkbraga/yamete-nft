import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress
} from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slick from 'react-slick';
import { AnimeCard } from '../components/cards';
import Character from '../models/Character';
import { styled, keyframes } from '@mui/material/styles';

const HomeWrapper = styled('div')({
  width: '100%',
  minHeight: '100vh',
  background: 'linear-gradient(-45deg, #2c3e50, #000000, #2c3e50, #000000)',
  backgroundSize: '400% 400%',
  animation: `${keyframes({
    '0%': { backgroundPosition: '0% 50%'},
    '50%': { backgroundPosition: '100% 50%'},
    '100%': { backgroundPosition: '0% 50%'}
  })} 15s ease infinite`
});

const Home = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const loadCharacters = async () => {
    setCharacters(await Character.find());
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadCharacters()
      ]);
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => await loadData())();
  }, []);

  return (
    <HomeWrapper>
      <Container>
        <Box textAlign="center" py={5}>
          <Typography fontWeight="bold" variant="h2">Yamete Kudasai</Typography>
          <Typography>NFT for Simps of Kawaii Anime Girls 😆</Typography>
        </Box>

        {(() => {
          if (isLoading)
            return (
              <Box textAlign="center">
                <CircularProgress />
                <Typography>Please wait</Typography>
              </Box>
            );

          if (errorMessage)
            return (
              <Box textAlign="center">
                <Typography variant="h5">Something went wrong</Typography>
                <Typography mb={1}>{errorMessage}</Typography>
                <Button variant="contained" size="small" onClick={loadData}>Try Again</Button>
              </Box>
            );

          return (
            <Slick
              dots={true}
              slidesToShow={3}
              swipeToSlide={true}
              autoplay={false}
              centerPadding="25px"
            >
              {characters.map(character => (
                <AnimeCard
                  key={character.id}
                  image={character.urls.image.replace('https://yamete.nftinity.xyz', 'http://localhost:88')}
                  title={character.name}
                  owner={character.owner}
                  description={character.description}
                />
              ))}
            </Slick>
          );
        })()}
      </Container>
    </HomeWrapper>
  );
};

export default Home;
