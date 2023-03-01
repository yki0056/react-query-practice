
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Home from './components/Home.js'
import OldSuperHeroes from './components/OldSuperHeroes.js'
import SuperHeroes from './components/SuperHeroes.js'
import {VillainDetailPage} from './components/VillainDetailPage.js'
import ParallelQueries from './components/ParallelQueries.js'
import DependentQueries from './components/DependentQueries.js'
import PaginatedQueries from './components/PaginatedQueries.js'
import InfiniteQueries from './components/InfiniteQueries.js'
import MutationPage from './components/MutationPage.js'
function App() {
  return (
    <BrowserRouter>  
      <div className="App">
          <h1>React Query란? </h1>
          <nav>
            <ul>
              <h3>데이터를 받는법</h3>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/old-super-heroes'>데이터를 받는 예전방식 ex.useEffect,state로딩 등...</Link></li>
              <li><Link to='/super-heroes'>useQuery - 데이터 받는 방법</Link></li>
              <li><Link to='/rq-parallel'>ParallelQueries 그리고 Dynamic Parallel Quries - 동시에 여러개의 정보를 받는법. 번외로 Axios Interceptor도 있음</Link></li>
              <li><Link to='/rq-dependent'>Dependent - 순차적으로 fetch하는 방법. 처음받은 fetch정보로 다음 fetch하기</Link></li>
              <li><Link to='/rq-paginated'>PaginatedQueries </Link></li>
              <li><Link to='/rq-infinite'>InfiniteQueries  </Link></li>
              <h3>데이터를 보내는법 POST</h3>
              <li><Link to='/rq-mutation'>useMutation</Link></li>

            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/old-super-heroes" element={<OldSuperHeroes/>}/>
            <Route path="/super-heroes" element={<SuperHeroes/>}/>
            <Route path="/villain/:id" element={<VillainDetailPage/>}/>
            
            <Route path="/rq-parallel" element={<ParallelQueries friendsId={[1, 3, 5]}/>}/>
            <Route path="/rq-dependent" element={<DependentQueries email='yki00562@gmail.com'/>}/>
            <Route path="/rq-paginated" element={<PaginatedQueries/>}/>
            <Route path="/rq-infinite" element={<InfiniteQueries/>}/>

            <Route path="/rq-mutation" element={<MutationPage/>}/>
          </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
