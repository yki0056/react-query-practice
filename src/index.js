/* 
클라이어트 사이드 state관리툴 ex) redux  서버사이드 state관리툴, 웹사이트의 배경theme을 바꾸거나, modal open, close 등... 
ex) redux-rtk, react-query  지속적인 fetching 과 updating, 서버정보가 지속적으로 바뀌는 경우 
//  https://tech.osci.kr/2022/07/13/react-query/     https://kyounghwan01.github.io/blog/React/react-query/basic/#%E1%84%89%E1%85%A1%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%92%E1%85%A1%E1%84%82%E1%85%B3%E1%86%AB-%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%B2

react-query는 서버의 값을 클라이언트에 가져오거나, 캐싱, 값 업데이트, 에러핸들링 등 비동기 과정을 더욱 편하게 하는데 사용됩니다.
같은 종류의 라이브러리로 redux-toolkit-query가있음 

# 사용하는 이유
서버로 부터 값을 가져오거나 업데이트 하는 로직을 store 내부에 개발하는 경우가 많습니다. 그렇다보니 store는 클라이언트 state를 유지해야하는데 
어느 순간부터 store에 클라이언트 데이터와 서버 데이터가 공존 하게 됩니다. 그리고 그 데이터가 서로 상호작용하면서 서버 데이터도 클라이언트 
데이터도 아닌 끔찍한 혼종(?)이 탄생하게 됩니다. (예를 들면 서버에는 이미 패치된 데이터가 클라이언트에서는 패치되기 전 데이터가 유저에게 사용되고 있는 것이라고 볼 수 있습니다.)
그래서 react-query를 사용함으로 서버, 클라이언트 데이터를 분리합니다. 이 개념에 대해 동의 하지 않아도 아래의 장점을 보신다면 사용하고 싶은 생각이 드실 것입니다.

서버 데이터 관리 라이브러리를 사용하게 된 이유는 크게 다음과 같이 세 가지 이유가 있었습니다. 라이브러리를 사용하면,
- 서버와의 통신 과정에서 로딩 상태, 에러 여부 등을 관련 컴포넌트 내부에서 직접 상태를 작성하여 관리하지 않아도 됩니다. props drilling을 할 필요도 거의 없어집니다.
- 자동 데이터 캐싱을 통해 서버의 부담도 줄일 수 있습니다.
- 또 일정 시간이 지나거나, 데이터 변동이 생겼을 때(유저가 게시글을 작성하는 등) 자동으로 캐시된 데이터를 제거하고 다시 받아와 유저에게 (적당히) 최신의 데이터를 보여줄 수도 있습니다

# react-query 장점 
  - React-Query는 기본적으로 데이터를 fetching 해온 후 데이터를 캐싱함.(처음 데이터를 가져올때 다운받는 시간이있지만 다시 그 페이지로 돌아갈때는 없음. 잠시 저장해놓기 떄문에) default로 5분동안 저장하는듯; 
  - 해당 데이터가 신선하지 않다고 판단될 때 데이터를 refetching 해오게 됩니다.
  - get을 한 데이터에 대해 update를 하면 자동으로 get을 다시 수행한다. (예를 들면 게시판의 글을 가져왔을 때 게시판의 글을 생성하면 게시판 글을 get하는 api를 자동으로 실행 )
  - 데이터가 오래 되었다고 판단되면 다시 get (invalidateQueries)
  - 동일 데이터 여러번 요청하면 한번만 요청한다. (옵션에 따라 중복 호출 허용 시간 조절 가능)
  - 무한 스크롤 (Infinite Queries (opens new window))
  - 비동기 과정을 선언적으로 관리할 수 있다.

다운받기 npm i react-query
먼저 react의 가장 기본이 되는 곳(index.js)에 react-query를 사용하도록 세팅합니다.
mock data를 사용하기 위해 fake json서버 주소를 받아서 사용해도 되지만, post되는것도 확인해보기때문에 json-server를 만들어서 사용해보겠음. 다운 npm i json-server 그리고 db.json파일을 만듬.  
  - package.json파일의 script에 "serve-json": "json-server --watch db.json --port 3001" 적음
  - 실행시키기 (또 다른 터미널를 열고) npm run serve-json
  - 주소에 localhost3001/superheroes  라고 치면 json에있는 정보들이 나옴. 이주소를 이용해서 fetch해오면됨
  - 주소사용방법.  localhost:3001/colors?_limit=2 (2개만 보여줌).  localhost:3001/colors?_limit=2&_page=1 (첫2개만 보여줌)
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";  // 리액트쿼리 dev tool 사용할수있게해줌. 

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* devtools */}
      <ReactQueryDevtools initialIsOpen position='bottom-right'/>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);


