import{r as i,f as a,b as m,w as p,s as c}from"./index-CyzWkqUU.js";import"react/jsx-runtime";import"react-dom/client";import"recharts";import"react-markdown";import"uuid";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const T=()=>{const o=window;o.addEventListener("statusTap",()=>{i(()=>{const n=o.innerWidth,r=o.innerHeight,e=document.elementFromPoint(n/2,r/2);if(!e)return;const t=a(e);t&&new Promise(s=>m(t,s)).then(()=>{p(async()=>{t.style.setProperty("--overflow","hidden"),await c(t,300),t.style.removeProperty("--overflow")})})})})};export{T as startStatusTap};
