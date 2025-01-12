import { useState } from "react";
import React from "react"; //整包匯入

import axios from axios;

function ReactUseState() {
  const [text, setText] = useState("初始值");
  console.log(text);


// 會一直發出請求
// (async ()=>{

// });

//只發出一次, =vue.watch
// (async ()=>{

// },[]);

// useEffect 錯誤寫法-1
// useEffecth(async ()=>{

// });

// useEffect 正確寫法
useEffecth(()=>{
    (async ()=>{

    })();
},[]);

// useEffect 錯誤寫法-2
// useEffecth(()=>{
//     // text++; CPU會標高電腦會掛掉
//     //setText(text) 錯誤寫法, 等於寫在外面, 一直刷新
// },[text]);


// useEffect 常見寫法
// async function getPerson(params) {
    
// }
// useEffecth(()=>{
//     getPerson();
// },[]);


  return (
    <>
      <h1>useState</h1>
      <input
        type="text"
        name="name"
        id="name"
        onChange={(e) => setText(e.target.value)}
      />
    </>
  );
}

export default ReactUseState;
