import useSingleEnemyData from "../hooks/useSingleEnemyData.js"
import {useParams} from 'react-router-dom';

export const VillainDetailPage = () => { 
  const {id} = useParams();
  const {isLoading, data, isError, error} = useSingleEnemyData(id)

  if(isLoading){
    return <h2>Loading........</h2>
  }
  if(isError){
    return <h2>{error.message}</h2>
  }
  return (
    <div> 
      <h1>{data && data.data.name} : {data && data.data.alterEgo}</h1>
    </div>
  )
}


