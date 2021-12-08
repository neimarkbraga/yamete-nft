import React, {useState, ComponentProps, FormEvent, useEffect} from 'react';
import {
  Box,
  Tab,
  Tabs,
  Grid,
  Alert,
  Button,
  Accordion,
  AccordionProps,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Character from '../models/Character';
import useMetaMask from '../hooks/useMetaMask';

const ContentWrapper = styled('div')({
  position: 'relative',
  overflow: 'hidden',

  '.background': {
    position: 'absolute',
    width: '300%',
    top: '-375px',
    left: '-75%',
    opacity: '0.05',
    zIndex: '1'
  },
  '.content': {
    position: 'relative',
    zIndex: '2'
  }
});

export interface ProfileFormProps extends ComponentProps<any> {
  character: Character,
  onCharacterChange: (character: Character) => void
}

const DetailsForm = (props: ProfileFormProps) => {
  const { character, onCharacterChange } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [statement, setStatement] = useState<string>('');

  const { getEthereumInstance, selectedAddress } = useMetaMask();

  const reset = () => {
    setDescription(character.description);
    setStatement(character.statement);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMessage('');
      const payload = {
        sub: character.id,
        aud: 'yamete-kudasai-nft',
        exp: Math.round(new Date().getTime() / 1000) + 120,
        iat: Math.round(new Date().getTime() / 1000),
        action: 'update-character',
        params: { description, statement }
      };
      const signature = await (getEthereumInstance().request({
        method: 'personal_sign',
        params: [JSON.stringify(payload), selectedAddress]
      }) as Promise<string>);
      const _character = await Character.updateDetails(payload, signature);
      Object.assign(character, _character);
      onCharacterChange(_character);
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(reset, []);

  return (
    <form onSubmit={submit}>
      <fieldset disabled={isLoading} style={{border: 'none', padding: 0}}>
        <Box pb={2}>
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            multiline
            fullWidth
            required
          />
        </Box>

        <Box pb={2}>
          <TextField
            label="Statement"
            value={statement}
            onChange={e => setStatement(e.target.value)}
            rows={4}
            multiline
            fullWidth
          />
        </Box>

        {!!errorMessage && (
          <Box pb={2}>
            <Alert onClose={() => setErrorMessage('')} severity="error">{errorMessage}</Alert>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={15} color="inherit" />}
            type="submit"
            variant="contained">
            Submit
          </Button>
        </Box>
      </fieldset>
    </form>
  );
};

const NftForm = (props: ProfileFormProps) => {
  const [activePanel, setActivePanel] = useState<string>('');

  const generateAccordionProps = (name: string): Partial<AccordionProps> => ({
    expanded: activePanel === name,
    onChange: () => setActivePanel(name !== activePanel ? name : '')
  });

  return (
    <div>
      <Accordion {...generateAccordionProps('approve')}>
        <AccordionSummary>
          <Typography sx={{ width: '30%', flexShrink: 0 }}>
            approve
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Approve an address to transfer token.</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box pb={2}>
            <TextField
              label="to"
              size="small"
              rows={4}
              fullWidth
            />
          </Box>
          <Box pb={2}>
            <TextField
              label="tokenId"
              size="small"
              rows={4}
              fullWidth
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" size="small">
              Transact
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion {...generateAccordionProps('safeTransferFrom')}>
        <AccordionSummary>
          <Typography sx={{ width: '30%', flexShrink: 0 }}>
            safeTransferFrom
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Transfer token to an address.</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box pb={2}>
            <TextField
              label="from"
              size="small"
              rows={4}
              fullWidth
            />
          </Box>
          <Box pb={2}>
            <TextField
              label="to"
              size="small"
              rows={4}
              fullWidth
            />
          </Box>
          <Box pb={2}>
            <TextField
              label="tokenId"
              size="small"
              rows={4}
              fullWidth
            />
          </Box>
          <Box pb={2}>
            <TextField
              label="_data"
              size="small"
              rows={4}
              fullWidth
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" size="small">
              Transact
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

    </div>
  );
};

export const ProfileForm = (props: ProfileFormProps) => {
  const { character } = props;
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box mx={1}>
              <Typography fontWeight="bold" variant="h5">{character.name}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
              <Tab label="Details" id="Details" />
              <Tab label="NFT" id="NFT" />
            </Tabs>
          </Grid>
        </Grid>
      </Box>

      <ContentWrapper>
        <img className="background" src={character.urls.image} alt={character.name} />
        <Box className="content" pt={2}>
          {activeTab === 0 && <DetailsForm {...props} />}
          {activeTab === 1 && <NftForm{...props} />}
        </Box>
      </ContentWrapper>
    </div>
  );
};

export default ProfileForm;
