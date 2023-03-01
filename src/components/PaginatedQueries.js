import {useState} from 'react';
import {useQuery} from 'react-query';
import styled from 'styled-components';
import axios from 'axios'

// Rendering paginated data is a very common UI pattern and in TanStack Query, it "just works" by including the page information in the query key:
// paginate란 버튼을 이용한 정보받기를 말하는듯. 
const StyledButton = styled.li`
    ${({dataa})=> dataa && `
        color:blue;
        font-size:25px;
    `}
`
const fetchColors = (pgNumber) => {
    return axios.get(`http://localhost:3001/colors?_limit=2&_page=${pgNumber}`); // 이건 axios가 제공하는 방법임.
    //colors 정보들중, limit=2 아이템 2개씩만 가져옴, page는 보여줄 페이지 ex) 1페이지라면 아이템1,2 
}

function PaginatedQueries() {
    const [pageNumber, setPageNumber] = useState(1);
    const {isLoading, isError, error,  data} = useQuery(['colors', pageNumber], ()=> fetchColors(pageNumber), {keepPreviousData:true})
    // * keepPreviousData는 일단 넣어주면 성능면에서 좋은듯. 
    if(isLoading) {
        return <h2>Loading....</h2>
    }
    if(isError) {
        return <h2>{error.message}</h2>
    }
    // console.log(data)
    let buttonss = [];
    for(let i =0; i < 5; i++){
        buttonss.push(<StyledButton key={i} dataa={pageNumber === i+1} onClick={()=>setPageNumber(i+1)}>{i+1}</StyledButton>)
    }

    return (
        <>
            <div>
                <h1>Paginated</h1>
                {data?.data.map(d=>{
                    return <li key={d.id} >{d.label}</li>
                })}
            </div>
            <div>
                <button onClick={ ()=>setPageNumber(page => page-1) } disabled={pageNumber === 1}> Prev page </button>
                <button onClick={ ()=>setPageNumber(page => page+1) } disabled={pageNumber === 5}> Next page </button>
            </div>

            <ul style={{width:'100px', display:'flex', justifyContent:'space-between', listStyle:'none', cursor:'pointer'}}>
                {buttonss}
            </ul>
        </>
    )
}

export default PaginatedQueries