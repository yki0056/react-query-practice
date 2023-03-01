import {useQuery} from 'react-query';
import axios from 'axios';

const fetchUserByEmail = (em) => {
    return axios.get(`http://localhost:3001/users/${em}`)
}
const fetchCoursesByChannelId = (ci) => {
    return axios.get(`http://localhost:3001/channels/${ci}`)
}

// 여러개의 정보를 query를 이용해  *순차적으로 fetch 하는 방법.
function DependentQueries({email}) {
    const {data} = useQuery(['user', email], () => fetchUserByEmail(email)) // yki00562@gmail.com
    // console.log(data.data) // error
    // 정보를 받아와서 객체정보를 확인할떄 ?. 를 사용하지않으면 에러가 떠서 객체의 더 안쪽정보를 열람하지 못하는데 그 이유는 data정보가 처음에 undefined로 들어오기때문. 
    // ?. 사용시  data 가있는가? 있다면 data.data 를 보여줘가됨. 
    // console.log(data?.data) // {channelId: codeEvolution, id:yki00562@gmail.com}
    const channelId = data?.data.channelId;

    // chanellId값이 들어올때까지 useQuery시작을 멈춤. !!두개를 사용하면 해당정보를 boolean으로 만들수있음, 정보가있다면 true 가되면 시작.
    const courseData = useQuery(['courses', channelId], ()=> fetchCoursesByChannelId(channelId), {enabled: !!channelId, }) 
    // console.log(courseData.data?.data) // {id: 'codeEvolution', courses: ['react','vue','angular']}

    return (
        <div>
            <h1>DependentQueries</h1>
            <div>
                <h2>first server 정보</h2>
                <br></br>
                {data?.data.id}
                {data?.data.channelId}
            </div>
            <div>
                <h2>first정보를 이용해 fetch한 second 서버정보</h2>
                <br></br>
                {courseData.data?.data.courses.map(c=> <div key={c}>{c}</div>)}
            </div>
            
        </div>
    )
}

export default DependentQueries