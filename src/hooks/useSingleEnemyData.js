import {useQuery, useQueryClient} from 'react-query'
import axios from 'axios';

const fetchEnemy = ({queryKey}) => {
    // console.log(queryKey) // ['enemy', 2]
    const enemyId = queryKey[1]
    return axios.get(`http://localhost:3001/enemies/${enemyId}`);
}
function useSingleEnemyData(enemyId) {
    // 방법1.  useQuery3번째에 함수에 인자를 함꼐 넣어야한다면 이렇게 함수안에 넣어 보내야한다, 아니면 함수를 바로 호출해버리니 ex) event함수 
    // return useQuery('enemy', () => fetchEnemy(enemyId));
    // 방법2. useQuery에 넣은 함수는, 이런식으로 인자로 넣지않고, 첫번째인자에 넣어서, 나중에 fetch함수내부에서 *queryKey를 통해 불러올수있음
    // return useQuery(['enemy', enemyId], fetchEnemy)

    // *useQUeryClient를 사용하는 방법 알아보자! (캐쉬에 저장된 정보를 가져올수있음)
    // 만약 이전 페이지에서 fetch되었던 정보 ex) enemies리스트 데이터 안에, 현재페이지의 정보가 있다면. 
    // 캐쉬에 저장된 정보를 가져와서 현페이지를 빠르게 디스플레이 가능. 그래서 Loading... 디스플레이 없이 바로 나옴.
    const queryClient = useQueryClient();
    return useQuery(['enemy', enemyId], fetchEnemy, { initialData:()=>{
        const enn = queryClient.getQueryData('enemies')?.find((enemy) => enemy.id === parseInt(enemyId))
        // {id:2, name:'Riddler, alterEgo:'Edwa rd Nygma}
        if(enn) {
            return {data: enn}
        } else {
            return undefined;
        }

    }})
}

export default useSingleEnemyData 