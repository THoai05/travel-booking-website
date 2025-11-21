import * as webpush from 'web-push';

webpush.setVapidDetails(
    'mailto:admin@example.com',
    'BNFtbUrK1TkBAiehTvi_kmtycIqRuH4NdvYIApYGGZr6JoN36n8zhJUN6DwtO97DHXHfVyv-U73eV2cbN-KuCXE', // public key
    'mzeM9dHUCJkTl8iiuBEKRQmFae-3owGAng06KK3PQ6g' // private key
);

export default webpush;
