import axios from 'axios';

const client = axios.create({baseURL: 'http://localhost:3001'});

export const requery = ({...options}) => {
    client.defaults.headers.common.Authorization = "비어러 토큰"
    const onSuccess = res => res;
    const onError = error => {
        // optionally catch errors and add additional logging here 
        return error;
    }

    return client(options).then(onSuccess).catch(onError);
}