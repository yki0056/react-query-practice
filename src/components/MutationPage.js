import axios from "axios";
import {useQuery, useMutation, useQueryClient} from "react-query";
import {useState} from 'react';
// https://freestrokes.tistory.com/170
// useMutation은 서버를 대상으로 데이터를 create, update, delete 하기 위해 사용하는 hook 입니다.
// useMutation에 사용한 파라미터는 순서대로 다음과 같은데 파라미터의 구성도 useQuery와 동일합니다.
// 1. mutationKey(unique key 값), 2. mutationFn (mutation에 사용할 promise 기반의 비동기 API 함수), 3. options (mutation에 사용할 옵션 값)
// onMutate - mutation이 실행되기 전에 실행되는 함수. mutationFn에 전달되는 파라미터를 동일하게 받음. mutation 실패시 onError, onSettled 함수에 return 값을 전달함.
/*
// useQueryClient - 최상위 컴포넌트(Index.js)에 적용시켜주면 하위들에서 사용가능. query정보들에 대한 다양한 메소드들을 사용가능. 
    - cancelQueries - 데이터 꼬임을 방지해줌 (특정 query key에 해당하는 데이터의 다른 업데이트를 무시하도록 할 수 있다.)
    - setQueryData - 'get-Hero' 쿼리 키를 갖는 쿼리를 업데이트 해줍니다. *즉, 서버의 응답이 오기 전에 UI를 미리 업데이트 하는 것입니다.
    - invalidateQueries - 일반적으로 mutation이 성공적으로 동작한 이후에는 다른 관련된 쿼리의 refetch를 해야함. 이러한 경우엔 다음과 같이 QueryClient의 invalidQueries 함수를 사용해줍니다. 이렇게 하면 mutation 성공 이후에 해당 쿼리가 stale (신선하지않음) 상태로 변경 되어 캐시에서 삭제되고 refetch가 실행되게 됩니다.
*/
const getHeroes = () => {
    return axios.get('http://localhost:3001/superheroes');
}
const addSuperHero = (hero) => { // console.log(hero) // {name: 'ww', alterEgo: 'ee'}
    return axios.post('http://localhost:3001/superheroes', hero)
}

function MutationPage() {
    const [name, setName] = useState('');
    const [alterEgo, setAlterEgo] = useState('');
    const {isLoading, data, isError, error} = useQuery('get-Hero', getHeroes) 
    const queryClient = useQueryClient()
    //  const {mutate: addHero} = useMutation(addSuperHero); // 여러개를 mutate 하려면 쓰는방법
    /* // 방법1 과 방법2
    const {mutate} = useMutation(addSuperHero, {onSuccess: ()=>{
        // 방법1. fetch
        // queryClient.invalidateQueries('get-Hero')
        // 방법2 근데 이게 맞는방식인지 확인필요
        queryClient.setQueryData('get-Hero', (oldQueryData)=>{
            const h = {name, alterEgo}
            return {
                data: [...oldQueryData.data, h]
            }
        })
    }}); 
    */
    // 방법3. optimistic update // 낙관적 업데이트로 서버업데이트시 UI에서도 어차피 업데이트 할것이란 (낙관적인) 가정으로 먼저 UI를 업데이트 시켜주고 서버를 통해 검증을 받고 업데이트 
    //  - 요청의 응답이 도착하기도 전에 미리 그 결과를 예측해서 보여주기 때문에 유저 입장에서는 마치 즉각적으로 응답이 오는 것처럼 느껴지게 됩니다. 
    //  - Optimistic UI는 상당히 유용하지만 혹시 모를 에러 발생에 대비하는 로직은 반드시 구성 해 두어야 합니다!
    const {mutate} = useMutation(addSuperHero, {
        onMutate: async (newHero) => { //새로 얻은 정보
            await queryClient.cancelQueries('get-Hero');
            // const previousHeroData = queryClient.getQueryData('get-Hero')
            queryClient.setQueryData('get-Hero', (oldQueryData)=>{
                //console.log(oldQueryData) // {data: [{...},x6], status: 200,  statusText: 'OK'...} // 새로운받은정보가 없는 이전정보들만.
                // oldQueryData 안에 정보들과 그중data항목만 수정해서 return함  
                return {...oldQueryData, data: [ ...oldQueryData.data, {id:oldQueryData?.data?.length+1, ...newHero}]}
            })
            // return previousHeroData
        }, 
        onError: (error, hero, context) => {
            queryClient.setQueryData('get-Hero', context.previousHeroData)
        },
        onSettled: () => {
            queryClient.invalidateQueries('get-Hero')
        }
    })
    if(isLoading){
        return <h2>Loading</h2>
    }
    if(isError){
        return <h2>{error.message}</h2>
    }

    const handleAddHeroClick = () => {  // console.log({name, alterEgo}) // 인풋에 적은 글
        const hero = {name, alterEgo} 
        mutate(hero)  // 여러개를 mutate 해야하면 // addHero(hero)
        setName('');
        setAlterEgo('');
    }

    return (
        <>
            <h1>Mutation 공부</h1>
            <p>useMutation을 사용해서 addHero버튼을 누르면 정보가 post됬지만, 새로운 정보가 바로 디스플레이 되지않는걸 확인할수있음 
                다시 fetch를 해야 새로운정보르 받을수있음 (새로고침을 or 포커스out in 등...) 
                post를 실행시키자 마자 그 새로운정보를 바로 받아오면됨<br></br>
                방법1. 다시 fetch<br></br>
                mutate()가 실행된뒤 바로 실행되는함수(콜백함수, onSuccess 메소드)를 줘서
                콜백함수에 *useQueryClient의 invalidateQueries() 를 사용하여 바로 fetch해옴 <br></br>
                방법2. post되기 직전에 새로운정보를 옛정보와 섞어서 디스플레이<br></br>
                더 효과적인 방법이있음,fetch를  다시 해오는것도 느려지기때문에
                콜백함수에 *useQueryClient의 setQueryData() 를 사용하여 
            </p>
            <div>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
                <input type="text" value={alterEgo} onChange={(e)=>setAlterEgo(e.target.value)}/>
                <button onClick={handleAddHeroClick}>Add Hero</button>
            </div>
            <div>
                { data?.data.map((dd) => {return <div key={dd.id}> {dd.name} {dd.alterEgo}</div>}) }
            </div>

        </>
    );

}

export default MutationPage