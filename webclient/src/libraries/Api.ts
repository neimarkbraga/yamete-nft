import axios from 'axios';

export const Api = axios.create({
  baseURL: (() => {
    if (window.location.host === 'localhost:3000')
      return 'http://localhost:88';
    return 'https://yamete.nftinity.xyz';
  })()
});

export default Api;
