/** 추가해야하는 기능
 * 1. todolist에 체크 됨 안됨 여부를 따져서 localstorage에 적용 
 * 1-1. 계획 완료하기 버튼 추가 >> 완료했을때 달력에 표시해주기
 * 2. emotionDiary의 헤더부분 css 다루기
 * 
 */

const rightContainer = document.querySelector('.right-container');

let date = new Date();

const renderCalendar =()=>{
  const viewYear = date.getFullYear();
  const viewMonth = date.getMonth();
  

  const enMonth = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const enDay= ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  document.querySelector('.year-month').innerHTML = `${enMonth[viewMonth]}.&nbsp&nbsp ${viewYear} `;
  // 계속해서 업데이트를 해줘야하므로 함수안에 집어넣기
  function showMain(){
    let viewDate = date.getDate();
    let viewDay= date.getDay();
    document.querySelector('.header-day').innerHTML = `${enDay[viewDay]}`;
    document.querySelector('.header-date').innerHTML = `${viewDate}`;
  }
  showMain();
  /**  달력에서 지난달 날짜와 다음달 날짜를 표기하기 위하여 진행하는 작업 **/

  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth+1 , 0);

  const PLDate = prevLast.getDate(); // 지난달 마지막 날짜
  const PLDay = prevLast.getDay(); // 지난달 마지막 요일 getDay >> 날짜 인덱스 0= 일요일 6=토요일

  const TLDate = thisLast.getDate(); // 이번달 마지막 날짜
  const TLDay = thisLast.getDay(); // 이번달 마지막 요일


  const prevDates =[]; //  현재달력의 이전달 일수를 표기하기 위함
  const thisDates =[...Array(TLDate+1).keys()].slice(1); // 배열은 0부터 시작이므로 0~31까지(또는 0~30) 총 32길이의 배열을 만든 후 첫번째 이전은 슬라이스
  // ...Array만 사용하면 key값들이 전부 undefined이기 때문에 key()명령어를 통해 0부터 n-1까지 array interator 생성

  const nextDates =[]; // 현재달력의 다음달 일수를 표기하기 위함


  // 토요일이 아닐때 >> 지난달 마지막요일이 토요일이라면 달력에 표기할 필요가 없음 
  if (PLDay !== 6){
      //지난달 마지막 요일이 될 때 까지
      for (let i = 0; i < PLDay + 1; i++){
          prevDates.unshift(PLDate-i); //역순으로 집어넣음
      }
      
  }
  for (let i = 1; i < 7 - TLDay; i++) {
      nextDates.push(i); // 이번달 마지막 요일을 기준으로 다음달 일 수 갯수를 채워나가는 방식
    }

  const dates = prevDates.concat(thisDates, nextDates); // prev에 this랑 next를 합침
  
  // 이전달 일수와 다음달 일수에게는 other class를 부여하여 투명도 조절
  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(TLDate);
  dates.forEach((date, i) => {
    const condition = i >= firstDateIndex && i < lastDateIndex + 1                      
                      ? 'this'
                      : 'other';

  dates[i] = `<div class="date"><span class="${condition}">${date}</span></div>`;
    })


  document.querySelector('.dates').innerHTML = dates.join(''); // .join('')은 아무런 수식없이 넣기임
  
  // 클릭시 날짜 변경
  const arrayThisDate= document.querySelectorAll('.this');
  let tdGroup = [];
  
  // this 클래스들을 선회하면서 id값 부여해주기
  arrayThisDate.forEach((e, i)=>{
    e.id = i+1;
  })

  // 미리 만들어놓은 배열에 부여해둔 id값을 전부 집어넣기
  function clickstart(){
    for(let i=1; i<=arrayThisDate.length; i++){
      tdGroup[i] = document.getElementById(i);
      tdGroup[i].addEventListener('click',changeToday);
    }
  }
  clickstart();
  
  
  // 클릭된 날짜는 active 클래스 추가  (기본값 : 오늘)
  let  clickedDate = document.getElementById(date.getDate());


  function changeToday(e){
    // 기존에 클래스 active가 있으면 삭제
    for(let i = 1; i <= arrayThisDate.length; i++){
      if(tdGroup[i].classList.contains('active')){
        tdGroup[i].classList.remove('active');
      }
    }
    // 변수 변경후 active클래스 추가
    clickedDate = e.currentTarget;
    clickedDate.classList.add('active');
    date = new Date(date.getFullYear(), date.getMonth(), clickedDate.id);
    showMain();




    let keyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate(); // 투두리스트 키밸류값 
    toDoInput();
    keepStore();
    displayToDoOnDays();
    displayToDoOnDiary();
  }

 


  const today = new Date(); // 오늘 날짜에 맞는 date 객체를 새로 만들어줌
  // 현재 보고 있는 달력에 오늘이 있는지 확인한 후 
  if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
    // this라는 클래스를 전부 찾은 후 그 date를 +단항 연산자로 숫자로 바꾼 후에(문자열로 오기 때문) 오늘이랑 같다면 today라는 클래스를 추가
    for (let date of document.querySelectorAll('.this')) {
      if (+date.innerText === today.getDate()) {
        date.classList.add('today');
        break;
      }
    }
  }
}

