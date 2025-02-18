System.register(["./index-legacy-BmH4OMNM.js","react/jsx-runtime","react-dom/client","recharts","react-markdown","uuid"],(function(e,t){"use strict";var n,r,s,i,o;return{setters:[e=>{n=e.r,r=e.f,s=e.b,i=e.w,o=e.s},null,null,null,null,null],execute:function(){
/*!
             * (C) Ionic http://ionicframework.com - MIT License
             */
e("startStatusTap",(()=>{const e=window;e.addEventListener("statusTap",(()=>{n((()=>{const t=e.innerWidth,n=e.innerHeight,l=document.elementFromPoint(t/2,n/2);if(!l)return;const u=r(l);u&&new Promise((e=>s(u,e))).then((()=>{i((async()=>{u.style.setProperty("--overflow","hidden"),await o(u,300),u.style.removeProperty("--overflow")}))}))}))}))}))}}}));
