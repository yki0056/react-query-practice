import{Fragment} from "react"; // 는 그냥 <></>랑 같은거임. 
import {useInfiniteQuery} from 'react-query';
import axios from 'axios';
// 기존에 있던 정보에서 추가고 좀더 "load more" data  or   "infinite scroll"  등은 많이 사용되는 UI패던이다 
const fetchColors = ({pageParam = 1}) => { // initial 페이지 넘버 1
    return axios.get(`http://localhost:3001/colors?_limit=2&_page=${pageParam}`);
}

function InfiniteQueries() {
    // hasNextPage : getNextPageParam() 에 따른 다음 페이지 존재 여부(Boolean)
    // fetchNextPage : 다음 데이터를 fetch해옴 메서드(Function). data의 pages 배열의 제일 끝에 새로운 데이터를 담는다.
    // isFetchingNextPage : 다음 데이터를 패치중인지 여부(Boolean)
    const {isLoading, 
        isError, 
        error, 
        isFetching, 
        data, 
        hasNextPage, 
        fetchNextPage, 
        isFetchingNextPage,
        } = useInfiniteQuery(['colors'], fetchColors, {getNextPageParam:(lastPage, pages)=>{
            // console.log(pages) // 페이지 안에는 클릭할때 마다 해당 정보들이 들어있음
            if(pages.length < 5){
                return pages.length + 1
            } else {
                return undefined;
            }
        } });

    if(isLoading){
        return <h2>Loading...........</h2>
    }
    if(isError){
        return <h2>{error.message}</h2>
    }

    return (
        <>
            <h2>infiniteQueries</h2>
            <p>주의할점 useInfiteQuery정보를 받아오면 data.data가 아니라 data.pages</p>
            <div>
                {data?.pages.map((group, index) => {
                    return(
                        <Fragment key={index}>
                            {group.data.map(c => <h2>{c.id}{c.label}</h2>)}
                        </Fragment>
                    )
                })}
            </div>
            <div>
                <button disabled={!hasNextPage} onClick={fetchNextPage}>Load More</button>
            </div>
        </>
    )
}

export default InfiniteQueries