renderCalendar();

const prevMonth =()=>{
  date.setDate(1);
  date.setMonth(date.getMonth()-1);
  renderCalendar();
}

const nextMonth =()=>{
  date.setDate(1);
  date.setMonth(date.getMonth()+1);
  renderCalendar();
}

const goToday =()=>{
  date= new Date();
  renderCalendar();
}


// ToDO LIST

let inputContent ="";
let id=0; // 삭제기능 or 수정기능때 필요함

const input = document.querySelector('.td-inserts-input');
const enterKey =  document.querySelector('.td-insert-button');

/** localStorage에 데이터가 있는지 확인하고 저장 or 불러오기 */
function keepStore(){
  const keyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate();
  let arrayToDo;
  let arr = new Array();
  if(!localStorage.getItem(keyValue)){
      return arr;
  }
  if(localStorage.getItem(keyValue).includes(',')){
      arrayToDo = localStorage.getItem(keyValue).split(',');
      arrayToDo.forEach((value)=>{
          arr.push(value);
      });
  }
  else{
      arr.push(localStorage.getItem(keyValue));
  }
  return arr;
}

/** input값에 입력을 하면 list에 업데이트해줌 */
function toDoInput(){

  
  if(input.value === ""){
        return;
    }

    storeToDo = keepStore();
    storeToDo.push(input.value);

    keyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate(); // 투두리스트 키밸류값 

    localStorage.setItem(keyValue,storeToDo);
    console.log(storeToDo);

    displayToDoOnDays();
    input.value="";
    input.focus();

}


// enter키, enter클릭시 함수 호출
enterKey.addEventListener('click',toDoInput);
input.addEventListener('keypress',(event)=>{
  if(event.key==='Enter'){
    toDoInput();
  }
});

const todoList = document.querySelector('.td-listItems');

/** 리스트 값을 .listItems에 업데이트해줌 */
function displayToDoOnDays(){
  todoList.innerHTML='';
  const keyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate();
  
  
  let arrayToDo;
  const elementToDo = document.createElement('div');
  // 없을 때
  if(!localStorage.getItem(keyValue)){
      return;
  }
  // 두개 이상 있을 때
  if(localStorage.getItem(keyValue).includes(',')){
      
      arrayToDo = localStorage.getItem(keyValue).split(',');
 
      arrayToDo.forEach((value)=>{

          const elementToDo = document.createElement('div');
          elementToDo.setAttribute('class','td-listItem');
          elementToDo.innerHTML = `<img src='icon/oval.png' class='checkBox' alt='' onclick='changeCheckBox(this)'></i><span class='td-listItem-span'>${value}</span>
          <img src='icon/edit.png' class='editIcon'><img src='icon/delete.png' class='deleteIcon'>`

          todoList.appendChild(elementToDo);
          elementToDo.scrollTo();
      });

      memoryToDo(); // 체크없이 추가만 한다면 이 함수에서 어? localstorage에 아무것도 없어요!! 이 지@랄하는거임 ㅇㅇ 
  }
  // 하나만 있을 때
  else{
      value = localStorage.getItem(keyValue);
      elementToDo.setAttribute('class','td-listItem');
      elementToDo.innerHTML = `<img src='icon/oval.png' class='checkBox' onclick='changeCheckBox(this)'><span class='td-listItem-span'>${value}</span>
      <img src='icon/edit.png' class='editIcon'><img src='icon/delete.png' class='deleteIcon'>`   
      todoList.appendChild(elementToDo);

      memoryToDo();
  }

}

