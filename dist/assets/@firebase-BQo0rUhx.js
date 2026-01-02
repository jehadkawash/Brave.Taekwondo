import{o as Wl}from"./idb-BXWtuYvb.js";const Ql=()=>{};var Ko={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ou=function(n){const t=[];let e=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},Xl=function(n){const t=[];let e=0,r=0;for(;e<n.length;){const s=n[e++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[e++];t[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[e++],a=n[e++],l=n[e++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|l&63)-65536;t[r++]=String.fromCharCode(55296+(h>>10)),t[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[e++],a=n[e++];t[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return t.join("")},au={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,l=a?n[s+1]:0,h=s+2<n.length,f=h?n[s+2]:0,p=o>>2,_=(o&3)<<4|l>>4;let I=(l&15)<<2|f>>6,b=f&63;h||(b=64,a||(I=64)),r.push(e[p],e[_],e[I],e[b])}return r.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(ou(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):Xl(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=e[n.charAt(s++)],l=s<n.length?e[n.charAt(s)]:0;++s;const f=s<n.length?e[n.charAt(s)]:64;++s;const _=s<n.length?e[n.charAt(s)]:64;if(++s,o==null||l==null||f==null||_==null)throw new Yl;const I=o<<2|l>>4;if(r.push(I),f!==64){const b=l<<4&240|f>>2;if(r.push(b),_!==64){const D=f<<6&192|_;r.push(D)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Yl extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Jl=function(n){const t=ou(n);return au.encodeByteArray(t,!0)},Er=function(n){return Jl(n).replace(/\./g,"")},Zl=function(n){try{return au.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function th(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eh=()=>th().__FIREBASE_DEFAULTS__,nh=()=>{if(typeof process>"u"||typeof Ko>"u")return;const n=Ko.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},rh=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&Zl(n[1]);return t&&JSON.parse(t)},Or=()=>{try{return Ql()||eh()||nh()||rh()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},sh=n=>{var t,e;return(e=(t=Or())==null?void 0:t.emulatorHosts)==null?void 0:e[n]},uu=n=>{const t=sh(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),r]:[t.substring(0,e),r]},cu=()=>{var n;return(n=Or())==null?void 0:n.config},Og=n=>{var t;return(t=Or())==null?void 0:t[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,r)=>{e?this.reject(e):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mn(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function lu(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hu(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},r=t||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Er(JSON.stringify(e)),Er(JSON.stringify(a)),""].join(".")}const In={};function oh(){const n={prod:[],emulator:[]};for(const t of Object.keys(In))In[t]?n.emulator.push(t):n.prod.push(t);return n}function ah(n){let t=document.getElementById(n),e=!1;return t||(t=document.createElement("div"),t.setAttribute("id",n),e=!0),{created:e,element:t}}let Wo=!1;function fu(n,t){if(typeof window>"u"||typeof document>"u"||!Mn(window.location.host)||In[n]===t||In[n]||Wo)return;In[n]=t;function e(I){return`__firebase__banner__${I}`}const r="__firebase__banner",o=oh().prod.length>0;function a(){const I=document.getElementById(r);I&&I.remove()}function l(I){I.style.display="flex",I.style.background="#7faaf0",I.style.position="fixed",I.style.bottom="5px",I.style.left="5px",I.style.padding=".5em",I.style.borderRadius="5px",I.style.alignItems="center"}function h(I,b){I.setAttribute("width","24"),I.setAttribute("id",b),I.setAttribute("height","24"),I.setAttribute("viewBox","0 0 24 24"),I.setAttribute("fill","none"),I.style.marginLeft="-6px"}function f(){const I=document.createElement("span");return I.style.cursor="pointer",I.style.marginLeft="16px",I.style.fontSize="24px",I.innerHTML=" &times;",I.onclick=()=>{Wo=!0,a()},I}function p(I,b){I.setAttribute("id",b),I.innerText="Learn more",I.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",I.setAttribute("target","__blank"),I.style.paddingLeft="5px",I.style.textDecoration="underline"}function _(){const I=ah(r),b=e("text"),D=document.getElementById(b)||document.createElement("span"),k=e("learnmore"),P=document.getElementById(k)||document.createElement("a"),j=e("preprendIcon"),U=document.getElementById(j)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(I.created){const B=I.element;l(B),p(P,k);const K=f();h(U,j),B.append(U,D,P,K),document.body.appendChild(B)}o?(D.innerText="Preview backend disconnected.",U.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(U.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,D.innerText="Preview backend running in this workspace."),D.setAttribute("id",b)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",_):_()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ri(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function xg(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ri())}function uh(){var t;const n=(t=Or())==null?void 0:t.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Mg(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Lg(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Fg(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ug(){const n=ri();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function ch(){return!uh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function lh(){try{return typeof indexedDB=="object"}catch{return!1}}function hh(){return new Promise((n,t)=>{try{let e=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var o;t(((o=s.error)==null?void 0:o.message)||"")}}catch(e){t(e)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fh="FirebaseError";class Ve extends Error{constructor(t,e,r){super(e),this.code=t,this.customData=r,this.name=fh,Object.setPrototypeOf(this,Ve.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,du.prototype.create)}}class du{constructor(t,e,r){this.service=t,this.serviceName=e,this.errors=r}create(t,...e){const r=e[0]||{},s=`${this.service}/${t}`,o=this.errors[t],a=o?dh(o,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new Ve(s,l,r)}}function dh(n,t){return n.replace(ph,(e,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const ph=/\{\$([^}]+)}/g;function Bg(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}function Tr(n,t){if(n===t)return!0;const e=Object.keys(n),r=Object.keys(t);for(const s of e){if(!r.includes(s))return!1;const o=n[s],a=t[s];if(Qo(o)&&Qo(a)){if(!Tr(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!e.includes(s))return!1;return!0}function Qo(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qg(n){const t=[];for(const[e,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function jg(n){const t={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,o]=r.split("=");t[decodeURIComponent(s)]=decodeURIComponent(o)}}),t}function $g(n){const t=n.indexOf("?");if(!t)return"";const e=n.indexOf("#",t);return n.substring(t,e>0?e:void 0)}function zg(n,t){const e=new mh(n,t);return e.subscribe.bind(e)}class mh{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(r=>{this.error(r)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,r){let s;if(t===void 0&&e===void 0&&r===void 0)throw new Error("Missing Observer.");gh(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:r},s.next===void 0&&(s.next=Rs),s.error===void 0&&(s.error=Rs),s.complete===void 0&&(s.complete=Rs);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function gh(n,t){if(typeof n!="object"||n===null)return!1;for(const e of t)if(e in n&&typeof n[e]=="function")return!0;return!1}function Rs(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(n){return n&&n._delegate?n._delegate:n}class qe{constructor(t,e,r){this.name=t,this.instanceFactory=e,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ie="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _h{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const r=new ih;if(this.instancesDeferred.set(e,r),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){const e=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),r=(t==null?void 0:t.optional)??!1;if(this.isInitialized(e)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:e})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Eh(t))try{this.getOrInitializeService({instanceIdentifier:Ie})}catch{}for(const[e,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(t=Ie){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Ie){return this.instances.has(t)}getOptions(t=Ie){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:e});for(const[o,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(o);r===l&&a.resolve(s)}return s}onInit(t,e){const r=this.normalizeInstanceIdentifier(e),s=this.onInitCallbacks.get(r)??new Set;s.add(t),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&t(o,r),()=>{s.delete(t)}}invokeOnInitCallbacks(t,e){const r=this.onInitCallbacks.get(e);if(r)for(const s of r)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:yh(t),options:e}),this.instances.set(t,r),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=Ie){return this.component?this.component.multipleInstances?t:Ie:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function yh(n){return n===Ie?void 0:n}function Eh(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Th{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new _h(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var G;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(G||(G={}));const Ih={debug:G.DEBUG,verbose:G.VERBOSE,info:G.INFO,warn:G.WARN,error:G.ERROR,silent:G.SILENT},wh=G.INFO,Ah={[G.DEBUG]:"log",[G.VERBOSE]:"log",[G.INFO]:"info",[G.WARN]:"warn",[G.ERROR]:"error"},vh=(n,t,...e)=>{if(t<n.logLevel)return;const r=new Date().toISOString(),s=Ah[t];if(s)console[s](`[${r}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class pu{constructor(t){this.name=t,this._logLevel=wh,this._logHandler=vh,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in G))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Ih[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,G.DEBUG,...t),this._logHandler(this,G.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,G.VERBOSE,...t),this._logHandler(this,G.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,G.INFO,...t),this._logHandler(this,G.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,G.WARN,...t),this._logHandler(this,G.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,G.ERROR,...t),this._logHandler(this,G.ERROR,...t)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rh{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(bh(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function bh(n){const t=n.getComponent();return(t==null?void 0:t.type)==="VERSION"}const xs="@firebase/app",Xo="0.14.6";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ht=new pu("@firebase/app"),Sh="@firebase/app-compat",Ch="@firebase/analytics-compat",Ph="@firebase/analytics",Vh="@firebase/app-check-compat",Dh="@firebase/app-check",Nh="@firebase/auth",kh="@firebase/auth-compat",Oh="@firebase/database",xh="@firebase/data-connect",Mh="@firebase/database-compat",Lh="@firebase/functions",Fh="@firebase/functions-compat",Uh="@firebase/installations",Bh="@firebase/installations-compat",qh="@firebase/messaging",jh="@firebase/messaging-compat",$h="@firebase/performance",zh="@firebase/performance-compat",Hh="@firebase/remote-config",Gh="@firebase/remote-config-compat",Kh="@firebase/storage",Wh="@firebase/storage-compat",Qh="@firebase/firestore",Xh="@firebase/ai",Yh="@firebase/firestore-compat",Jh="firebase",Zh="12.6.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ms="[DEFAULT]",tf={[xs]:"fire-core",[Sh]:"fire-core-compat",[Ph]:"fire-analytics",[Ch]:"fire-analytics-compat",[Dh]:"fire-app-check",[Vh]:"fire-app-check-compat",[Nh]:"fire-auth",[kh]:"fire-auth-compat",[Oh]:"fire-rtdb",[xh]:"fire-data-connect",[Mh]:"fire-rtdb-compat",[Lh]:"fire-fn",[Fh]:"fire-fn-compat",[Uh]:"fire-iid",[Bh]:"fire-iid-compat",[qh]:"fire-fcm",[jh]:"fire-fcm-compat",[$h]:"fire-perf",[zh]:"fire-perf-compat",[Hh]:"fire-rc",[Gh]:"fire-rc-compat",[Kh]:"fire-gcs",[Wh]:"fire-gcs-compat",[Qh]:"fire-fst",[Yh]:"fire-fst-compat",[Xh]:"fire-vertex","fire-js":"fire-js",[Jh]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ir=new Map,ef=new Map,Ls=new Map;function Yo(n,t){try{n.container.addComponent(t)}catch(e){Ht.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function Sn(n){const t=n.name;if(Ls.has(t))return Ht.debug(`There were multiple attempts to register component ${t}.`),!1;Ls.set(t,n);for(const e of Ir.values())Yo(e,n);for(const e of ef.values())Yo(e,n);return!0}function mu(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function gu(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nf={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},re=new du("app","Firebase",nf);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rf{constructor(t,e,r){this._isDeleted=!1,this._options={...t},this._config={...e},this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new qe("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw re.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _u=Zh;function sf(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const r={name:Ms,automaticDataCollectionEnabled:!0,...t},s=r.name;if(typeof s!="string"||!s)throw re.create("bad-app-name",{appName:String(s)});if(e||(e=cu()),!e)throw re.create("no-options");const o=Ir.get(s);if(o){if(Tr(e,o.options)&&Tr(r,o.config))return o;throw re.create("duplicate-app",{appName:s})}const a=new Th(s);for(const h of Ls.values())a.addComponent(h);const l=new rf(e,r,a);return Ir.set(s,l),l}function yu(n=Ms){const t=Ir.get(n);if(!t&&n===Ms&&cu())return sf();if(!t)throw re.create("no-app",{appName:n});return t}function Ae(n,t,e){let r=tf[n]??n;e&&(r+=`-${e}`);const s=r.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const a=[`Unable to register library "${r}" with version "${t}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Ht.warn(a.join(" "));return}Sn(new qe(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const of="firebase-heartbeat-database",af=1,Cn="firebase-heartbeat-store";let bs=null;function Eu(){return bs||(bs=Wl(of,af,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(Cn)}catch(e){console.warn(e)}}}}).catch(n=>{throw re.create("idb-open",{originalErrorMessage:n.message})})),bs}async function uf(n){try{const e=(await Eu()).transaction(Cn),r=await e.objectStore(Cn).get(Tu(n));return await e.done,r}catch(t){if(t instanceof Ve)Ht.warn(t.message);else{const e=re.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});Ht.warn(e.message)}}}async function Jo(n,t){try{const r=(await Eu()).transaction(Cn,"readwrite");await r.objectStore(Cn).put(t,Tu(n)),await r.done}catch(e){if(e instanceof Ve)Ht.warn(e.message);else{const r=re.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});Ht.warn(r.message)}}}function Tu(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cf=1024,lf=30;class hf{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new df(e),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=Zo();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats.length>lf){const a=pf(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Ht.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=Zo(),{heartbeatsToSend:r,unsentEntries:s}=ff(this._heartbeatsCache.heartbeats),o=Er(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(e){return Ht.warn(e),""}}}function Zo(){return new Date().toISOString().substring(0,10)}function ff(n,t=cf){const e=[];let r=n.slice();for(const s of n){const o=e.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),ta(e)>t){o.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),ta(e)>t){e.pop();break}r=r.slice(1)}return{heartbeatsToSend:e,unsentEntries:r}}class df{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return lh()?hh().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await uf(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return Jo(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return Jo(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}}function ta(n){return Er(JSON.stringify({version:2,heartbeats:n})).length}function pf(n){if(n.length===0)return-1;let t=0,e=n[0].date;for(let r=1;r<n.length;r++)n[r].date<e&&(e=n[r].date,t=r);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mf(n){Sn(new qe("platform-logger",t=>new Rh(t),"PRIVATE")),Sn(new qe("heartbeat",t=>new hf(t),"PRIVATE")),Ae(xs,Xo,n),Ae(xs,Xo,"esm2020"),Ae("fire-js","")}mf("");var ea=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var se,Iu;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(T,m){function y(){}y.prototype=m.prototype,T.F=m.prototype,T.prototype=new y,T.prototype.constructor=T,T.D=function(w,E,v){for(var g=Array(arguments.length-2),Rt=2;Rt<arguments.length;Rt++)g[Rt-2]=arguments[Rt];return m.prototype[E].apply(w,g)}}function e(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}t(r,e),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,m,y){y||(y=0);const w=Array(16);if(typeof m=="string")for(var E=0;E<16;++E)w[E]=m.charCodeAt(y++)|m.charCodeAt(y++)<<8|m.charCodeAt(y++)<<16|m.charCodeAt(y++)<<24;else for(E=0;E<16;++E)w[E]=m[y++]|m[y++]<<8|m[y++]<<16|m[y++]<<24;m=T.g[0],y=T.g[1],E=T.g[2];let v=T.g[3],g;g=m+(v^y&(E^v))+w[0]+3614090360&4294967295,m=y+(g<<7&4294967295|g>>>25),g=v+(E^m&(y^E))+w[1]+3905402710&4294967295,v=m+(g<<12&4294967295|g>>>20),g=E+(y^v&(m^y))+w[2]+606105819&4294967295,E=v+(g<<17&4294967295|g>>>15),g=y+(m^E&(v^m))+w[3]+3250441966&4294967295,y=E+(g<<22&4294967295|g>>>10),g=m+(v^y&(E^v))+w[4]+4118548399&4294967295,m=y+(g<<7&4294967295|g>>>25),g=v+(E^m&(y^E))+w[5]+1200080426&4294967295,v=m+(g<<12&4294967295|g>>>20),g=E+(y^v&(m^y))+w[6]+2821735955&4294967295,E=v+(g<<17&4294967295|g>>>15),g=y+(m^E&(v^m))+w[7]+4249261313&4294967295,y=E+(g<<22&4294967295|g>>>10),g=m+(v^y&(E^v))+w[8]+1770035416&4294967295,m=y+(g<<7&4294967295|g>>>25),g=v+(E^m&(y^E))+w[9]+2336552879&4294967295,v=m+(g<<12&4294967295|g>>>20),g=E+(y^v&(m^y))+w[10]+4294925233&4294967295,E=v+(g<<17&4294967295|g>>>15),g=y+(m^E&(v^m))+w[11]+2304563134&4294967295,y=E+(g<<22&4294967295|g>>>10),g=m+(v^y&(E^v))+w[12]+1804603682&4294967295,m=y+(g<<7&4294967295|g>>>25),g=v+(E^m&(y^E))+w[13]+4254626195&4294967295,v=m+(g<<12&4294967295|g>>>20),g=E+(y^v&(m^y))+w[14]+2792965006&4294967295,E=v+(g<<17&4294967295|g>>>15),g=y+(m^E&(v^m))+w[15]+1236535329&4294967295,y=E+(g<<22&4294967295|g>>>10),g=m+(E^v&(y^E))+w[1]+4129170786&4294967295,m=y+(g<<5&4294967295|g>>>27),g=v+(y^E&(m^y))+w[6]+3225465664&4294967295,v=m+(g<<9&4294967295|g>>>23),g=E+(m^y&(v^m))+w[11]+643717713&4294967295,E=v+(g<<14&4294967295|g>>>18),g=y+(v^m&(E^v))+w[0]+3921069994&4294967295,y=E+(g<<20&4294967295|g>>>12),g=m+(E^v&(y^E))+w[5]+3593408605&4294967295,m=y+(g<<5&4294967295|g>>>27),g=v+(y^E&(m^y))+w[10]+38016083&4294967295,v=m+(g<<9&4294967295|g>>>23),g=E+(m^y&(v^m))+w[15]+3634488961&4294967295,E=v+(g<<14&4294967295|g>>>18),g=y+(v^m&(E^v))+w[4]+3889429448&4294967295,y=E+(g<<20&4294967295|g>>>12),g=m+(E^v&(y^E))+w[9]+568446438&4294967295,m=y+(g<<5&4294967295|g>>>27),g=v+(y^E&(m^y))+w[14]+3275163606&4294967295,v=m+(g<<9&4294967295|g>>>23),g=E+(m^y&(v^m))+w[3]+4107603335&4294967295,E=v+(g<<14&4294967295|g>>>18),g=y+(v^m&(E^v))+w[8]+1163531501&4294967295,y=E+(g<<20&4294967295|g>>>12),g=m+(E^v&(y^E))+w[13]+2850285829&4294967295,m=y+(g<<5&4294967295|g>>>27),g=v+(y^E&(m^y))+w[2]+4243563512&4294967295,v=m+(g<<9&4294967295|g>>>23),g=E+(m^y&(v^m))+w[7]+1735328473&4294967295,E=v+(g<<14&4294967295|g>>>18),g=y+(v^m&(E^v))+w[12]+2368359562&4294967295,y=E+(g<<20&4294967295|g>>>12),g=m+(y^E^v)+w[5]+4294588738&4294967295,m=y+(g<<4&4294967295|g>>>28),g=v+(m^y^E)+w[8]+2272392833&4294967295,v=m+(g<<11&4294967295|g>>>21),g=E+(v^m^y)+w[11]+1839030562&4294967295,E=v+(g<<16&4294967295|g>>>16),g=y+(E^v^m)+w[14]+4259657740&4294967295,y=E+(g<<23&4294967295|g>>>9),g=m+(y^E^v)+w[1]+2763975236&4294967295,m=y+(g<<4&4294967295|g>>>28),g=v+(m^y^E)+w[4]+1272893353&4294967295,v=m+(g<<11&4294967295|g>>>21),g=E+(v^m^y)+w[7]+4139469664&4294967295,E=v+(g<<16&4294967295|g>>>16),g=y+(E^v^m)+w[10]+3200236656&4294967295,y=E+(g<<23&4294967295|g>>>9),g=m+(y^E^v)+w[13]+681279174&4294967295,m=y+(g<<4&4294967295|g>>>28),g=v+(m^y^E)+w[0]+3936430074&4294967295,v=m+(g<<11&4294967295|g>>>21),g=E+(v^m^y)+w[3]+3572445317&4294967295,E=v+(g<<16&4294967295|g>>>16),g=y+(E^v^m)+w[6]+76029189&4294967295,y=E+(g<<23&4294967295|g>>>9),g=m+(y^E^v)+w[9]+3654602809&4294967295,m=y+(g<<4&4294967295|g>>>28),g=v+(m^y^E)+w[12]+3873151461&4294967295,v=m+(g<<11&4294967295|g>>>21),g=E+(v^m^y)+w[15]+530742520&4294967295,E=v+(g<<16&4294967295|g>>>16),g=y+(E^v^m)+w[2]+3299628645&4294967295,y=E+(g<<23&4294967295|g>>>9),g=m+(E^(y|~v))+w[0]+4096336452&4294967295,m=y+(g<<6&4294967295|g>>>26),g=v+(y^(m|~E))+w[7]+1126891415&4294967295,v=m+(g<<10&4294967295|g>>>22),g=E+(m^(v|~y))+w[14]+2878612391&4294967295,E=v+(g<<15&4294967295|g>>>17),g=y+(v^(E|~m))+w[5]+4237533241&4294967295,y=E+(g<<21&4294967295|g>>>11),g=m+(E^(y|~v))+w[12]+1700485571&4294967295,m=y+(g<<6&4294967295|g>>>26),g=v+(y^(m|~E))+w[3]+2399980690&4294967295,v=m+(g<<10&4294967295|g>>>22),g=E+(m^(v|~y))+w[10]+4293915773&4294967295,E=v+(g<<15&4294967295|g>>>17),g=y+(v^(E|~m))+w[1]+2240044497&4294967295,y=E+(g<<21&4294967295|g>>>11),g=m+(E^(y|~v))+w[8]+1873313359&4294967295,m=y+(g<<6&4294967295|g>>>26),g=v+(y^(m|~E))+w[15]+4264355552&4294967295,v=m+(g<<10&4294967295|g>>>22),g=E+(m^(v|~y))+w[6]+2734768916&4294967295,E=v+(g<<15&4294967295|g>>>17),g=y+(v^(E|~m))+w[13]+1309151649&4294967295,y=E+(g<<21&4294967295|g>>>11),g=m+(E^(y|~v))+w[4]+4149444226&4294967295,m=y+(g<<6&4294967295|g>>>26),g=v+(y^(m|~E))+w[11]+3174756917&4294967295,v=m+(g<<10&4294967295|g>>>22),g=E+(m^(v|~y))+w[2]+718787259&4294967295,E=v+(g<<15&4294967295|g>>>17),g=y+(v^(E|~m))+w[9]+3951481745&4294967295,T.g[0]=T.g[0]+m&4294967295,T.g[1]=T.g[1]+(E+(g<<21&4294967295|g>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+v&4294967295}r.prototype.v=function(T,m){m===void 0&&(m=T.length);const y=m-this.blockSize,w=this.C;let E=this.h,v=0;for(;v<m;){if(E==0)for(;v<=y;)s(this,T,v),v+=this.blockSize;if(typeof T=="string"){for(;v<m;)if(w[E++]=T.charCodeAt(v++),E==this.blockSize){s(this,w),E=0;break}}else for(;v<m;)if(w[E++]=T[v++],E==this.blockSize){s(this,w),E=0;break}}this.h=E,this.o+=m},r.prototype.A=function(){var T=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);T[0]=128;for(var m=1;m<T.length-8;++m)T[m]=0;m=this.o*8;for(var y=T.length-8;y<T.length;++y)T[y]=m&255,m/=256;for(this.v(T),T=Array(16),m=0,y=0;y<4;++y)for(let w=0;w<32;w+=8)T[m++]=this.g[y]>>>w&255;return T};function o(T,m){var y=l;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=m(T)}function a(T,m){this.h=m;const y=[];let w=!0;for(let E=T.length-1;E>=0;E--){const v=T[E]|0;w&&v==m||(y[E]=v,w=!1)}this.g=y}var l={};function h(T){return-128<=T&&T<128?o(T,function(m){return new a([m|0],m<0?-1:0)}):new a([T|0],T<0?-1:0)}function f(T){if(isNaN(T)||!isFinite(T))return _;if(T<0)return P(f(-T));const m=[];let y=1;for(let w=0;T>=y;w++)m[w]=T/y|0,y*=4294967296;return new a(m,0)}function p(T,m){if(T.length==0)throw Error("number format error: empty string");if(m=m||10,m<2||36<m)throw Error("radix out of range: "+m);if(T.charAt(0)=="-")return P(p(T.substring(1),m));if(T.indexOf("-")>=0)throw Error('number format error: interior "-" character');const y=f(Math.pow(m,8));let w=_;for(let v=0;v<T.length;v+=8){var E=Math.min(8,T.length-v);const g=parseInt(T.substring(v,v+E),m);E<8?(E=f(Math.pow(m,E)),w=w.j(E).add(f(g))):(w=w.j(y),w=w.add(f(g)))}return w}var _=h(0),I=h(1),b=h(16777216);n=a.prototype,n.m=function(){if(k(this))return-P(this).m();let T=0,m=1;for(let y=0;y<this.g.length;y++){const w=this.i(y);T+=(w>=0?w:4294967296+w)*m,m*=4294967296}return T},n.toString=function(T){if(T=T||10,T<2||36<T)throw Error("radix out of range: "+T);if(D(this))return"0";if(k(this))return"-"+P(this).toString(T);const m=f(Math.pow(T,6));var y=this;let w="";for(;;){const E=K(y,m).g;y=j(y,E.j(m));let v=((y.g.length>0?y.g[0]:y.h)>>>0).toString(T);if(y=E,D(y))return v+w;for(;v.length<6;)v="0"+v;w=v+w}},n.i=function(T){return T<0?0:T<this.g.length?this.g[T]:this.h};function D(T){if(T.h!=0)return!1;for(let m=0;m<T.g.length;m++)if(T.g[m]!=0)return!1;return!0}function k(T){return T.h==-1}n.l=function(T){return T=j(this,T),k(T)?-1:D(T)?0:1};function P(T){const m=T.g.length,y=[];for(let w=0;w<m;w++)y[w]=~T.g[w];return new a(y,~T.h).add(I)}n.abs=function(){return k(this)?P(this):this},n.add=function(T){const m=Math.max(this.g.length,T.g.length),y=[];let w=0;for(let E=0;E<=m;E++){let v=w+(this.i(E)&65535)+(T.i(E)&65535),g=(v>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);w=g>>>16,v&=65535,g&=65535,y[E]=g<<16|v}return new a(y,y[y.length-1]&-2147483648?-1:0)};function j(T,m){return T.add(P(m))}n.j=function(T){if(D(this)||D(T))return _;if(k(this))return k(T)?P(this).j(P(T)):P(P(this).j(T));if(k(T))return P(this.j(P(T)));if(this.l(b)<0&&T.l(b)<0)return f(this.m()*T.m());const m=this.g.length+T.g.length,y=[];for(var w=0;w<2*m;w++)y[w]=0;for(w=0;w<this.g.length;w++)for(let E=0;E<T.g.length;E++){const v=this.i(w)>>>16,g=this.i(w)&65535,Rt=T.i(E)>>>16,me=T.i(E)&65535;y[2*w+2*E]+=g*me,U(y,2*w+2*E),y[2*w+2*E+1]+=v*me,U(y,2*w+2*E+1),y[2*w+2*E+1]+=g*Rt,U(y,2*w+2*E+1),y[2*w+2*E+2]+=v*Rt,U(y,2*w+2*E+2)}for(T=0;T<m;T++)y[T]=y[2*T+1]<<16|y[2*T];for(T=m;T<2*m;T++)y[T]=0;return new a(y,0)};function U(T,m){for(;(T[m]&65535)!=T[m];)T[m+1]+=T[m]>>>16,T[m]&=65535,m++}function B(T,m){this.g=T,this.h=m}function K(T,m){if(D(m))throw Error("division by zero");if(D(T))return new B(_,_);if(k(T))return m=K(P(T),m),new B(P(m.g),P(m.h));if(k(m))return m=K(T,P(m)),new B(P(m.g),m.h);if(T.g.length>30){if(k(T)||k(m))throw Error("slowDivide_ only works with positive integers.");for(var y=I,w=m;w.l(T)<=0;)y=ht(y),w=ht(w);var E=Z(y,1),v=Z(w,1);for(w=Z(w,2),y=Z(y,2);!D(w);){var g=v.add(w);g.l(T)<=0&&(E=E.add(y),v=g),w=Z(w,1),y=Z(y,1)}return m=j(T,E.j(m)),new B(E,m)}for(E=_;T.l(m)>=0;){for(y=Math.max(1,Math.floor(T.m()/m.m())),w=Math.ceil(Math.log(y)/Math.LN2),w=w<=48?1:Math.pow(2,w-48),v=f(y),g=v.j(m);k(g)||g.l(T)>0;)y-=w,v=f(y),g=v.j(m);D(v)&&(v=I),E=E.add(v),T=j(T,g)}return new B(E,T)}n.B=function(T){return K(this,T).h},n.and=function(T){const m=Math.max(this.g.length,T.g.length),y=[];for(let w=0;w<m;w++)y[w]=this.i(w)&T.i(w);return new a(y,this.h&T.h)},n.or=function(T){const m=Math.max(this.g.length,T.g.length),y=[];for(let w=0;w<m;w++)y[w]=this.i(w)|T.i(w);return new a(y,this.h|T.h)},n.xor=function(T){const m=Math.max(this.g.length,T.g.length),y=[];for(let w=0;w<m;w++)y[w]=this.i(w)^T.i(w);return new a(y,this.h^T.h)};function ht(T){const m=T.g.length+1,y=[];for(let w=0;w<m;w++)y[w]=T.i(w)<<1|T.i(w-1)>>>31;return new a(y,T.h)}function Z(T,m){const y=m>>5;m%=32;const w=T.g.length-y,E=[];for(let v=0;v<w;v++)E[v]=m>0?T.i(v+y)>>>m|T.i(v+y+1)<<32-m:T.i(v+y);return new a(E,T.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Iu=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=f,a.fromString=p,se=a}).apply(typeof ea<"u"?ea:typeof self<"u"?self:typeof window<"u"?window:{});var or=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var wu,_n,Au,dr,Fs,vu,Ru,bu;(function(){var n,t=Object.defineProperty;function e(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof or=="object"&&or];for(var u=0;u<i.length;++u){var c=i[u];if(c&&c.Math==Math)return c}throw Error("Cannot find global object")}var r=e(this);function s(i,u){if(u)t:{var c=r;i=i.split(".");for(var d=0;d<i.length-1;d++){var A=i[d];if(!(A in c))break t;c=c[A]}i=i[i.length-1],d=c[i],u=u(d),u!=d&&u!=null&&t(c,i,{configurable:!0,writable:!0,value:u})}}s("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(i){return i||function(u){var c=[],d;for(d in u)Object.prototype.hasOwnProperty.call(u,d)&&c.push([d,u[d]]);return c}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function l(i){var u=typeof i;return u=="object"&&i!=null||u=="function"}function h(i,u,c){return i.call.apply(i.bind,arguments)}function f(i,u,c){return f=h,f.apply(null,arguments)}function p(i,u){var c=Array.prototype.slice.call(arguments,1);return function(){var d=c.slice();return d.push.apply(d,arguments),i.apply(this,d)}}function _(i,u){function c(){}c.prototype=u.prototype,i.Z=u.prototype,i.prototype=new c,i.prototype.constructor=i,i.Ob=function(d,A,R){for(var V=Array(arguments.length-2),q=2;q<arguments.length;q++)V[q-2]=arguments[q];return u.prototype[A].apply(d,V)}}var I=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function b(i){const u=i.length;if(u>0){const c=Array(u);for(let d=0;d<u;d++)c[d]=i[d];return c}return[]}function D(i,u){for(let d=1;d<arguments.length;d++){const A=arguments[d];var c=typeof A;if(c=c!="object"?c:A?Array.isArray(A)?"array":c:"null",c=="array"||c=="object"&&typeof A.length=="number"){c=i.length||0;const R=A.length||0;i.length=c+R;for(let V=0;V<R;V++)i[c+V]=A[V]}else i.push(A)}}class k{constructor(u,c){this.i=u,this.j=c,this.h=0,this.g=null}get(){let u;return this.h>0?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function P(i){a.setTimeout(()=>{throw i},0)}function j(){var i=T;let u=null;return i.g&&(u=i.g,i.g=i.g.next,i.g||(i.h=null),u.next=null),u}class U{constructor(){this.h=this.g=null}add(u,c){const d=B.get();d.set(u,c),this.h?this.h.next=d:this.g=d,this.h=d}}var B=new k(()=>new K,i=>i.reset());class K{constructor(){this.next=this.g=this.h=null}set(u,c){this.h=u,this.g=c,this.next=null}reset(){this.next=this.g=this.h=null}}let ht,Z=!1,T=new U,m=()=>{const i=Promise.resolve(void 0);ht=()=>{i.then(y)}};function y(){for(var i;i=j();){try{i.h.call(i.g)}catch(c){P(c)}var u=B;u.j(i),u.h<100&&(u.h++,i.next=u.g,u.g=i)}Z=!1}function w(){this.u=this.u,this.C=this.C}w.prototype.u=!1,w.prototype.dispose=function(){this.u||(this.u=!0,this.N())},w.prototype[Symbol.dispose]=function(){this.dispose()},w.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function E(i,u){this.type=i,this.g=this.target=u,this.defaultPrevented=!1}E.prototype.h=function(){this.defaultPrevented=!0};var v=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var i=!1,u=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const c=()=>{};a.addEventListener("test",c,u),a.removeEventListener("test",c,u)}catch{}return i}();function g(i){return/^[\s\xa0]*$/.test(i)}function Rt(i,u){E.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,u)}_(Rt,E),Rt.prototype.init=function(i,u){const c=this.type=i.type,d=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=u,u=i.relatedTarget,u||(c=="mouseover"?u=i.fromElement:c=="mouseout"&&(u=i.toElement)),this.relatedTarget=u,d?(this.clientX=d.clientX!==void 0?d.clientX:d.pageX,this.clientY=d.clientY!==void 0?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&Rt.Z.h.call(this)},Rt.prototype.h=function(){Rt.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var me="closure_listenable_"+(Math.random()*1e6|0),gl=0;function _l(i,u,c,d,A){this.listener=i,this.proxy=null,this.src=u,this.type=c,this.capture=!!d,this.ha=A,this.key=++gl,this.da=this.fa=!1}function Hn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Gn(i,u,c){for(const d in i)u.call(c,i[d],d,i)}function yl(i,u){for(const c in i)u.call(void 0,i[c],c,i)}function Hi(i){const u={};for(const c in i)u[c]=i[c];return u}const Gi="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ki(i,u){let c,d;for(let A=1;A<arguments.length;A++){d=arguments[A];for(c in d)i[c]=d[c];for(let R=0;R<Gi.length;R++)c=Gi[R],Object.prototype.hasOwnProperty.call(d,c)&&(i[c]=d[c])}}function Kn(i){this.src=i,this.g={},this.h=0}Kn.prototype.add=function(i,u,c,d,A){const R=i.toString();i=this.g[R],i||(i=this.g[R]=[],this.h++);const V=ns(i,u,d,A);return V>-1?(u=i[V],c||(u.fa=!1)):(u=new _l(u,this.src,R,!!d,A),u.fa=c,i.push(u)),u};function es(i,u){const c=u.type;if(c in i.g){var d=i.g[c],A=Array.prototype.indexOf.call(d,u,void 0),R;(R=A>=0)&&Array.prototype.splice.call(d,A,1),R&&(Hn(u),i.g[c].length==0&&(delete i.g[c],i.h--))}}function ns(i,u,c,d){for(let A=0;A<i.length;++A){const R=i[A];if(!R.da&&R.listener==u&&R.capture==!!c&&R.ha==d)return A}return-1}var rs="closure_lm_"+(Math.random()*1e6|0),ss={};function Wi(i,u,c,d,A){if(Array.isArray(u)){for(let R=0;R<u.length;R++)Wi(i,u[R],c,d,A);return null}return c=Yi(c),i&&i[me]?i.J(u,c,l(d)?!!d.capture:!1,A):El(i,u,c,!1,d,A)}function El(i,u,c,d,A,R){if(!u)throw Error("Invalid event type");const V=l(A)?!!A.capture:!!A;let q=os(i);if(q||(i[rs]=q=new Kn(i)),c=q.add(u,c,d,V,R),c.proxy)return c;if(d=Tl(),c.proxy=d,d.src=i,d.listener=c,i.addEventListener)v||(A=V),A===void 0&&(A=!1),i.addEventListener(u.toString(),d,A);else if(i.attachEvent)i.attachEvent(Xi(u.toString()),d);else if(i.addListener&&i.removeListener)i.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");return c}function Tl(){function i(c){return u.call(i.src,i.listener,c)}const u=Il;return i}function Qi(i,u,c,d,A){if(Array.isArray(u))for(var R=0;R<u.length;R++)Qi(i,u[R],c,d,A);else d=l(d)?!!d.capture:!!d,c=Yi(c),i&&i[me]?(i=i.i,R=String(u).toString(),R in i.g&&(u=i.g[R],c=ns(u,c,d,A),c>-1&&(Hn(u[c]),Array.prototype.splice.call(u,c,1),u.length==0&&(delete i.g[R],i.h--)))):i&&(i=os(i))&&(u=i.g[u.toString()],i=-1,u&&(i=ns(u,c,d,A)),(c=i>-1?u[i]:null)&&is(c))}function is(i){if(typeof i!="number"&&i&&!i.da){var u=i.src;if(u&&u[me])es(u.i,i);else{var c=i.type,d=i.proxy;u.removeEventListener?u.removeEventListener(c,d,i.capture):u.detachEvent?u.detachEvent(Xi(c),d):u.addListener&&u.removeListener&&u.removeListener(d),(c=os(u))?(es(c,i),c.h==0&&(c.src=null,u[rs]=null)):Hn(i)}}}function Xi(i){return i in ss?ss[i]:ss[i]="on"+i}function Il(i,u){if(i.da)i=!0;else{u=new Rt(u,this);const c=i.listener,d=i.ha||i.src;i.fa&&is(i),i=c.call(d,u)}return i}function os(i){return i=i[rs],i instanceof Kn?i:null}var as="__closure_events_fn_"+(Math.random()*1e9>>>0);function Yi(i){return typeof i=="function"?i:(i[as]||(i[as]=function(u){return i.handleEvent(u)}),i[as])}function _t(){w.call(this),this.i=new Kn(this),this.M=this,this.G=null}_(_t,w),_t.prototype[me]=!0,_t.prototype.removeEventListener=function(i,u,c,d){Qi(this,i,u,c,d)};function wt(i,u){var c,d=i.G;if(d)for(c=[];d;d=d.G)c.push(d);if(i=i.M,d=u.type||u,typeof u=="string")u=new E(u,i);else if(u instanceof E)u.target=u.target||i;else{var A=u;u=new E(d,i),Ki(u,A)}A=!0;let R,V;if(c)for(V=c.length-1;V>=0;V--)R=u.g=c[V],A=Wn(R,d,!0,u)&&A;if(R=u.g=i,A=Wn(R,d,!0,u)&&A,A=Wn(R,d,!1,u)&&A,c)for(V=0;V<c.length;V++)R=u.g=c[V],A=Wn(R,d,!1,u)&&A}_t.prototype.N=function(){if(_t.Z.N.call(this),this.i){var i=this.i;for(const u in i.g){const c=i.g[u];for(let d=0;d<c.length;d++)Hn(c[d]);delete i.g[u],i.h--}}this.G=null},_t.prototype.J=function(i,u,c,d){return this.i.add(String(i),u,!1,c,d)},_t.prototype.K=function(i,u,c,d){return this.i.add(String(i),u,!0,c,d)};function Wn(i,u,c,d){if(u=i.i.g[String(u)],!u)return!0;u=u.concat();let A=!0;for(let R=0;R<u.length;++R){const V=u[R];if(V&&!V.da&&V.capture==c){const q=V.listener,ct=V.ha||V.src;V.fa&&es(i.i,V),A=q.call(ct,d)!==!1&&A}}return A&&!d.defaultPrevented}function wl(i,u){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=f(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(u)>2147483647?-1:a.setTimeout(i,u||0)}function Ji(i){i.g=wl(()=>{i.g=null,i.i&&(i.i=!1,Ji(i))},i.l);const u=i.h;i.h=null,i.m.apply(null,u)}class Al extends w{constructor(u,c){super(),this.m=u,this.l=c,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Ji(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ze(i){w.call(this),this.h=i,this.g={}}_(Ze,w);var Zi=[];function to(i){Gn(i.g,function(u,c){this.g.hasOwnProperty(c)&&is(u)},i),i.g={}}Ze.prototype.N=function(){Ze.Z.N.call(this),to(this)},Ze.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var us=a.JSON.stringify,vl=a.JSON.parse,Rl=class{stringify(i){return a.JSON.stringify(i,void 0)}parse(i){return a.JSON.parse(i,void 0)}};function eo(){}function no(){}var tn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function cs(){E.call(this,"d")}_(cs,E);function ls(){E.call(this,"c")}_(ls,E);var ge={},ro=null;function Qn(){return ro=ro||new _t}ge.Ia="serverreachability";function so(i){E.call(this,ge.Ia,i)}_(so,E);function en(i){const u=Qn();wt(u,new so(u))}ge.STAT_EVENT="statevent";function io(i,u){E.call(this,ge.STAT_EVENT,i),this.stat=u}_(io,E);function At(i){const u=Qn();wt(u,new io(u,i))}ge.Ja="timingevent";function oo(i,u){E.call(this,ge.Ja,i),this.size=u}_(oo,E);function nn(i,u){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){i()},u)}function rn(){this.g=!0}rn.prototype.ua=function(){this.g=!1};function bl(i,u,c,d,A,R){i.info(function(){if(i.g)if(R){var V="",q=R.split("&");for(let Q=0;Q<q.length;Q++){var ct=q[Q].split("=");if(ct.length>1){const ft=ct[0];ct=ct[1];const Mt=ft.split("_");V=Mt.length>=2&&Mt[1]=="type"?V+(ft+"="+ct+"&"):V+(ft+"=redacted&")}}}else V=null;else V=R;return"XMLHTTP REQ ("+d+") [attempt "+A+"]: "+u+`
`+c+`
`+V})}function Sl(i,u,c,d,A,R,V){i.info(function(){return"XMLHTTP RESP ("+d+") [ attempt "+A+"]: "+u+`
`+c+`
`+R+" "+V})}function ke(i,u,c,d){i.info(function(){return"XMLHTTP TEXT ("+u+"): "+Pl(i,c)+(d?" "+d:"")})}function Cl(i,u){i.info(function(){return"TIMEOUT: "+u})}rn.prototype.info=function(){};function Pl(i,u){if(!i.g)return u;if(!u)return null;try{const R=JSON.parse(u);if(R){for(i=0;i<R.length;i++)if(Array.isArray(R[i])){var c=R[i];if(!(c.length<2)){var d=c[1];if(Array.isArray(d)&&!(d.length<1)){var A=d[0];if(A!="noop"&&A!="stop"&&A!="close")for(let V=1;V<d.length;V++)d[V]=""}}}}return us(R)}catch{return u}}var Xn={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},ao={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},uo;function hs(){}_(hs,eo),hs.prototype.g=function(){return new XMLHttpRequest},uo=new hs;function sn(i){return encodeURIComponent(String(i))}function Vl(i){var u=1;i=i.split(":");const c=[];for(;u>0&&i.length;)c.push(i.shift()),u--;return i.length&&c.push(i.join(":")),c}function Qt(i,u,c,d){this.j=i,this.i=u,this.l=c,this.S=d||1,this.V=new Ze(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new co}function co(){this.i=null,this.g="",this.h=!1}var lo={},fs={};function ds(i,u,c){i.M=1,i.A=Jn(xt(u)),i.u=c,i.R=!0,ho(i,null)}function ho(i,u){i.F=Date.now(),Yn(i),i.B=xt(i.A);var c=i.B,d=i.S;Array.isArray(d)||(d=[String(d)]),Ro(c.i,"t",d),i.C=0,c=i.j.L,i.h=new co,i.g=$o(i.j,c?u:null,!i.u),i.P>0&&(i.O=new Al(f(i.Y,i,i.g),i.P)),u=i.V,c=i.g,d=i.ba;var A="readystatechange";Array.isArray(A)||(A&&(Zi[0]=A.toString()),A=Zi);for(let R=0;R<A.length;R++){const V=Wi(c,A[R],d||u.handleEvent,!1,u.h||u);if(!V)break;u.g[V.key]=V}u=i.J?Hi(i.J):{},i.u?(i.v||(i.v="POST"),u["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,u)):(i.v="GET",i.g.ea(i.B,i.v,null,u)),en(),bl(i.i,i.v,i.B,i.l,i.S,i.u)}Qt.prototype.ba=function(i){i=i.target;const u=this.O;u&&Jt(i)==3?u.j():this.Y(i)},Qt.prototype.Y=function(i){try{if(i==this.g)t:{const q=Jt(this.g),ct=this.g.ya(),Q=this.g.ca();if(!(q<3)&&(q!=3||this.g&&(this.h.h||this.g.la()||No(this.g)))){this.K||q!=4||ct==7||(ct==8||Q<=0?en(3):en(2)),ps(this);var u=this.g.ca();this.X=u;var c=Dl(this);if(this.o=u==200,Sl(this.i,this.v,this.B,this.l,this.S,q,u),this.o){if(this.U&&!this.L){e:{if(this.g){var d,A=this.g;if((d=A.g?A.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!g(d)){var R=d;break e}}R=null}if(i=R)ke(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,ms(this,i);else{this.o=!1,this.m=3,At(12),_e(this),on(this);break t}}if(this.R){i=!0;let ft;for(;!this.K&&this.C<c.length;)if(ft=Nl(this,c),ft==fs){q==4&&(this.m=4,At(14),i=!1),ke(this.i,this.l,null,"[Incomplete Response]");break}else if(ft==lo){this.m=4,At(15),ke(this.i,this.l,c,"[Invalid Chunk]"),i=!1;break}else ke(this.i,this.l,ft,null),ms(this,ft);if(fo(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),q!=4||c.length!=0||this.h.h||(this.m=1,At(16),i=!1),this.o=this.o&&i,!i)ke(this.i,this.l,c,"[Invalid Chunked Response]"),_e(this),on(this);else if(c.length>0&&!this.W){this.W=!0;var V=this.j;V.g==this&&V.aa&&!V.P&&(V.j.info("Great, no buffering proxy detected. Bytes received: "+c.length),As(V),V.P=!0,At(11))}}else ke(this.i,this.l,c,null),ms(this,c);q==4&&_e(this),this.o&&!this.K&&(q==4?Uo(this.j,this):(this.o=!1,Yn(this)))}else Gl(this.g),u==400&&c.indexOf("Unknown SID")>0?(this.m=3,At(12)):(this.m=0,At(13)),_e(this),on(this)}}}catch{}finally{}};function Dl(i){if(!fo(i))return i.g.la();const u=No(i.g);if(u==="")return"";let c="";const d=u.length,A=Jt(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return _e(i),on(i),"";i.h.i=new a.TextDecoder}for(let R=0;R<d;R++)i.h.h=!0,c+=i.h.i.decode(u[R],{stream:!(A&&R==d-1)});return u.length=0,i.h.g+=c,i.C=0,i.h.g}function fo(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function Nl(i,u){var c=i.C,d=u.indexOf(`
`,c);return d==-1?fs:(c=Number(u.substring(c,d)),isNaN(c)?lo:(d+=1,d+c>u.length?fs:(u=u.slice(d,d+c),i.C=d+c,u)))}Qt.prototype.cancel=function(){this.K=!0,_e(this)};function Yn(i){i.T=Date.now()+i.H,po(i,i.H)}function po(i,u){if(i.D!=null)throw Error("WatchDog timer not null");i.D=nn(f(i.aa,i),u)}function ps(i){i.D&&(a.clearTimeout(i.D),i.D=null)}Qt.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(Cl(this.i,this.B),this.M!=2&&(en(),At(17)),_e(this),this.m=2,on(this)):po(this,this.T-i)};function on(i){i.j.I==0||i.K||Uo(i.j,i)}function _e(i){ps(i);var u=i.O;u&&typeof u.dispose=="function"&&u.dispose(),i.O=null,to(i.V),i.g&&(u=i.g,i.g=null,u.abort(),u.dispose())}function ms(i,u){try{var c=i.j;if(c.I!=0&&(c.g==i||gs(c.h,i))){if(!i.L&&gs(c.h,i)&&c.I==3){try{var d=c.Ba.g.parse(u)}catch{d=null}if(Array.isArray(d)&&d.length==3){var A=d;if(A[0]==0){t:if(!c.v){if(c.g)if(c.g.F+3e3<i.F)rr(c),er(c);else break t;ws(c),At(18)}}else c.xa=A[1],0<c.xa-c.K&&A[2]<37500&&c.F&&c.A==0&&!c.C&&(c.C=nn(f(c.Va,c),6e3));_o(c.h)<=1&&c.ta&&(c.ta=void 0)}else Ee(c,11)}else if((i.L||c.g==i)&&rr(c),!g(u))for(A=c.Ba.g.parse(u),u=0;u<A.length;u++){let Q=A[u];const ft=Q[0];if(!(ft<=c.K))if(c.K=ft,Q=Q[1],c.I==2)if(Q[0]=="c"){c.M=Q[1],c.ba=Q[2];const Mt=Q[3];Mt!=null&&(c.ka=Mt,c.j.info("VER="+c.ka));const Te=Q[4];Te!=null&&(c.za=Te,c.j.info("SVER="+c.za));const Zt=Q[5];Zt!=null&&typeof Zt=="number"&&Zt>0&&(d=1.5*Zt,c.O=d,c.j.info("backChannelRequestTimeoutMs_="+d)),d=c;const te=i.g;if(te){const ir=te.g?te.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ir){var R=d.h;R.g||ir.indexOf("spdy")==-1&&ir.indexOf("quic")==-1&&ir.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(_s(R,R.h),R.h=null))}if(d.G){const vs=te.g?te.g.getResponseHeader("X-HTTP-Session-Id"):null;vs&&(d.wa=vs,Y(d.J,d.G,vs))}}c.I=3,c.l&&c.l.ra(),c.aa&&(c.T=Date.now()-i.F,c.j.info("Handshake RTT: "+c.T+"ms")),d=c;var V=i;if(d.na=jo(d,d.L?d.ba:null,d.W),V.L){yo(d.h,V);var q=V,ct=d.O;ct&&(q.H=ct),q.D&&(ps(q),Yn(q)),d.g=V}else Lo(d);c.i.length>0&&nr(c)}else Q[0]!="stop"&&Q[0]!="close"||Ee(c,7);else c.I==3&&(Q[0]=="stop"||Q[0]=="close"?Q[0]=="stop"?Ee(c,7):Is(c):Q[0]!="noop"&&c.l&&c.l.qa(Q),c.A=0)}}en(4)}catch{}}var kl=class{constructor(i,u){this.g=i,this.map=u}};function mo(i){this.l=i||10,a.PerformanceNavigationTiming?(i=a.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function go(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function _o(i){return i.h?1:i.g?i.g.size:0}function gs(i,u){return i.h?i.h==u:i.g?i.g.has(u):!1}function _s(i,u){i.g?i.g.add(u):i.h=u}function yo(i,u){i.h&&i.h==u?i.h=null:i.g&&i.g.has(u)&&i.g.delete(u)}mo.prototype.cancel=function(){if(this.i=Eo(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Eo(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let u=i.i;for(const c of i.g.values())u=u.concat(c.G);return u}return b(i.i)}var To=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ol(i,u){if(i){i=i.split("&");for(let c=0;c<i.length;c++){const d=i[c].indexOf("=");let A,R=null;d>=0?(A=i[c].substring(0,d),R=i[c].substring(d+1)):A=i[c],u(A,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function Xt(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let u;i instanceof Xt?(this.l=i.l,an(this,i.j),this.o=i.o,this.g=i.g,un(this,i.u),this.h=i.h,ys(this,bo(i.i)),this.m=i.m):i&&(u=String(i).match(To))?(this.l=!1,an(this,u[1]||"",!0),this.o=cn(u[2]||""),this.g=cn(u[3]||"",!0),un(this,u[4]),this.h=cn(u[5]||"",!0),ys(this,u[6]||"",!0),this.m=cn(u[7]||"")):(this.l=!1,this.i=new hn(null,this.l))}Xt.prototype.toString=function(){const i=[];var u=this.j;u&&i.push(ln(u,Io,!0),":");var c=this.g;return(c||u=="file")&&(i.push("//"),(u=this.o)&&i.push(ln(u,Io,!0),"@"),i.push(sn(c).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.u,c!=null&&i.push(":",String(c))),(c=this.h)&&(this.g&&c.charAt(0)!="/"&&i.push("/"),i.push(ln(c,c.charAt(0)=="/"?Ll:Ml,!0))),(c=this.i.toString())&&i.push("?",c),(c=this.m)&&i.push("#",ln(c,Ul)),i.join("")},Xt.prototype.resolve=function(i){const u=xt(this);let c=!!i.j;c?an(u,i.j):c=!!i.o,c?u.o=i.o:c=!!i.g,c?u.g=i.g:c=i.u!=null;var d=i.h;if(c)un(u,i.u);else if(c=!!i.h){if(d.charAt(0)!="/")if(this.g&&!this.h)d="/"+d;else{var A=u.h.lastIndexOf("/");A!=-1&&(d=u.h.slice(0,A+1)+d)}if(A=d,A==".."||A==".")d="";else if(A.indexOf("./")!=-1||A.indexOf("/.")!=-1){d=A.lastIndexOf("/",0)==0,A=A.split("/");const R=[];for(let V=0;V<A.length;){const q=A[V++];q=="."?d&&V==A.length&&R.push(""):q==".."?((R.length>1||R.length==1&&R[0]!="")&&R.pop(),d&&V==A.length&&R.push("")):(R.push(q),d=!0)}d=R.join("/")}else d=A}return c?u.h=d:c=i.i.toString()!=="",c?ys(u,bo(i.i)):c=!!i.m,c&&(u.m=i.m),u};function xt(i){return new Xt(i)}function an(i,u,c){i.j=c?cn(u,!0):u,i.j&&(i.j=i.j.replace(/:$/,""))}function un(i,u){if(u){if(u=Number(u),isNaN(u)||u<0)throw Error("Bad port number "+u);i.u=u}else i.u=null}function ys(i,u,c){u instanceof hn?(i.i=u,Bl(i.i,i.l)):(c||(u=ln(u,Fl)),i.i=new hn(u,i.l))}function Y(i,u,c){i.i.set(u,c)}function Jn(i){return Y(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function cn(i,u){return i?u?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function ln(i,u,c){return typeof i=="string"?(i=encodeURI(i).replace(u,xl),c&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function xl(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Io=/[#\/\?@]/g,Ml=/[#\?:]/g,Ll=/[#\?]/g,Fl=/[#\?@]/g,Ul=/#/g;function hn(i,u){this.h=this.g=null,this.i=i||null,this.j=!!u}function ye(i){i.g||(i.g=new Map,i.h=0,i.i&&Ol(i.i,function(u,c){i.add(decodeURIComponent(u.replace(/\+/g," ")),c)}))}n=hn.prototype,n.add=function(i,u){ye(this),this.i=null,i=Oe(this,i);let c=this.g.get(i);return c||this.g.set(i,c=[]),c.push(u),this.h+=1,this};function wo(i,u){ye(i),u=Oe(i,u),i.g.has(u)&&(i.i=null,i.h-=i.g.get(u).length,i.g.delete(u))}function Ao(i,u){return ye(i),u=Oe(i,u),i.g.has(u)}n.forEach=function(i,u){ye(this),this.g.forEach(function(c,d){c.forEach(function(A){i.call(u,A,d,this)},this)},this)};function vo(i,u){ye(i);let c=[];if(typeof u=="string")Ao(i,u)&&(c=c.concat(i.g.get(Oe(i,u))));else for(i=Array.from(i.g.values()),u=0;u<i.length;u++)c=c.concat(i[u]);return c}n.set=function(i,u){return ye(this),this.i=null,i=Oe(this,i),Ao(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[u]),this.h+=1,this},n.get=function(i,u){return i?(i=vo(this,i),i.length>0?String(i[0]):u):u};function Ro(i,u,c){wo(i,u),c.length>0&&(i.i=null,i.g.set(Oe(i,u),b(c)),i.h+=c.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],u=Array.from(this.g.keys());for(let d=0;d<u.length;d++){var c=u[d];const A=sn(c);c=vo(this,c);for(let R=0;R<c.length;R++){let V=A;c[R]!==""&&(V+="="+sn(c[R])),i.push(V)}}return this.i=i.join("&")};function bo(i){const u=new hn;return u.i=i.i,i.g&&(u.g=new Map(i.g),u.h=i.h),u}function Oe(i,u){return u=String(u),i.j&&(u=u.toLowerCase()),u}function Bl(i,u){u&&!i.j&&(ye(i),i.i=null,i.g.forEach(function(c,d){const A=d.toLowerCase();d!=A&&(wo(this,d),Ro(this,A,c))},i)),i.j=u}function ql(i,u){const c=new rn;if(a.Image){const d=new Image;d.onload=p(Yt,c,"TestLoadImage: loaded",!0,u,d),d.onerror=p(Yt,c,"TestLoadImage: error",!1,u,d),d.onabort=p(Yt,c,"TestLoadImage: abort",!1,u,d),d.ontimeout=p(Yt,c,"TestLoadImage: timeout",!1,u,d),a.setTimeout(function(){d.ontimeout&&d.ontimeout()},1e4),d.src=i}else u(!1)}function jl(i,u){const c=new rn,d=new AbortController,A=setTimeout(()=>{d.abort(),Yt(c,"TestPingServer: timeout",!1,u)},1e4);fetch(i,{signal:d.signal}).then(R=>{clearTimeout(A),R.ok?Yt(c,"TestPingServer: ok",!0,u):Yt(c,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(A),Yt(c,"TestPingServer: error",!1,u)})}function Yt(i,u,c,d,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),d(c)}catch{}}function $l(){this.g=new Rl}function Es(i){this.i=i.Sb||null,this.h=i.ab||!1}_(Es,eo),Es.prototype.g=function(){return new Zn(this.i,this.h)};function Zn(i,u){_t.call(this),this.H=i,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}_(Zn,_t),n=Zn.prototype,n.open=function(i,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=u,this.readyState=1,dn(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const u={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(u.body=i),(this.H||a).fetch(new Request(this.D,u)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,fn(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,dn(this)),this.g&&(this.readyState=3,dn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;So(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function So(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var u=i.value?i.value:new Uint8Array(0);(u=this.B.decode(u,{stream:!i.done}))&&(this.response=this.responseText+=u)}i.done?fn(this):dn(this),this.readyState==3&&So(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,fn(this))},n.Na=function(i){this.g&&(this.response=i,fn(this))},n.ga=function(){this.g&&fn(this)};function fn(i){i.readyState=4,i.l=null,i.j=null,i.B=null,dn(i)}n.setRequestHeader=function(i,u){this.A.append(i,u)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],u=this.h.entries();for(var c=u.next();!c.done;)c=c.value,i.push(c[0]+": "+c[1]),c=u.next();return i.join(`\r
`)};function dn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(Zn.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Co(i){let u="";return Gn(i,function(c,d){u+=d,u+=":",u+=c,u+=`\r
`}),u}function Ts(i,u,c){t:{for(d in c){var d=!1;break t}d=!0}d||(c=Co(c),typeof i=="string"?c!=null&&sn(c):Y(i,u,c))}function et(i){_t.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}_(et,_t);var zl=/^https?$/i,Hl=["POST","PUT"];n=et.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,u,c,d){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);u=u?u.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():uo.g(),this.g.onreadystatechange=I(f(this.Ca,this));try{this.B=!0,this.g.open(u,String(i),!0),this.B=!1}catch(R){Po(this,R);return}if(i=c||"",c=new Map(this.headers),d)if(Object.getPrototypeOf(d)===Object.prototype)for(var A in d)c.set(A,d[A]);else if(typeof d.keys=="function"&&typeof d.get=="function")for(const R of d.keys())c.set(R,d.get(R));else throw Error("Unknown input type for opt_headers: "+String(d));d=Array.from(c.keys()).find(R=>R.toLowerCase()=="content-type"),A=a.FormData&&i instanceof a.FormData,!(Array.prototype.indexOf.call(Hl,u,void 0)>=0)||d||A||c.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,V]of c)this.g.setRequestHeader(R,V);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(R){Po(this,R)}};function Po(i,u){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=u,i.o=5,Vo(i),tr(i)}function Vo(i){i.A||(i.A=!0,wt(i,"complete"),wt(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,wt(this,"complete"),wt(this,"abort"),tr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),tr(this,!0)),et.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Do(this):this.Xa())},n.Xa=function(){Do(this)};function Do(i){if(i.h&&typeof o<"u"){if(i.v&&Jt(i)==4)setTimeout(i.Ca.bind(i),0);else if(wt(i,"readystatechange"),Jt(i)==4){i.h=!1;try{const R=i.ca();t:switch(R){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break t;default:u=!1}var c;if(!(c=u)){var d;if(d=R===0){let V=String(i.D).match(To)[1]||null;!V&&a.self&&a.self.location&&(V=a.self.location.protocol.slice(0,-1)),d=!zl.test(V?V.toLowerCase():"")}c=d}if(c)wt(i,"complete"),wt(i,"success");else{i.o=6;try{var A=Jt(i)>2?i.g.statusText:""}catch{A=""}i.l=A+" ["+i.ca()+"]",Vo(i)}}finally{tr(i)}}}}function tr(i,u){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const c=i.g;i.g=null,u||wt(i,"ready");try{c.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Jt(i){return i.g?i.g.readyState:0}n.ca=function(){try{return Jt(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var u=this.g.responseText;return i&&u.indexOf(i)==0&&(u=u.substring(i.length)),vl(u)}};function No(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Gl(i){const u={};i=(i.g&&Jt(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let d=0;d<i.length;d++){if(g(i[d]))continue;var c=Vl(i[d]);const A=c[0];if(c=c[1],typeof c!="string")continue;c=c.trim();const R=u[A]||[];u[A]=R,R.push(c)}yl(u,function(d){return d.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function pn(i,u,c){return c&&c.internalChannelParams&&c.internalChannelParams[i]||u}function ko(i){this.za=0,this.i=[],this.j=new rn,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=pn("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=pn("baseRetryDelayMs",5e3,i),this.Za=pn("retryDelaySeedMs",1e4,i),this.Ta=pn("forwardChannelMaxRetries",2,i),this.va=pn("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new mo(i&&i.concurrentRequestLimit),this.Ba=new $l,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=ko.prototype,n.ka=8,n.I=1,n.connect=function(i,u,c,d){At(0),this.W=i,this.H=u||{},c&&d!==void 0&&(this.H.OSID=c,this.H.OAID=d),this.F=this.X,this.J=jo(this,null,this.W),nr(this)};function Is(i){if(Oo(i),i.I==3){var u=i.V++,c=xt(i.J);if(Y(c,"SID",i.M),Y(c,"RID",u),Y(c,"TYPE","terminate"),mn(i,c),u=new Qt(i,i.j,u),u.M=2,u.A=Jn(xt(c)),c=!1,a.navigator&&a.navigator.sendBeacon)try{c=a.navigator.sendBeacon(u.A.toString(),"")}catch{}!c&&a.Image&&(new Image().src=u.A,c=!0),c||(u.g=$o(u.j,null),u.g.ea(u.A)),u.F=Date.now(),Yn(u)}qo(i)}function er(i){i.g&&(As(i),i.g.cancel(),i.g=null)}function Oo(i){er(i),i.v&&(a.clearTimeout(i.v),i.v=null),rr(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&a.clearTimeout(i.m),i.m=null)}function nr(i){if(!go(i.h)&&!i.m){i.m=!0;var u=i.Ea;ht||m(),Z||(ht(),Z=!0),T.add(u,i),i.D=0}}function Kl(i,u){return _o(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=u.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=nn(f(i.Ea,i,u),Bo(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const A=new Qt(this,this.j,i);let R=this.o;if(this.U&&(R?(R=Hi(R),Ki(R,this.U)):R=this.U),this.u!==null||this.R||(A.J=R,R=null),this.S)t:{for(var u=0,c=0;c<this.i.length;c++){e:{var d=this.i[c];if("__data__"in d.map&&(d=d.map.__data__,typeof d=="string")){d=d.length;break e}d=void 0}if(d===void 0)break;if(u+=d,u>4096){u=c;break t}if(u===4096||c===this.i.length-1){u=c+1;break t}}u=1e3}else u=1e3;u=Mo(this,A,u),c=xt(this.J),Y(c,"RID",i),Y(c,"CVER",22),this.G&&Y(c,"X-HTTP-Session-Id",this.G),mn(this,c),R&&(this.R?u="headers="+sn(Co(R))+"&"+u:this.u&&Ts(c,this.u,R)),_s(this.h,A),this.Ra&&Y(c,"TYPE","init"),this.S?(Y(c,"$req",u),Y(c,"SID","null"),A.U=!0,ds(A,c,null)):ds(A,c,u),this.I=2}}else this.I==3&&(i?xo(this,i):this.i.length==0||go(this.h)||xo(this))};function xo(i,u){var c;u?c=u.l:c=i.V++;const d=xt(i.J);Y(d,"SID",i.M),Y(d,"RID",c),Y(d,"AID",i.K),mn(i,d),i.u&&i.o&&Ts(d,i.u,i.o),c=new Qt(i,i.j,c,i.D+1),i.u===null&&(c.J=i.o),u&&(i.i=u.G.concat(i.i)),u=Mo(i,c,1e3),c.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),_s(i.h,c),ds(c,d,u)}function mn(i,u){i.H&&Gn(i.H,function(c,d){Y(u,d,c)}),i.l&&Gn({},function(c,d){Y(u,d,c)})}function Mo(i,u,c){c=Math.min(i.i.length,c);const d=i.l?f(i.l.Ka,i.l,i):null;t:{var A=i.i;let q=-1;for(;;){const ct=["count="+c];q==-1?c>0?(q=A[0].g,ct.push("ofs="+q)):q=0:ct.push("ofs="+q);let Q=!0;for(let ft=0;ft<c;ft++){var R=A[ft].g;const Mt=A[ft].map;if(R-=q,R<0)q=Math.max(0,A[ft].g-100),Q=!1;else try{R="req"+R+"_"||"";try{var V=Mt instanceof Map?Mt:Object.entries(Mt);for(const[Te,Zt]of V){let te=Zt;l(Zt)&&(te=us(Zt)),ct.push(R+Te+"="+encodeURIComponent(te))}}catch(Te){throw ct.push(R+"type="+encodeURIComponent("_badmap")),Te}}catch{d&&d(Mt)}}if(Q){V=ct.join("&");break t}}V=void 0}return i=i.i.splice(0,c),u.G=i,V}function Lo(i){if(!i.g&&!i.v){i.Y=1;var u=i.Da;ht||m(),Z||(ht(),Z=!0),T.add(u,i),i.A=0}}function ws(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=nn(f(i.Da,i),Bo(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,Fo(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=nn(f(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,At(10),er(this),Fo(this))};function As(i){i.B!=null&&(a.clearTimeout(i.B),i.B=null)}function Fo(i){i.g=new Qt(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var u=xt(i.na);Y(u,"RID","rpc"),Y(u,"SID",i.M),Y(u,"AID",i.K),Y(u,"CI",i.F?"0":"1"),!i.F&&i.ia&&Y(u,"TO",i.ia),Y(u,"TYPE","xmlhttp"),mn(i,u),i.u&&i.o&&Ts(u,i.u,i.o),i.O&&(i.g.H=i.O);var c=i.g;i=i.ba,c.M=1,c.A=Jn(xt(u)),c.u=null,c.R=!0,ho(c,i)}n.Va=function(){this.C!=null&&(this.C=null,er(this),ws(this),At(19))};function rr(i){i.C!=null&&(a.clearTimeout(i.C),i.C=null)}function Uo(i,u){var c=null;if(i.g==u){rr(i),As(i),i.g=null;var d=2}else if(gs(i.h,u))c=u.G,yo(i.h,u),d=1;else return;if(i.I!=0){if(u.o)if(d==1){c=u.u?u.u.length:0,u=Date.now()-u.F;var A=i.D;d=Qn(),wt(d,new oo(d,c)),nr(i)}else Lo(i);else if(A=u.m,A==3||A==0&&u.X>0||!(d==1&&Kl(i,u)||d==2&&ws(i)))switch(c&&c.length>0&&(u=i.h,u.i=u.i.concat(c)),A){case 1:Ee(i,5);break;case 4:Ee(i,10);break;case 3:Ee(i,6);break;default:Ee(i,2)}}}function Bo(i,u){let c=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(c*=2),c*u}function Ee(i,u){if(i.j.info("Error code "+u),u==2){var c=f(i.bb,i),d=i.Ua;const A=!d;d=new Xt(d||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||an(d,"https"),Jn(d),A?ql(d.toString(),c):jl(d.toString(),c)}else At(2);i.I=0,i.l&&i.l.pa(u),qo(i),Oo(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),At(2)):(this.j.info("Failed to ping google.com"),At(1))};function qo(i){if(i.I=0,i.ja=[],i.l){const u=Eo(i.h);(u.length!=0||i.i.length!=0)&&(D(i.ja,u),D(i.ja,i.i),i.h.i.length=0,b(i.i),i.i.length=0),i.l.oa()}}function jo(i,u,c){var d=c instanceof Xt?xt(c):new Xt(c);if(d.g!="")u&&(d.g=u+"."+d.g),un(d,d.u);else{var A=a.location;d=A.protocol,u=u?u+"."+A.hostname:A.hostname,A=+A.port;const R=new Xt(null);d&&an(R,d),u&&(R.g=u),A&&un(R,A),c&&(R.h=c),d=R}return c=i.G,u=i.wa,c&&u&&Y(d,c,u),Y(d,"VER",i.ka),mn(i,d),d}function $o(i,u,c){if(u&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return u=i.Aa&&!i.ma?new et(new Es({ab:c})):new et(i.ma),u.Fa(i.L),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function zo(){}n=zo.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function sr(){}sr.prototype.g=function(i,u){return new Pt(i,u)};function Pt(i,u){_t.call(this),this.g=new ko(u),this.l=i,this.h=u&&u.messageUrlParams||null,i=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(i?i["X-WebChannel-Content-Type"]=u.messageContentType:i={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.sa&&(i?i["X-WebChannel-Client-Profile"]=u.sa:i={"X-WebChannel-Client-Profile":u.sa}),this.g.U=i,(i=u&&u.Qb)&&!g(i)&&(this.g.u=i),this.A=u&&u.supportsCrossDomainXhr||!1,this.v=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!g(u)&&(this.g.G=u,i=this.h,i!==null&&u in i&&(i=this.h,u in i&&delete i[u])),this.j=new xe(this)}_(Pt,_t),Pt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Pt.prototype.close=function(){Is(this.g)},Pt.prototype.o=function(i){var u=this.g;if(typeof i=="string"){var c={};c.__data__=i,i=c}else this.v&&(c={},c.__data__=us(i),i=c);u.i.push(new kl(u.Ya++,i)),u.I==3&&nr(u)},Pt.prototype.N=function(){this.g.l=null,delete this.j,Is(this.g),delete this.g,Pt.Z.N.call(this)};function Ho(i){cs.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var u=i.__sm__;if(u){t:{for(const c in u){i=c;break t}i=void 0}(this.i=i)&&(i=this.i,u=u!==null&&i in u?u[i]:void 0),this.data=u}else this.data=i}_(Ho,cs);function Go(){ls.call(this),this.status=1}_(Go,ls);function xe(i){this.g=i}_(xe,zo),xe.prototype.ra=function(){wt(this.g,"a")},xe.prototype.qa=function(i){wt(this.g,new Ho(i))},xe.prototype.pa=function(i){wt(this.g,new Go)},xe.prototype.oa=function(){wt(this.g,"b")},sr.prototype.createWebChannel=sr.prototype.g,Pt.prototype.send=Pt.prototype.o,Pt.prototype.open=Pt.prototype.m,Pt.prototype.close=Pt.prototype.close,bu=function(){return new sr},Ru=function(){return Qn()},vu=ge,Fs={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Xn.NO_ERROR=0,Xn.TIMEOUT=8,Xn.HTTP_ERROR=6,dr=Xn,ao.COMPLETE="complete",Au=ao,no.EventType=tn,tn.OPEN="a",tn.CLOSE="b",tn.ERROR="c",tn.MESSAGE="d",_t.prototype.listen=_t.prototype.J,_n=no,et.prototype.listenOnce=et.prototype.K,et.prototype.getLastError=et.prototype.Ha,et.prototype.getLastErrorCode=et.prototype.ya,et.prototype.getStatus=et.prototype.ca,et.prototype.getResponseJson=et.prototype.La,et.prototype.getResponseText=et.prototype.la,et.prototype.send=et.prototype.ea,et.prototype.setWithCredentials=et.prototype.Fa,wu=et}).apply(typeof or<"u"?or:typeof self<"u"?self:typeof window<"u"?window:{});const na="@firebase/firestore",ra="4.9.2";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}Et.UNAUTHENTICATED=new Et(null),Et.GOOGLE_CREDENTIALS=new Et("google-credentials-uid"),Et.FIRST_PARTY=new Et("first-party-uid"),Et.MOCK_USER=new Et("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let We="12.3.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Se=new pu("@firebase/firestore");function Me(){return Se.logLevel}function O(n,...t){if(Se.logLevel<=G.DEBUG){const e=t.map(si);Se.debug(`Firestore (${We}): ${n}`,...e)}}function Gt(n,...t){if(Se.logLevel<=G.ERROR){const e=t.map(si);Se.error(`Firestore (${We}): ${n}`,...e)}}function je(n,...t){if(Se.logLevel<=G.WARN){const e=t.map(si);Se.warn(`Firestore (${We}): ${n}`,...e)}}function si(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(e){return JSON.stringify(e)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(n,t,e){let r="Unexpected state";typeof t=="string"?r=t:e=t,Su(n,r,e)}function Su(n,t,e){let r=`FIRESTORE (${We}) INTERNAL ASSERTION FAILED: ${t} (ID: ${n.toString(16)})`;if(e!==void 0)try{r+=" CONTEXT: "+JSON.stringify(e)}catch{r+=" CONTEXT: "+e}throw Gt(r),new Error(r)}function W(n,t,e,r){let s="Unexpected state";typeof e=="string"?s=e:r=e,n||Su(t,s,r)}function F(n,t){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends Ve{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class gf{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(Et.UNAUTHENTICATED))}shutdown(){}}class _f{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class yf{constructor(t){this.t=t,this.currentUser=Et.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){W(this.o===void 0,42304);let r=this.i;const s=h=>this.i!==r?(r=this.i,e(h)):Promise.resolve();let o=new zt;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new zt,t.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;t.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},l=h=>{O("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>l(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?l(h):(O("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new zt)}},0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(r=>this.i!==t?(O("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(W(typeof r.accessToken=="string",31837,{l:r}),new Cu(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return W(t===null||typeof t=="string",2055,{h:t}),new Et(t)}}class Ef{constructor(t,e,r){this.P=t,this.T=e,this.I=r,this.type="FirstParty",this.user=Et.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Tf{constructor(t,e,r){this.P=t,this.T=e,this.I=r}getToken(){return Promise.resolve(new Ef(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable(()=>e(Et.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class sa{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class If{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,gu(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){W(this.o===void 0,3512);const r=o=>{o.error!=null&&O("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,O("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(o.token):Promise.resolve()};this.o=o=>{t.enqueueRetryable(()=>r(o))};const s=o=>{O("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?s(o):O("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new sa(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(W(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new sa(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wf(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let r=0;r<n;r++)e[r]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ii{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=wf(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<e&&(r+=t.charAt(s[o]%62))}return r}}function $(n,t){return n<t?-1:n>t?1:0}function Us(n,t){const e=Math.min(n.length,t.length);for(let r=0;r<e;r++){const s=n.charAt(r),o=t.charAt(r);if(s!==o)return Ss(s)===Ss(o)?$(s,o):Ss(s)?1:-1}return $(n.length,t.length)}const Af=55296,vf=57343;function Ss(n){const t=n.charCodeAt(0);return t>=Af&&t<=vf}function $e(n,t,e){return n.length===t.length&&n.every((r,s)=>e(r,t[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ia="__name__";class Lt{constructor(t,e,r){e===void 0?e=0:e>t.length&&M(637,{offset:e,range:t.length}),r===void 0?r=t.length-e:r>t.length-e&&M(1746,{length:r,range:t.length-e}),this.segments=t,this.offset=e,this.len=r}get length(){return this.len}isEqual(t){return Lt.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Lt?t.forEach(r=>{e.push(r)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,r=this.limit();e<r;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const r=Math.min(t.length,e.length);for(let s=0;s<r;s++){const o=Lt.compareSegments(t.get(s),e.get(s));if(o!==0)return o}return $(t.length,e.length)}static compareSegments(t,e){const r=Lt.isNumericId(t),s=Lt.isNumericId(e);return r&&!s?-1:!r&&s?1:r&&s?Lt.extractNumericId(t).compare(Lt.extractNumericId(e)):Us(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return se.fromString(t.substring(4,t.length-2))}}class X extends Lt{construct(t,e,r){return new X(t,e,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const r of t){if(r.indexOf("//")>=0)throw new N(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);e.push(...r.split("/").filter(s=>s.length>0))}return new X(e)}static emptyPath(){return new X([])}}const Rf=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class mt extends Lt{construct(t,e,r){return new mt(t,e,r)}static isValidIdentifier(t){return Rf.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),mt.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===ia}static keyField(){return new mt([ia])}static fromServerFormat(t){const e=[];let r="",s=0;const o=()=>{if(r.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(r),r=""};let a=!1;for(;s<t.length;){const l=t[s];if(l==="\\"){if(s+1===t.length)throw new N(S.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const h=t[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new N(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=h,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(o(),s++)}if(o(),a)throw new N(S.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new mt(e)}static emptyPath(){return new mt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x{constructor(t){this.path=t}static fromPath(t){return new x(X.fromString(t))}static fromName(t){return new x(X.fromString(t).popFirst(5))}static empty(){return new x(X.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&X.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return X.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new x(new X(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pu(n,t,e){if(!e)throw new N(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function bf(n,t,e,r){if(t===!0&&r===!0)throw new N(S.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function oa(n){if(!x.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function aa(n){if(x.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Vu(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function xr(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=function(r){return r.constructor?r.constructor.name:null}(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":M(12329,{type:typeof n})}function Nt(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new N(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=xr(n);throw new N(S.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ut(n,t){const e={typeString:n};return t&&(e.value=t),e}function Ln(n,t){if(!Vu(n))throw new N(S.INVALID_ARGUMENT,"JSON must be an object");let e;for(const r in t)if(t[r]){const s=t[r].typeString,o="value"in t[r]?{value:t[r].value}:void 0;if(!(r in n)){e=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){e=`JSON field '${r}' must be a ${s}.`;break}if(o!==void 0&&a!==o.value){e=`Expected '${r}' field to equal '${o.value}'`;break}}if(e)throw new N(S.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ua=-62135596800,ca=1e6;class J{static now(){return J.fromMillis(Date.now())}static fromDate(t){return J.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),r=Math.floor((t-1e3*e)*ca);return new J(e,r)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<ua)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ca}_compareTo(t){return this.seconds===t.seconds?$(this.nanoseconds,t.nanoseconds):$(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:J._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(Ln(t,J._jsonSchema))return new J(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-ua;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}J._jsonSchemaVersion="firestore/timestamp/1.0",J._jsonSchema={type:ut("string",J._jsonSchemaVersion),seconds:ut("number"),nanoseconds:ut("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{static fromTimestamp(t){return new L(t)}static min(){return new L(new J(0,0))}static max(){return new L(new J(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pn=-1;function Sf(n,t){const e=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=L.fromTimestamp(r===1e9?new J(e+1,0):new J(e,r));return new oe(s,x.empty(),t)}function Cf(n){return new oe(n.readTime,n.key,Pn)}class oe{constructor(t,e,r){this.readTime=t,this.documentKey=e,this.largestBatchId=r}static min(){return new oe(L.min(),x.empty(),Pn)}static max(){return new oe(L.max(),x.empty(),Pn)}}function Pf(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=x.comparator(n.documentKey,t.documentKey),e!==0?e:$(n.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vf="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Df{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qe(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==Vf)throw n;O("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&M(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new C((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(t,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(e,o).next(r,s)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof C?e:C.resolve(e)}catch(e){return C.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):C.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):C.reject(e)}static resolve(t){return new C((e,r)=>{e(t)})}static reject(t){return new C((e,r)=>{r(t)})}static waitFor(t){return new C((e,r)=>{let s=0,o=0,a=!1;t.forEach(l=>{++s,l.next(()=>{++o,a&&o===s&&e()},h=>r(h))}),a=!0,o===s&&e()})}static or(t){let e=C.resolve(!1);for(const r of t)e=e.next(s=>s?C.resolve(s):r());return e}static forEach(t,e){const r=[];return t.forEach((s,o)=>{r.push(e.call(this,s,o))}),this.waitFor(r)}static mapArray(t,e){return new C((r,s)=>{const o=t.length,a=new Array(o);let l=0;for(let h=0;h<o;h++){const f=h;e(t[f]).next(p=>{a[f]=p,++l,l===o&&r(a)},p=>s(p))}})}static doWhile(t,e){return new C((r,s)=>{const o=()=>{t()===!0?e().next(()=>{o()},s):r()};o()})}}function Nf(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Xe(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mr{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>e.writeSequenceNumber(r))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}Mr.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oi=-1;function Lr(n){return n==null}function wr(n){return n===0&&1/n==-1/0}function kf(n){return typeof n=="number"&&Number.isInteger(n)&&!wr(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Du="";function Of(n){let t="";for(let e=0;e<n.length;e++)t.length>0&&(t=la(t)),t=xf(n.get(e),t);return la(t)}function xf(n,t){let e=t;const r=n.length;for(let s=0;s<r;s++){const o=n.charAt(s);switch(o){case"\0":e+="";break;case Du:e+="";break;default:e+=o}}return e}function la(n){return n+Du+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ha(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function fe(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function Nu(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(t,e){this.comparator=t,this.root=e||pt.EMPTY}insert(t,e){return new tt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,pt.BLACK,null,null))}remove(t){return new tt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,pt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const r=this.comparator(t,e.key);if(r===0)return e.value;r<0?e=e.left:r>0&&(e=e.right)}return null}indexOf(t){let e=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(t,r.key);if(s===0)return e+r.left.size;s<0?r=r.left:(e+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,r)=>(t(e,r),!1))}toString(){const t=[];return this.inorderTraversal((e,r)=>(t.push(`${e}:${r}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new ar(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new ar(this.root,t,this.comparator,!1)}getReverseIterator(){return new ar(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new ar(this.root,t,this.comparator,!0)}}class ar{constructor(t,e,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!t.isEmpty();)if(o=e?r(t.key,e):1,e&&s&&(o*=-1),o<0)t=this.isReverse?t.left:t.right;else{if(o===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class pt{constructor(t,e,r,s,o){this.key=t,this.value=e,this.color=r??pt.RED,this.left=s??pt.EMPTY,this.right=o??pt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,r,s,o){return new pt(t??this.key,e??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,r){let s=this;const o=r(t,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(t,e,r),null):o===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return pt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let r,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return pt.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,pt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,pt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw M(43730,{key:this.key,value:this.value});if(this.right.isRed())throw M(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw M(27949);return t+(this.isRed()?0:1)}}pt.EMPTY=null,pt.RED=!0,pt.BLACK=!1;pt.EMPTY=new class{constructor(){this.size=0}get key(){throw M(57766)}get value(){throw M(16141)}get color(){throw M(16727)}get left(){throw M(29726)}get right(){throw M(36894)}copy(t,e,r,s,o){return this}insert(t,e,r){return new pt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(t){this.comparator=t,this.data=new tt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,r)=>(t(e),!1))}forEachInRange(t,e){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let r;for(r=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new fa(this.data.getIterator())}getIteratorFrom(t){return new fa(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(r=>{e=e.add(r)}),e}isEqual(t){if(!(t instanceof lt)||this.size!==t.size)return!1;const e=this.data.getIterator(),r=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new lt(this.comparator);return e.data=t,e}}class fa{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(t){this.fields=t,t.sort(mt.comparator)}static empty(){return new Vt([])}unionWith(t){let e=new lt(mt.comparator);for(const r of this.fields)e=e.add(r);for(const r of t)e=e.add(r);return new Vt(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return $e(this.fields,t.fields,(e,r)=>e.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ku extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new ku("Invalid base64 string: "+o):o}}(t);return new gt(e)}static fromUint8Array(t){const e=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(t);return new gt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return $(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}gt.EMPTY_BYTE_STRING=new gt("");const Mf=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ae(n){if(W(!!n,39018),typeof n=="string"){let t=0;const e=Mf.exec(n);if(W(!!e,46558,{timestamp:n}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:st(n.seconds),nanos:st(n.nanos)}}function st(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function ue(n){return typeof n=="string"?gt.fromBase64String(n):gt.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ou="server_timestamp",xu="__type__",Mu="__previous_value__",Lu="__local_write_time__";function ai(n){var e,r;return((r=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[xu])==null?void 0:r.stringValue)===Ou}function Fr(n){const t=n.mapValue.fields[Mu];return ai(t)?Fr(t):t}function Vn(n){const t=ae(n.mapValue.fields[Lu].timestampValue);return new J(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lf{constructor(t,e,r,s,o,a,l,h,f,p){this.databaseId=t,this.appId=e,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=h,this.useFetchStreams=f,this.isUsingEmulator=p}}const Ar="(default)";class Dn{constructor(t,e){this.projectId=t,this.database=e||Ar}static empty(){return new Dn("","")}get isDefaultDatabase(){return this.database===Ar}isEqual(t){return t instanceof Dn&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fu="__type__",Ff="__max__",ur={mapValue:{}},Uu="__vector__",vr="value";function ce(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?ai(n)?4:Bf(n)?9007199254740991:Uf(n)?10:11:M(28295,{value:n})}function $t(n,t){if(n===t)return!0;const e=ce(n);if(e!==ce(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return Vn(n).isEqual(Vn(t));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=ae(s.timestampValue),l=ae(o.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,t);case 5:return n.stringValue===t.stringValue;case 6:return function(s,o){return ue(s.bytesValue).isEqual(ue(o.bytesValue))}(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return function(s,o){return st(s.geoPointValue.latitude)===st(o.geoPointValue.latitude)&&st(s.geoPointValue.longitude)===st(o.geoPointValue.longitude)}(n,t);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return st(s.integerValue)===st(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=st(s.doubleValue),l=st(o.doubleValue);return a===l?wr(a)===wr(l):isNaN(a)&&isNaN(l)}return!1}(n,t);case 9:return $e(n.arrayValue.values||[],t.arrayValue.values||[],$t);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},l=o.mapValue.fields||{};if(ha(a)!==ha(l))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(l[h]===void 0||!$t(a[h],l[h])))return!1;return!0}(n,t);default:return M(52216,{left:n})}}function Nn(n,t){return(n.values||[]).find(e=>$t(e,t))!==void 0}function ze(n,t){if(n===t)return 0;const e=ce(n),r=ce(t);if(e!==r)return $(e,r);switch(e){case 0:case 9007199254740991:return 0;case 1:return $(n.booleanValue,t.booleanValue);case 2:return function(o,a){const l=st(o.integerValue||o.doubleValue),h=st(a.integerValue||a.doubleValue);return l<h?-1:l>h?1:l===h?0:isNaN(l)?isNaN(h)?0:-1:1}(n,t);case 3:return da(n.timestampValue,t.timestampValue);case 4:return da(Vn(n),Vn(t));case 5:return Us(n.stringValue,t.stringValue);case 6:return function(o,a){const l=ue(o),h=ue(a);return l.compareTo(h)}(n.bytesValue,t.bytesValue);case 7:return function(o,a){const l=o.split("/"),h=a.split("/");for(let f=0;f<l.length&&f<h.length;f++){const p=$(l[f],h[f]);if(p!==0)return p}return $(l.length,h.length)}(n.referenceValue,t.referenceValue);case 8:return function(o,a){const l=$(st(o.latitude),st(a.latitude));return l!==0?l:$(st(o.longitude),st(a.longitude))}(n.geoPointValue,t.geoPointValue);case 9:return pa(n.arrayValue,t.arrayValue);case 10:return function(o,a){var I,b,D,k;const l=o.fields||{},h=a.fields||{},f=(I=l[vr])==null?void 0:I.arrayValue,p=(b=h[vr])==null?void 0:b.arrayValue,_=$(((D=f==null?void 0:f.values)==null?void 0:D.length)||0,((k=p==null?void 0:p.values)==null?void 0:k.length)||0);return _!==0?_:pa(f,p)}(n.mapValue,t.mapValue);case 11:return function(o,a){if(o===ur.mapValue&&a===ur.mapValue)return 0;if(o===ur.mapValue)return 1;if(a===ur.mapValue)return-1;const l=o.fields||{},h=Object.keys(l),f=a.fields||{},p=Object.keys(f);h.sort(),p.sort();for(let _=0;_<h.length&&_<p.length;++_){const I=Us(h[_],p[_]);if(I!==0)return I;const b=ze(l[h[_]],f[p[_]]);if(b!==0)return b}return $(h.length,p.length)}(n.mapValue,t.mapValue);default:throw M(23264,{he:e})}}function da(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return $(n,t);const e=ae(n),r=ae(t),s=$(e.seconds,r.seconds);return s!==0?s:$(e.nanos,r.nanos)}function pa(n,t){const e=n.values||[],r=t.values||[];for(let s=0;s<e.length&&s<r.length;++s){const o=ze(e[s],r[s]);if(o)return o}return $(e.length,r.length)}function He(n){return Bs(n)}function Bs(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(e){const r=ae(e);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(e){return ue(e).toBase64()}(n.bytesValue):"referenceValue"in n?function(e){return x.fromName(e).toString()}(n.referenceValue):"geoPointValue"in n?function(e){return`geo(${e.latitude},${e.longitude})`}(n.geoPointValue):"arrayValue"in n?function(e){let r="[",s=!0;for(const o of e.values||[])s?s=!1:r+=",",r+=Bs(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(e){const r=Object.keys(e.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${Bs(e.fields[a])}`;return s+"}"}(n.mapValue):M(61005,{value:n})}function pr(n){switch(ce(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=Fr(n);return t?16+pr(t):16;case 5:return 2*n.stringValue.length;case 6:return ue(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((s,o)=>s+pr(o),0)}(n.arrayValue);case 10:case 11:return function(r){let s=0;return fe(r.fields,(o,a)=>{s+=o.length+pr(a)}),s}(n.mapValue);default:throw M(13486,{value:n})}}function ma(n,t){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${t.path.canonicalString()}`}}function qs(n){return!!n&&"integerValue"in n}function ui(n){return!!n&&"arrayValue"in n}function ga(n){return!!n&&"nullValue"in n}function _a(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function mr(n){return!!n&&"mapValue"in n}function Uf(n){var e,r;return((r=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[Fu])==null?void 0:r.stringValue)===Uu}function wn(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const t={mapValue:{fields:{}}};return fe(n.mapValue.fields,(e,r)=>t.mapValue.fields[e]=wn(r)),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=wn(n.arrayValue.values[e]);return t}return{...n}}function Bf(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Ff}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(t){this.value=t}static empty(){return new St({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let r=0;r<t.length-1;++r)if(e=(e.mapValue.fields||{})[t.get(r)],!mr(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=wn(e)}setAll(t){let e=mt.emptyPath(),r={},s=[];t.forEach((a,l)=>{if(!e.isImmediateParentOf(l)){const h=this.getFieldsMap(e);this.applyChanges(h,r,s),r={},s=[],e=l.popLast()}a?r[l.lastSegment()]=wn(a):s.push(l.lastSegment())});const o=this.getFieldsMap(e);this.applyChanges(o,r,s)}delete(t){const e=this.field(t.popLast());mr(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return $t(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let r=0;r<t.length;++r){let s=e.mapValue.fields[t.get(r)];mr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(r)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,r){fe(e,(s,o)=>t[s]=o);for(const s of r)delete t[s]}clone(){return new St(wn(this.value))}}function Bu(n){const t=[];return fe(n.fields,(e,r)=>{const s=new mt([e]);if(mr(r)){const o=Bu(r.mapValue).fields;if(o.length===0)t.push(s);else for(const a of o)t.push(s.child(a))}else t.push(s)}),new Vt(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(t,e,r,s,o,a,l){this.key=t,this.documentType=e,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=l}static newInvalidDocument(t){return new Tt(t,0,L.min(),L.min(),L.min(),St.empty(),0)}static newFoundDocument(t,e,r,s){return new Tt(t,1,e,L.min(),r,s,0)}static newNoDocument(t,e){return new Tt(t,2,e,L.min(),L.min(),St.empty(),0)}static newUnknownDocument(t,e){return new Tt(t,3,e,L.min(),L.min(),St.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(L.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=St.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=St.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=L.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof Tt&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new Tt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rr{constructor(t,e){this.position=t,this.inclusive=e}}function ya(n,t,e){let r=0;for(let s=0;s<n.position.length;s++){const o=t[s],a=n.position[s];if(o.field.isKeyField()?r=x.comparator(x.fromName(a.referenceValue),e.key):r=ze(a,e.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Ea(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!$t(n.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(t,e="asc"){this.field=t,this.dir=e}}function qf(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qu{}class at extends qu{constructor(t,e,r){super(),this.field=t,this.op=e,this.value=r}static create(t,e,r){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,r):new $f(t,e,r):e==="array-contains"?new Gf(t,r):e==="in"?new Kf(t,r):e==="not-in"?new Wf(t,r):e==="array-contains-any"?new Qf(t,r):new at(t,e,r)}static createKeyFieldInFilter(t,e,r){return e==="in"?new zf(t,r):new Hf(t,r)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(ze(e,this.value)):e!==null&&ce(this.value)===ce(e)&&this.matchesComparison(ze(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return M(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ot extends qu{constructor(t,e){super(),this.filters=t,this.op=e,this.Pe=null}static create(t,e){return new Ot(t,e)}matches(t){return ju(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function ju(n){return n.op==="and"}function $u(n){return jf(n)&&ju(n)}function jf(n){for(const t of n.filters)if(t instanceof Ot)return!1;return!0}function js(n){if(n instanceof at)return n.field.canonicalString()+n.op.toString()+He(n.value);if($u(n))return n.filters.map(t=>js(t)).join(",");{const t=n.filters.map(e=>js(e)).join(",");return`${n.op}(${t})`}}function zu(n,t){return n instanceof at?function(r,s){return s instanceof at&&r.op===s.op&&r.field.isEqual(s.field)&&$t(r.value,s.value)}(n,t):n instanceof Ot?function(r,s){return s instanceof Ot&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,l)=>o&&zu(a,s.filters[l]),!0):!1}(n,t):void M(19439)}function Hu(n){return n instanceof at?function(e){return`${e.field.canonicalString()} ${e.op} ${He(e.value)}`}(n):n instanceof Ot?function(e){return e.op.toString()+" {"+e.getFilters().map(Hu).join(" ,")+"}"}(n):"Filter"}class $f extends at{constructor(t,e,r){super(t,e,r),this.key=x.fromName(r.referenceValue)}matches(t){const e=x.comparator(t.key,this.key);return this.matchesComparison(e)}}class zf extends at{constructor(t,e){super(t,"in",e),this.keys=Gu("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class Hf extends at{constructor(t,e){super(t,"not-in",e),this.keys=Gu("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function Gu(n,t){var e;return(((e=t.arrayValue)==null?void 0:e.values)||[]).map(r=>x.fromName(r.referenceValue))}class Gf extends at{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return ui(e)&&Nn(e.arrayValue,this.value)}}class Kf extends at{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Nn(this.value.arrayValue,e)}}class Wf extends at{constructor(t,e){super(t,"not-in",e)}matches(t){if(Nn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!Nn(this.value.arrayValue,e)}}class Qf extends at{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!ui(e)||!e.arrayValue.values)&&e.arrayValue.values.some(r=>Nn(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xf{constructor(t,e=null,r=[],s=[],o=null,a=null,l=null){this.path=t,this.collectionGroup=e,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=l,this.Te=null}}function Ta(n,t=null,e=[],r=[],s=null,o=null,a=null){return new Xf(n,t,e,r,s,o,a)}function ci(n){const t=F(n);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(r=>js(r)).join(","),e+="|ob:",e+=t.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),Lr(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(r=>He(r)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(r=>He(r)).join(",")),t.Te=e}return t.Te}function li(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!qf(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!zu(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!Ea(n.startAt,t.startAt)&&Ea(n.endAt,t.endAt)}function $s(n){return x.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(t,e=null,r=[],s=[],o=null,a="F",l=null,h=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=l,this.endAt=h,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Yf(n,t,e,r,s,o,a,l){return new Ye(n,t,e,r,s,o,a,l)}function Ur(n){return new Ye(n)}function Ia(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Ku(n){return n.collectionGroup!==null}function An(n){const t=F(n);if(t.Ie===null){t.Ie=[];const e=new Set;for(const o of t.explicitOrderBy)t.Ie.push(o),e.add(o.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new lt(mt.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(f=>{f.isInequality()&&(l=l.add(f.field))})}),l})(t).forEach(o=>{e.has(o.canonicalString())||o.isKeyField()||t.Ie.push(new kn(o,r))}),e.has(mt.keyField().canonicalString())||t.Ie.push(new kn(mt.keyField(),r))}return t.Ie}function Ut(n){const t=F(n);return t.Ee||(t.Ee=Jf(t,An(n))),t.Ee}function Jf(n,t){if(n.limitType==="F")return Ta(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new kn(s.field,o)});const e=n.endAt?new Rr(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Rr(n.startAt.position,n.startAt.inclusive):null;return Ta(n.path,n.collectionGroup,t,n.filters,n.limit,e,r)}}function zs(n,t){const e=n.filters.concat([t]);return new Ye(n.path,n.collectionGroup,n.explicitOrderBy.slice(),e,n.limit,n.limitType,n.startAt,n.endAt)}function Hs(n,t,e){return new Ye(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function Br(n,t){return li(Ut(n),Ut(t))&&n.limitType===t.limitType}function Wu(n){return`${ci(Ut(n))}|lt:${n.limitType}`}function Le(n){return`Query(target=${function(e){let r=e.path.canonicalString();return e.collectionGroup!==null&&(r+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(r+=`, filters: [${e.filters.map(s=>Hu(s)).join(", ")}]`),Lr(e.limit)||(r+=", limit: "+e.limit),e.orderBy.length>0&&(r+=`, orderBy: [${e.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),e.startAt&&(r+=", startAt: ",r+=e.startAt.inclusive?"b:":"a:",r+=e.startAt.position.map(s=>He(s)).join(",")),e.endAt&&(r+=", endAt: ",r+=e.endAt.inclusive?"a:":"b:",r+=e.endAt.position.map(s=>He(s)).join(",")),`Target(${r})`}(Ut(n))}; limitType=${n.limitType})`}function qr(n,t){return t.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):x.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,t)&&function(r,s){for(const o of An(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,t)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,t)&&function(r,s){return!(r.startAt&&!function(a,l,h){const f=ya(a,l,h);return a.inclusive?f<=0:f<0}(r.startAt,An(r),s)||r.endAt&&!function(a,l,h){const f=ya(a,l,h);return a.inclusive?f>=0:f>0}(r.endAt,An(r),s))}(n,t)}function Zf(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Qu(n){return(t,e)=>{let r=!1;for(const s of An(n)){const o=td(s,t,e);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function td(n,t,e){const r=n.field.isKeyField()?x.comparator(t.key,e.key):function(o,a,l){const h=a.data.field(o),f=l.data.field(o);return h!==null&&f!==null?ze(h,f):M(42886)}(n.field,t,e);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return M(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,t))return o}}has(t){return this.get(t)!==void 0}set(t,e){const r=this.mapKeyFn(t),s=this.inner[r];if(s===void 0)return this.inner[r]=[[t,e]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],t))return void(s[o]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return r.length===1?delete this.inner[e]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(t){fe(this.inner,(e,r)=>{for(const[s,o]of r)t(s,o)})}isEmpty(){return Nu(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ed=new tt(x.comparator);function Kt(){return ed}const Xu=new tt(x.comparator);function yn(...n){let t=Xu;for(const e of n)t=t.insert(e.key,e);return t}function Yu(n){let t=Xu;return n.forEach((e,r)=>t=t.insert(e,r.overlayedDocument)),t}function we(){return vn()}function Ju(){return vn()}function vn(){return new De(n=>n.toString(),(n,t)=>n.isEqual(t))}const nd=new tt(x.comparator),rd=new lt(x.comparator);function z(...n){let t=rd;for(const e of n)t=t.add(e);return t}const sd=new lt($);function id(){return sd}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hi(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:wr(t)?"-0":t}}function Zu(n){return{integerValue:""+n}}function od(n,t){return kf(t)?Zu(t):hi(n,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr{constructor(){this._=void 0}}function ad(n,t,e){return n instanceof br?function(s,o){const a={fields:{[xu]:{stringValue:Ou},[Lu]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&ai(o)&&(o=Fr(o)),o&&(a.fields[Mu]=o),{mapValue:a}}(e,t):n instanceof On?ec(n,t):n instanceof xn?nc(n,t):function(s,o){const a=tc(s,o),l=wa(a)+wa(s.Ae);return qs(a)&&qs(s.Ae)?Zu(l):hi(s.serializer,l)}(n,t)}function ud(n,t,e){return n instanceof On?ec(n,t):n instanceof xn?nc(n,t):e}function tc(n,t){return n instanceof Sr?function(r){return qs(r)||function(o){return!!o&&"doubleValue"in o}(r)}(t)?t:{integerValue:0}:null}class br extends jr{}class On extends jr{constructor(t){super(),this.elements=t}}function ec(n,t){const e=rc(t);for(const r of n.elements)e.some(s=>$t(s,r))||e.push(r);return{arrayValue:{values:e}}}class xn extends jr{constructor(t){super(),this.elements=t}}function nc(n,t){let e=rc(t);for(const r of n.elements)e=e.filter(s=>!$t(s,r));return{arrayValue:{values:e}}}class Sr extends jr{constructor(t,e){super(),this.serializer=t,this.Ae=e}}function wa(n){return st(n.integerValue||n.doubleValue)}function rc(n){return ui(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function cd(n,t){return n.field.isEqual(t.field)&&function(r,s){return r instanceof On&&s instanceof On||r instanceof xn&&s instanceof xn?$e(r.elements,s.elements,$t):r instanceof Sr&&s instanceof Sr?$t(r.Ae,s.Ae):r instanceof br&&s instanceof br}(n.transform,t.transform)}class ld{constructor(t,e){this.version=t,this.transformResults=e}}class Ct{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new Ct}static exists(t){return new Ct(void 0,t)}static updateTime(t){return new Ct(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function gr(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class $r{}function sc(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new zr(n.key,Ct.none()):new Fn(n.key,n.data,Ct.none());{const e=n.data,r=St.empty();let s=new lt(mt.comparator);for(let o of t.fields)if(!s.has(o)){let a=e.field(o);a===null&&o.length>1&&(o=o.popLast(),a=e.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new de(n.key,r,new Vt(s.toArray()),Ct.none())}}function hd(n,t,e){n instanceof Fn?function(s,o,a){const l=s.value.clone(),h=va(s.fieldTransforms,o,a.transformResults);l.setAll(h),o.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,t,e):n instanceof de?function(s,o,a){if(!gr(s.precondition,o))return void o.convertToUnknownDocument(a.version);const l=va(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(ic(s)),h.setAll(l),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,t,e):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,t,e)}function Rn(n,t,e,r){return n instanceof Fn?function(o,a,l,h){if(!gr(o.precondition,a))return l;const f=o.value.clone(),p=Ra(o.fieldTransforms,h,a);return f.setAll(p),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),null}(n,t,e,r):n instanceof de?function(o,a,l,h){if(!gr(o.precondition,a))return l;const f=Ra(o.fieldTransforms,h,a),p=a.data;return p.setAll(ic(o)),p.setAll(f),a.convertToFoundDocument(a.version,p).setHasLocalMutations(),l===null?null:l.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(_=>_.field))}(n,t,e,r):function(o,a,l){return gr(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,t,e)}function fd(n,t){let e=null;for(const r of n.fieldTransforms){const s=t.data.field(r.field),o=tc(r.transform,s||null);o!=null&&(e===null&&(e=St.empty()),e.set(r.field,o))}return e||null}function Aa(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&$e(r,s,(o,a)=>cd(o,a))}(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class Fn extends $r{constructor(t,e,r,s=[]){super(),this.key=t,this.value=e,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class de extends $r{constructor(t,e,r,s,o=[]){super(),this.key=t,this.data=e,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function ic(n){const t=new Map;return n.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const r=n.data.field(e);t.set(e,r)}}),t}function va(n,t,e){const r=new Map;W(n.length===e.length,32656,{Re:e.length,Ve:n.length});for(let s=0;s<e.length;s++){const o=n[s],a=o.transform,l=t.data.field(o.field);r.set(o.field,ud(a,l,e[s]))}return r}function Ra(n,t,e){const r=new Map;for(const s of n){const o=s.transform,a=e.data.field(s.field);r.set(s.field,ad(o,a,t))}return r}class zr extends $r{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class dd extends $r{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pd{constructor(t,e,r,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(t,e){const r=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(t.key)&&hd(o,t,r[s])}}applyToLocalView(t,e){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(e=Rn(r,t,e,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(e=Rn(r,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const r=Ju();return this.mutations.forEach(s=>{const o=t.get(s.key),a=o.overlayedDocument;let l=this.applyToLocalView(a,o.mutatedFields);l=e.has(s.key)?null:l;const h=sc(a,l);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(L.min())}),r}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),z())}isEqual(t){return this.batchId===t.batchId&&$e(this.mutations,t.mutations,(e,r)=>Aa(e,r))&&$e(this.baseMutations,t.baseMutations,(e,r)=>Aa(e,r))}}class fi{constructor(t,e,r,s){this.batch=t,this.commitVersion=e,this.mutationResults=r,this.docVersions=s}static from(t,e,r){W(t.mutations.length===r.length,58842,{me:t.mutations.length,fe:r.length});let s=function(){return nd}();const o=t.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new fi(t,e,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gd{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ot,H;function _d(n){switch(n){case S.OK:return M(64938);case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0;default:return M(15467,{code:n})}}function oc(n){if(n===void 0)return Gt("GRPC error has no .code"),S.UNKNOWN;switch(n){case ot.OK:return S.OK;case ot.CANCELLED:return S.CANCELLED;case ot.UNKNOWN:return S.UNKNOWN;case ot.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case ot.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case ot.INTERNAL:return S.INTERNAL;case ot.UNAVAILABLE:return S.UNAVAILABLE;case ot.UNAUTHENTICATED:return S.UNAUTHENTICATED;case ot.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case ot.NOT_FOUND:return S.NOT_FOUND;case ot.ALREADY_EXISTS:return S.ALREADY_EXISTS;case ot.PERMISSION_DENIED:return S.PERMISSION_DENIED;case ot.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case ot.ABORTED:return S.ABORTED;case ot.OUT_OF_RANGE:return S.OUT_OF_RANGE;case ot.UNIMPLEMENTED:return S.UNIMPLEMENTED;case ot.DATA_LOSS:return S.DATA_LOSS;default:return M(39323,{code:n})}}(H=ot||(ot={}))[H.OK=0]="OK",H[H.CANCELLED=1]="CANCELLED",H[H.UNKNOWN=2]="UNKNOWN",H[H.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",H[H.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",H[H.NOT_FOUND=5]="NOT_FOUND",H[H.ALREADY_EXISTS=6]="ALREADY_EXISTS",H[H.PERMISSION_DENIED=7]="PERMISSION_DENIED",H[H.UNAUTHENTICATED=16]="UNAUTHENTICATED",H[H.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",H[H.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",H[H.ABORTED=10]="ABORTED",H[H.OUT_OF_RANGE=11]="OUT_OF_RANGE",H[H.UNIMPLEMENTED=12]="UNIMPLEMENTED",H[H.INTERNAL=13]="INTERNAL",H[H.UNAVAILABLE=14]="UNAVAILABLE",H[H.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yd(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ed=new se([4294967295,4294967295],0);function ba(n){const t=yd().encode(n),e=new Iu;return e.update(t),new Uint8Array(e.digest())}function Sa(n){const t=new DataView(n.buffer),e=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),o=t.getUint32(12,!0);return[new se([e,r],0),new se([s,o],0)]}class di{constructor(t,e,r){if(this.bitmap=t,this.padding=e,this.hashCount=r,e<0||e>=8)throw new En(`Invalid padding: ${e}`);if(r<0)throw new En(`Invalid hash count: ${r}`);if(t.length>0&&this.hashCount===0)throw new En(`Invalid hash count: ${r}`);if(t.length===0&&e!==0)throw new En(`Invalid padding when bitmap length is 0: ${e}`);this.ge=8*t.length-e,this.pe=se.fromNumber(this.ge)}ye(t,e,r){let s=t.add(e.multiply(se.fromNumber(r)));return s.compare(Ed)===1&&(s=new se([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.ge===0)return!1;const e=ba(t),[r,s]=Sa(e);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);if(!this.we(a))return!1}return!0}static create(t,e,r){const s=t%8==0?0:8-t%8,o=new Uint8Array(Math.ceil(t/8)),a=new di(o,s,e);return r.forEach(l=>a.insert(l)),a}insert(t){if(this.ge===0)return;const e=ba(t),[r,s]=Sa(e);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);this.Se(a)}}Se(t){const e=Math.floor(t/8),r=t%8;this.bitmap[e]|=1<<r}}class En extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hr{constructor(t,e,r,s,o){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(t,e,r){const s=new Map;return s.set(t,Un.createSynthesizedTargetChangeForCurrentChange(t,e,r)),new Hr(L.min(),s,new tt($),Kt(),z())}}class Un{constructor(t,e,r,s,o){this.resumeToken=t,this.current=e,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(t,e,r){return new Un(r,e,z(),z(),z())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _r{constructor(t,e,r,s){this.be=t,this.removedTargetIds=e,this.key=r,this.De=s}}class ac{constructor(t,e){this.targetId=t,this.Ce=e}}class uc{constructor(t,e,r=gt.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=r,this.cause=s}}class Ca{constructor(){this.ve=0,this.Fe=Pa(),this.Me=gt.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(t){t.approximateByteSize()>0&&(this.Oe=!0,this.Me=t)}ke(){let t=z(),e=z(),r=z();return this.Fe.forEach((s,o)=>{switch(o){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:r=r.add(s);break;default:M(38017,{changeType:o})}}),new Un(this.Me,this.xe,t,e,r)}qe(){this.Oe=!1,this.Fe=Pa()}Qe(t,e){this.Oe=!0,this.Fe=this.Fe.insert(t,e)}$e(t){this.Oe=!0,this.Fe=this.Fe.remove(t)}Ue(){this.ve+=1}Ke(){this.ve-=1,W(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class Td{constructor(t){this.Ge=t,this.ze=new Map,this.je=Kt(),this.Je=cr(),this.He=cr(),this.Ye=new tt($)}Ze(t){for(const e of t.be)t.De&&t.De.isFoundDocument()?this.Xe(e,t.De):this.et(e,t.key,t.De);for(const e of t.removedTargetIds)this.et(e,t.key,t.De)}tt(t){this.forEachTarget(t,e=>{const r=this.nt(e);switch(t.state){case 0:this.rt(e)&&r.Le(t.resumeToken);break;case 1:r.Ke(),r.Ne||r.qe(),r.Le(t.resumeToken);break;case 2:r.Ke(),r.Ne||this.removeTarget(e);break;case 3:this.rt(e)&&(r.We(),r.Le(t.resumeToken));break;case 4:this.rt(e)&&(this.it(e),r.Le(t.resumeToken));break;default:M(56790,{state:t.state})}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.ze.forEach((r,s)=>{this.rt(s)&&e(s)})}st(t){const e=t.targetId,r=t.Ce.count,s=this.ot(e);if(s){const o=s.target;if($s(o))if(r===0){const a=new x(o.path);this.et(e,a,Tt.newNoDocument(a,L.min()))}else W(r===1,20013,{expectedCount:r});else{const a=this._t(e);if(a!==r){const l=this.ut(t),h=l?this.ct(l,t,a):1;if(h!==0){this.it(e);const f=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(e,f)}}}}}ut(t){const e=t.Ce.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=e;let a,l;try{a=ue(r).toUint8Array()}catch(h){if(h instanceof ku)return je("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{l=new di(a,s,o)}catch(h){return je(h instanceof En?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return l.ge===0?null:l}ct(t,e,r){return e.Ce.count===r-this.Pt(t,e.targetId)?0:2}Pt(t,e){const r=this.Ge.getRemoteKeysForTarget(e);let s=0;return r.forEach(o=>{const a=this.Ge.ht(),l=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;t.mightContain(l)||(this.et(e,o,null),s++)}),s}Tt(t){const e=new Map;this.ze.forEach((o,a)=>{const l=this.ot(a);if(l){if(o.current&&$s(l.target)){const h=new x(l.target.path);this.It(h).has(a)||this.Et(a,h)||this.et(a,h,Tt.newNoDocument(h,t))}o.Be&&(e.set(a,o.ke()),o.qe())}});let r=z();this.He.forEach((o,a)=>{let l=!0;a.forEachWhile(h=>{const f=this.ot(h);return!f||f.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(o))}),this.je.forEach((o,a)=>a.setReadTime(t));const s=new Hr(t,e,this.Ye,this.je,r);return this.je=Kt(),this.Je=cr(),this.He=cr(),this.Ye=new tt($),s}Xe(t,e){if(!this.rt(t))return;const r=this.Et(t,e.key)?2:0;this.nt(t).Qe(e.key,r),this.je=this.je.insert(e.key,e),this.Je=this.Je.insert(e.key,this.It(e.key).add(t)),this.He=this.He.insert(e.key,this.dt(e.key).add(t))}et(t,e,r){if(!this.rt(t))return;const s=this.nt(t);this.Et(t,e)?s.Qe(e,1):s.$e(e),this.He=this.He.insert(e,this.dt(e).delete(t)),this.He=this.He.insert(e,this.dt(e).add(t)),r&&(this.je=this.je.insert(e,r))}removeTarget(t){this.ze.delete(t)}_t(t){const e=this.nt(t).ke();return this.Ge.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}Ue(t){this.nt(t).Ue()}nt(t){let e=this.ze.get(t);return e||(e=new Ca,this.ze.set(t,e)),e}dt(t){let e=this.He.get(t);return e||(e=new lt($),this.He=this.He.insert(t,e)),e}It(t){let e=this.Je.get(t);return e||(e=new lt($),this.Je=this.Je.insert(t,e)),e}rt(t){const e=this.ot(t)!==null;return e||O("WatchChangeAggregator","Detected inactive target",t),e}ot(t){const e=this.ze.get(t);return e&&e.Ne?null:this.Ge.At(t)}it(t){this.ze.set(t,new Ca),this.Ge.getRemoteKeysForTarget(t).forEach(e=>{this.et(t,e,null)})}Et(t,e){return this.Ge.getRemoteKeysForTarget(t).has(e)}}function cr(){return new tt(x.comparator)}function Pa(){return new tt(x.comparator)}const Id={asc:"ASCENDING",desc:"DESCENDING"},wd={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Ad={and:"AND",or:"OR"};class vd{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Gs(n,t){return n.useProto3Json||Lr(t)?t:{value:t}}function Cr(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function cc(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function Rd(n,t){return Cr(n,t.toTimestamp())}function Bt(n){return W(!!n,49232),L.fromTimestamp(function(e){const r=ae(e);return new J(r.seconds,r.nanos)}(n))}function pi(n,t){return Ks(n,t).canonicalString()}function Ks(n,t){const e=function(s){return new X(["projects",s.projectId,"databases",s.database])}(n).child("documents");return t===void 0?e:e.child(t)}function lc(n){const t=X.fromString(n);return W(mc(t),10190,{key:t.toString()}),t}function Ws(n,t){return pi(n.databaseId,t.path)}function Cs(n,t){const e=lc(t);if(e.get(1)!==n.databaseId.projectId)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+n.databaseId.projectId);if(e.get(3)!==n.databaseId.database)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+n.databaseId.database);return new x(fc(e))}function hc(n,t){return pi(n.databaseId,t)}function bd(n){const t=lc(n);return t.length===4?X.emptyPath():fc(t)}function Qs(n){return new X(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function fc(n){return W(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Va(n,t,e){return{name:Ws(n,t),fields:e.value.mapValue.fields}}function Sd(n,t){let e;if("targetChange"in t){t.targetChange;const r=function(f){return f==="NO_CHANGE"?0:f==="ADD"?1:f==="REMOVE"?2:f==="CURRENT"?3:f==="RESET"?4:M(39313,{state:f})}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],o=function(f,p){return f.useProto3Json?(W(p===void 0||typeof p=="string",58123),gt.fromBase64String(p||"")):(W(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),gt.fromUint8Array(p||new Uint8Array))}(n,t.targetChange.resumeToken),a=t.targetChange.cause,l=a&&function(f){const p=f.code===void 0?S.UNKNOWN:oc(f.code);return new N(p,f.message||"")}(a);e=new uc(r,s,o,l||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=Cs(n,r.document.name),o=Bt(r.document.updateTime),a=r.document.createTime?Bt(r.document.createTime):L.min(),l=new St({mapValue:{fields:r.document.fields}}),h=Tt.newFoundDocument(s,o,a,l),f=r.targetIds||[],p=r.removedTargetIds||[];e=new _r(f,p,h.key,h)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=Cs(n,r.document),o=r.readTime?Bt(r.readTime):L.min(),a=Tt.newNoDocument(s,o),l=r.removedTargetIds||[];e=new _r([],l,a.key,a)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=Cs(n,r.document),o=r.removedTargetIds||[];e=new _r([],o,s,null)}else{if(!("filter"in t))return M(11601,{Rt:t});{t.filter;const r=t.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new gd(s,o),l=r.targetId;e=new ac(l,a)}}return e}function Cd(n,t){let e;if(t instanceof Fn)e={update:Va(n,t.key,t.value)};else if(t instanceof zr)e={delete:Ws(n,t.key)};else if(t instanceof de)e={update:Va(n,t.key,t.data),updateMask:Ld(t.fieldMask)};else{if(!(t instanceof dd))return M(16599,{Vt:t.type});e={verify:Ws(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(r=>function(o,a){const l=a.transform;if(l instanceof br)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof On)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof xn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Sr)return{fieldPath:a.field.canonicalString(),increment:l.Ae};throw M(20930,{transform:a.transform})}(0,r))),t.precondition.isNone||(e.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:Rd(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:M(27497)}(n,t.precondition)),e}function Pd(n,t){return n&&n.length>0?(W(t!==void 0,14353),n.map(e=>function(s,o){let a=s.updateTime?Bt(s.updateTime):Bt(o);return a.isEqual(L.min())&&(a=Bt(o)),new ld(a,s.transformResults||[])}(e,t))):[]}function Vd(n,t){return{documents:[hc(n,t.path)]}}function Dd(n,t){const e={structuredQuery:{}},r=t.path;let s;t.collectionGroup!==null?(s=r,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),e.structuredQuery.from=[{collectionId:r.lastSegment()}]),e.parent=hc(n,s);const o=function(f){if(f.length!==0)return pc(Ot.create(f,"and"))}(t.filters);o&&(e.structuredQuery.where=o);const a=function(f){if(f.length!==0)return f.map(p=>function(I){return{field:Fe(I.field),direction:Od(I.dir)}}(p))}(t.orderBy);a&&(e.structuredQuery.orderBy=a);const l=Gs(n,t.limit);return l!==null&&(e.structuredQuery.limit=l),t.startAt&&(e.structuredQuery.startAt=function(f){return{before:f.inclusive,values:f.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(f){return{before:!f.inclusive,values:f.position}}(t.endAt)),{ft:e,parent:s}}function Nd(n){let t=bd(n.parent);const e=n.structuredQuery,r=e.from?e.from.length:0;let s=null;if(r>0){W(r===1,65062);const p=e.from[0];p.allDescendants?s=p.collectionId:t=t.child(p.collectionId)}let o=[];e.where&&(o=function(_){const I=dc(_);return I instanceof Ot&&$u(I)?I.getFilters():[I]}(e.where));let a=[];e.orderBy&&(a=function(_){return _.map(I=>function(D){return new kn(Ue(D.field),function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(D.direction))}(I))}(e.orderBy));let l=null;e.limit&&(l=function(_){let I;return I=typeof _=="object"?_.value:_,Lr(I)?null:I}(e.limit));let h=null;e.startAt&&(h=function(_){const I=!!_.before,b=_.values||[];return new Rr(b,I)}(e.startAt));let f=null;return e.endAt&&(f=function(_){const I=!_.before,b=_.values||[];return new Rr(b,I)}(e.endAt)),Yf(t,s,a,o,l,"F",h,f)}function kd(n,t){const e=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M(28987,{purpose:s})}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function dc(n){return n.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const r=Ue(e.unaryFilter.field);return at.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Ue(e.unaryFilter.field);return at.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Ue(e.unaryFilter.field);return at.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Ue(e.unaryFilter.field);return at.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return M(61313);default:return M(60726)}}(n):n.fieldFilter!==void 0?function(e){return at.create(Ue(e.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return M(58110);default:return M(50506)}}(e.fieldFilter.op),e.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(e){return Ot.create(e.compositeFilter.filters.map(r=>dc(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return M(1026)}}(e.compositeFilter.op))}(n):M(30097,{filter:n})}function Od(n){return Id[n]}function xd(n){return wd[n]}function Md(n){return Ad[n]}function Fe(n){return{fieldPath:n.canonicalString()}}function Ue(n){return mt.fromServerFormat(n.fieldPath)}function pc(n){return n instanceof at?function(e){if(e.op==="=="){if(_a(e.value))return{unaryFilter:{field:Fe(e.field),op:"IS_NAN"}};if(ga(e.value))return{unaryFilter:{field:Fe(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(_a(e.value))return{unaryFilter:{field:Fe(e.field),op:"IS_NOT_NAN"}};if(ga(e.value))return{unaryFilter:{field:Fe(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Fe(e.field),op:xd(e.op),value:e.value}}}(n):n instanceof Ot?function(e){const r=e.getFilters().map(s=>pc(s));return r.length===1?r[0]:{compositeFilter:{op:Md(e.op),filters:r}}}(n):M(54877,{filter:n})}function Ld(n){const t=[];return n.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function mc(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne{constructor(t,e,r,s,o=L.min(),a=L.min(),l=gt.EMPTY_BYTE_STRING,h=null){this.target=t,this.targetId=e,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=h}withSequenceNumber(t){return new ne(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new ne(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new ne(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new ne(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fd{constructor(t){this.yt=t}}function Ud(n){const t=Nd({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Hs(t,t.limit,"L"):t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bd{constructor(){this.Cn=new qd}addToCollectionParentIndex(t,e){return this.Cn.add(e),C.resolve()}getCollectionParents(t,e){return C.resolve(this.Cn.getEntries(e))}addFieldIndex(t,e){return C.resolve()}deleteFieldIndex(t,e){return C.resolve()}deleteAllFieldIndexes(t){return C.resolve()}createTargetIndexes(t,e){return C.resolve()}getDocumentsMatchingTarget(t,e){return C.resolve(null)}getIndexType(t,e){return C.resolve(0)}getFieldIndexes(t,e){return C.resolve([])}getNextCollectionGroupToUpdate(t){return C.resolve(null)}getMinOffset(t,e){return C.resolve(oe.min())}getMinOffsetFromCollectionGroup(t,e){return C.resolve(oe.min())}updateCollectionGroup(t,e,r){return C.resolve()}updateIndexEntries(t,e){return C.resolve()}}class qd{constructor(){this.index={}}add(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e]||new lt(X.comparator),o=!s.has(r);return this.index[e]=s.add(r),o}has(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e];return s&&s.has(r)}getEntries(t){return(this.index[t]||new lt(X.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Da={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},gc=41943040;class bt{static withCacheSize(t){return new bt(t,bt.DEFAULT_COLLECTION_PERCENTILE,bt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,r){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */bt.DEFAULT_COLLECTION_PERCENTILE=10,bt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,bt.DEFAULT=new bt(gc,bt.DEFAULT_COLLECTION_PERCENTILE,bt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),bt.DISABLED=new bt(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(t){this.ar=t}next(){return this.ar+=2,this.ar}static ur(){return new Ge(0)}static cr(){return new Ge(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Na="LruGarbageCollector",jd=1048576;function ka([n,t],[e,r]){const s=$(n,e);return s===0?$(t,r):s}class $d{constructor(t){this.Ir=t,this.buffer=new lt(ka),this.Er=0}dr(){return++this.Er}Ar(t){const e=[t,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(e);else{const r=this.buffer.last();ka(e,r)<0&&(this.buffer=this.buffer.delete(r).add(e))}}get maxValue(){return this.buffer.last()[0]}}class zd{constructor(t,e,r){this.garbageCollector=t,this.asyncQueue=e,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(t){O(Na,`Garbage collection scheduled in ${t}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Xe(e)?O(Na,"Ignoring IndexedDB error during garbage collection: ",e):await Qe(e)}await this.Vr(3e5)})}}class Hd{constructor(t,e){this.mr=t,this.params=e}calculateTargetCount(t,e){return this.mr.gr(t).next(r=>Math.floor(e/100*r))}nthSequenceNumber(t,e){if(e===0)return C.resolve(Mr.ce);const r=new $d(e);return this.mr.forEachTarget(t,s=>r.Ar(s.sequenceNumber)).next(()=>this.mr.pr(t,s=>r.Ar(s))).next(()=>r.maxValue)}removeTargets(t,e,r){return this.mr.removeTargets(t,e,r)}removeOrphanedDocuments(t,e){return this.mr.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(O("LruGarbageCollector","Garbage collection skipped; disabled"),C.resolve(Da)):this.getCacheSize(t).next(r=>r<this.params.cacheSizeCollectionThreshold?(O("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Da):this.yr(t,e))}getCacheSize(t){return this.mr.getCacheSize(t)}yr(t,e){let r,s,o,a,l,h,f;const p=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next(_=>(_>this.params.maximumSequenceNumbersToCollect?(O("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${_}`),s=this.params.maximumSequenceNumbersToCollect):s=_,a=Date.now(),this.nthSequenceNumber(t,s))).next(_=>(r=_,l=Date.now(),this.removeTargets(t,r,e))).next(_=>(o=_,h=Date.now(),this.removeOrphanedDocuments(t,r))).next(_=>(f=Date.now(),Me()<=G.DEBUG&&O("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-p}ms
	Determined least recently used ${s} in `+(l-a)+`ms
	Removed ${o} targets in `+(h-l)+`ms
	Removed ${_} documents in `+(f-h)+`ms
Total Duration: ${f-p}ms`),C.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:_})))}}function Gd(n,t){return new Hd(n,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kd{constructor(){this.changes=new De(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,Tt.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const r=this.changes.get(e);return r!==void 0?C.resolve(r):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wd{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qd{constructor(t,e,r,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=r,this.indexManager=s}getDocument(t,e){let r=null;return this.documentOverlayCache.getOverlay(t,e).next(s=>(r=s,this.remoteDocumentCache.getEntry(t,e))).next(s=>(r!==null&&Rn(r.mutation,s,Vt.empty(),J.now()),s))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.getLocalViewOfDocuments(t,r,z()).next(()=>r))}getLocalViewOfDocuments(t,e,r=z()){const s=we();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,r).next(o=>{let a=yn();return o.forEach((l,h)=>{a=a.insert(l,h.overlayedDocument)}),a}))}getOverlayedDocuments(t,e){const r=we();return this.populateOverlays(t,r,e).next(()=>this.computeViews(t,e,r,z()))}populateOverlays(t,e,r){const s=[];return r.forEach(o=>{e.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(t,s).next(o=>{o.forEach((a,l)=>{e.set(a,l)})})}computeViews(t,e,r,s){let o=Kt();const a=vn(),l=function(){return vn()}();return e.forEach((h,f)=>{const p=r.get(f.key);s.has(f.key)&&(p===void 0||p.mutation instanceof de)?o=o.insert(f.key,f):p!==void 0?(a.set(f.key,p.mutation.getFieldMask()),Rn(p.mutation,f,p.mutation.getFieldMask(),J.now())):a.set(f.key,Vt.empty())}),this.recalculateAndSaveOverlays(t,o).next(h=>(h.forEach((f,p)=>a.set(f,p)),e.forEach((f,p)=>l.set(f,new Wd(p,a.get(f)??null))),l))}recalculateAndSaveOverlays(t,e){const r=vn();let s=new tt((a,l)=>a-l),o=z();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(a=>{for(const l of a)l.keys().forEach(h=>{const f=e.get(h);if(f===null)return;let p=r.get(h)||Vt.empty();p=l.applyToLocalView(f,p),r.set(h,p);const _=(s.get(l.batchId)||z()).add(h);s=s.insert(l.batchId,_)})}).next(()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const h=l.getNext(),f=h.key,p=h.value,_=Ju();p.forEach(I=>{if(!o.has(I)){const b=sc(e.get(I),r.get(I));b!==null&&_.set(I,b),o=o.add(I)}}),a.push(this.documentOverlayCache.saveOverlays(t,f,_))}return C.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.recalculateAndSaveOverlays(t,r))}getDocumentsMatchingQuery(t,e,r,s){return function(a){return x.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):Ku(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,r,s):this.getDocumentsMatchingCollectionQuery(t,e,r,s)}getNextDocuments(t,e,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,r.largestBatchId,s-o.size):C.resolve(we());let l=Pn,h=o;return a.next(f=>C.forEach(f,(p,_)=>(l<_.largestBatchId&&(l=_.largestBatchId),o.get(p)?C.resolve():this.remoteDocumentCache.getEntry(t,p).next(I=>{h=h.insert(p,I)}))).next(()=>this.populateOverlays(t,f,o)).next(()=>this.computeViews(t,h,f,z())).next(p=>({batchId:l,changes:Yu(p)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new x(e)).next(r=>{let s=yn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(t,e,r,s){const o=e.collectionGroup;let a=yn();return this.indexManager.getCollectionParents(t,o).next(l=>C.forEach(l,h=>{const f=function(_,I){return new Ye(I,null,_.explicitOrderBy.slice(),_.filters.slice(),_.limit,_.limitType,_.startAt,_.endAt)}(e,h.child(o));return this.getDocumentsMatchingCollectionQuery(t,f,r,s).next(p=>{p.forEach((_,I)=>{a=a.insert(_,I)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(t,e,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,r,o,s))).next(a=>{o.forEach((h,f)=>{const p=f.getKey();a.get(p)===null&&(a=a.insert(p,Tt.newInvalidDocument(p)))});let l=yn();return a.forEach((h,f)=>{const p=o.get(h);p!==void 0&&Rn(p.mutation,f,Vt.empty(),J.now()),qr(e,f)&&(l=l.insert(h,f))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{constructor(t){this.serializer=t,this.Lr=new Map,this.kr=new Map}getBundleMetadata(t,e){return C.resolve(this.Lr.get(e))}saveBundleMetadata(t,e){return this.Lr.set(e.id,function(s){return{id:s.id,version:s.version,createTime:Bt(s.createTime)}}(e)),C.resolve()}getNamedQuery(t,e){return C.resolve(this.kr.get(e))}saveNamedQuery(t,e){return this.kr.set(e.name,function(s){return{name:s.name,query:Ud(s.bundledQuery),readTime:Bt(s.readTime)}}(e)),C.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yd{constructor(){this.overlays=new tt(x.comparator),this.qr=new Map}getOverlay(t,e){return C.resolve(this.overlays.get(e))}getOverlays(t,e){const r=we();return C.forEach(e,s=>this.getOverlay(t,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(t,e,r){return r.forEach((s,o)=>{this.St(t,e,o)}),C.resolve()}removeOverlaysForBatchId(t,e,r){const s=this.qr.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.qr.delete(r)),C.resolve()}getOverlaysForCollection(t,e,r){const s=we(),o=e.length+1,a=new x(e.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const h=l.getNext().value,f=h.getKey();if(!e.isPrefixOf(f.path))break;f.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return C.resolve(s)}getOverlaysForCollectionGroup(t,e,r,s){let o=new tt((f,p)=>f-p);const a=this.overlays.getIterator();for(;a.hasNext();){const f=a.getNext().value;if(f.getKey().getCollectionGroup()===e&&f.largestBatchId>r){let p=o.get(f.largestBatchId);p===null&&(p=we(),o=o.insert(f.largestBatchId,p)),p.set(f.getKey(),f)}}const l=we(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((f,p)=>l.set(f,p)),!(l.size()>=s)););return C.resolve(l)}St(t,e,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.qr.get(s.largestBatchId).delete(r.key);this.qr.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new md(e,r));let o=this.qr.get(e);o===void 0&&(o=z(),this.qr.set(e,o)),this.qr.set(e,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jd{constructor(){this.sessionToken=gt.EMPTY_BYTE_STRING}getSessionToken(t){return C.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,C.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mi{constructor(){this.Qr=new lt(dt.$r),this.Ur=new lt(dt.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(t,e){const r=new dt(t,e);this.Qr=this.Qr.add(r),this.Ur=this.Ur.add(r)}Wr(t,e){t.forEach(r=>this.addReference(r,e))}removeReference(t,e){this.Gr(new dt(t,e))}zr(t,e){t.forEach(r=>this.removeReference(r,e))}jr(t){const e=new x(new X([])),r=new dt(e,t),s=new dt(e,t+1),o=[];return this.Ur.forEachInRange([r,s],a=>{this.Gr(a),o.push(a.key)}),o}Jr(){this.Qr.forEach(t=>this.Gr(t))}Gr(t){this.Qr=this.Qr.delete(t),this.Ur=this.Ur.delete(t)}Hr(t){const e=new x(new X([])),r=new dt(e,t),s=new dt(e,t+1);let o=z();return this.Ur.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(t){const e=new dt(t,0),r=this.Qr.firstAfterOrEqual(e);return r!==null&&t.isEqual(r.key)}}class dt{constructor(t,e){this.key=t,this.Yr=e}static $r(t,e){return x.comparator(t.key,e.key)||$(t.Yr,e.Yr)}static Kr(t,e){return $(t.Yr,e.Yr)||x.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.tr=1,this.Zr=new lt(dt.$r)}checkEmpty(t){return C.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,r,s){const o=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new pd(o,e,r,s);this.mutationQueue.push(a);for(const l of s)this.Zr=this.Zr.add(new dt(l.key,o)),this.indexManager.addToCollectionParentIndex(t,l.key.path.popLast());return C.resolve(a)}lookupMutationBatch(t,e){return C.resolve(this.Xr(e))}getNextMutationBatchAfterBatchId(t,e){const r=e+1,s=this.ei(r),o=s<0?0:s;return C.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return C.resolve(this.mutationQueue.length===0?oi:this.tr-1)}getAllMutationBatches(t){return C.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const r=new dt(e,0),s=new dt(e,Number.POSITIVE_INFINITY),o=[];return this.Zr.forEachInRange([r,s],a=>{const l=this.Xr(a.Yr);o.push(l)}),C.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(t,e){let r=new lt($);return e.forEach(s=>{const o=new dt(s,0),a=new dt(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([o,a],l=>{r=r.add(l.Yr)})}),C.resolve(this.ti(r))}getAllMutationBatchesAffectingQuery(t,e){const r=e.path,s=r.length+1;let o=r;x.isDocumentKey(o)||(o=o.child(""));const a=new dt(new x(o),0);let l=new lt($);return this.Zr.forEachWhile(h=>{const f=h.key.path;return!!r.isPrefixOf(f)&&(f.length===s&&(l=l.add(h.Yr)),!0)},a),C.resolve(this.ti(l))}ti(t){const e=[];return t.forEach(r=>{const s=this.Xr(r);s!==null&&e.push(s)}),e}removeMutationBatch(t,e){W(this.ni(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Zr;return C.forEach(e.mutations,s=>{const o=new dt(s.key,e.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.Zr=r})}ir(t){}containsKey(t,e){const r=new dt(e,0),s=this.Zr.firstAfterOrEqual(r);return C.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,C.resolve()}ni(t,e){return this.ei(t)}ei(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Xr(t){const e=this.ei(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tp{constructor(t){this.ri=t,this.docs=function(){return new tt(x.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const r=e.key,s=this.docs.get(r),o=s?s.size:0,a=this.ri(e);return this.docs=this.docs.insert(r,{document:e.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const r=this.docs.get(e);return C.resolve(r?r.document.mutableCopy():Tt.newInvalidDocument(e))}getEntries(t,e){let r=Kt();return e.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():Tt.newInvalidDocument(s))}),C.resolve(r)}getDocumentsMatchingQuery(t,e,r,s){let o=Kt();const a=e.path,l=new x(a.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(l);for(;h.hasNext();){const{key:f,value:{document:p}}=h.getNext();if(!a.isPrefixOf(f.path))break;f.path.length>a.length+1||Pf(Cf(p),r)<=0||(s.has(p.key)||qr(e,p))&&(o=o.insert(p.key,p.mutableCopy()))}return C.resolve(o)}getAllFromCollectionGroup(t,e,r,s){M(9500)}ii(t,e){return C.forEach(this.docs,r=>e(r))}newChangeBuffer(t){return new ep(this)}getSize(t){return C.resolve(this.size)}}class ep extends Kd{constructor(t){super(),this.Nr=t}applyChanges(t){const e=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?e.push(this.Nr.addEntry(t,s)):this.Nr.removeEntry(r)}),C.waitFor(e)}getFromCache(t,e){return this.Nr.getEntry(t,e)}getAllFromCache(t,e){return this.Nr.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np{constructor(t){this.persistence=t,this.si=new De(e=>ci(e),li),this.lastRemoteSnapshotVersion=L.min(),this.highestTargetId=0,this.oi=0,this._i=new mi,this.targetCount=0,this.ai=Ge.ur()}forEachTarget(t,e){return this.si.forEach((r,s)=>e(s)),C.resolve()}getLastRemoteSnapshotVersion(t){return C.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return C.resolve(this.oi)}allocateTargetId(t){return this.highestTargetId=this.ai.next(),C.resolve(this.highestTargetId)}setTargetsMetadata(t,e,r){return r&&(this.lastRemoteSnapshotVersion=r),e>this.oi&&(this.oi=e),C.resolve()}Pr(t){this.si.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.ai=new Ge(e),this.highestTargetId=e),t.sequenceNumber>this.oi&&(this.oi=t.sequenceNumber)}addTargetData(t,e){return this.Pr(e),this.targetCount+=1,C.resolve()}updateTargetData(t,e){return this.Pr(e),C.resolve()}removeTargetData(t,e){return this.si.delete(e.target),this._i.jr(e.targetId),this.targetCount-=1,C.resolve()}removeTargets(t,e,r){let s=0;const o=[];return this.si.forEach((a,l)=>{l.sequenceNumber<=e&&r.get(l.targetId)===null&&(this.si.delete(a),o.push(this.removeMatchingKeysForTargetId(t,l.targetId)),s++)}),C.waitFor(o).next(()=>s)}getTargetCount(t){return C.resolve(this.targetCount)}getTargetData(t,e){const r=this.si.get(e)||null;return C.resolve(r)}addMatchingKeys(t,e,r){return this._i.Wr(e,r),C.resolve()}removeMatchingKeys(t,e,r){this._i.zr(e,r);const s=this.persistence.referenceDelegate,o=[];return s&&e.forEach(a=>{o.push(s.markPotentiallyOrphaned(t,a))}),C.waitFor(o)}removeMatchingKeysForTargetId(t,e){return this._i.jr(e),C.resolve()}getMatchingKeysForTargetId(t,e){const r=this._i.Hr(e);return C.resolve(r)}containsKey(t,e){return C.resolve(this._i.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _c{constructor(t,e){this.ui={},this.overlays={},this.ci=new Mr(0),this.li=!1,this.li=!0,this.hi=new Jd,this.referenceDelegate=t(this),this.Pi=new np(this),this.indexManager=new Bd,this.remoteDocumentCache=function(s){return new tp(s)}(r=>this.referenceDelegate.Ti(r)),this.serializer=new Fd(e),this.Ii=new Xd(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Yd,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let r=this.ui[t.toKey()];return r||(r=new Zd(e,this.referenceDelegate),this.ui[t.toKey()]=r),r}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(t,e,r){O("MemoryPersistence","Starting transaction:",t);const s=new rp(this.ci.next());return this.referenceDelegate.Ei(),r(s).next(o=>this.referenceDelegate.di(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Ai(t,e){return C.or(Object.values(this.ui).map(r=>()=>r.containsKey(t,e)))}}class rp extends Df{constructor(t){super(),this.currentSequenceNumber=t}}class gi{constructor(t){this.persistence=t,this.Ri=new mi,this.Vi=null}static mi(t){return new gi(t)}get fi(){if(this.Vi)return this.Vi;throw M(60996)}addReference(t,e,r){return this.Ri.addReference(r,e),this.fi.delete(r.toString()),C.resolve()}removeReference(t,e,r){return this.Ri.removeReference(r,e),this.fi.add(r.toString()),C.resolve()}markPotentiallyOrphaned(t,e){return this.fi.add(e.toString()),C.resolve()}removeTarget(t,e){this.Ri.jr(e.targetId).forEach(s=>this.fi.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,e.targetId).next(s=>{s.forEach(o=>this.fi.add(o.toString()))}).next(()=>r.removeTargetData(t,e))}Ei(){this.Vi=new Set}di(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return C.forEach(this.fi,r=>{const s=x.fromPath(r);return this.gi(t,s).next(o=>{o||e.removeEntry(s,L.min())})}).next(()=>(this.Vi=null,e.apply(t)))}updateLimboDocument(t,e){return this.gi(t,e).next(r=>{r?this.fi.delete(e.toString()):this.fi.add(e.toString())})}Ti(t){return 0}gi(t,e){return C.or([()=>C.resolve(this.Ri.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ai(t,e)])}}class Pr{constructor(t,e){this.persistence=t,this.pi=new De(r=>Of(r.path),(r,s)=>r.isEqual(s)),this.garbageCollector=Gd(this,e)}static mi(t,e){return new Pr(t,e)}Ei(){}di(t){return C.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}gr(t){const e=this.wr(t);return this.persistence.getTargetCache().getTargetCount(t).next(r=>e.next(s=>r+s))}wr(t){let e=0;return this.pr(t,r=>{e++}).next(()=>e)}pr(t,e){return C.forEach(this.pi,(r,s)=>this.br(t,r,s).next(o=>o?C.resolve():e(s)))}removeTargets(t,e,r){return this.persistence.getTargetCache().removeTargets(t,e,r)}removeOrphanedDocuments(t,e){let r=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.ii(t,a=>this.br(t,a,e).next(l=>{l||(r++,o.removeEntry(a,L.min()))})).next(()=>o.apply(t)).next(()=>r)}markPotentiallyOrphaned(t,e){return this.pi.set(e,t.currentSequenceNumber),C.resolve()}removeTarget(t,e){const r=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,r)}addReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),C.resolve()}removeReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),C.resolve()}updateLimboDocument(t,e){return this.pi.set(e,t.currentSequenceNumber),C.resolve()}Ti(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=pr(t.data.value)),e}br(t,e,r){return C.or([()=>this.persistence.Ai(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.pi.get(e);return C.resolve(s!==void 0&&s>r)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _i{constructor(t,e,r,s){this.targetId=t,this.fromCache=e,this.Es=r,this.ds=s}static As(t,e){let r=z(),s=z();for(const o of e.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new _i(t,e.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sp{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ip{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=function(){return ch()?8:Nf(ri())>0?6:4}()}initialize(t,e){this.ps=t,this.indexManager=e,this.Rs=!0}getDocumentsMatchingQuery(t,e,r,s){const o={result:null};return this.ys(t,e).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.ws(t,e,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new sp;return this.Ss(t,e,a).next(l=>{if(o.result=l,this.Vs)return this.bs(t,e,a,l.size)})}).next(()=>o.result)}bs(t,e,r,s){return r.documentReadCount<this.fs?(Me()<=G.DEBUG&&O("QueryEngine","SDK will not create cache indexes for query:",Le(e),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),C.resolve()):(Me()<=G.DEBUG&&O("QueryEngine","Query:",Le(e),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.gs*s?(Me()<=G.DEBUG&&O("QueryEngine","The SDK decides to create cache indexes for query:",Le(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Ut(e))):C.resolve())}ys(t,e){if(Ia(e))return C.resolve(null);let r=Ut(e);return this.indexManager.getIndexType(t,r).next(s=>s===0?null:(e.limit!==null&&s===1&&(e=Hs(e,null,"F"),r=Ut(e)),this.indexManager.getDocumentsMatchingTarget(t,r).next(o=>{const a=z(...o);return this.ps.getDocuments(t,a).next(l=>this.indexManager.getMinOffset(t,r).next(h=>{const f=this.Ds(e,l);return this.Cs(e,f,a,h.readTime)?this.ys(t,Hs(e,null,"F")):this.vs(t,f,e,h)}))})))}ws(t,e,r,s){return Ia(e)||s.isEqual(L.min())?C.resolve(null):this.ps.getDocuments(t,r).next(o=>{const a=this.Ds(e,o);return this.Cs(e,a,r,s)?C.resolve(null):(Me()<=G.DEBUG&&O("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Le(e)),this.vs(t,a,e,Sf(s,Pn)).next(l=>l))})}Ds(t,e){let r=new lt(Qu(t));return e.forEach((s,o)=>{qr(t,o)&&(r=r.add(o))}),r}Cs(t,e,r,s){if(t.limit===null)return!1;if(r.size!==e.size)return!0;const o=t.limitType==="F"?e.last():e.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Ss(t,e,r){return Me()<=G.DEBUG&&O("QueryEngine","Using full collection scan to execute query:",Le(e)),this.ps.getDocumentsMatchingQuery(t,e,oe.min(),r)}vs(t,e,r,s){return this.ps.getDocumentsMatchingQuery(t,r,s).next(o=>(e.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yi="LocalStore",op=3e8;class ap{constructor(t,e,r,s){this.persistence=t,this.Fs=e,this.serializer=s,this.Ms=new tt($),this.xs=new De(o=>ci(o),li),this.Os=new Map,this.Ns=t.getRemoteDocumentCache(),this.Pi=t.getTargetCache(),this.Ii=t.getBundleCache(),this.Bs(r)}Bs(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Qd(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.Ms))}}function up(n,t,e,r){return new ap(n,t,e,r)}async function yc(n,t){const e=F(n);return await e.persistence.runTransaction("Handle user change","readonly",r=>{let s;return e.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,e.Bs(t),e.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],l=[];let h=z();for(const f of s){a.push(f.batchId);for(const p of f.mutations)h=h.add(p.key)}for(const f of o){l.push(f.batchId);for(const p of f.mutations)h=h.add(p.key)}return e.localDocuments.getDocuments(r,h).next(f=>({Ls:f,removedBatchIds:a,addedBatchIds:l}))})})}function cp(n,t){const e=F(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=t.batch.keys(),o=e.Ns.newChangeBuffer({trackRemovals:!0});return function(l,h,f,p){const _=f.batch,I=_.keys();let b=C.resolve();return I.forEach(D=>{b=b.next(()=>p.getEntry(h,D)).next(k=>{const P=f.docVersions.get(D);W(P!==null,48541),k.version.compareTo(P)<0&&(_.applyToRemoteDocument(k,f),k.isValidDocument()&&(k.setReadTime(f.commitVersion),p.addEntry(k)))})}),b.next(()=>l.mutationQueue.removeMutationBatch(h,_))}(e,r,t,o).next(()=>o.apply(r)).next(()=>e.mutationQueue.performConsistencyCheck(r)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(r,s,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let h=z();for(let f=0;f<l.mutationResults.length;++f)l.mutationResults[f].transformResults.length>0&&(h=h.add(l.batch.mutations[f].key));return h}(t))).next(()=>e.localDocuments.getDocuments(r,s))})}function Ec(n){const t=F(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Pi.getLastRemoteSnapshotVersion(e))}function lp(n,t){const e=F(n),r=t.snapshotVersion;let s=e.Ms;return e.persistence.runTransaction("Apply remote event","readwrite-primary",o=>{const a=e.Ns.newChangeBuffer({trackRemovals:!0});s=e.Ms;const l=[];t.targetChanges.forEach((p,_)=>{const I=s.get(_);if(!I)return;l.push(e.Pi.removeMatchingKeys(o,p.removedDocuments,_).next(()=>e.Pi.addMatchingKeys(o,p.addedDocuments,_)));let b=I.withSequenceNumber(o.currentSequenceNumber);t.targetMismatches.get(_)!==null?b=b.withResumeToken(gt.EMPTY_BYTE_STRING,L.min()).withLastLimboFreeSnapshotVersion(L.min()):p.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(p.resumeToken,r)),s=s.insert(_,b),function(k,P,j){return k.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-k.snapshotVersion.toMicroseconds()>=op?!0:j.addedDocuments.size+j.modifiedDocuments.size+j.removedDocuments.size>0}(I,b,p)&&l.push(e.Pi.updateTargetData(o,b))});let h=Kt(),f=z();if(t.documentUpdates.forEach(p=>{t.resolvedLimboDocuments.has(p)&&l.push(e.persistence.referenceDelegate.updateLimboDocument(o,p))}),l.push(hp(o,a,t.documentUpdates).next(p=>{h=p.ks,f=p.qs})),!r.isEqual(L.min())){const p=e.Pi.getLastRemoteSnapshotVersion(o).next(_=>e.Pi.setTargetsMetadata(o,o.currentSequenceNumber,r));l.push(p)}return C.waitFor(l).next(()=>a.apply(o)).next(()=>e.localDocuments.getLocalViewOfDocuments(o,h,f)).next(()=>h)}).then(o=>(e.Ms=s,o))}function hp(n,t,e){let r=z(),s=z();return e.forEach(o=>r=r.add(o)),t.getEntries(n,r).next(o=>{let a=Kt();return e.forEach((l,h)=>{const f=o.get(l);h.isFoundDocument()!==f.isFoundDocument()&&(s=s.add(l)),h.isNoDocument()&&h.version.isEqual(L.min())?(t.removeEntry(l,h.readTime),a=a.insert(l,h)):!f.isValidDocument()||h.version.compareTo(f.version)>0||h.version.compareTo(f.version)===0&&f.hasPendingWrites?(t.addEntry(h),a=a.insert(l,h)):O(yi,"Ignoring outdated watch update for ",l,". Current version:",f.version," Watch version:",h.version)}),{ks:a,qs:s}})}function fp(n,t){const e=F(n);return e.persistence.runTransaction("Get next mutation batch","readonly",r=>(t===void 0&&(t=oi),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t)))}function dp(n,t){const e=F(n);return e.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return e.Pi.getTargetData(r,t).next(o=>o?(s=o,C.resolve(s)):e.Pi.allocateTargetId(r).next(a=>(s=new ne(t,a,"TargetPurposeListen",r.currentSequenceNumber),e.Pi.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=e.Ms.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.Ms=e.Ms.insert(r.targetId,r),e.xs.set(t,r.targetId)),r})}async function Xs(n,t,e){const r=F(n),s=r.Ms.get(t),o=e?"readwrite":"readwrite-primary";try{e||await r.persistence.runTransaction("Release target",o,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!Xe(a))throw a;O(yi,`Failed to update sequence numbers for target ${t}: ${a}`)}r.Ms=r.Ms.remove(t),r.xs.delete(s.target)}function Oa(n,t,e){const r=F(n);let s=L.min(),o=z();return r.persistence.runTransaction("Execute query","readwrite",a=>function(h,f,p){const _=F(h),I=_.xs.get(p);return I!==void 0?C.resolve(_.Ms.get(I)):_.Pi.getTargetData(f,p)}(r,a,Ut(t)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(a,l.targetId).next(h=>{o=h})}).next(()=>r.Fs.getDocumentsMatchingQuery(a,t,e?s:L.min(),e?o:z())).next(l=>(pp(r,Zf(t),l),{documents:l,Qs:o})))}function pp(n,t,e){let r=n.Os.get(t)||L.min();e.forEach((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)}),n.Os.set(t,r)}class xa{constructor(){this.activeTargetIds=id()}zs(t){this.activeTargetIds=this.activeTargetIds.add(t)}js(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Gs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class mp{constructor(){this.Mo=new xa,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,r){}addLocalQueryTarget(t,e=!0){return e&&this.Mo.zs(t),this.xo[t]||"not-current"}updateQueryState(t,e,r){this.xo[t]=e}removeLocalQueryTarget(t){this.Mo.js(t)}isLocalQueryTarget(t){return this.Mo.activeTargetIds.has(t)}clearQueryState(t){delete this.xo[t]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(t){return this.Mo.activeTargetIds.has(t)}start(){return this.Mo=new xa,Promise.resolve()}handleUserChange(t,e,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gp{Oo(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ma="ConnectivityMonitor";class La{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(t){this.qo.push(t)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){O(Ma,"Network connectivity changed: AVAILABLE");for(const t of this.qo)t(0)}ko(){O(Ma,"Network connectivity changed: UNAVAILABLE");for(const t of this.qo)t(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let lr=null;function Ys(){return lr===null?lr=function(){return 268435456+Math.round(2147483648*Math.random())}():lr++,"0x"+lr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ps="RestConnection",_p={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class yp{get $o(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=e+"://"+t.host,this.Ko=`projects/${r}/databases/${s}`,this.Wo=this.databaseId.database===Ar?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Go(t,e,r,s,o){const a=Ys(),l=this.zo(t,e.toUriEncodedString());O(Ps,`Sending RPC '${t}' ${a}:`,l,r);const h={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(h,s,o);const{host:f}=new URL(l),p=Mn(f);return this.Jo(t,l,h,r,p).then(_=>(O(Ps,`Received RPC '${t}' ${a}: `,_),_),_=>{throw je(Ps,`RPC '${t}' ${a} failed with error: `,_,"url: ",l,"request:",r),_})}Ho(t,e,r,s,o,a){return this.Go(t,e,r,s,o)}jo(t,e,r){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+We}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach((s,o)=>t[o]=s),r&&r.headers.forEach((s,o)=>t[o]=s)}zo(t,e){const r=_p[t];return`${this.Uo}/v1/${e}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ep{constructor(t){this.Yo=t.Yo,this.Zo=t.Zo}Xo(t){this.e_=t}t_(t){this.n_=t}r_(t){this.i_=t}onMessage(t){this.s_=t}close(){this.Zo()}send(t){this.Yo(t)}o_(){this.e_()}__(){this.n_()}a_(t){this.i_(t)}u_(t){this.s_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yt="WebChannelConnection";class Tp extends yp{constructor(t){super(t),this.c_=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}Jo(t,e,r,s,o){const a=Ys();return new Promise((l,h)=>{const f=new wu;f.setWithCredentials(!0),f.listenOnce(Au.COMPLETE,()=>{try{switch(f.getLastErrorCode()){case dr.NO_ERROR:const _=f.getResponseJson();O(yt,`XHR for RPC '${t}' ${a} received:`,JSON.stringify(_)),l(_);break;case dr.TIMEOUT:O(yt,`RPC '${t}' ${a} timed out`),h(new N(S.DEADLINE_EXCEEDED,"Request time out"));break;case dr.HTTP_ERROR:const I=f.getStatus();if(O(yt,`RPC '${t}' ${a} failed with status:`,I,"response text:",f.getResponseText()),I>0){let b=f.getResponseJson();Array.isArray(b)&&(b=b[0]);const D=b==null?void 0:b.error;if(D&&D.status&&D.message){const k=function(j){const U=j.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(U)>=0?U:S.UNKNOWN}(D.status);h(new N(k,D.message))}else h(new N(S.UNKNOWN,"Server responded with status "+f.getStatus()))}else h(new N(S.UNAVAILABLE,"Connection failed."));break;default:M(9055,{l_:t,streamId:a,h_:f.getLastErrorCode(),P_:f.getLastError()})}}finally{O(yt,`RPC '${t}' ${a} completed.`)}});const p=JSON.stringify(s);O(yt,`RPC '${t}' ${a} sending request:`,s),f.send(e,"POST",p,r,15)})}T_(t,e,r){const s=Ys(),o=[this.Uo,"/","google.firestore.v1.Firestore","/",t,"/channel"],a=bu(),l=Ru(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},f=this.longPollingOptions.timeoutSeconds;f!==void 0&&(h.longPollingTimeout=Math.round(1e3*f)),this.useFetchStreams&&(h.useFetchStreams=!0),this.jo(h.initMessageHeaders,e,r),h.encodeInitMessageHeaders=!0;const p=o.join("");O(yt,`Creating RPC '${t}' stream ${s}: ${p}`,h);const _=a.createWebChannel(p,h);this.I_(_);let I=!1,b=!1;const D=new Ep({Yo:P=>{b?O(yt,`Not sending because RPC '${t}' stream ${s} is closed:`,P):(I||(O(yt,`Opening RPC '${t}' stream ${s} transport.`),_.open(),I=!0),O(yt,`RPC '${t}' stream ${s} sending:`,P),_.send(P))},Zo:()=>_.close()}),k=(P,j,U)=>{P.listen(j,B=>{try{U(B)}catch(K){setTimeout(()=>{throw K},0)}})};return k(_,_n.EventType.OPEN,()=>{b||(O(yt,`RPC '${t}' stream ${s} transport opened.`),D.o_())}),k(_,_n.EventType.CLOSE,()=>{b||(b=!0,O(yt,`RPC '${t}' stream ${s} transport closed`),D.a_(),this.E_(_))}),k(_,_n.EventType.ERROR,P=>{b||(b=!0,je(yt,`RPC '${t}' stream ${s} transport errored. Name:`,P.name,"Message:",P.message),D.a_(new N(S.UNAVAILABLE,"The operation could not be completed")))}),k(_,_n.EventType.MESSAGE,P=>{var j;if(!b){const U=P.data[0];W(!!U,16349);const B=U,K=(B==null?void 0:B.error)||((j=B[0])==null?void 0:j.error);if(K){O(yt,`RPC '${t}' stream ${s} received error:`,K);const ht=K.status;let Z=function(y){const w=ot[y];if(w!==void 0)return oc(w)}(ht),T=K.message;Z===void 0&&(Z=S.INTERNAL,T="Unknown error status: "+ht+" with message "+K.message),b=!0,D.a_(new N(Z,T)),_.close()}else O(yt,`RPC '${t}' stream ${s} received:`,U),D.u_(U)}}),k(l,vu.STAT_EVENT,P=>{P.stat===Fs.PROXY?O(yt,`RPC '${t}' stream ${s} detected buffering proxy`):P.stat===Fs.NOPROXY&&O(yt,`RPC '${t}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{D.__()},0),D}terminate(){this.c_.forEach(t=>t.close()),this.c_=[]}I_(t){this.c_.push(t)}E_(t){this.c_=this.c_.filter(e=>e===t)}}function Vs(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gr(n){return new vd(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tc{constructor(t,e,r=1e3,s=1.5,o=6e4){this.Mi=t,this.timerId=e,this.d_=r,this.A_=s,this.R_=o,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(t){this.cancel();const e=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,e-r);s>0&&O("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,()=>(this.f_=Date.now(),t())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fa="PersistentStream";class Ic{constructor(t,e,r,s,o,a,l,h){this.Mi=t,this.S_=r,this.b_=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=h,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Tc(t,e)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(t){this.Q_(),this.stream.send(t)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(t,e){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,t!==4?this.M_.reset():e&&e.code===S.RESOURCE_EXHAUSTED?(Gt(e.toString()),Gt("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):e&&e.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.r_(e)}K_(){}auth(){this.state=1;const t=this.W_(this.D_),e=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.D_===e&&this.G_(r,s)},r=>{t(()=>{const s=new N(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(s)})})}G_(t,e){const r=this.W_(this.D_);this.stream=this.j_(t,e),this.stream.Xo(()=>{r(()=>this.listener.Xo())}),this.stream.t_(()=>{r(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(s=>{r(()=>this.z_(s))}),this.stream.onMessage(s=>{r(()=>++this.F_==1?this.J_(s):this.onNext(s))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(t){return O(Fa,`close with error: ${t}`),this.stream=null,this.close(4,t)}W_(t){return e=>{this.Mi.enqueueAndForget(()=>this.D_===t?e():(O(Fa,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Ip extends Ic{constructor(t,e,r,s,o,a){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,r,s,a),this.serializer=o}j_(t,e){return this.connection.T_("Listen",t,e)}J_(t){return this.onNext(t)}onNext(t){this.M_.reset();const e=Sd(this.serializer,t),r=function(o){if(!("targetChange"in o))return L.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?L.min():a.readTime?Bt(a.readTime):L.min()}(t);return this.listener.H_(e,r)}Y_(t){const e={};e.database=Qs(this.serializer),e.addTarget=function(o,a){let l;const h=a.target;if(l=$s(h)?{documents:Vd(o,h)}:{query:Dd(o,h).ft},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=cc(o,a.resumeToken);const f=Gs(o,a.expectedCount);f!==null&&(l.expectedCount=f)}else if(a.snapshotVersion.compareTo(L.min())>0){l.readTime=Cr(o,a.snapshotVersion.toTimestamp());const f=Gs(o,a.expectedCount);f!==null&&(l.expectedCount=f)}return l}(this.serializer,t);const r=kd(this.serializer,t);r&&(e.labels=r),this.q_(e)}Z_(t){const e={};e.database=Qs(this.serializer),e.removeTarget=t,this.q_(e)}}class wp extends Ic{constructor(t,e,r,s,o,a){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,r,s,a),this.serializer=o}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(t,e){return this.connection.T_("Write",t,e)}J_(t){return W(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,W(!t.writeResults||t.writeResults.length===0,55816),this.listener.ta()}onNext(t){W(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.M_.reset();const e=Pd(t.writeResults,t.commitTime),r=Bt(t.commitTime);return this.listener.na(r,e)}ra(){const t={};t.database=Qs(this.serializer),this.q_(t)}ea(t){const e={streamToken:this.lastStreamToken,writes:t.map(r=>Cd(this.serializer,r))};this.q_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ap{}class vp extends Ap{constructor(t,e,r,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=r,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.")}Go(t,e,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Go(t,Ks(e,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(S.UNKNOWN,o.toString())})}Ho(t,e,r,s,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Ho(t,Ks(e,r),s,a,l,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new N(S.UNKNOWN,a.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class Rp{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(t){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ca("Offline")))}set(t){this.Pa(),this.oa=0,t==="Online"&&(this.aa=!1),this.ca(t)}ca(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}la(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Gt(e),this.aa=!1):O("OnlineStateTracker",e)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ce="RemoteStore";class bp{constructor(t,e,r,s,o){this.localStore=t,this.datastore=e,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=o,this.Aa.Oo(a=>{r.enqueueAndForget(async()=>{Ne(this)&&(O(Ce,"Restarting streams for network reachability change."),await async function(h){const f=F(h);f.Ea.add(4),await Bn(f),f.Ra.set("Unknown"),f.Ea.delete(4),await Kr(f)}(this))})}),this.Ra=new Rp(r,s)}}async function Kr(n){if(Ne(n))for(const t of n.da)await t(!0)}async function Bn(n){for(const t of n.da)await t(!1)}function wc(n,t){const e=F(n);e.Ia.has(t.targetId)||(e.Ia.set(t.targetId,t),wi(e)?Ii(e):Je(e).O_()&&Ti(e,t))}function Ei(n,t){const e=F(n),r=Je(e);e.Ia.delete(t),r.O_()&&Ac(e,t),e.Ia.size===0&&(r.O_()?r.L_():Ne(e)&&e.Ra.set("Unknown"))}function Ti(n,t){if(n.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(L.min())>0){const e=n.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Je(n).Y_(t)}function Ac(n,t){n.Va.Ue(t),Je(n).Z_(t)}function Ii(n){n.Va=new Td({getRemoteKeysForTarget:t=>n.remoteSyncer.getRemoteKeysForTarget(t),At:t=>n.Ia.get(t)||null,ht:()=>n.datastore.serializer.databaseId}),Je(n).start(),n.Ra.ua()}function wi(n){return Ne(n)&&!Je(n).x_()&&n.Ia.size>0}function Ne(n){return F(n).Ea.size===0}function vc(n){n.Va=void 0}async function Sp(n){n.Ra.set("Online")}async function Cp(n){n.Ia.forEach((t,e)=>{Ti(n,t)})}async function Pp(n,t){vc(n),wi(n)?(n.Ra.ha(t),Ii(n)):n.Ra.set("Unknown")}async function Vp(n,t,e){if(n.Ra.set("Online"),t instanceof uc&&t.state===2&&t.cause)try{await async function(s,o){const a=o.cause;for(const l of o.targetIds)s.Ia.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.Ia.delete(l),s.Va.removeTarget(l))}(n,t)}catch(r){O(Ce,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await Vr(n,r)}else if(t instanceof _r?n.Va.Ze(t):t instanceof ac?n.Va.st(t):n.Va.tt(t),!e.isEqual(L.min()))try{const r=await Ec(n.localStore);e.compareTo(r)>=0&&await function(o,a){const l=o.Va.Tt(a);return l.targetChanges.forEach((h,f)=>{if(h.resumeToken.approximateByteSize()>0){const p=o.Ia.get(f);p&&o.Ia.set(f,p.withResumeToken(h.resumeToken,a))}}),l.targetMismatches.forEach((h,f)=>{const p=o.Ia.get(h);if(!p)return;o.Ia.set(h,p.withResumeToken(gt.EMPTY_BYTE_STRING,p.snapshotVersion)),Ac(o,h);const _=new ne(p.target,h,f,p.sequenceNumber);Ti(o,_)}),o.remoteSyncer.applyRemoteEvent(l)}(n,e)}catch(r){O(Ce,"Failed to raise snapshot:",r),await Vr(n,r)}}async function Vr(n,t,e){if(!Xe(t))throw t;n.Ea.add(1),await Bn(n),n.Ra.set("Offline"),e||(e=()=>Ec(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{O(Ce,"Retrying IndexedDB access"),await e(),n.Ea.delete(1),await Kr(n)})}function Rc(n,t){return t().catch(e=>Vr(n,e,t))}async function Wr(n){const t=F(n),e=le(t);let r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:oi;for(;Dp(t);)try{const s=await fp(t.localStore,r);if(s===null){t.Ta.length===0&&e.L_();break}r=s.batchId,Np(t,s)}catch(s){await Vr(t,s)}bc(t)&&Sc(t)}function Dp(n){return Ne(n)&&n.Ta.length<10}function Np(n,t){n.Ta.push(t);const e=le(n);e.O_()&&e.X_&&e.ea(t.mutations)}function bc(n){return Ne(n)&&!le(n).x_()&&n.Ta.length>0}function Sc(n){le(n).start()}async function kp(n){le(n).ra()}async function Op(n){const t=le(n);for(const e of n.Ta)t.ea(e.mutations)}async function xp(n,t,e){const r=n.Ta.shift(),s=fi.from(r,t,e);await Rc(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await Wr(n)}async function Mp(n,t){t&&le(n).X_&&await async function(r,s){if(function(a){return _d(a)&&a!==S.ABORTED}(s.code)){const o=r.Ta.shift();le(r).B_(),await Rc(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await Wr(r)}}(n,t),bc(n)&&Sc(n)}async function Ua(n,t){const e=F(n);e.asyncQueue.verifyOperationInProgress(),O(Ce,"RemoteStore received new credentials");const r=Ne(e);e.Ea.add(3),await Bn(e),r&&e.Ra.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Ea.delete(3),await Kr(e)}async function Lp(n,t){const e=F(n);t?(e.Ea.delete(2),await Kr(e)):t||(e.Ea.add(2),await Bn(e),e.Ra.set("Unknown"))}function Je(n){return n.ma||(n.ma=function(e,r,s){const o=F(e);return o.sa(),new Ip(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Xo:Sp.bind(null,n),t_:Cp.bind(null,n),r_:Pp.bind(null,n),H_:Vp.bind(null,n)}),n.da.push(async t=>{t?(n.ma.B_(),wi(n)?Ii(n):n.Ra.set("Unknown")):(await n.ma.stop(),vc(n))})),n.ma}function le(n){return n.fa||(n.fa=function(e,r,s){const o=F(e);return o.sa(),new wp(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Xo:()=>Promise.resolve(),t_:kp.bind(null,n),r_:Mp.bind(null,n),ta:Op.bind(null,n),na:xp.bind(null,n)}),n.da.push(async t=>{t?(n.fa.B_(),await Wr(n)):(await n.fa.stop(),n.Ta.length>0&&(O(Ce,`Stopping write stream with ${n.Ta.length} pending writes`),n.Ta=[]))})),n.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ai{constructor(t,e,r,s,o){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new zt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,r,s,o){const a=Date.now()+r,l=new Ai(t,e,a,s,o);return l.start(r),l}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(S.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function vi(n,t){if(Gt("AsyncQueue",`${t}: ${n}`),Xe(n))return new N(S.UNAVAILABLE,`${t}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{static emptySet(t){return new Be(t.comparator)}constructor(t){this.comparator=t?(e,r)=>t(e,r)||x.comparator(e.key,r.key):(e,r)=>x.comparator(e.key,r.key),this.keyedMap=yn(),this.sortedSet=new tt(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,r)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof Be)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const r=new Be;return r.comparator=this.comparator,r.keyedMap=t,r.sortedSet=e,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ba{constructor(){this.ga=new tt(x.comparator)}track(t){const e=t.doc.key,r=this.ga.get(e);r?t.type!==0&&r.type===3?this.ga=this.ga.insert(e,t):t.type===3&&r.type!==1?this.ga=this.ga.insert(e,{type:r.type,doc:t.doc}):t.type===2&&r.type===2?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):t.type===2&&r.type===0?this.ga=this.ga.insert(e,{type:0,doc:t.doc}):t.type===1&&r.type===0?this.ga=this.ga.remove(e):t.type===1&&r.type===2?this.ga=this.ga.insert(e,{type:1,doc:r.doc}):t.type===0&&r.type===1?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):M(63341,{Rt:t,pa:r}):this.ga=this.ga.insert(e,t)}ya(){const t=[];return this.ga.inorderTraversal((e,r)=>{t.push(r)}),t}}class Ke{constructor(t,e,r,s,o,a,l,h,f){this.query=t,this.docs=e,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=h,this.hasCachedResults=f}static fromInitialDocuments(t,e,r,s,o){const a=[];return e.forEach(l=>{a.push({type:0,doc:l})}),new Ke(t,e,Be.emptySet(e),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&Br(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,r=t.docChanges;if(e.length!==r.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==r[s].type||!e[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fp{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(t=>t.Da())}}class Up{constructor(){this.queries=qa(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(e,r){const s=F(e),o=s.queries;s.queries=qa(),o.forEach((a,l)=>{for(const h of l.Sa)h.onError(r)})})(this,new N(S.ABORTED,"Firestore shutting down"))}}function qa(){return new De(n=>Wu(n),Br)}async function Ri(n,t){const e=F(n);let r=3;const s=t.query;let o=e.queries.get(s);o?!o.ba()&&t.Da()&&(r=2):(o=new Fp,r=t.Da()?0:1);try{switch(r){case 0:o.wa=await e.onListen(s,!0);break;case 1:o.wa=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(a){const l=vi(a,`Initialization of query '${Le(t.query)}' failed`);return void t.onError(l)}e.queries.set(s,o),o.Sa.push(t),t.va(e.onlineState),o.wa&&t.Fa(o.wa)&&Si(e)}async function bi(n,t){const e=F(n),r=t.query;let s=3;const o=e.queries.get(r);if(o){const a=o.Sa.indexOf(t);a>=0&&(o.Sa.splice(a,1),o.Sa.length===0?s=t.Da()?0:1:!o.ba()&&t.Da()&&(s=2))}switch(s){case 0:return e.queries.delete(r),e.onUnlisten(r,!0);case 1:return e.queries.delete(r),e.onUnlisten(r,!1);case 2:return e.onLastRemoteStoreUnlisten(r);default:return}}function Bp(n,t){const e=F(n);let r=!1;for(const s of t){const o=s.query,a=e.queries.get(o);if(a){for(const l of a.Sa)l.Fa(s)&&(r=!0);a.wa=s}}r&&Si(e)}function qp(n,t,e){const r=F(n),s=r.queries.get(t);if(s)for(const o of s.Sa)o.onError(e);r.queries.delete(t)}function Si(n){n.Ca.forEach(t=>{t.next()})}var Js,ja;(ja=Js||(Js={})).Ma="default",ja.Cache="cache";class Ci{constructor(t,e,r){this.query=t,this.xa=e,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(t){if(!this.options.includeMetadataChanges){const r=[];for(const s of t.docChanges)s.type!==3&&r.push(s);t=new Ke(t.query,t.docs,t.oldDocs,r,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.Oa?this.Ba(t)&&(this.xa.next(t),e=!0):this.La(t,this.onlineState)&&(this.ka(t),e=!0),this.Na=t,e}onError(t){this.xa.error(t)}va(t){this.onlineState=t;let e=!1;return this.Na&&!this.Oa&&this.La(this.Na,t)&&(this.ka(this.Na),e=!0),e}La(t,e){if(!t.fromCache||!this.Da())return!0;const r=e!=="Offline";return(!this.options.qa||!r)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}Ba(t){if(t.docChanges.length>0)return!0;const e=this.Na&&this.Na.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}ka(t){t=Ke.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.Oa=!0,this.xa.next(t)}Da(){return this.options.source!==Js.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cc{constructor(t){this.key=t}}class Pc{constructor(t){this.key=t}}class jp{constructor(t,e){this.query=t,this.Ya=e,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=z(),this.mutatedKeys=z(),this.eu=Qu(t),this.tu=new Be(this.eu)}get nu(){return this.Ya}ru(t,e){const r=e?e.iu:new Ba,s=e?e.tu:this.tu;let o=e?e.mutatedKeys:this.mutatedKeys,a=s,l=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,f=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((p,_)=>{const I=s.get(p),b=qr(this.query,_)?_:null,D=!!I&&this.mutatedKeys.has(I.key),k=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations);let P=!1;I&&b?I.data.isEqual(b.data)?D!==k&&(r.track({type:3,doc:b}),P=!0):this.su(I,b)||(r.track({type:2,doc:b}),P=!0,(h&&this.eu(b,h)>0||f&&this.eu(b,f)<0)&&(l=!0)):!I&&b?(r.track({type:0,doc:b}),P=!0):I&&!b&&(r.track({type:1,doc:I}),P=!0,(h||f)&&(l=!0)),P&&(b?(a=a.add(b),o=k?o.add(p):o.delete(p)):(a=a.delete(p),o=o.delete(p)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const p=this.query.limitType==="F"?a.last():a.first();a=a.delete(p.key),o=o.delete(p.key),r.track({type:1,doc:p})}return{tu:a,iu:r,Cs:l,mutatedKeys:o}}su(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,r,s){const o=this.tu;this.tu=t.tu,this.mutatedKeys=t.mutatedKeys;const a=t.iu.ya();a.sort((p,_)=>function(b,D){const k=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M(20277,{Rt:P})}};return k(b)-k(D)}(p.type,_.type)||this.eu(p.doc,_.doc)),this.ou(r),s=s??!1;const l=e&&!s?this._u():[],h=this.Xa.size===0&&this.current&&!s?1:0,f=h!==this.Za;return this.Za=h,a.length!==0||f?{snapshot:new Ke(this.query,t.tu,o,a,t.mutatedKeys,h===0,f,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:l}:{au:l}}va(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new Ba,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(t){return!this.Ya.has(t)&&!!this.tu.has(t)&&!this.tu.get(t).hasLocalMutations}ou(t){t&&(t.addedDocuments.forEach(e=>this.Ya=this.Ya.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ya=this.Ya.delete(e)),this.current=t.current)}_u(){if(!this.current)return[];const t=this.Xa;this.Xa=z(),this.tu.forEach(r=>{this.uu(r.key)&&(this.Xa=this.Xa.add(r.key))});const e=[];return t.forEach(r=>{this.Xa.has(r)||e.push(new Pc(r))}),this.Xa.forEach(r=>{t.has(r)||e.push(new Cc(r))}),e}cu(t){this.Ya=t.Qs,this.Xa=z();const e=this.ru(t.documents);return this.applyChanges(e,!0)}lu(){return Ke.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const Pi="SyncEngine";class $p{constructor(t,e,r){this.query=t,this.targetId=e,this.view=r}}class zp{constructor(t){this.key=t,this.hu=!1}}class Hp{constructor(t,e,r,s,o,a){this.localStore=t,this.remoteStore=e,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new De(l=>Wu(l),Br),this.Iu=new Map,this.Eu=new Set,this.du=new tt(x.comparator),this.Au=new Map,this.Ru=new mi,this.Vu={},this.mu=new Map,this.fu=Ge.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function Gp(n,t,e=!0){const r=xc(n);let s;const o=r.Tu.get(t);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.lu()):s=await Vc(r,t,e,!0),s}async function Kp(n,t){const e=xc(n);await Vc(e,t,!0,!1)}async function Vc(n,t,e,r){const s=await dp(n.localStore,Ut(t)),o=s.targetId,a=n.sharedClientState.addLocalQueryTarget(o,e);let l;return r&&(l=await Wp(n,t,o,a==="current",s.resumeToken)),n.isPrimaryClient&&e&&wc(n.remoteStore,s),l}async function Wp(n,t,e,r,s){n.pu=(_,I,b)=>async function(k,P,j,U){let B=P.view.ru(j);B.Cs&&(B=await Oa(k.localStore,P.query,!1).then(({documents:T})=>P.view.ru(T,B)));const K=U&&U.targetChanges.get(P.targetId),ht=U&&U.targetMismatches.get(P.targetId)!=null,Z=P.view.applyChanges(B,k.isPrimaryClient,K,ht);return za(k,P.targetId,Z.au),Z.snapshot}(n,_,I,b);const o=await Oa(n.localStore,t,!0),a=new jp(t,o.Qs),l=a.ru(o.documents),h=Un.createSynthesizedTargetChangeForCurrentChange(e,r&&n.onlineState!=="Offline",s),f=a.applyChanges(l,n.isPrimaryClient,h);za(n,e,f.au);const p=new $p(t,e,a);return n.Tu.set(t,p),n.Iu.has(e)?n.Iu.get(e).push(t):n.Iu.set(e,[t]),f.snapshot}async function Qp(n,t,e){const r=F(n),s=r.Tu.get(t),o=r.Iu.get(s.targetId);if(o.length>1)return r.Iu.set(s.targetId,o.filter(a=>!Br(a,t))),void r.Tu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Xs(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),e&&Ei(r.remoteStore,s.targetId),Zs(r,s.targetId)}).catch(Qe)):(Zs(r,s.targetId),await Xs(r.localStore,s.targetId,!0))}async function Xp(n,t){const e=F(n),r=e.Tu.get(t),s=e.Iu.get(r.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(r.targetId),Ei(e.remoteStore,r.targetId))}async function Yp(n,t,e){const r=sm(n);try{const s=await function(a,l){const h=F(a),f=J.now(),p=l.reduce((b,D)=>b.add(D.key),z());let _,I;return h.persistence.runTransaction("Locally write mutations","readwrite",b=>{let D=Kt(),k=z();return h.Ns.getEntries(b,p).next(P=>{D=P,D.forEach((j,U)=>{U.isValidDocument()||(k=k.add(j))})}).next(()=>h.localDocuments.getOverlayedDocuments(b,D)).next(P=>{_=P;const j=[];for(const U of l){const B=fd(U,_.get(U.key).overlayedDocument);B!=null&&j.push(new de(U.key,B,Bu(B.value.mapValue),Ct.exists(!0)))}return h.mutationQueue.addMutationBatch(b,f,j,l)}).next(P=>{I=P;const j=P.applyToLocalDocumentSet(_,k);return h.documentOverlayCache.saveOverlays(b,P.batchId,j)})}).then(()=>({batchId:I.batchId,changes:Yu(_)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),function(a,l,h){let f=a.Vu[a.currentUser.toKey()];f||(f=new tt($)),f=f.insert(l,h),a.Vu[a.currentUser.toKey()]=f}(r,s.batchId,e),await qn(r,s.changes),await Wr(r.remoteStore)}catch(s){const o=vi(s,"Failed to persist write");e.reject(o)}}async function Dc(n,t){const e=F(n);try{const r=await lp(e.localStore,t);t.targetChanges.forEach((s,o)=>{const a=e.Au.get(o);a&&(W(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.hu=!0:s.modifiedDocuments.size>0?W(a.hu,14607):s.removedDocuments.size>0&&(W(a.hu,42227),a.hu=!1))}),await qn(e,r,t)}catch(r){await Qe(r)}}function $a(n,t,e){const r=F(n);if(r.isPrimaryClient&&e===0||!r.isPrimaryClient&&e===1){const s=[];r.Tu.forEach((o,a)=>{const l=a.view.va(t);l.snapshot&&s.push(l.snapshot)}),function(a,l){const h=F(a);h.onlineState=l;let f=!1;h.queries.forEach((p,_)=>{for(const I of _.Sa)I.va(l)&&(f=!0)}),f&&Si(h)}(r.eventManager,t),s.length&&r.Pu.H_(s),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function Jp(n,t,e){const r=F(n);r.sharedClientState.updateQueryState(t,"rejected",e);const s=r.Au.get(t),o=s&&s.key;if(o){let a=new tt(x.comparator);a=a.insert(o,Tt.newNoDocument(o,L.min()));const l=z().add(o),h=new Hr(L.min(),new Map,new tt($),a,l);await Dc(r,h),r.du=r.du.remove(o),r.Au.delete(t),Vi(r)}else await Xs(r.localStore,t,!1).then(()=>Zs(r,t,e)).catch(Qe)}async function Zp(n,t){const e=F(n),r=t.batch.batchId;try{const s=await cp(e.localStore,t);kc(e,r,null),Nc(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await qn(e,s)}catch(s){await Qe(s)}}async function tm(n,t,e){const r=F(n);try{const s=await function(a,l){const h=F(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",f=>{let p;return h.mutationQueue.lookupMutationBatch(f,l).next(_=>(W(_!==null,37113),p=_.keys(),h.mutationQueue.removeMutationBatch(f,_))).next(()=>h.mutationQueue.performConsistencyCheck(f)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(f,p,l)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(f,p)).next(()=>h.localDocuments.getDocuments(f,p))})}(r.localStore,t);kc(r,t,e),Nc(r,t),r.sharedClientState.updateMutationState(t,"rejected",e),await qn(r,s)}catch(s){await Qe(s)}}function Nc(n,t){(n.mu.get(t)||[]).forEach(e=>{e.resolve()}),n.mu.delete(t)}function kc(n,t,e){const r=F(n);let s=r.Vu[r.currentUser.toKey()];if(s){const o=s.get(t);o&&(e?o.reject(e):o.resolve(),s=s.remove(t)),r.Vu[r.currentUser.toKey()]=s}}function Zs(n,t,e=null){n.sharedClientState.removeLocalQueryTarget(t);for(const r of n.Iu.get(t))n.Tu.delete(r),e&&n.Pu.yu(r,e);n.Iu.delete(t),n.isPrimaryClient&&n.Ru.jr(t).forEach(r=>{n.Ru.containsKey(r)||Oc(n,r)})}function Oc(n,t){n.Eu.delete(t.path.canonicalString());const e=n.du.get(t);e!==null&&(Ei(n.remoteStore,e),n.du=n.du.remove(t),n.Au.delete(e),Vi(n))}function za(n,t,e){for(const r of e)r instanceof Cc?(n.Ru.addReference(r.key,t),em(n,r)):r instanceof Pc?(O(Pi,"Document no longer in limbo: "+r.key),n.Ru.removeReference(r.key,t),n.Ru.containsKey(r.key)||Oc(n,r.key)):M(19791,{wu:r})}function em(n,t){const e=t.key,r=e.path.canonicalString();n.du.get(e)||n.Eu.has(r)||(O(Pi,"New document in limbo: "+e),n.Eu.add(r),Vi(n))}function Vi(n){for(;n.Eu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const t=n.Eu.values().next().value;n.Eu.delete(t);const e=new x(X.fromString(t)),r=n.fu.next();n.Au.set(r,new zp(e)),n.du=n.du.insert(e,r),wc(n.remoteStore,new ne(Ut(Ur(e.path)),r,"TargetPurposeLimboResolution",Mr.ce))}}async function qn(n,t,e){const r=F(n),s=[],o=[],a=[];r.Tu.isEmpty()||(r.Tu.forEach((l,h)=>{a.push(r.pu(h,t,e).then(f=>{var p;if((f||e)&&r.isPrimaryClient){const _=f?!f.fromCache:(p=e==null?void 0:e.targetChanges.get(h.targetId))==null?void 0:p.current;r.sharedClientState.updateQueryState(h.targetId,_?"current":"not-current")}if(f){s.push(f);const _=_i.As(h.targetId,f);o.push(_)}}))}),await Promise.all(a),r.Pu.H_(s),await async function(h,f){const p=F(h);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",_=>C.forEach(f,I=>C.forEach(I.Es,b=>p.persistence.referenceDelegate.addReference(_,I.targetId,b)).next(()=>C.forEach(I.ds,b=>p.persistence.referenceDelegate.removeReference(_,I.targetId,b)))))}catch(_){if(!Xe(_))throw _;O(yi,"Failed to update sequence numbers: "+_)}for(const _ of f){const I=_.targetId;if(!_.fromCache){const b=p.Ms.get(I),D=b.snapshotVersion,k=b.withLastLimboFreeSnapshotVersion(D);p.Ms=p.Ms.insert(I,k)}}}(r.localStore,o))}async function nm(n,t){const e=F(n);if(!e.currentUser.isEqual(t)){O(Pi,"User change. New user:",t.toKey());const r=await yc(e.localStore,t);e.currentUser=t,function(o,a){o.mu.forEach(l=>{l.forEach(h=>{h.reject(new N(S.CANCELLED,a))})}),o.mu.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await qn(e,r.Ls)}}function rm(n,t){const e=F(n),r=e.Au.get(t);if(r&&r.hu)return z().add(r.key);{let s=z();const o=e.Iu.get(t);if(!o)return s;for(const a of o){const l=e.Tu.get(a);s=s.unionWith(l.view.nu)}return s}}function xc(n){const t=F(n);return t.remoteStore.remoteSyncer.applyRemoteEvent=Dc.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=rm.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=Jp.bind(null,t),t.Pu.H_=Bp.bind(null,t.eventManager),t.Pu.yu=qp.bind(null,t.eventManager),t}function sm(n){const t=F(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Zp.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=tm.bind(null,t),t}class Dr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=Gr(t.databaseInfo.databaseId),this.sharedClientState=this.Du(t),this.persistence=this.Cu(t),await this.persistence.start(),this.localStore=this.vu(t),this.gcScheduler=this.Fu(t,this.localStore),this.indexBackfillerScheduler=this.Mu(t,this.localStore)}Fu(t,e){return null}Mu(t,e){return null}vu(t){return up(this.persistence,new ip,t.initialUser,this.serializer)}Cu(t){return new _c(gi.mi,this.serializer)}Du(t){return new mp}async terminate(){var t,e;(t=this.gcScheduler)==null||t.stop(),(e=this.indexBackfillerScheduler)==null||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Dr.provider={build:()=>new Dr};class im extends Dr{constructor(t){super(),this.cacheSizeBytes=t}Fu(t,e){W(this.persistence.referenceDelegate instanceof Pr,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new zd(r,t.asyncQueue,e)}Cu(t){const e=this.cacheSizeBytes!==void 0?bt.withCacheSize(this.cacheSizeBytes):bt.DEFAULT;return new _c(r=>Pr.mi(r,e),this.serializer)}}class ti{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>$a(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=nm.bind(null,this.syncEngine),await Lp(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new Up}()}createDatastore(t){const e=Gr(t.databaseInfo.databaseId),r=function(o){return new Tp(o)}(t.databaseInfo);return function(o,a,l,h){return new vp(o,a,l,h)}(t.authCredentials,t.appCheckCredentials,r,e)}createRemoteStore(t){return function(r,s,o,a,l){return new bp(r,s,o,a,l)}(this.localStore,this.datastore,t.asyncQueue,e=>$a(this.syncEngine,e,0),function(){return La.v()?new La:new gp}())}createSyncEngine(t,e){return function(s,o,a,l,h,f,p){const _=new Hp(s,o,a,l,h,f);return p&&(_.gu=!0),_}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(s){const o=F(s);O(Ce,"RemoteStore shutting down."),o.Ea.add(5),await Bn(o),o.Aa.shutdown(),o.Ra.set("Unknown")}(this.remoteStore),(t=this.datastore)==null||t.terminate(),(e=this.eventManager)==null||e.terminate()}}ti.provider={build:()=>new ti};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ou(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ou(this.observer.error,t):Gt("Uncaught Error in snapshot listener:",t.toString()))}Nu(){this.muted=!0}Ou(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const he="FirestoreClient";class om{constructor(t,e,r,s,o){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=r,this.databaseInfo=s,this.user=Et.UNAUTHENTICATED,this.clientId=ii.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{O(he,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(O(he,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new zt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const r=vi(e,"Failed to shutdown persistence");t.reject(r)}}),t.promise}}async function Ds(n,t){n.asyncQueue.verifyOperationInProgress(),O(he,"Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let r=e.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await yc(t.localStore,s),r=s)}),t.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=t}async function Ha(n,t){n.asyncQueue.verifyOperationInProgress();const e=await am(n);O(he,"Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener(r=>Ua(t.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Ua(t.remoteStore,s)),n._onlineComponents=t}async function am(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){O(he,"Using user provided OfflineComponentProvider");try{await Ds(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(s){return s.name==="FirebaseError"?s.code===S.FAILED_PRECONDITION||s.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(e))throw e;je("Error using user provided cache. Falling back to memory cache: "+e),await Ds(n,new Dr)}}else O(he,"Using default OfflineComponentProvider"),await Ds(n,new im(void 0));return n._offlineComponents}async function Mc(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(O(he,"Using user provided OnlineComponentProvider"),await Ha(n,n._uninitializedComponentsProvider._online)):(O(he,"Using default OnlineComponentProvider"),await Ha(n,new ti))),n._onlineComponents}function um(n){return Mc(n).then(t=>t.syncEngine)}async function Nr(n){const t=await Mc(n),e=t.eventManager;return e.onListen=Gp.bind(null,t.syncEngine),e.onUnlisten=Qp.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=Kp.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=Xp.bind(null,t.syncEngine),e}function cm(n,t,e={}){const r=new zt;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,l,h,f){const p=new Di({next:I=>{p.Nu(),a.enqueueAndForget(()=>bi(o,_));const b=I.docs.has(l);!b&&I.fromCache?f.reject(new N(S.UNAVAILABLE,"Failed to get document because the client is offline.")):b&&I.fromCache&&h&&h.source==="server"?f.reject(new N(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):f.resolve(I)},error:I=>f.reject(I)}),_=new Ci(Ur(l.path),p,{includeMetadataChanges:!0,qa:!0});return Ri(o,_)}(await Nr(n),n.asyncQueue,t,e,r)),r.promise}function lm(n,t,e={}){const r=new zt;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,l,h,f){const p=new Di({next:I=>{p.Nu(),a.enqueueAndForget(()=>bi(o,_)),I.fromCache&&h.source==="server"?f.reject(new N(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):f.resolve(I)},error:I=>f.reject(I)}),_=new Ci(l,p,{includeMetadataChanges:!0,qa:!0});return Ri(o,_)}(await Nr(n),n.asyncQueue,t,e,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lc(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ga=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fc="firestore.googleapis.com",Ka=!0;class Wa{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new N(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Fc,this.ssl=Ka}else this.host=t.host,this.ssl=t.ssl??Ka;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=gc;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<jd)throw new N(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}bf("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Lc(t.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class Qr{constructor(t,e,r,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Wa({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new N(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Wa(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new gf;switch(r.type){case"firstParty":return new Tf(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const r=Ga.get(e);r&&(O("ComponentProvider","Removing Datastore"),Ga.delete(e),r.terminate())}(this),Promise.resolve()}}function hm(n,t,e,r={}){var f;n=Nt(n,Qr);const s=Mn(t),o=n._getSettings(),a={...o,emulatorOptions:n._getEmulatorOptions()},l=`${t}:${e}`;s&&(lu(`https://${l}`),fu("Firestore",!0)),o.host!==Fc&&o.host!==l&&je("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h={...o,host:l,ssl:s,emulatorOptions:r};if(!Tr(h,a)&&(n._setSettings(h),r.mockUserToken)){let p,_;if(typeof r.mockUserToken=="string")p=r.mockUserToken,_=Et.MOCK_USER;else{p=hu(r.mockUserToken,(f=n._app)==null?void 0:f.options.projectId);const I=r.mockUserToken.sub||r.mockUserToken.user_id;if(!I)throw new N(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");_=new Et(I)}n._authCredentials=new _f(new Cu(p,_))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(t,e,r){this.converter=e,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new pe(this.firestore,t,this._query)}}class it{constructor(t,e,r){this.converter=e,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ie(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new it(this.firestore,t,this._key)}toJSON(){return{type:it._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,r){if(Ln(e,it._jsonSchema))return new it(t,r||null,new x(X.fromString(e.referencePath)))}}it._jsonSchemaVersion="firestore/documentReference/1.0",it._jsonSchema={type:ut("string",it._jsonSchemaVersion),referencePath:ut("string")};class ie extends pe{constructor(t,e,r){super(t,e,Ur(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new it(this.firestore,null,new x(t))}withConverter(t){return new ie(this.firestore,t,this._path)}}function Gg(n,t,...e){if(n=It(n),Pu("collection","path",t),n instanceof Qr){const r=X.fromString(t,...e);return aa(r),new ie(n,null,r)}{if(!(n instanceof it||n instanceof ie))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(t,...e));return aa(r),new ie(n.firestore,null,r)}}function fm(n,t,...e){if(n=It(n),arguments.length===1&&(t=ii.newId()),Pu("doc","path",t),n instanceof Qr){const r=X.fromString(t,...e);return oa(r),new it(n,null,new x(r))}{if(!(n instanceof it||n instanceof ie))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(t,...e));return oa(r),new it(n.firestore,n instanceof ie?n.converter:null,new x(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qa="AsyncQueue";class Xa{constructor(t=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Tc(this,"async_queue_retry"),this._c=()=>{const r=Vs();r&&O(Qa,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=t;const e=Vs();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.uc(),this.cc(t)}enterRestrictedMode(t){if(!this.ec){this.ec=!0,this.sc=t||!1;const e=Vs();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this._c)}}enqueue(t){if(this.uc(),this.ec)return new Promise(()=>{});const e=new zt;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Xu.push(t),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(t){if(!Xe(t))throw t;O(Qa,"Operation failed with retryable error: "+t)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(t){const e=this.ac.then(()=>(this.rc=!0,t().catch(r=>{throw this.nc=r,this.rc=!1,Gt("INTERNAL UNHANDLED ERROR: ",Ya(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=e,e}enqueueAfterDelay(t,e,r){this.uc(),this.oc.indexOf(t)>-1&&(e=0);const s=Ai.createAndSchedule(this,t,e,r,o=>this.hc(o));return this.tc.push(s),s}uc(){this.nc&&M(47125,{Pc:Ya(this.nc)})}verifyOperationInProgress(){}async Tc(){let t;do t=this.ac,await t;while(t!==this.ac)}Ic(t){for(const e of this.tc)if(e.timerId===t)return!0;return!1}Ec(t){return this.Tc().then(()=>{this.tc.sort((e,r)=>e.targetTimeMs-r.targetTimeMs);for(const e of this.tc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Tc()})}dc(t){this.oc.push(t)}hc(t){const e=this.tc.indexOf(t);this.tc.splice(e,1)}}function Ya(n){let t=n.message||"";return n.stack&&(t=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ja(n){return function(e,r){if(typeof e!="object"||e===null)return!1;const s=e;for(const o of r)if(o in s&&typeof s[o]=="function")return!0;return!1}(n,["next","error","complete"])}class Wt extends Qr{constructor(t,e,r,s){super(t,e,r,s),this.type="firestore",this._queue=new Xa,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new Xa(t),this._firestoreClient=void 0,await t}}}function Kg(n,t){const e=typeof n=="object"?n:yu(),r=typeof n=="string"?n:Ar,s=mu(e,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=uu("firestore");o&&hm(s,...o)}return s}function jn(n){if(n._terminated)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||dm(n),n._firestoreClient}function dm(n){var r,s,o;const t=n._freezeSettings(),e=function(l,h,f,p){return new Lf(l,h,f,p.host,p.ssl,p.experimentalForceLongPolling,p.experimentalAutoDetectLongPolling,Lc(p.experimentalLongPollingOptions),p.useFetchStreams,p.isUsingEmulator)}(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,t);n._componentsProvider||(s=t.localCache)!=null&&s._offlineComponentProvider&&((o=t.localCache)!=null&&o._onlineComponentProvider)&&(n._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),n._firestoreClient=new om(n._authCredentials,n._appCheckCredentials,n._queue,e,n._componentsProvider&&function(l){const h=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(h),_online:h}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(t){this._byteString=t}static fromBase64String(t){try{return new kt(gt.fromBase64String(t))}catch(e){throw new N(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new kt(gt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:kt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(Ln(t,kt._jsonSchema))return kt.fromBase64String(t.bytes)}}kt._jsonSchemaVersion="firestore/bytes/1.0",kt._jsonSchema={type:ut("string",kt._jsonSchemaVersion),bytes:ut("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new N(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new mt(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ni{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new N(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new N(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return $(this._lat,t._lat)||$(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:qt._jsonSchemaVersion}}static fromJSON(t){if(Ln(t,qt._jsonSchema))return new qt(t.latitude,t.longitude)}}qt._jsonSchemaVersion="firestore/geoPoint/1.0",qt._jsonSchema={type:ut("string",qt._jsonSchemaVersion),latitude:ut("number"),longitude:ut("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,t._values)}toJSON(){return{type:jt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(Ln(t,jt._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every(e=>typeof e=="number"))return new jt(t.vectorValues);throw new N(S.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}jt._jsonSchemaVersion="firestore/vectorValue/1.0",jt._jsonSchema={type:ut("string",jt._jsonSchemaVersion),vectorValues:ut("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pm=/^__.*__$/;class mm{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return this.fieldMask!==null?new de(t,this.data,this.fieldMask,e,this.fieldTransforms):new Fn(t,this.data,e,this.fieldTransforms)}}class Uc{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return new de(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function Bc(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M(40011,{Ac:n})}}class ki{constructor(t,e,r,s,o,a){this.settings=t,this.databaseId=e,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.Rc(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(t){return new ki({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),r=this.Vc({path:e,fc:!1});return r.gc(t),r}yc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),r=this.Vc({path:e,fc:!1});return r.Rc(),r}wc(t){return this.Vc({path:void 0,fc:!0})}Sc(t){return kr(t,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}Rc(){if(this.path)for(let t=0;t<this.path.length;t++)this.gc(this.path.get(t))}gc(t){if(t.length===0)throw this.Sc("Document fields must not be empty");if(Bc(this.Ac)&&pm.test(t))throw this.Sc('Document fields cannot begin and end with "__"')}}class gm{constructor(t,e,r){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=r||Gr(t)}Cc(t,e,r,s=!1){return new ki({Ac:t,methodName:e,Dc:r,path:mt.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Xr(n){const t=n._freezeSettings(),e=Gr(n._databaseId);return new gm(n._databaseId,!!t.ignoreUndefinedProperties,e)}function qc(n,t,e,r,s,o={}){const a=n.Cc(o.merge||o.mergeFields?2:0,t,e,s);Oi("Data must be an object, but it was:",a,r);const l=zc(r,a);let h,f;if(o.merge)h=new Vt(a.fieldMask),f=a.fieldTransforms;else if(o.mergeFields){const p=[];for(const _ of o.mergeFields){const I=ei(t,_,e);if(!a.contains(I))throw new N(S.INVALID_ARGUMENT,`Field '${I}' is specified in your field mask but missing from your input data.`);Gc(p,I)||p.push(I)}h=new Vt(p),f=a.fieldTransforms.filter(_=>h.covers(_.field))}else h=null,f=a.fieldTransforms;return new mm(new St(l),h,f)}class Yr extends Ni{_toFieldTransform(t){if(t.Ac!==2)throw t.Ac===1?t.Sc(`${this._methodName}() can only appear at the top level of your update data`):t.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Yr}}function jc(n,t,e,r){const s=n.Cc(1,t,e);Oi("Data must be an object, but it was:",s,r);const o=[],a=St.empty();fe(r,(h,f)=>{const p=xi(t,h,e);f=It(f);const _=s.yc(p);if(f instanceof Yr)o.push(p);else{const I=zn(f,_);I!=null&&(o.push(p),a.set(p,I))}});const l=new Vt(o);return new Uc(a,l,s.fieldTransforms)}function $c(n,t,e,r,s,o){const a=n.Cc(1,t,e),l=[ei(t,r,e)],h=[s];if(o.length%2!=0)throw new N(S.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let I=0;I<o.length;I+=2)l.push(ei(t,o[I])),h.push(o[I+1]);const f=[],p=St.empty();for(let I=l.length-1;I>=0;--I)if(!Gc(f,l[I])){const b=l[I];let D=h[I];D=It(D);const k=a.yc(b);if(D instanceof Yr)f.push(b);else{const P=zn(D,k);P!=null&&(f.push(b),p.set(b,P))}}const _=new Vt(f);return new Uc(p,_,a.fieldTransforms)}function _m(n,t,e,r=!1){return zn(e,n.Cc(r?4:3,t))}function zn(n,t){if(Hc(n=It(n)))return Oi("Unsupported field value:",t,n),zc(n,t);if(n instanceof Ni)return function(r,s){if(!Bc(s.Ac))throw s.Sc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.fc&&t.Ac!==4)throw t.Sc("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const l of r){let h=zn(l,s.wc(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,t)}return function(r,s){if((r=It(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return od(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=J.fromDate(r);return{timestampValue:Cr(s.serializer,o)}}if(r instanceof J){const o=new J(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Cr(s.serializer,o)}}if(r instanceof qt)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof kt)return{bytesValue:cc(s.serializer,r._byteString)};if(r instanceof it){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Sc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:pi(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof jt)return function(a,l){return{mapValue:{fields:{[Fu]:{stringValue:Uu},[vr]:{arrayValue:{values:a.toArray().map(f=>{if(typeof f!="number")throw l.Sc("VectorValues must only contain numeric values.");return hi(l.serializer,f)})}}}}}}(r,s);throw s.Sc(`Unsupported field value: ${xr(r)}`)}(n,t)}function zc(n,t){const e={};return Nu(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):fe(n,(r,s)=>{const o=zn(s,t.mc(r));o!=null&&(e[r]=o)}),{mapValue:{fields:e}}}function Hc(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof J||n instanceof qt||n instanceof kt||n instanceof it||n instanceof Ni||n instanceof jt)}function Oi(n,t,e){if(!Hc(e)||!Vu(e)){const r=xr(e);throw r==="an object"?t.Sc(n+" a custom object"):t.Sc(n+" "+r)}}function ei(n,t,e){if((t=It(t))instanceof $n)return t._internalPath;if(typeof t=="string")return xi(n,t);throw kr("Field path arguments must be of type string or ",n,!1,void 0,e)}const ym=new RegExp("[~\\*/\\[\\]]");function xi(n,t,e){if(t.search(ym)>=0)throw kr(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new $n(...t.split("."))._internalPath}catch{throw kr(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function kr(n,t,e,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let l=`Function ${t}() called with invalid data`;e&&(l+=" (via `toFirestore()`)"),l+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new N(S.INVALID_ARGUMENT,l+n+h)}function Gc(n,t){return n.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kc{constructor(t,e,r,s,o){this._firestore=t,this._userDataWriter=e,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new it(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new Em(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(Jr("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class Em extends Kc{data(){return super.data()}}function Jr(n,t){return typeof t=="string"?xi(n,t):t instanceof $n?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wc(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new N(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Mi{}class Qc extends Mi{}function Wg(n,t,...e){let r=[];t instanceof Mi&&r.push(t),r=r.concat(e),function(o){const a=o.filter(h=>h instanceof Li).length,l=o.filter(h=>h instanceof Zr).length;if(a>1||a>0&&l>0)throw new N(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)n=s._apply(n);return n}class Zr extends Qc{constructor(t,e,r){super(),this._field=t,this._op=e,this._value=r,this.type="where"}static _create(t,e,r){return new Zr(t,e,r)}_apply(t){const e=this._parse(t);return Xc(t._query,e),new pe(t.firestore,t.converter,zs(t._query,e))}_parse(t){const e=Xr(t.firestore);return function(o,a,l,h,f,p,_){let I;if(f.isKeyField()){if(p==="array-contains"||p==="array-contains-any")throw new N(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${p}' queries on documentId().`);if(p==="in"||p==="not-in"){tu(_,p);const D=[];for(const k of _)D.push(Za(h,o,k));I={arrayValue:{values:D}}}else I=Za(h,o,_)}else p!=="in"&&p!=="not-in"&&p!=="array-contains-any"||tu(_,p),I=_m(l,a,_,p==="in"||p==="not-in");return at.create(f,p,I)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function Qg(n,t,e){const r=t,s=Jr("where",n);return Zr._create(s,r,e)}class Li extends Mi{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new Li(t,e)}_parse(t){const e=this._queryConstraints.map(r=>r._parse(t)).filter(r=>r.getFilters().length>0);return e.length===1?e[0]:Ot.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(s,o){let a=s;const l=o.getFlattenedFilters();for(const h of l)Xc(a,h),a=zs(a,h)}(t._query,e),new pe(t.firestore,t.converter,zs(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Fi extends Qc{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new Fi(t,e)}_apply(t){const e=function(s,o,a){if(s.startAt!==null)throw new N(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new N(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new kn(o,a)}(t._query,this._field,this._direction);return new pe(t.firestore,t.converter,function(s,o){const a=s.explicitOrderBy.concat([o]);return new Ye(s.path,s.collectionGroup,a,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(t._query,e))}}function Xg(n,t="asc"){const e=t,r=Jr("orderBy",n);return Fi._create(r,e)}function Za(n,t,e){if(typeof(e=It(e))=="string"){if(e==="")throw new N(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ku(t)&&e.indexOf("/")!==-1)throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const r=t.path.child(X.fromString(e));if(!x.isDocumentKey(r))throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return ma(n,new x(r))}if(e instanceof it)return ma(n,e._key);throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${xr(e)}.`)}function tu(n,t){if(!Array.isArray(n)||n.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Xc(n,t){const e=function(s,o){for(const a of s)for(const l of a.getFlattenedFilters())if(o.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class Tm{convertValue(t,e="none"){switch(ce(t)){case 0:return null;case 1:return t.booleanValue;case 2:return st(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(ue(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw M(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const r={};return fe(t,(s,o)=>{r[s]=this.convertValue(o,e)}),r}convertVectorValue(t){var r,s,o;const e=(o=(s=(r=t.fields)==null?void 0:r[vr].arrayValue)==null?void 0:s.values)==null?void 0:o.map(a=>st(a.doubleValue));return new jt(e)}convertGeoPoint(t){return new qt(st(t.latitude),st(t.longitude))}convertArray(t,e){return(t.values||[]).map(r=>this.convertValue(r,e))}convertServerTimestamp(t,e){switch(e){case"previous":const r=Fr(t);return r==null?null:this.convertValue(r,e);case"estimate":return this.convertTimestamp(Vn(t));default:return null}}convertTimestamp(t){const e=ae(t);return new J(e.seconds,e.nanos)}convertDocumentKey(t,e){const r=X.fromString(t);W(mc(r),9688,{name:t});const s=new Dn(r.get(1),r.get(3)),o=new x(r.popFirst(5));return s.isEqual(e)||Gt(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(n,t,e){let r;return r=n?e&&(e.merge||e.mergeFields)?n.toFirestore(t,e):n.toFirestore(t):t,r}class Tn{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class ve extends Kc{constructor(t,e,r,s,o,a){super(t,e,r,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=o}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new yr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const r=this._document.data.field(Jr("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=ve._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}ve._jsonSchemaVersion="firestore/documentSnapshot/1.0",ve._jsonSchema={type:ut("string",ve._jsonSchemaVersion),bundleSource:ut("string","DocumentSnapshot"),bundleName:ut("string"),bundle:ut("string")};class yr extends ve{data(t={}){return super.data(t)}}class Re{constructor(t,e,r,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new Tn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(r=>{t.call(e,new yr(this._firestore,this._userDataWriter,r.key,r,new Tn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new N(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(l=>{const h=new yr(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Tn(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>o||l.type!==3).map(l=>{const h=new yr(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Tn(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let f=-1,p=-1;return l.type!==0&&(f=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),p=a.indexOf(l.doc.key)),{type:Im(l.type),doc:h,oldIndex:f,newIndex:p}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=Re._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=ii.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],r=[],s=[];return this.docs.forEach(o=>{o._document!==null&&(e.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))}),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function Im(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M(61501,{type:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yg(n){n=Nt(n,it);const t=Nt(n.firestore,Wt);return cm(jn(t),n._key).then(e=>Jc(t,n,e))}Re._jsonSchemaVersion="firestore/querySnapshot/1.0",Re._jsonSchema={type:ut("string",Re._jsonSchemaVersion),bundleSource:ut("string","QuerySnapshot"),bundleName:ut("string"),bundle:ut("string")};class Ui extends Tm{constructor(t){super(),this.firestore=t}convertBytes(t){return new kt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new it(this.firestore,null,e)}}function Jg(n){n=Nt(n,pe);const t=Nt(n.firestore,Wt),e=jn(t),r=new Ui(t);return Wc(n._query),lm(e,n._query).then(s=>new Re(t,r,n,s))}function Zg(n,t,e,...r){n=Nt(n,it);const s=Nt(n.firestore,Wt),o=Xr(s);let a;return a=typeof(t=It(t))=="string"||t instanceof $n?$c(o,"updateDoc",n._key,t,e,r):jc(o,"updateDoc",n._key,t),ts(s,[a.toMutation(n._key,Ct.exists(!0))])}function t_(n){return ts(Nt(n.firestore,Wt),[new zr(n._key,Ct.none())])}function e_(n,t){const e=Nt(n.firestore,Wt),r=fm(n),s=Yc(n.converter,t);return ts(e,[qc(Xr(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,Ct.exists(!1))]).then(()=>r)}function n_(n,...t){var h,f,p;n=It(n);let e={includeMetadataChanges:!1,source:"default"},r=0;typeof t[r]!="object"||Ja(t[r])||(e=t[r++]);const s={includeMetadataChanges:e.includeMetadataChanges,source:e.source};if(Ja(t[r])){const _=t[r];t[r]=(h=_.next)==null?void 0:h.bind(_),t[r+1]=(f=_.error)==null?void 0:f.bind(_),t[r+2]=(p=_.complete)==null?void 0:p.bind(_)}let o,a,l;if(n instanceof it)a=Nt(n.firestore,Wt),l=Ur(n._key.path),o={next:_=>{t[r]&&t[r](Jc(a,n,_))},error:t[r+1],complete:t[r+2]};else{const _=Nt(n,pe);a=Nt(_.firestore,Wt),l=_._query;const I=new Ui(a);o={next:b=>{t[r]&&t[r](new Re(a,I,_,b))},error:t[r+1],complete:t[r+2]},Wc(n._query)}return function(I,b,D,k){const P=new Di(k),j=new Ci(b,P,D);return I.asyncQueue.enqueueAndForget(async()=>Ri(await Nr(I),j)),()=>{P.Nu(),I.asyncQueue.enqueueAndForget(async()=>bi(await Nr(I),j))}}(jn(a),l,s,o)}function ts(n,t){return function(r,s){const o=new zt;return r.asyncQueue.enqueueAndForget(async()=>Yp(await um(r),s,o)),o.promise}(jn(n),t)}function Jc(n,t,e){const r=e.docs.get(t._key),s=new Ui(n);return new ve(n,s,t._key,r,new Tn(e.hasPendingWrites,e.fromCache),t.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wm{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=Xr(t)}set(t,e,r){this._verifyNotCommitted();const s=Ns(t,this._firestore),o=Yc(s.converter,e,r),a=qc(this._dataReader,"WriteBatch.set",s._key,o,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,Ct.none())),this}update(t,e,r,...s){this._verifyNotCommitted();const o=Ns(t,this._firestore);let a;return a=typeof(e=It(e))=="string"||e instanceof $n?$c(this._dataReader,"WriteBatch.update",o._key,e,r,s):jc(this._dataReader,"WriteBatch.update",o._key,e),this._mutations.push(a.toMutation(o._key,Ct.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=Ns(t,this._firestore);return this._mutations=this._mutations.concat(new zr(e._key,Ct.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new N(S.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Ns(n,t){if((n=It(n)).firestore!==t)throw new N(S.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r_(n){return jn(n=Nt(n,Wt)),new wm(n,t=>ts(n,t))}(function(t,e=!0){(function(s){We=s})(_u),Sn(new qe("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),l=new Wt(new yf(r.getProvider("auth-internal")),new If(a,r.getProvider("app-check-internal")),function(f,p){if(!Object.prototype.hasOwnProperty.apply(f.options,["projectId"]))throw new N(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Dn(f.options.projectId,p)}(a,s),a);return o={useFetchStreams:e,...o},l._setSettings(o),l},"PUBLIC").setMultipleInstances(!0)),Ae(na,ra,t),Ae(na,ra,"esm2020")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zc="firebasestorage.googleapis.com",tl="storageBucket",Am=2*60*1e3,vm=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt extends Ve{constructor(t,e,r=0){super(ks(t),`Firebase Storage: ${e} (${ks(t)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,rt.prototype)}get status(){return this.status_}set status(t){this.status_=t}_codeEquals(t){return ks(t)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(t){this.customData.serverResponse=t,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var nt;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(nt||(nt={}));function ks(n){return"storage/"+n}function Bi(){const n="An unknown error occurred, please check the error payload for server response.";return new rt(nt.UNKNOWN,n)}function Rm(n){return new rt(nt.OBJECT_NOT_FOUND,"Object '"+n+"' does not exist.")}function bm(n){return new rt(nt.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Sm(){const n="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new rt(nt.UNAUTHENTICATED,n)}function Cm(){return new rt(nt.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Pm(n){return new rt(nt.UNAUTHORIZED,"User does not have permission to access '"+n+"'.")}function Vm(){return new rt(nt.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Dm(){return new rt(nt.CANCELED,"User canceled the upload/download.")}function Nm(n){return new rt(nt.INVALID_URL,"Invalid URL '"+n+"'.")}function km(n){return new rt(nt.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function Om(){return new rt(nt.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+tl+"' property when initializing the app?")}function xm(){return new rt(nt.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function Mm(){return new rt(nt.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function Lm(n){return new rt(nt.UNSUPPORTED_ENVIRONMENT,`${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function ni(n){return new rt(nt.INVALID_ARGUMENT,n)}function el(){return new rt(nt.APP_DELETED,"The Firebase app was deleted.")}function Fm(n){return new rt(nt.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function bn(n,t){return new rt(nt.INVALID_FORMAT,"String does not match format '"+n+"': "+t)}function gn(n){throw new rt(nt.INTERNAL_ERROR,"Internal error: "+n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(t,e){this.bucket=t,this.path_=e}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const t=encodeURIComponent;return"/b/"+t(this.bucket)+"/o/"+t(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(t,e){let r;try{r=Dt.makeFromUrl(t,e)}catch{return new Dt(t,"")}if(r.path==="")return r;throw km(t)}static makeFromUrl(t,e){let r=null;const s="([A-Za-z0-9.\\-_]+)";function o(K){K.path.charAt(K.path.length-1)==="/"&&(K.path_=K.path_.slice(0,-1))}const a="(/(.*))?$",l=new RegExp("^gs://"+s+a,"i"),h={bucket:1,path:3};function f(K){K.path_=decodeURIComponent(K.path)}const p="v[A-Za-z0-9_]+",_=e.replace(/[.]/g,"\\."),I="(/([^?#]*).*)?$",b=new RegExp(`^https?://${_}/${p}/b/${s}/o${I}`,"i"),D={bucket:1,path:3},k=e===Zc?"(?:storage.googleapis.com|storage.cloud.google.com)":e,P="([^?#]*)",j=new RegExp(`^https?://${k}/${s}/${P}`,"i"),B=[{regex:l,indices:h,postModify:o},{regex:b,indices:D,postModify:f},{regex:j,indices:{bucket:1,path:2},postModify:f}];for(let K=0;K<B.length;K++){const ht=B[K],Z=ht.regex.exec(t);if(Z){const T=Z[ht.indices.bucket];let m=Z[ht.indices.path];m||(m=""),r=new Dt(T,m),ht.postModify(r);break}}if(r==null)throw Nm(t);return r}}class Um{constructor(t){this.promise_=Promise.reject(t)}getPromise(){return this.promise_}cancel(t=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bm(n,t,e){let r=1,s=null,o=null,a=!1,l=0;function h(){return l===2}let f=!1;function p(...P){f||(f=!0,t.apply(null,P))}function _(P){s=setTimeout(()=>{s=null,n(b,h())},P)}function I(){o&&clearTimeout(o)}function b(P,...j){if(f){I();return}if(P){I(),p.call(null,P,...j);return}if(h()||a){I(),p.call(null,P,...j);return}r<64&&(r*=2);let B;l===1?(l=2,B=0):B=(r+Math.random())*1e3,_(B)}let D=!1;function k(P){D||(D=!0,I(),!f&&(s!==null?(P||(l=2),clearTimeout(s),_(0)):P||(l=1)))}return _(0),o=setTimeout(()=>{a=!0,k(!0)},e),k}function qm(n){n(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jm(n){return n!==void 0}function $m(n){return typeof n=="object"&&!Array.isArray(n)}function qi(n){return typeof n=="string"||n instanceof String}function eu(n){return ji()&&n instanceof Blob}function ji(){return typeof Blob<"u"}function nu(n,t,e,r){if(r<t)throw ni(`Invalid value for '${n}'. Expected ${t} or greater.`);if(r>e)throw ni(`Invalid value for '${n}'. Expected ${e} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $i(n,t,e){let r=t;return e==null&&(r=`https://${t}`),`${e}://${r}/v0${n}`}function nl(n){const t=encodeURIComponent;let e="?";for(const r in n)if(n.hasOwnProperty(r)){const s=t(r)+"="+t(n[r]);e=e+s+"&"}return e=e.slice(0,-1),e}var be;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(be||(be={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zm(n,t){const e=n>=500&&n<600,s=[408,429].indexOf(n)!==-1,o=t.indexOf(n)!==-1;return e||s||o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(t,e,r,s,o,a,l,h,f,p,_,I=!0,b=!1){this.url_=t,this.method_=e,this.headers_=r,this.body_=s,this.successCodes_=o,this.additionalRetryCodes_=a,this.callback_=l,this.errorCallback_=h,this.timeout_=f,this.progressCallback_=p,this.connectionFactory_=_,this.retry=I,this.isUsingEmulator=b,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((D,k)=>{this.resolve_=D,this.reject_=k,this.start_()})}start_(){const t=(r,s)=>{if(s){r(!1,new hr(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const a=l=>{const h=l.loaded,f=l.lengthComputable?l.total:-1;this.progressCallback_!==null&&this.progressCallback_(h,f)};this.progressCallback_!==null&&o.addUploadProgressListener(a),o.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(a),this.pendingConnection_=null;const l=o.getErrorCode()===be.NO_ERROR,h=o.getStatus();if(!l||zm(h,this.additionalRetryCodes_)&&this.retry){const p=o.getErrorCode()===be.ABORT;r(!1,new hr(!1,null,p));return}const f=this.successCodes_.indexOf(h)!==-1;r(!0,new hr(f,o))})},e=(r,s)=>{const o=this.resolve_,a=this.reject_,l=s.connection;if(s.wasSuccessCode)try{const h=this.callback_(l,l.getResponse());jm(h)?o(h):o()}catch(h){a(h)}else if(l!==null){const h=Bi();h.serverResponse=l.getErrorText(),this.errorCallback_?a(this.errorCallback_(l,h)):a(h)}else if(s.canceled){const h=this.appDelete_?el():Dm();a(h)}else{const h=Vm();a(h)}};this.canceled_?e(!1,new hr(!1,null,!0)):this.backoffId_=Bm(t,e,this.timeout_)}getPromise(){return this.promise_}cancel(t){this.canceled_=!0,this.appDelete_=t||!1,this.backoffId_!==null&&qm(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class hr{constructor(t,e,r){this.wasSuccessCode=t,this.connection=e,this.canceled=!!r}}function Gm(n,t){t!==null&&t.length>0&&(n.Authorization="Firebase "+t)}function Km(n,t){n["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}function Wm(n,t){t&&(n["X-Firebase-GMPID"]=t)}function Qm(n,t){t!==null&&(n["X-Firebase-AppCheck"]=t)}function Xm(n,t,e,r,s,o,a=!0,l=!1){const h=nl(n.urlParams),f=n.url+h,p=Object.assign({},n.headers);return Wm(p,t),Gm(p,e),Km(p,o),Qm(p,r),new Hm(f,n.method,p,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,s,a,l)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ym(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function Jm(...n){const t=Ym();if(t!==void 0){const e=new t;for(let r=0;r<n.length;r++)e.append(n[r]);return e.getBlob()}else{if(ji())return new Blob(n);throw new rt(nt.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function Zm(n,t,e){return n.webkitSlice?n.webkitSlice(t,e):n.mozSlice?n.mozSlice(t,e):n.slice?n.slice(t,e):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tg(n){if(typeof atob>"u")throw Lm("base-64");return atob(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Os{constructor(t,e){this.data=t,this.contentType=e||null}}function eg(n,t){switch(n){case Ft.RAW:return new Os(rl(t));case Ft.BASE64:case Ft.BASE64URL:return new Os(sl(n,t));case Ft.DATA_URL:return new Os(rg(t),sg(t))}throw Bi()}function rl(n){const t=[];for(let e=0;e<n.length;e++){let r=n.charCodeAt(e);if(r<=127)t.push(r);else if(r<=2047)t.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(e<n.length-1&&(n.charCodeAt(e+1)&64512)===56320))t.push(239,191,189);else{const o=r,a=n.charCodeAt(++e);r=65536|(o&1023)<<10|a&1023,t.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?t.push(239,191,189):t.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(t)}function ng(n){let t;try{t=decodeURIComponent(n)}catch{throw bn(Ft.DATA_URL,"Malformed data URL.")}return rl(t)}function sl(n,t){switch(n){case Ft.BASE64:{const s=t.indexOf("-")!==-1,o=t.indexOf("_")!==-1;if(s||o)throw bn(n,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case Ft.BASE64URL:{const s=t.indexOf("+")!==-1,o=t.indexOf("/")!==-1;if(s||o)throw bn(n,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let e;try{e=tg(t)}catch(s){throw s.message.includes("polyfill")?s:bn(n,"Invalid character found")}const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r}class il{constructor(t){this.base64=!1,this.contentType=null;const e=t.match(/^data:([^,]+)?,/);if(e===null)throw bn(Ft.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=e[1]||null;r!=null&&(this.base64=ig(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=t.substring(t.indexOf(",")+1)}}function rg(n){const t=new il(n);return t.base64?sl(Ft.BASE64,t.rest):ng(t.rest)}function sg(n){return new il(n).contentType}function ig(n,t){return n.length>=t.length?n.substring(n.length-t.length)===t:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(t,e){let r=0,s="";eu(t)?(this.data_=t,r=t.size,s=t.type):t instanceof ArrayBuffer?(e?this.data_=new Uint8Array(t):(this.data_=new Uint8Array(t.byteLength),this.data_.set(new Uint8Array(t))),r=this.data_.length):t instanceof Uint8Array&&(e?this.data_=t:(this.data_=new Uint8Array(t.length),this.data_.set(t)),r=t.length),this.size_=r,this.type_=s}size(){return this.size_}type(){return this.type_}slice(t,e){if(eu(this.data_)){const r=this.data_,s=Zm(r,t,e);return s===null?null:new ee(s)}else{const r=new Uint8Array(this.data_.buffer,t,e-t);return new ee(r,!0)}}static getBlob(...t){if(ji()){const e=t.map(r=>r instanceof ee?r.data_:r);return new ee(Jm.apply(null,e))}else{const e=t.map(a=>qi(a)?eg(Ft.RAW,a).data:a.data_);let r=0;e.forEach(a=>{r+=a.byteLength});const s=new Uint8Array(r);let o=0;return e.forEach(a=>{for(let l=0;l<a.length;l++)s[o++]=a[l]}),new ee(s,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ol(n){let t;try{t=JSON.parse(n)}catch{return null}return $m(t)?t:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function og(n){if(n.length===0)return null;const t=n.lastIndexOf("/");return t===-1?"":n.slice(0,t)}function ag(n,t){const e=t.split("/").filter(r=>r.length>0).join("/");return n.length===0?e:n+"/"+e}function al(n){const t=n.lastIndexOf("/",n.length-2);return t===-1?n:n.slice(t+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ug(n,t){return t}class vt{constructor(t,e,r,s){this.server=t,this.local=e||t,this.writable=!!r,this.xform=s||ug}}let fr=null;function cg(n){return!qi(n)||n.length<2?n:al(n)}function ul(){if(fr)return fr;const n=[];n.push(new vt("bucket")),n.push(new vt("generation")),n.push(new vt("metageneration")),n.push(new vt("name","fullPath",!0));function t(o,a){return cg(a)}const e=new vt("name");e.xform=t,n.push(e);function r(o,a){return a!==void 0?Number(a):a}const s=new vt("size");return s.xform=r,n.push(s),n.push(new vt("timeCreated")),n.push(new vt("updated")),n.push(new vt("md5Hash",null,!0)),n.push(new vt("cacheControl",null,!0)),n.push(new vt("contentDisposition",null,!0)),n.push(new vt("contentEncoding",null,!0)),n.push(new vt("contentLanguage",null,!0)),n.push(new vt("contentType",null,!0)),n.push(new vt("metadata","customMetadata",!0)),fr=n,fr}function lg(n,t){function e(){const r=n.bucket,s=n.fullPath,o=new Dt(r,s);return t._makeStorageReference(o)}Object.defineProperty(n,"ref",{get:e})}function hg(n,t,e){const r={};r.type="file";const s=e.length;for(let o=0;o<s;o++){const a=e[o];r[a.local]=a.xform(r,t[a.server])}return lg(r,n),r}function cl(n,t,e){const r=ol(t);return r===null?null:hg(n,r,e)}function fg(n,t,e,r){const s=ol(t);if(s===null||!qi(s.downloadTokens))return null;const o=s.downloadTokens;if(o.length===0)return null;const a=encodeURIComponent;return o.split(",").map(f=>{const p=n.bucket,_=n.fullPath,I="/b/"+a(p)+"/o/"+a(_),b=$i(I,e,r),D=nl({alt:"media",token:f});return b+D})[0]}function dg(n,t){const e={},r=t.length;for(let s=0;s<r;s++){const o=t[s];o.writable&&(e[o.server]=n[o.local])}return JSON.stringify(e)}class ll{constructor(t,e,r,s){this.url=t,this.method=e,this.handler=r,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hl(n){if(!n)throw Bi()}function pg(n,t){function e(r,s){const o=cl(n,s,t);return hl(o!==null),o}return e}function mg(n,t){function e(r,s){const o=cl(n,s,t);return hl(o!==null),fg(o,s,n.host,n._protocol)}return e}function fl(n){function t(e,r){let s;return e.getStatus()===401?e.getErrorText().includes("Firebase App Check token is invalid")?s=Cm():s=Sm():e.getStatus()===402?s=bm(n.bucket):e.getStatus()===403?s=Pm(n.path):s=r,s.status=e.getStatus(),s.serverResponse=r.serverResponse,s}return t}function gg(n){const t=fl(n);function e(r,s){let o=t(r,s);return r.getStatus()===404&&(o=Rm(n.path)),o.serverResponse=s.serverResponse,o}return e}function _g(n,t,e){const r=t.fullServerUrl(),s=$i(r,n.host,n._protocol),o="GET",a=n.maxOperationRetryTime,l=new ll(s,o,mg(n,e),a);return l.errorHandler=gg(t),l}function yg(n,t){return n&&n.contentType||t&&t.type()||"application/octet-stream"}function Eg(n,t,e){const r=Object.assign({},e);return r.fullPath=n.path,r.size=t.size(),r.contentType||(r.contentType=yg(null,t)),r}function Tg(n,t,e,r,s){const o=t.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function l(){let B="";for(let K=0;K<2;K++)B=B+Math.random().toString().slice(2);return B}const h=l();a["Content-Type"]="multipart/related; boundary="+h;const f=Eg(t,r,s),p=dg(f,e),_="--"+h+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+p+`\r
--`+h+`\r
Content-Type: `+f.contentType+`\r
\r
`,I=`\r
--`+h+"--",b=ee.getBlob(_,r,I);if(b===null)throw xm();const D={name:f.fullPath},k=$i(o,n.host,n._protocol),P="POST",j=n.maxUploadRetryTime,U=new ll(k,P,pg(n,e),j);return U.urlParams=D,U.headers=a,U.body=b.uploadData(),U.errorHandler=fl(t),U}class Ig{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=be.NO_ERROR,this.sendPromise_=new Promise(t=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=be.ABORT,t()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=be.NETWORK_ERROR,t()}),this.xhr_.addEventListener("load",()=>{t()})})}send(t,e,r,s,o){if(this.sent_)throw gn("cannot .send() more than once");if(Mn(t)&&r&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(e,t,!0),o!==void 0)for(const a in o)o.hasOwnProperty(a)&&this.xhr_.setRequestHeader(a,o[a].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw gn("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw gn("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw gn("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw gn("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(t){return this.xhr_.getResponseHeader(t)}addUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",t)}removeUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",t)}}class wg extends Ig{initXhr(){this.xhr_.responseType="text"}}function dl(){return new wg}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(t,e){this._service=t,e instanceof Dt?this._location=e:this._location=Dt.makeFromUrl(e,t.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(t,e){return new Pe(t,e)}get root(){const t=new Dt(this._location.bucket,"");return this._newRef(this._service,t)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return al(this._location.path)}get storage(){return this._service}get parent(){const t=og(this._location.path);if(t===null)return null;const e=new Dt(this._location.bucket,t);return new Pe(this._service,e)}_throwIfRoot(t){if(this._location.path==="")throw Fm(t)}}function Ag(n,t,e){n._throwIfRoot("uploadBytes");const r=Tg(n.storage,n._location,ul(),new ee(t,!0),e);return n.storage.makeRequestWithTokens(r,dl).then(s=>({metadata:s,ref:n}))}function vg(n){n._throwIfRoot("getDownloadURL");const t=_g(n.storage,n._location,ul());return n.storage.makeRequestWithTokens(t,dl).then(e=>{if(e===null)throw Mm();return e})}function Rg(n,t){const e=ag(n._location.path,t),r=new Dt(n._location.bucket,e);return new Pe(n.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bg(n){return/^[A-Za-z]+:\/\//.test(n)}function Sg(n,t){return new Pe(n,t)}function pl(n,t){if(n instanceof zi){const e=n;if(e._bucket==null)throw Om();const r=new Pe(e,e._bucket);return t!=null?pl(r,t):r}else return t!==void 0?Rg(n,t):n}function Cg(n,t){if(t&&bg(t)){if(n instanceof zi)return Sg(n,t);throw ni("To use ref(service, url), the first argument must be a Storage instance.")}else return pl(n,t)}function ru(n,t){const e=t==null?void 0:t[tl];return e==null?null:Dt.makeFromBucketSpec(e,n)}function Pg(n,t,e,r={}){n.host=`${t}:${e}`;const s=Mn(t);s&&(lu(`https://${n.host}/b`),fu("Storage",!0)),n._isUsingEmulator=!0,n._protocol=s?"https":"http";const{mockUserToken:o}=r;o&&(n._overrideAuthToken=typeof o=="string"?o:hu(o,n.app.options.projectId))}class zi{constructor(t,e,r,s,o,a=!1){this.app=t,this._authProvider=e,this._appCheckProvider=r,this._url=s,this._firebaseVersion=o,this._isUsingEmulator=a,this._bucket=null,this._host=Zc,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Am,this._maxUploadRetryTime=vm,this._requests=new Set,s!=null?this._bucket=Dt.makeFromBucketSpec(s,this._host):this._bucket=ru(this._host,this.app.options)}get host(){return this._host}set host(t){this._host=t,this._url!=null?this._bucket=Dt.makeFromBucketSpec(this._url,t):this._bucket=ru(t,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(t){nu("time",0,Number.POSITIVE_INFINITY,t),this._maxUploadRetryTime=t}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(t){nu("time",0,Number.POSITIVE_INFINITY,t),this._maxOperationRetryTime=t}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const t=this._authProvider.getImmediate({optional:!0});if(t){const e=await t.getToken();if(e!==null)return e.accessToken}return null}async _getAppCheckToken(){if(gu(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=this._appCheckProvider.getImmediate({optional:!0});return t?(await t.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(t=>t.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(t){return new Pe(this,t)}_makeRequest(t,e,r,s,o=!0){if(this._deleted)return new Um(el());{const a=Xm(t,this._appId,r,s,e,this._firebaseVersion,o,this._isUsingEmulator);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(t,e){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(t,e,r,s).getPromise()}}const su="@firebase/storage",iu="0.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ml="storage";function s_(n,t,e){return n=It(n),Ag(n,t,e)}function i_(n){return n=It(n),vg(n)}function o_(n,t){return n=It(n),Cg(n,t)}function a_(n=yu(),t){n=It(n);const r=mu(n,ml).getImmediate({identifier:t}),s=uu("storage");return s&&Vg(r,...s),r}function Vg(n,t,e,r={}){Pg(n,t,e,r)}function Dg(n,{instanceIdentifier:t}){const e=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),s=n.getProvider("app-check-internal");return new zi(e,r,s,t,_u)}function Ng(){Sn(new qe(ml,Dg,"PUBLIC").setMultipleInstances(!0)),Ae(su,iu,""),Ae(su,iu,"esm2020")}Ng();export{a_ as A,Gg as B,qe as C,Wg as D,du as E,Ve as F,n_ as G,t_ as H,fm as I,Zg as J,e_ as K,pu as L,Qg as M,Xg as N,Jg as O,r_ as P,o_ as Q,s_ as R,_u as S,i_ as T,Yg as U,Sn as _,Fg as a,Lg as b,gu as c,It as d,ri as e,zg as f,Og as g,G as h,xg as i,Zl as j,Mn as k,yu as l,mu as m,sh as n,Tr as o,lu as p,qg as q,Ae as r,Ug as s,Bg as t,fu as u,jg as v,$g as w,Mg as x,sf as y,Kg as z};
