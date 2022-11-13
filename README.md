# qnffnrl-batteryMonitor
* 배터리 모니터링 페이지 퍼블리싱
* Template from -> https://startbootstrap.com/template/sb-admin

## MockUP
![화면 캡처 2022-11-10 225033](https://user-images.githubusercontent.com/71891870/201109172-a13c7ca8-c8a5-4f5f-bef6-8c8cd6525607.png)

## Trouble Shooting
* 페이지를 768px(col-md) 이하로 줄였을 때 현재 시간을 표시하는 부분이 표시가 안됨
* 원인 대충 파악함 -> 부트스트랩 템플릿 CSS 파일에 @media라는 문법들이 있는데 이게 if와 똑같은 의미임
* 여기서 페이지 크기가 769px 이하로 내려가면 수행되는 css 코드들이 있는데 이것 때문에 그러는 것 같은
* 현재시간 표시하는 부분은 내가 직접 작성한 코드라 원래 템플릿 css와 뭔가 맞지 않는 부분이 있는 것 같음 -> 그 부분 찾는 중
