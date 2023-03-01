import {useEffect, useState} from 'react'
import axios from "axios";

function OldSuperHeroes() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(()=>{
        axios.get('http://localhost:3001/superheroes').then((res)=>{
            setData(res.data);
            setIsLoading(false)
        }).catch((error)=> {
            setError(error.message);
            setIsLoading(false);
        })
    },[])

    if(isLoading){
        return <h2>Loading...</h2>
    }
    if(error){
        return <h2>{error}</h2>
    }

    return (
        <div>
            <h2>OldSuperHeroes</h2>
            <p>매번 이페이지에 들어올때마다 서버에서 정보를 받아오기 때문에 isLoading이 뜨는걸 볼수있음</p>
            {data.map(d=>{
                return <div key={d.name}>{d.name}</div>
            })}
        </div>
    )
}

export default OldSuperHeroes