/** checkbox의 체크유무, span의 style요소를 localStorage를 이용하여 저장 
 *  오류있음 기존에 있는것들 체크하고 추가할때 >>>  checkToDo라는 함수를 안거치므로 기존 localStorage는 업데이트 되지 않은채로 추가가 되어서 오류발생  >> 조건문 걸어서 해결 but 초기화되는 현상 발생 .
*/
function memoryToDo(){
  const cKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate() +'c';
  const fKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate() +'f';
  const pKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate() +'p';
  let totalPlans = 0;
  if(localStorage.getItem(cKeyValue) !==null && localStorage.getItem(fKeyValue) !==null){
    let checkToDo, a;
    checkToDo = localStorage.getItem(cKeyValue).split(',');
    a = localStorage.getItem(fKeyValue);
    const fontToDo = JSON.parse(a); // json>> string -> object로 다시변환

    console.log('fontToDo',fontToDo);
    console.log('checkedToDo',checkToDo);
    totalPlans = fontToDo.length;
    const listItemImg  = document.querySelectorAll('.td-listItem img');
    const listItemSpan = document.querySelectorAll('.td-listItem-span');

    console.log(listItemSpan.length, fontToDo.length);
    console.log(listItemImg);

    if(checkToDo.length === listItemImg.length / 3){
      listItemImg.forEach((e,i)=>{
        if(i%3 === 0){
          e.src = checkToDo[i/3];
        }
      })
    }
  
    if(fontToDo.length === listItemSpan.length){
      listItemSpan.forEach((e,i)=>{
      e.style.color = fontToDo[i].color;
      e.style.textDecoration = fontToDo[i].style;
      e.style.font = fontToDo[i].font;
      })
    }
    }

  const totalPlan = document.querySelector('.total-plan-span');
  const progressPlan = document.querySelector('.progress-plan-span');
  const completedPlan = document.querySelector('.completed-plan-span');
  let progress = localStorage.getItem(pKeyValue);
  totalPlan.innerText = totalPlans;
  progressPlan.innerText =  totalPlans-progress;
  completedPlan.innerText = progress;
    
}

// class로 타게팅해서 이벤트리쓰너 적용 - 삭제 기능 구현 >>>>> css부분적인 요소도 local에서 지워야됨
todoList.addEventListener('click',(event)=>{
  if(event.target.className==='deleteIcon'){
      console.log("a: "+event.target.parentNode.textContent);
           
      const keyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate(); // textContent
      // 둘 이상 있을 때
      if(localStorage.getItem(keyValue).includes(',')){
          let array = localStorage.getItem(keyValue).split(',');
          let copyArray = [];
          
          // 왜 버그가 나는거지 value값이랑 다른 것들만 새로운 배열에 넣어서 다시 로컬스토리지를 세팅해주는건데... >> 오른쪽에 공백이 있었음
          // 만약에 똑같은 텍스트값이 여러개 있으면 버그가 남 
          array.forEach((e)=>{
              if(e !== event.target.parentNode.textContent.trimEnd()){
                  copyArray.push(e);
              }
          });
          console.log(copyArray);
          localStorage.setItem(keyValue,copyArray);
      }
      // 하나만 있을 때
      else{
          localStorage.removeItem(keyValue);
      }

      todoList.removeChild(event.target.parentNode);
  }
  
});


