System.register(["./index-legacy-BmH4OMNM.js","react/jsx-runtime","react-dom/client","recharts","react-markdown","uuid"],(function(t,e){"use strict";var n,r,c;return{setters:[t=>{n=t.i,r=t.c,c=t.a},null,null,null,null,null],execute:function(){
/*!
             * (C) Ionic http://ionicframework.com - MIT License
             */
t("createSwipeBackGesture",((t,e,i,a,s)=>{const l=t.ownerDocument.defaultView;let o=n(t);const u=t=>o?-t.deltaX:t.deltaX;return r({el:t,gestureName:"goback-swipe",gesturePriority:101,threshold:10,canStart:r=>(o=n(t),(t=>{const{startX:e}=t;return o?e>=l.innerWidth-50:e<=50})(r)&&e()),onStart:i,onMove:t=>{const e=u(t)/l.innerWidth;a(e)},onEnd:t=>{const e=u(t),n=l.innerWidth,r=e/n,i=(t=>o?-t.velocityX:t.velocityX)(t),a=i>=0&&(i>.2||e>n/2),d=(a?1-r:r)*n;let h=0;if(d>5){const t=d/Math.abs(i);h=Math.min(t,540)}s(a,r<=0?.01:c(0,r,.9999),h)}})}))}}}));
