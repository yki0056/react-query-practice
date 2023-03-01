import {useQuery} from "react-query";
import axios from "axios";
// 커스텀 쿼리 훅 
const getEnemies = async() => {
    const response = await axios.get('http://localhost:3001/enemies');
    return response.data
}

export const useEnemiesData = (onSucess, onError) => {
    return useQuery('enemies', getEnemies, {onSucess, onError, enabled: false}) 
}