function changeCheckBox(e){
  // console.log(e.nextSibling);
    if(e.src.match('icon/oval.png')){
      e.src='icon/checked.png'
      e.style.opacity='1';
      e.nextSibling.style.color='rgb(214, 214, 214)';
      e.nextSibling.style.textDecoration='line-through';
      e.nextSibling.style.fontStyle='italic';
    }else{
      e.src='icon/oval.png'
      e.style.opacity='0.5';
      e.nextSibling.style.color='black';
      e.nextSibling.style.textDecoration='';
      e.nextSibling.style.fontStyle='';
    }
  // 이 정보를 그대로 넣을거임 
  toDoCheck();
}


/** checked되어있는지 확인하고 이 class값을 localStorage에 저장 */
function toDoCheck(){
  const listItemImg  = document.querySelectorAll('.td-listItem img');
  const listItemSpan = document.querySelectorAll('.td-listItem-span');
  let progress = 0;

  let mapImg =[]; // 체크박스의 이미지 소스를 저장시켜놓을 장소
  let mapSp =[]; // 폰트의 스타일 저장시켜놓을 장소
  listItemImg.forEach((e,i)=>{
    if(i%3 === 0){
      mapImg.push(e.src);
      if(e.src ==='http://127.0.0.1:5500/icon/checked.png'){
        progress += 1; 
      }
    }
  });
  listItemSpan.forEach((e,i)=>{
    mapSp.push({color: e.style.color, style: e.style.textDecoration, font: e.style.fontStyle});
  })
  const cKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate() +'c'; // mapImg넣을 localStorage
  const fKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate() +'f'; // mapSp 넣을 localStorage
  const pKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate() +'p'; // 진행중인 계획 수를 알리기 위한 localStorage
  localStorage.setItem(cKeyValue, mapImg);
  localStorage.setItem(fKeyValue, JSON.stringify(mapSp)); // 객체를 저장시킬때는 json을 이용해서 string으로 변환시켜줘야된다.
  localStorage.setItem(pKeyValue,progress);


  console.log(mapImg);
  console.log('mapSp',mapSp);
  console.log('progress',progress);

  // 진행중이 계획 알리기
  const totalPlan = document.querySelector('.total-plan-span');
  const progressPlan = document.querySelector('.progress-plan-span');
  const completedPlan = document.querySelector('.completed-plan-span');

  totalPlan.innerText = mapSp.length;
  progressPlan.innerText =  mapSp.length-progress;
  completedPlan.innerText = progress;

  // if(mapSp.length === progress){
  //   alert("today's work is completed!")
  // }
}


// -----------------------감정 기록 다이어리 ---------------------------//
const emText = document.querySelector('.em-insert-ta');
const emEnter = document.querySelector('.em-insert-button');
const diaryBoard = document.querySelector('.diaryBoard');
const selectEm = document.querySelector('.selectEm');
const inputDiary = document.querySelector('.diary');
const emotionDiary = document.querySelector('.emotionDiary');
const dbBody = document.querySelector('.db-body-content');
const resetBtn = document.querySelector('.db-reset-button');
const headerEm = document.querySelector('.insertEm div')
emEnter.addEventListener('click',toDoDiary);
resetBtn.addEventListener('click',resetDiary);

// 감정 리스트
const emList = ['icon/happy.png','icon/good.png','icon/meh.png','icon/sad.png','icon/crying.png','icon/angry.png'];

function toDoDiary(){  
  const dKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'d';

  if(emText.value === ""){
    return;
  }

  localStorage.setItem(dKeyValue,emText.value);
  if(emText.value !== ""){
    displayToDoOnDiary()
  }
  emText.value="";
}

function displayToDoOnDiary(){
  // 일기 보드를 display on 시켜주고 나머지 off
  diaryBoard.style.display ="";
  selectEm.style.display='none';
  inputDiary.style.display='none';

  const inputDate = document.querySelector('.db-header-date div');
  const dKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'d';
  const eKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'e';

  const enMonth = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const selectDate = `${date.getFullYear()}.${enMonth[date.getMonth()]}.${date.getDate()}`;

  inputDate.innerHTML = selectDate;


  // 없을 때
  if(!localStorage.getItem(dKeyValue)){
    diaryBoard.style.display ="none";
    selectEm.style.display='';
    inputDiary.style.display='';
    return;
  }

  dValue = localStorage.getItem(dKeyValue);
  eValue = localStorage.getItem(eKeyValue);
  headerEm.innerHTML=`<img src=${eValue}>`
  dbBody.innerHTML = `<div class='shownDiary' style="white-space:pre;">${dValue}</div>`;
}

