// src/push-web/webpush.ts
import * as webpush from 'web-push';

const PUBLIC_KEY = 'BK7X28zynXeAOZiLDh54f43Tk6N0odvv9GLQYQD-cZI2VYutxDPHhrZIkTlSchfhcp-WJUuE_pxIvVVhaA3BgAA';
const PRIVATE_KEY = '8g1D_v5ihOutx14Sig_3F_dcxFVm7DZyv6_o39oOam4';

webpush.setVapidDetails(
    'mailto:bluvera05@gmail.com',
    PUBLIC_KEY,
    PRIVATE_KEY
);

export default webpush;
