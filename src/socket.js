import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'https://debugger-dev.tagmate.app';

function getToken() {
    let token
    chrome.storage.local.get(['t_id_token'], (tIdToken) => {
        console.log(tIdToken)
        token = tIdToken.t_id_token;
    });
    return token
}
const socket = io(URL, {
    auth: {
        token: getToken()
    }
});
export default socket;


