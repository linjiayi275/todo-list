const txt = document.querySelector('.txt');
const save = document.querySelector('.save');
const all = document.querySelector('.all');
const undo = document.querySelector('.undo');
const finished = document.querySelector('.finished');
const todo = document.querySelector('.todo');
const filter = document.querySelector('.filter');
const undo_num = document.querySelector('.undo_num');
const deleteAllDone = document.querySelector('.deleteAllDone');

let data = [];

render();//將畫面渲染於網頁上

//新增一筆資料
save.addEventListener("click",function(e){
  let content = txt.value.trim(); //trim是將文字前後空白刪除
  if (content == ""){
    alert("請輸入待辦事項");
    return;
  }

  let obj={};
  obj.content_todo = content;
  obj.checked = false;
  data.push(obj);
  // 也可用以下寫法
  // data.push({
  //   checked: false,
  //   content_todo: content
  // });

  render();//將畫面渲染於網頁上
  txt.value="";//清除輸入的資料
})

// 輸入完成可按enter來取代按 + ，enter代號13
txt.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();// 阻止預設事件發生
    save.click();
  }
});

//將畫面渲染於網頁上
function render(){
  let str = "";
  data.forEach(function(item,index){
    let content;
    if(data[index].checked) {
      content = 
      `<li>
      <label data-num="${index}">
      <input data-num="${index}" class="checkbox" type="checkbox" checked><span >✔</span>
      <p>${item.content_todo}</p>
      </label><input class="delete" type="button" value="╳"></li>`;
    }else{
      content = 
      `<li>
      <label data-num="${index}">
      <input data-num="${index}" class="checkbox" type="checkbox" ><span >✔</span>
      <p>${item.content_todo}</p>
      </label><input class="delete" type="button" value="╳"></li>`;
    }
    str += content;
  })
  todo.innerHTML = str;
  calc_undo_num(); //計算待完成項目
  const mouse = filter.querySelector('.mouse');
  refresh_filter(mouse); //判斷滑鼠點選的filter為全部、待完成還是未完成
}

// 計算待完成項目
function calc_undo_num(){
  let sum = 0;
  for(let i=0; i<data.length; i++){
    if(!data[i].checked){
      sum ++;
    }
  }
  undo_num.textContent = `${sum} 個待完成項目`;
}

//監聽filter被點選的目標（全部、待完成、未完成其中一個），在class加上"mouse"
filter.addEventListener("click", function (e) {
  e.target.classList.add("mouse");
  refresh_filter(e.target)
})
// 根據帶入的參數來判斷 全部、待完成、未完成 並依照其需求顯示filter上所需資料
function refresh_filter(ele){
  const checkbox = todo.querySelectorAll(".checkbox");
  if(ele.value === "待完成"){
    all.classList.remove("mouse");
    finished.classList.remove("mouse");
    for(let i=0;i<data.length; i++){
      if(data[i].checked){
        checkbox[i].parentNode.parentNode.style.display = 'none';
      }else{
        checkbox[i].parentNode.parentNode.style.display = 'flex';
      }
    }
  }else if(ele.value === "已完成"){
    all.classList.remove("mouse");
    undo.classList.remove("mouse");
    for(let i=0;i<data.length; i++){
      if(data[i].checked){
        checkbox[i].parentNode.parentNode.style.display = 'flex';
      }else{
        checkbox[i].parentNode.parentNode.style.display = 'none';
      }
    }
  }else{
    finished.classList.remove("mouse");
    undo.classList.remove("mouse");
    for (let i = 0; i < data.length; i++) {
      checkbox[i].parentNode.parentNode.style.display = 'flex';
    }
  }
}

// 是否被勾選
todo.addEventListener("click",function(e){
  let num = e.target.dataset.num;
  let checkbox = todo.querySelectorAll(".checkbox");
  if(e.target.nodeName !== "INPUT" || e.target.className === "delete"){
    return;
  }
  // console.log(checkBox[num].checked);
  if(checkbox[num].checked){
    data[num].checked = true;
  }else{
    data[num].checked = false;
  }
  calc_undo_num(); //計算待完成項目
  const mouse = filter.querySelector('.mouse');
  refresh_filter(mouse); //判斷滑鼠點選的filter為全部、待完成還是未完成
})

// 清除已完成項目
deleteAllDone.addEventListener("click",function(){
  for (let i = data.length - 1; i > -1; i--){
    if(data[i].checked){
      data.splice(i, 1);
    }
  }render();
})

// 刪除一筆資料
todo.addEventListener("click",function(e){
  if(e.target.className !== "delete"){
    return;
  }
  let num = e.target.previousSibling.dataset.num;
  // e.target.previousSibling滑鼠點選的同一層的前一個元素
  data.splice(num, 1);
  render();
})