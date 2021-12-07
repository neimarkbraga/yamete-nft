import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInfoCircle, faWallet } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Character from '../models/Character';
import BubbleStatement from '../components/BubbleStatement';
import useMetaMask from '../hooks/useMetaMask';

const ProfileWrapper = styled('div')({
  width: '100%',
  minHeight: '100vh',
  background: 'linear-gradient(-45deg, #c04848, #480048, #c04848, #480048)',
  backgroundSize: '400% 400%',
  animation: `${keyframes({
    '0%': { backgroundPosition: '0% 50%'},
    '50%': { backgroundPosition: '100% 50%'},
    '100%': { backgroundPosition: '0% 50%'}
  })} 15s ease infinite`,

  '.brand-title': {
    transition: 'all 50ms ease-in-out',
    transformOrigin: 'center center',

    '&:hover': {
      transform: 'scale(1.1)'
    }
  },

  '.image-container': {
    backgroundSize: '150vh',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center -15vh'
  }
});

const Profile = (props: {id: number}) => {
  const [character, setCharacter] = useState<Character|null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const {
    onboarding,
    connectWallet,
    selectedAddress,
    isMetaMaskInstalled
  } = useMetaMask();

  const loadCharacter = async () => {
    setCharacter(await Character.findById(props.id));
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadCharacter()
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
    <ProfileWrapper>
      {(() => {
        if (isLoading)
          return (
            <Box height="100vh" width="100vw" display="flex" alignItems="center" justifyContent="center">
              <Box textAlign="center">
                <CircularProgress />
                <Typography>Please wait</Typography>
              </Box>
            </Box>
          );

        if (errorMessage)
          return (
            <Box height="100vh" width="100vw" display="flex" alignItems="center" justifyContent="center">
              <Box textAlign="center">
                <Typography variant="h5">Something went wrong</Typography>
                <Typography mb={1}>{errorMessage}</Typography>
                <Button variant="contained" size="small" onClick={loadData}>Try Again</Button>
              </Box>
            </Box>
          );

        if (!character)
          return (
            <Box textAlign="center">
              <Typography variant="h5" mb={1}>Character does not exist</Typography>
              <Button variant="contained" size="small" onClick={loadData}>Try Again</Button>
            </Box>
          );

        return (
          <Grid container height="100vh">
            <Grid item xs={6} display="flex" flexDirection="column" px={5}>
              <Grid container py={3} spacing={2} alignItems="center">
                <Grid item>
                  <Link to="/" style={{color: 'inherit', textDecoration: 'none'}}>
                    <Typography className="brand-title" fontWeight="bold" variant="h6">
                      Yamete Kudasai
                    </Typography>
                  </Link>
                </Grid>
                <>
                  <Grid item>
                    <Box ml={1}>|</Box>
                  </Grid>
                  <Grid item>
                    {(() => {
                      if (selectedAddress)
                        return (
                          <Box>
                            <FontAwesomeIcon icon={faWallet} />
                            <Box ml={1} display="inline-block">{selectedAddress}</Box>
                          </Box>
                        );

                      return (
                        <Button
                          color="inherit"
                          size="small"
                          startIcon={<FontAwesomeIcon icon={faWallet} />}
                          onClick={() => connectWallet()}
                        >
                          Connect to MetaMask
                        </Button>
                      );
                    })()}
                  </Grid>
                </>

              </Grid>

              <Box flex="1 0 auto" display="flex" alignItems="center">
                <Box pt={5} pl={5}>
                  <Typography fontWeight="bold" variant="h2">{character.name}</Typography>
                  <Typography fontWeight="normal" variant="h4">{character.description}</Typography>
                  {(character.owner.toLowerCase() === selectedAddress?.toLowerCase()) && (
                    <Box mt={2}>
                      <Button
                        startIcon={<FontAwesomeIcon icon={faEdit} />}
                        variant="outlined"
                        color="inherit"
                        size="small"
                      >
                        Manage Details
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box pb={3}>
                <Typography fontSize="0.9em">
                  <b>Owner Address: </b>
                  <span>{character.owner}</span>
                </Typography>

                <Typography fontSize="0.9em">
                  <b>Contract Address: </b>
                  <span>{character.owner}</span>
                </Typography>

                {!isMetaMaskInstalled && (
                  <Typography fontSize="0.9em">
                    <FontAwesomeIcon icon={faInfoCircle} style={{marginRight: '4px'}} />
                    <span>MetaMask is not installed in your browser. If you are the owner of <b>{character.name}</b>,</span>
                    <span> you need to </span>
                    <a href="/"
                       style={{
                         color: 'inherit',
                         fontWeight: 'bold'
                       }}
                       onClick={e => {
                         e.preventDefault();
                         onboarding?.startOnboarding();
                       }}
                    >install MetaMask</a>
                    <span> to manage her details.</span>
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={6} className="image-container" style={{backgroundImage: `url(${character.urls.image})`}}>
              {!!character.statement && (
                <BubbleStatement style={{position: 'absolute', right: '72vh', top: '17vh'}}>
                  {character.statement}
                </BubbleStatement>
              )}
            </Grid>
          </Grid>
        );
      })()}
    </ProfileWrapper>
  );
};

export default Profile;