function resetDiary(){
  let result = confirm('정말로 일기를 초기화하실겁니까?');
  if(result === false){
    return;
  }else{
    const dKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'d';
  
    localStorage.removeItem(dKeyValue);
    displayToDoOnDiary();
  }
  
}

// 감정들 클릭했을때 정보 저장해놓도록 구현
let insertEm ='';
const happy = document.querySelector('.happy');
const good = document.querySelector('.good');
const meh = document.querySelector('.meh');
const sad = document.querySelector('.sad');
const crying = document.querySelector('.crying');
const angry = document.querySelector('.angry');

happy.addEventListener('click',()=>{
  const eKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'e';
  insertEm = emList[0];
  localStorage.setItem(eKeyValue,insertEm);
  happy.style.border='3px solid red';
  good.style.border='3px solid rgb(188, 211, 241)';
  meh.style.border='3px solid rgb(188, 211, 241)';
  sad.style.border='3px solid rgb(188, 211, 241)';
  crying.style.border='3px solid rgb(188, 211, 241)';
  angry.style.border='3px solid rgb(188, 211, 241)';
})

good.addEventListener('click',()=>{
  const eKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'e';
  insertEm = emList[1];
  localStorage.setItem(eKeyValue,insertEm);
  happy.style.border='3px solid rgb(188, 211, 241)';
  good.style.border='3px solid orange';
  meh.style.border='3px solid rgb(188, 211, 241)';
  sad.style.border='3px solid rgb(188, 211, 241)';
  crying.style.border='3px solid rgb(188, 211, 241)';
  angry.style.border='3px solid rgb(188, 211, 241)';
})

meh.addEventListener('click',()=>{
  const eKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'e';
  insertEm = emList[2];
  localStorage.setItem(eKeyValue,insertEm);
  happy.style.border='3px solid rgb(188, 211, 241)';
  good.style.border='3px solid rgb(188, 211, 241)';
  meh.style.border='3px solid yellow';
  sad.style.border='3px solid rgb(188, 211, 241)';
  crying.style.border='3px solid rgb(188, 211, 241)';
  angry.style.border='3px solid rgb(188, 211, 241)';
})

sad.addEventListener('click',()=>{
  const eKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'e';
  insertEm = emList[3];
  localStorage.setItem(eKeyValue,insertEm);
  happy.style.border='3px solid rgb(188, 211, 241)';
  good.style.border='3px solid rgb(188, 211, 241)';
  meh.style.border='3px solid rgb(188, 211, 241)';
  sad.style.border='3px solid green';
  crying.style.border='3px solid rgb(188, 211, 241)';
  angry.style.border='3px solid rgb(188, 211, 241)';
})

crying.addEventListener('click',()=>{
  const eKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'e';
  insertEm = emList[4];
  localStorage.setItem(eKeyValue,insertEm);
  happy.style.border='3px solid rgb(188, 211, 241)';
  good.style.border='3px solid rgb(188, 211, 241)';
  meh.style.border='3px solid rgb(188, 211, 241)';
  sad.style.border='3px solid rgb(188, 211, 241)';
  crying.style.border='3px solid blue';
  angry.style.border='3px solid rgb(188, 211, 241)';
})

angry.addEventListener('click',()=>{
  const eKeyValue = date.getFullYear() + '' + date.getMonth()+ '' + date.getDate()+'e';
  insertEm = emList[5];
  localStorage.setItem(eKeyValue,insertEm);
  happy.style.border='3px solid rgb(188, 211, 241)';
  good.style.border='3px solid rgb(188, 211, 241)';
  meh.style.border='3px solid rgb(188, 211, 241)';
  sad.style.border='3px solid rgb(188, 211, 241)';
  crying.style.border='3px solid rgb(188, 211, 241)';
  angry.style.border='3px solid black';
})
