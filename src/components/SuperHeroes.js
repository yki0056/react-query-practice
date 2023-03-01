import axios from "axios";
import {Link} from 'react-router-dom'
import {useQuery} from "react-query";
import {useEnemiesData} from '../hooks/useEnemiesData.js'

const getHeroes = () => {
    return axios.get('http://localhost:3001/superheroes');
}
const onSucessFunc = (dataa) => { // fetch성공시 콜백함수의 인자로는 fetch로 얻은 정보가 들어오고 
    console.log('Perform side effect after data fetching', dataa)
}
const onErrorFunc = (errorr) => { // fetch실패시 콜백함수의 인자로는 에러정보가 들어옴 
    console.log('Perform side effect after encountering error', errorr)
}

function SuperHeroes() {
    const {isLoading, isFetching, data, isError, error, refetch} = useQuery('getHero', getHeroes, {onSucessFunc, onErrorFunc}) 
    // const heroQuery  = useQuery('getHero', getHeroes, {}) // 윗줄을 다르게 쓰는 방식. useQuery를 여러개 사용시

    const enemyQuery  = useEnemiesData(onSucessFunc, onErrorFunc);
    /*
    1번째인자는 이름, 2번째인자는 fetch함수, 3번째인자는 옵션으로 부가설정 가능.  
        cacheTime: default 5분. 캐싱저장기간수정가능. 캐싱이 된다고해서 서버에서 fetch를 안하는게 아님 매번함 (그래야 서버에서 받은 정보와 비교해서 수정을하니). 
        // 하지만 아예 fetch를 안받게 할수도있음 (staleTime).
        staleTime: default 사용안함. 페이지에 한번 들어온 이후 다시 이페이지에 돌아왓을때 fetch를 받지않게함(서버의정보가 자주 바뀌지 않는 정보일때사용). staleTime 사용시 특정시간 동안 fetch안받게 할수있고, cacheTime은 default. 
        refetchOnMount: 안적을시 기본으로 true. 리액트가 마운트되면 fetch해서 새로운정보를 받음
        refetchOnWindowFocus: 안적을시 기본으로 true. 브라우저에 포커스가 다시 들어오면 fetch해서 새로운정보를 받음
        refetchInterval: 안적을시 기본으로 false. 시간차 지속적으로 fetch를함 ex) 주식가격변동보기  약점-윈도우가 포커스 안되어있으면 fetching이 중단됨.
        refetchIntervalBackground: true를 같이주면 윈도우가 포커스되어있지않아도 fetching됨
        // fetch가 완료된 뒤 콜백함수를 실행시는 방법. 쿼리가끝나자마자 사이드이펙트를 구현하고싶다면. 
        - 일단 쿼리가 성공시, 실패시 실행될 함수를 만들어주고 넣음 3번째 인자에 넣음
        - onSuccess: onSucessFunc,
        - onError: onErrorFunc,
    
    // 버튼클릭하면 fetch해오게하는 방법 
    - enabled: false 를 해줘서 페이지에 들어오자마자 fetch되는걸막음, 그다음 refetch를 온클릭함수에 넣어서 사용. refetch를 사용할떄 로딩을 만들고싶다면 isLoading || isFetching 같이 넣어주는게 좋음.

    // 데이터 전부가 아닌 특정 데이터만 가져오기   // select: 함수를 넣고 return된 값을줌
    - select: (dt) => {
        const superHeroNames = dt.data.map(hero => hero.name)
        return superHeroNames  
    }
    // useQuery를 많이 사용해야할 경우 중복 코드들이 많이짐 그때는 hooks를 사용해야함 hooks 폴더 참고 
     */
    // console.log({isLoading, isFetching})

    if(isLoading){
        return <h2>Loading</h2>
    }
    if(isError){
        return <h2>{error.message}</h2>
    }

    console.log(enemyQuery)
    return (
        <>
            <h1>Hero 리스트</h1>
            <p>useQuery는 캐싱이 자동으로 되기 때문에 한번 이페이지에 들어오면 5분간은 다른페이지에 갔다와도 정보가 캐시에 저장되어 남아있음. 그래서 fetch해온 정보가 기존정보와 같을경우 로딩없이 빠르게 *디스플레이를 해줌.  유저의 만족도 업!</p>
            <div>
                { data?.data.map((dd) => {return <div key={dd.id}> {dd.name} {dd.alterEgo}</div>}) }
            </div>
            <br></br>
            <button onClick={enemyQuery.refetch}>클릭fetch 적 리스트 정보 가져오기</button>
            <div>
                { enemyQuery.data && enemyQuery.data.map((dd) => {
                    return <div key={dd.id}> 
                        <Link to={`/villain/${dd.id}`}>{dd.name}</Link>
                    </div>
                    })
                }
            </div>
        </>
    );

}

export default SuperHeroes