# Node JS Practice #1 - GifChat(Socket.io)

From `Node.js 교과서`

### 책과 다른 부분

1. `socket.adapter.rooms`  
   `socket.adapter.rooms`가 array가 아니고 set임  
   아래와 같이 바꿔야 함
   `currentRoom = socket.adapter.rooms.get(roomId);userCount = currentRoom ? currentRoom.size : 0;`

2. socket에서 session 참조하기

- socket.io 버전 변경으로 인해 session 정보가 책대로 하면 socket에서 참조 불가
- express-socket.io-session 패키지를 사용
- io.use가 아닌 각 네임스페이스의 use로 하면 됨
  ```
  const sharedsession = require("express-socket.io-session");
  room.use(sharedsession(sessionMiddleware));
  chat.use(sharedsession(sessionMiddleware));
  ```

### 스스로 해보기 항목

1. 채팅 참여자수 표시 - [커밋 링크](https://github.com/pss9205/NodePractice/commit/e19f9ba845c0255f99982aadda45d536ac7e3077)

- `socket.adapter.rooms.get(roomId)`사용하여 인원 표시
- "join","exit" 이벤트 emit 할때 participants 같이 전송, 갱신

2. 시스템 메시지도 저장하기 - [커밋 링크](https://github.com/pss9205/NodePractice/commit/9950a690262f43f8fc900d0505bb455d0f35c0aa), [커밋 링크](https://github.com/pss9205/NodePractice/commit/534d6862b3b2a17a3d60327a7fd438191d0649c9)

- socket.io의 connection,disconnect이벤트를 router로 이동
- 라우터에서 DB에 저장하고 join,exit 이벤트 emit
- post요청 없이 로컬 메소드로 만들어도 가능해보임

3. 강퇴 - [커밋 링크](https://github.com/pss9205/NodePractice/commit/1381af67ac698c3ab225ef8b7ef83e16b608de24)

- 방의 owner에게만 강퇴 버튼 보이도록 수정
- 이를 위한 라우터 `/room/:id/ban/:sender`와 socket 이벤트 `ban`추가
- 강퇴 버튼 클릭 -> post(/room/:id/ban/:sender) -> emit(ban)

4. 방장 위임 - [커밋 링크](https://github.com/pss9205/NodePractice/pull/24/commits/ca8ccb383effc7ecfeb0db609b0fd2ae741494dc)

- 방장이 나가면 `socket.adapter.rooms` 참조해서 새로운 방장 선택
- 이를 위한 라우터 `/room/owner/:id`와 socket 이벤트 `updateRoom`, `owner` 추가
- post(disconnect) -> 방장인지 확인 -> emit(owner)(chat namespace 이벤트) -> patch(room/owner/새방장id) -> DB 업데이트 -> 목록 갱신 emit(updateRoom) (room namespace 이벤트)
