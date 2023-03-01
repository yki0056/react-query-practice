import {useQuery, useQueries} from 'react-query';
import axios from 'axios';
import {request} from '../utils/axios-util.js' 
// axios 인터셉터는 react query와는 별개의 기술.
// fetch해오면서 promise안에 추가적으로 정보를 더 적어주는 기술인듯. ex) 토큰을 줘서 로그인 authorization이 가능한듯. 

const fetchSuperHeroes = () => {
  return axios.get('http://localhost:3001/superheroes')
 //  return request({url:'/superheroes'})
}
const fetchFriends = () => {
  return axios.get('http://localhost:3001/friends')
}
const dynamicParallel = (fid) => {
  return axios.get(`http://localhost:3001/friends/${fid}`)
}

function ParallelQueries( {friendsId}) {
  // 방법 1. Manual Parallel Queries 
  const heroes = useQuery('super-heroes', fetchSuperHeroes);
  const {data: friends} = useQuery('friends', fetchFriends)

  // 방법 2. Dynamic Parallel Queries with 'useQueries'는 받아야하는 정보가 졸라 많고, 유동적이야 할떄 사용하는듯;  
  // If the number of queries you need to execute is changing from render to render, you cannot use manual querying since that would violate the rules of hooks. 
  // id값은 고정으로 받아오도록 app.js에 1,3,5 적어뒀음.
  const dynamicResult = useQueries(
    friendsId.map((id) => {
      return {
        queryKey: ['friend', id],
        queryFn: () => dynamicParallel(id)
      }
    })
  )
  
  // console.log(heroes.data?.data); // [{…} x8]
  // console.log(friends?.data); // [{…} x5]
  // console.log(dynamicResult) // [{...} x3]

  return (
    <div>ParallelQueries</div>
  )
}

export default ParallelQueries