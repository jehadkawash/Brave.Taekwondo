import{o as dh}from"./idb-BXWtuYvb.js";const mh=()=>{};var pa={};/**
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
 */const Du=function(n){const t=[];let e=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},ph=function(n){const t=[];let e=0,r=0;for(;e<n.length;){const s=n[e++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[e++];t[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[e++],a=n[e++],c=n[e++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|c&63)-65536;t[r++]=String.fromCharCode(55296+(h>>10)),t[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[e++],a=n[e++];t[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return t.join("")},Nu={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,c=a?n[s+1]:0,h=s+2<n.length,f=h?n[s+2]:0,m=o>>2,g=(o&3)<<4|c>>4;let E=(c&15)<<2|f>>6,b=f&63;h||(b=64,a||(E=64)),r.push(e[m],e[g],e[E],e[b])}return r.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(Du(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):ph(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=e[n.charAt(s++)],c=s<n.length?e[n.charAt(s)]:0;++s;const f=s<n.length?e[n.charAt(s)]:64;++s;const g=s<n.length?e[n.charAt(s)]:64;if(++s,o==null||c==null||f==null||g==null)throw new gh;const E=o<<2|c>>4;if(r.push(E),f!==64){const b=c<<4&240|f>>2;if(r.push(b),g!==64){const V=f<<6&192|g;r.push(V)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class gh extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const _h=function(n){const t=Du(n);return Nu.encodeByteArray(t,!0)},Pr=function(n){return _h(n).replace(/\./g,"")},yh=function(n){try{return Nu.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
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
 */function Eh(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Th=()=>Eh().__FIREBASE_DEFAULTS__,wh=()=>{if(typeof process>"u"||typeof pa>"u")return;const n=pa.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Ih=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&yh(n[1]);return t&&JSON.parse(t)},Wr=()=>{try{return mh()||Th()||wh()||Ih()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Ah=n=>{var t,e;return(e=(t=Wr())==null?void 0:t.emulatorHosts)==null?void 0:e[n]},di=n=>{const t=Ah(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),r]:[t.substring(0,e),r]},ku=()=>{var n;return(n=Wr())==null?void 0:n.config},v_=n=>{var t;return(t=Wr())==null?void 0:t[`_${n}`]};/**
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
 */class vh{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,r)=>{e?this.reject(e):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,r))}}}/**
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
 */function Oe(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function mi(n){return(await fetch(n,{credentials:"include"})).ok}/**
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
 */function Ou(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},r=t||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Pr(JSON.stringify(e)),Pr(JSON.stringify(a)),""].join(".")}const Pn={};function Rh(){const n={prod:[],emulator:[]};for(const t of Object.keys(Pn))Pn[t]?n.emulator.push(t):n.prod.push(t);return n}function bh(n){let t=document.getElementById(n),e=!1;return t||(t=document.createElement("div"),t.setAttribute("id",n),e=!0),{created:e,element:t}}let ga=!1;function pi(n,t){if(typeof window>"u"||typeof document>"u"||!Oe(window.location.host)||Pn[n]===t||Pn[n]||ga)return;Pn[n]=t;function e(E){return`__firebase__banner__${E}`}const r="__firebase__banner",o=Rh().prod.length>0;function a(){const E=document.getElementById(r);E&&E.remove()}function c(E){E.style.display="flex",E.style.background="#7faaf0",E.style.position="fixed",E.style.bottom="5px",E.style.left="5px",E.style.padding=".5em",E.style.borderRadius="5px",E.style.alignItems="center"}function h(E,b){E.setAttribute("width","24"),E.setAttribute("id",b),E.setAttribute("height","24"),E.setAttribute("viewBox","0 0 24 24"),E.setAttribute("fill","none"),E.style.marginLeft="-6px"}function f(){const E=document.createElement("span");return E.style.cursor="pointer",E.style.marginLeft="16px",E.style.fontSize="24px",E.innerHTML=" &times;",E.onclick=()=>{ga=!0,a()},E}function m(E,b){E.setAttribute("id",b),E.innerText="Learn more",E.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",E.setAttribute("target","__blank"),E.style.paddingLeft="5px",E.style.textDecoration="underline"}function g(){const E=bh(r),b=e("text"),V=document.getElementById(b)||document.createElement("span"),k=e("learnmore"),P=document.getElementById(k)||document.createElement("a"),j=e("preprendIcon"),U=document.getElementById(j)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(E.created){const B=E.element;c(B),m(P,k);const W=f();h(U,j),B.append(U,V,P,W),document.body.appendChild(B)}o?(V.innerText="Preview backend disconnected.",U.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
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
</defs>`,V.innerText="Preview backend running in this workspace."),V.setAttribute("id",b)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",g):g()}/**
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
 */function gi(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function R_(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(gi())}function Sh(){var t;const n=(t=Wr())==null?void 0:t.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function b_(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function S_(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function C_(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function P_(){const n=gi();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Ch(){return!Sh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ph(){try{return typeof indexedDB=="object"}catch{return!1}}function Vh(){return new Promise((n,t)=>{try{let e=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var o;t(((o=s.error)==null?void 0:o.message)||"")}}catch(e){t(e)}})}/**
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
 */const Dh="FirebaseError";class ye extends Error{constructor(t,e,r){super(e),this.code=t,this.customData=r,this.name=Dh,Object.setPrototypeOf(this,ye.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,xu.prototype.create)}}class xu{constructor(t,e,r){this.service=t,this.serviceName=e,this.errors=r}create(t,...e){const r=e[0]||{},s=`${this.service}/${t}`,o=this.errors[t],a=o?Nh(o,r):"Error",c=`${this.serviceName}: ${a} (${s}).`;return new ye(s,c,r)}}function Nh(n,t){return n.replace(kh,(e,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const kh=/\{\$([^}]+)}/g;function V_(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}function Vr(n,t){if(n===t)return!0;const e=Object.keys(n),r=Object.keys(t);for(const s of e){if(!r.includes(s))return!1;const o=n[s],a=t[s];if(_a(o)&&_a(a)){if(!Vr(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!e.includes(s))return!1;return!0}function _a(n){return n!==null&&typeof n=="object"}/**
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
 */function D_(n){const t=[];for(const[e,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function N_(n){const t={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,o]=r.split("=");t[decodeURIComponent(s)]=decodeURIComponent(o)}}),t}function k_(n){const t=n.indexOf("?");if(!t)return"";const e=n.indexOf("#",t);return n.substring(t,e>0?e:void 0)}function O_(n,t){const e=new Oh(n,t);return e.subscribe.bind(e)}class Oh{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(r=>{this.error(r)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,r){let s;if(t===void 0&&e===void 0&&r===void 0)throw new Error("Missing Observer.");xh(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:r},s.next===void 0&&(s.next=Fs),s.error===void 0&&(s.error=Fs),s.complete===void 0&&(s.complete=Fs);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function xh(n,t){if(typeof n!="object"||n===null)return!1;for(const e of t)if(e in n&&typeof n[e]=="function")return!0;return!1}function Fs(){}/**
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
 */function lt(n){return n&&n._delegate?n._delegate:n}class Ve{constructor(t,e,r){this.name=t,this.instanceFactory=e,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
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
 */const Se="[DEFAULT]";/**
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
 */class Mh{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const r=new vh;if(this.instancesDeferred.set(e,r),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){const e=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),r=(t==null?void 0:t.optional)??!1;if(this.isInitialized(e)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:e})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Fh(t))try{this.getOrInitializeService({instanceIdentifier:Se})}catch{}for(const[e,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(t=Se){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Se){return this.instances.has(t)}getOptions(t=Se){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:e});for(const[o,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(o);r===c&&a.resolve(s)}return s}onInit(t,e){const r=this.normalizeInstanceIdentifier(e),s=this.onInitCallbacks.get(r)??new Set;s.add(t),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&t(o,r),()=>{s.delete(t)}}invokeOnInitCallbacks(t,e){const r=this.onInitCallbacks.get(e);if(r)for(const s of r)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Lh(t),options:e}),this.instances.set(t,r),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=Se){return this.component?this.component.multipleInstances?t:Se:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Lh(n){return n===Se?void 0:n}function Fh(n){return n.instantiationMode==="EAGER"}/**
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
 */class Uh{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new Mh(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var H;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(H||(H={}));const Bh={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},qh=H.INFO,jh={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},$h=(n,t,...e)=>{if(t<n.logLevel)return;const r=new Date().toISOString(),s=jh[t];if(s)console[s](`[${r}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Mu{constructor(t){this.name=t,this._logLevel=qh,this._logHandler=$h,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in H))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Bh[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...t),this._logHandler(this,H.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...t),this._logHandler(this,H.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,H.INFO,...t),this._logHandler(this,H.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,H.WARN,...t),this._logHandler(this,H.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...t),this._logHandler(this,H.ERROR,...t)}}/**
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
 */class zh{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(Gh(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function Gh(n){const t=n.getComponent();return(t==null?void 0:t.type)==="VERSION"}const Hs="@firebase/app",ya="0.14.6";/**
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
 */const Qt=new Mu("@firebase/app"),Hh="@firebase/app-compat",Kh="@firebase/analytics-compat",Wh="@firebase/analytics",Qh="@firebase/app-check-compat",Xh="@firebase/app-check",Yh="@firebase/auth",Jh="@firebase/auth-compat",Zh="@firebase/database",tf="@firebase/data-connect",ef="@firebase/database-compat",nf="@firebase/functions",rf="@firebase/functions-compat",sf="@firebase/installations",of="@firebase/installations-compat",af="@firebase/messaging",uf="@firebase/messaging-compat",cf="@firebase/performance",lf="@firebase/performance-compat",hf="@firebase/remote-config",ff="@firebase/remote-config-compat",df="@firebase/storage",mf="@firebase/storage-compat",pf="@firebase/firestore",gf="@firebase/ai",_f="@firebase/firestore-compat",yf="firebase",Ef="12.6.0";/**
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
 */const Ks="[DEFAULT]",Tf={[Hs]:"fire-core",[Hh]:"fire-core-compat",[Wh]:"fire-analytics",[Kh]:"fire-analytics-compat",[Xh]:"fire-app-check",[Qh]:"fire-app-check-compat",[Yh]:"fire-auth",[Jh]:"fire-auth-compat",[Zh]:"fire-rtdb",[tf]:"fire-data-connect",[ef]:"fire-rtdb-compat",[nf]:"fire-fn",[rf]:"fire-fn-compat",[sf]:"fire-iid",[of]:"fire-iid-compat",[af]:"fire-fcm",[uf]:"fire-fcm-compat",[cf]:"fire-perf",[lf]:"fire-perf-compat",[hf]:"fire-rc",[ff]:"fire-rc-compat",[df]:"fire-gcs",[mf]:"fire-gcs-compat",[pf]:"fire-fst",[_f]:"fire-fst-compat",[gf]:"fire-vertex","fire-js":"fire-js",[yf]:"fire-js-all"};/**
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
 */const Dr=new Map,wf=new Map,Ws=new Map;function Ea(n,t){try{n.container.addComponent(t)}catch(e){Qt.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function Ke(n){const t=n.name;if(Ws.has(t))return Qt.debug(`There were multiple attempts to register component ${t}.`),!1;Ws.set(t,n);for(const e of Dr.values())Ea(e,n);for(const e of wf.values())Ea(e,n);return!0}function _i(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function yi(n){return n==null?!1:n.settings!==void 0}/**
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
 */const If={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ae=new xu("app","Firebase",If);/**
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
 */class Af{constructor(t,e,r){this._isDeleted=!1,this._options={...t},this._config={...e},this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Ve("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw ae.create("app-deleted",{appName:this._name})}}/**
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
 */const Lu=Ef;function vf(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const r={name:Ks,automaticDataCollectionEnabled:!0,...t},s=r.name;if(typeof s!="string"||!s)throw ae.create("bad-app-name",{appName:String(s)});if(e||(e=ku()),!e)throw ae.create("no-options");const o=Dr.get(s);if(o){if(Vr(e,o.options)&&Vr(r,o.config))return o;throw ae.create("duplicate-app",{appName:s})}const a=new Uh(s);for(const h of Ws.values())a.addComponent(h);const c=new Af(e,r,a);return Dr.set(s,c),c}function Ei(n=Ks){const t=Dr.get(n);if(!t&&n===Ks&&ku())return vf();if(!t)throw ae.create("no-app",{appName:n});return t}function Wt(n,t,e){let r=Tf[n]??n;e&&(r+=`-${e}`);const s=r.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const a=[`Unable to register library "${r}" with version "${t}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Qt.warn(a.join(" "));return}Ke(new Ve(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}/**
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
 */const Rf="firebase-heartbeat-database",bf=1,Mn="firebase-heartbeat-store";let Us=null;function Fu(){return Us||(Us=dh(Rf,bf,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(Mn)}catch(e){console.warn(e)}}}}).catch(n=>{throw ae.create("idb-open",{originalErrorMessage:n.message})})),Us}async function Sf(n){try{const e=(await Fu()).transaction(Mn),r=await e.objectStore(Mn).get(Uu(n));return await e.done,r}catch(t){if(t instanceof ye)Qt.warn(t.message);else{const e=ae.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});Qt.warn(e.message)}}}async function Ta(n,t){try{const r=(await Fu()).transaction(Mn,"readwrite");await r.objectStore(Mn).put(t,Uu(n)),await r.done}catch(e){if(e instanceof ye)Qt.warn(e.message);else{const r=ae.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});Qt.warn(r.message)}}}function Uu(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Cf=1024,Pf=30;class Vf{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new Nf(e),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=wa();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats.length>Pf){const a=kf(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Qt.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=wa(),{heartbeatsToSend:r,unsentEntries:s}=Df(this._heartbeatsCache.heartbeats),o=Pr(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(e){return Qt.warn(e),""}}}function wa(){return new Date().toISOString().substring(0,10)}function Df(n,t=Cf){const e=[];let r=n.slice();for(const s of n){const o=e.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),Ia(e)>t){o.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),Ia(e)>t){e.pop();break}r=r.slice(1)}return{heartbeatsToSend:e,unsentEntries:r}}class Nf{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ph()?Vh().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await Sf(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return Ta(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return Ta(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}}function Ia(n){return Pr(JSON.stringify({version:2,heartbeats:n})).length}function kf(n){if(n.length===0)return-1;let t=0,e=n[0].date;for(let r=1;r<n.length;r++)n[r].date<e&&(e=n[r].date,t=r);return t}/**
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
 */function Of(n){Ke(new Ve("platform-logger",t=>new zh(t),"PRIVATE")),Ke(new Ve("heartbeat",t=>new Vf(t),"PRIVATE")),Wt(Hs,ya,n),Wt(Hs,ya,"esm2020"),Wt("fire-js","")}Of("");var Aa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ue,Bu;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(w,p){function y(){}y.prototype=p.prototype,w.F=p.prototype,w.prototype=new y,w.prototype.constructor=w,w.D=function(I,T,v){for(var _=Array(arguments.length-2),Ct=2;Ct<arguments.length;Ct++)_[Ct-2]=arguments[Ct];return p.prototype[T].apply(I,_)}}function e(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}t(r,e),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(w,p,y){y||(y=0);const I=Array(16);if(typeof p=="string")for(var T=0;T<16;++T)I[T]=p.charCodeAt(y++)|p.charCodeAt(y++)<<8|p.charCodeAt(y++)<<16|p.charCodeAt(y++)<<24;else for(T=0;T<16;++T)I[T]=p[y++]|p[y++]<<8|p[y++]<<16|p[y++]<<24;p=w.g[0],y=w.g[1],T=w.g[2];let v=w.g[3],_;_=p+(v^y&(T^v))+I[0]+3614090360&4294967295,p=y+(_<<7&4294967295|_>>>25),_=v+(T^p&(y^T))+I[1]+3905402710&4294967295,v=p+(_<<12&4294967295|_>>>20),_=T+(y^v&(p^y))+I[2]+606105819&4294967295,T=v+(_<<17&4294967295|_>>>15),_=y+(p^T&(v^p))+I[3]+3250441966&4294967295,y=T+(_<<22&4294967295|_>>>10),_=p+(v^y&(T^v))+I[4]+4118548399&4294967295,p=y+(_<<7&4294967295|_>>>25),_=v+(T^p&(y^T))+I[5]+1200080426&4294967295,v=p+(_<<12&4294967295|_>>>20),_=T+(y^v&(p^y))+I[6]+2821735955&4294967295,T=v+(_<<17&4294967295|_>>>15),_=y+(p^T&(v^p))+I[7]+4249261313&4294967295,y=T+(_<<22&4294967295|_>>>10),_=p+(v^y&(T^v))+I[8]+1770035416&4294967295,p=y+(_<<7&4294967295|_>>>25),_=v+(T^p&(y^T))+I[9]+2336552879&4294967295,v=p+(_<<12&4294967295|_>>>20),_=T+(y^v&(p^y))+I[10]+4294925233&4294967295,T=v+(_<<17&4294967295|_>>>15),_=y+(p^T&(v^p))+I[11]+2304563134&4294967295,y=T+(_<<22&4294967295|_>>>10),_=p+(v^y&(T^v))+I[12]+1804603682&4294967295,p=y+(_<<7&4294967295|_>>>25),_=v+(T^p&(y^T))+I[13]+4254626195&4294967295,v=p+(_<<12&4294967295|_>>>20),_=T+(y^v&(p^y))+I[14]+2792965006&4294967295,T=v+(_<<17&4294967295|_>>>15),_=y+(p^T&(v^p))+I[15]+1236535329&4294967295,y=T+(_<<22&4294967295|_>>>10),_=p+(T^v&(y^T))+I[1]+4129170786&4294967295,p=y+(_<<5&4294967295|_>>>27),_=v+(y^T&(p^y))+I[6]+3225465664&4294967295,v=p+(_<<9&4294967295|_>>>23),_=T+(p^y&(v^p))+I[11]+643717713&4294967295,T=v+(_<<14&4294967295|_>>>18),_=y+(v^p&(T^v))+I[0]+3921069994&4294967295,y=T+(_<<20&4294967295|_>>>12),_=p+(T^v&(y^T))+I[5]+3593408605&4294967295,p=y+(_<<5&4294967295|_>>>27),_=v+(y^T&(p^y))+I[10]+38016083&4294967295,v=p+(_<<9&4294967295|_>>>23),_=T+(p^y&(v^p))+I[15]+3634488961&4294967295,T=v+(_<<14&4294967295|_>>>18),_=y+(v^p&(T^v))+I[4]+3889429448&4294967295,y=T+(_<<20&4294967295|_>>>12),_=p+(T^v&(y^T))+I[9]+568446438&4294967295,p=y+(_<<5&4294967295|_>>>27),_=v+(y^T&(p^y))+I[14]+3275163606&4294967295,v=p+(_<<9&4294967295|_>>>23),_=T+(p^y&(v^p))+I[3]+4107603335&4294967295,T=v+(_<<14&4294967295|_>>>18),_=y+(v^p&(T^v))+I[8]+1163531501&4294967295,y=T+(_<<20&4294967295|_>>>12),_=p+(T^v&(y^T))+I[13]+2850285829&4294967295,p=y+(_<<5&4294967295|_>>>27),_=v+(y^T&(p^y))+I[2]+4243563512&4294967295,v=p+(_<<9&4294967295|_>>>23),_=T+(p^y&(v^p))+I[7]+1735328473&4294967295,T=v+(_<<14&4294967295|_>>>18),_=y+(v^p&(T^v))+I[12]+2368359562&4294967295,y=T+(_<<20&4294967295|_>>>12),_=p+(y^T^v)+I[5]+4294588738&4294967295,p=y+(_<<4&4294967295|_>>>28),_=v+(p^y^T)+I[8]+2272392833&4294967295,v=p+(_<<11&4294967295|_>>>21),_=T+(v^p^y)+I[11]+1839030562&4294967295,T=v+(_<<16&4294967295|_>>>16),_=y+(T^v^p)+I[14]+4259657740&4294967295,y=T+(_<<23&4294967295|_>>>9),_=p+(y^T^v)+I[1]+2763975236&4294967295,p=y+(_<<4&4294967295|_>>>28),_=v+(p^y^T)+I[4]+1272893353&4294967295,v=p+(_<<11&4294967295|_>>>21),_=T+(v^p^y)+I[7]+4139469664&4294967295,T=v+(_<<16&4294967295|_>>>16),_=y+(T^v^p)+I[10]+3200236656&4294967295,y=T+(_<<23&4294967295|_>>>9),_=p+(y^T^v)+I[13]+681279174&4294967295,p=y+(_<<4&4294967295|_>>>28),_=v+(p^y^T)+I[0]+3936430074&4294967295,v=p+(_<<11&4294967295|_>>>21),_=T+(v^p^y)+I[3]+3572445317&4294967295,T=v+(_<<16&4294967295|_>>>16),_=y+(T^v^p)+I[6]+76029189&4294967295,y=T+(_<<23&4294967295|_>>>9),_=p+(y^T^v)+I[9]+3654602809&4294967295,p=y+(_<<4&4294967295|_>>>28),_=v+(p^y^T)+I[12]+3873151461&4294967295,v=p+(_<<11&4294967295|_>>>21),_=T+(v^p^y)+I[15]+530742520&4294967295,T=v+(_<<16&4294967295|_>>>16),_=y+(T^v^p)+I[2]+3299628645&4294967295,y=T+(_<<23&4294967295|_>>>9),_=p+(T^(y|~v))+I[0]+4096336452&4294967295,p=y+(_<<6&4294967295|_>>>26),_=v+(y^(p|~T))+I[7]+1126891415&4294967295,v=p+(_<<10&4294967295|_>>>22),_=T+(p^(v|~y))+I[14]+2878612391&4294967295,T=v+(_<<15&4294967295|_>>>17),_=y+(v^(T|~p))+I[5]+4237533241&4294967295,y=T+(_<<21&4294967295|_>>>11),_=p+(T^(y|~v))+I[12]+1700485571&4294967295,p=y+(_<<6&4294967295|_>>>26),_=v+(y^(p|~T))+I[3]+2399980690&4294967295,v=p+(_<<10&4294967295|_>>>22),_=T+(p^(v|~y))+I[10]+4293915773&4294967295,T=v+(_<<15&4294967295|_>>>17),_=y+(v^(T|~p))+I[1]+2240044497&4294967295,y=T+(_<<21&4294967295|_>>>11),_=p+(T^(y|~v))+I[8]+1873313359&4294967295,p=y+(_<<6&4294967295|_>>>26),_=v+(y^(p|~T))+I[15]+4264355552&4294967295,v=p+(_<<10&4294967295|_>>>22),_=T+(p^(v|~y))+I[6]+2734768916&4294967295,T=v+(_<<15&4294967295|_>>>17),_=y+(v^(T|~p))+I[13]+1309151649&4294967295,y=T+(_<<21&4294967295|_>>>11),_=p+(T^(y|~v))+I[4]+4149444226&4294967295,p=y+(_<<6&4294967295|_>>>26),_=v+(y^(p|~T))+I[11]+3174756917&4294967295,v=p+(_<<10&4294967295|_>>>22),_=T+(p^(v|~y))+I[2]+718787259&4294967295,T=v+(_<<15&4294967295|_>>>17),_=y+(v^(T|~p))+I[9]+3951481745&4294967295,w.g[0]=w.g[0]+p&4294967295,w.g[1]=w.g[1]+(T+(_<<21&4294967295|_>>>11))&4294967295,w.g[2]=w.g[2]+T&4294967295,w.g[3]=w.g[3]+v&4294967295}r.prototype.v=function(w,p){p===void 0&&(p=w.length);const y=p-this.blockSize,I=this.C;let T=this.h,v=0;for(;v<p;){if(T==0)for(;v<=y;)s(this,w,v),v+=this.blockSize;if(typeof w=="string"){for(;v<p;)if(I[T++]=w.charCodeAt(v++),T==this.blockSize){s(this,I),T=0;break}}else for(;v<p;)if(I[T++]=w[v++],T==this.blockSize){s(this,I),T=0;break}}this.h=T,this.o+=p},r.prototype.A=function(){var w=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);w[0]=128;for(var p=1;p<w.length-8;++p)w[p]=0;p=this.o*8;for(var y=w.length-8;y<w.length;++y)w[y]=p&255,p/=256;for(this.v(w),w=Array(16),p=0,y=0;y<4;++y)for(let I=0;I<32;I+=8)w[p++]=this.g[y]>>>I&255;return w};function o(w,p){var y=c;return Object.prototype.hasOwnProperty.call(y,w)?y[w]:y[w]=p(w)}function a(w,p){this.h=p;const y=[];let I=!0;for(let T=w.length-1;T>=0;T--){const v=w[T]|0;I&&v==p||(y[T]=v,I=!1)}this.g=y}var c={};function h(w){return-128<=w&&w<128?o(w,function(p){return new a([p|0],p<0?-1:0)}):new a([w|0],w<0?-1:0)}function f(w){if(isNaN(w)||!isFinite(w))return g;if(w<0)return P(f(-w));const p=[];let y=1;for(let I=0;w>=y;I++)p[I]=w/y|0,y*=4294967296;return new a(p,0)}function m(w,p){if(w.length==0)throw Error("number format error: empty string");if(p=p||10,p<2||36<p)throw Error("radix out of range: "+p);if(w.charAt(0)=="-")return P(m(w.substring(1),p));if(w.indexOf("-")>=0)throw Error('number format error: interior "-" character');const y=f(Math.pow(p,8));let I=g;for(let v=0;v<w.length;v+=8){var T=Math.min(8,w.length-v);const _=parseInt(w.substring(v,v+T),p);T<8?(T=f(Math.pow(p,T)),I=I.j(T).add(f(_))):(I=I.j(y),I=I.add(f(_)))}return I}var g=h(0),E=h(1),b=h(16777216);n=a.prototype,n.m=function(){if(k(this))return-P(this).m();let w=0,p=1;for(let y=0;y<this.g.length;y++){const I=this.i(y);w+=(I>=0?I:4294967296+I)*p,p*=4294967296}return w},n.toString=function(w){if(w=w||10,w<2||36<w)throw Error("radix out of range: "+w);if(V(this))return"0";if(k(this))return"-"+P(this).toString(w);const p=f(Math.pow(w,6));var y=this;let I="";for(;;){const T=W(y,p).g;y=j(y,T.j(p));let v=((y.g.length>0?y.g[0]:y.h)>>>0).toString(w);if(y=T,V(y))return v+I;for(;v.length<6;)v="0"+v;I=v+I}},n.i=function(w){return w<0?0:w<this.g.length?this.g[w]:this.h};function V(w){if(w.h!=0)return!1;for(let p=0;p<w.g.length;p++)if(w.g[p]!=0)return!1;return!0}function k(w){return w.h==-1}n.l=function(w){return w=j(this,w),k(w)?-1:V(w)?0:1};function P(w){const p=w.g.length,y=[];for(let I=0;I<p;I++)y[I]=~w.g[I];return new a(y,~w.h).add(E)}n.abs=function(){return k(this)?P(this):this},n.add=function(w){const p=Math.max(this.g.length,w.g.length),y=[];let I=0;for(let T=0;T<=p;T++){let v=I+(this.i(T)&65535)+(w.i(T)&65535),_=(v>>>16)+(this.i(T)>>>16)+(w.i(T)>>>16);I=_>>>16,v&=65535,_&=65535,y[T]=_<<16|v}return new a(y,y[y.length-1]&-2147483648?-1:0)};function j(w,p){return w.add(P(p))}n.j=function(w){if(V(this)||V(w))return g;if(k(this))return k(w)?P(this).j(P(w)):P(P(this).j(w));if(k(w))return P(this.j(P(w)));if(this.l(b)<0&&w.l(b)<0)return f(this.m()*w.m());const p=this.g.length+w.g.length,y=[];for(var I=0;I<2*p;I++)y[I]=0;for(I=0;I<this.g.length;I++)for(let T=0;T<w.g.length;T++){const v=this.i(I)>>>16,_=this.i(I)&65535,Ct=w.i(T)>>>16,we=w.i(T)&65535;y[2*I+2*T]+=_*we,U(y,2*I+2*T),y[2*I+2*T+1]+=v*we,U(y,2*I+2*T+1),y[2*I+2*T+1]+=_*Ct,U(y,2*I+2*T+1),y[2*I+2*T+2]+=v*Ct,U(y,2*I+2*T+2)}for(w=0;w<p;w++)y[w]=y[2*w+1]<<16|y[2*w];for(w=p;w<2*p;w++)y[w]=0;return new a(y,0)};function U(w,p){for(;(w[p]&65535)!=w[p];)w[p+1]+=w[p]>>>16,w[p]&=65535,p++}function B(w,p){this.g=w,this.h=p}function W(w,p){if(V(p))throw Error("division by zero");if(V(w))return new B(g,g);if(k(w))return p=W(P(w),p),new B(P(p.g),P(p.h));if(k(p))return p=W(w,P(p)),new B(P(p.g),p.h);if(w.g.length>30){if(k(w)||k(p))throw Error("slowDivide_ only works with positive integers.");for(var y=E,I=p;I.l(w)<=0;)y=dt(y),I=dt(I);var T=Z(y,1),v=Z(I,1);for(I=Z(I,2),y=Z(y,2);!V(I);){var _=v.add(I);_.l(w)<=0&&(T=T.add(y),v=_),I=Z(I,1),y=Z(y,1)}return p=j(w,T.j(p)),new B(T,p)}for(T=g;w.l(p)>=0;){for(y=Math.max(1,Math.floor(w.m()/p.m())),I=Math.ceil(Math.log(y)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),v=f(y),_=v.j(p);k(_)||_.l(w)>0;)y-=I,v=f(y),_=v.j(p);V(v)&&(v=E),T=T.add(v),w=j(w,_)}return new B(T,w)}n.B=function(w){return W(this,w).h},n.and=function(w){const p=Math.max(this.g.length,w.g.length),y=[];for(let I=0;I<p;I++)y[I]=this.i(I)&w.i(I);return new a(y,this.h&w.h)},n.or=function(w){const p=Math.max(this.g.length,w.g.length),y=[];for(let I=0;I<p;I++)y[I]=this.i(I)|w.i(I);return new a(y,this.h|w.h)},n.xor=function(w){const p=Math.max(this.g.length,w.g.length),y=[];for(let I=0;I<p;I++)y[I]=this.i(I)^w.i(I);return new a(y,this.h^w.h)};function dt(w){const p=w.g.length+1,y=[];for(let I=0;I<p;I++)y[I]=w.i(I)<<1|w.i(I-1)>>>31;return new a(y,w.h)}function Z(w,p){const y=p>>5;p%=32;const I=w.g.length-y,T=[];for(let v=0;v<I;v++)T[v]=p>0?w.i(v+y)>>>p|w.i(v+y+1)<<32-p:w.i(v+y);return new a(T,w.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Bu=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=f,a.fromString=m,ue=a}).apply(typeof Aa<"u"?Aa:typeof self<"u"?self:typeof window<"u"?window:{});var gr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var qu,bn,ju,Ar,Qs,$u,zu,Gu;(function(){var n,t=Object.defineProperty;function e(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof gr=="object"&&gr];for(var u=0;u<i.length;++u){var l=i[u];if(l&&l.Math==Math)return l}throw Error("Cannot find global object")}var r=e(this);function s(i,u){if(u)t:{var l=r;i=i.split(".");for(var d=0;d<i.length-1;d++){var A=i[d];if(!(A in l))break t;l=l[A]}i=i[i.length-1],d=l[i],u=u(d),u!=d&&u!=null&&t(l,i,{configurable:!0,writable:!0,value:u})}}s("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(i){return i||function(u){var l=[],d;for(d in u)Object.prototype.hasOwnProperty.call(u,d)&&l.push([d,u[d]]);return l}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function c(i){var u=typeof i;return u=="object"&&i!=null||u=="function"}function h(i,u,l){return i.call.apply(i.bind,arguments)}function f(i,u,l){return f=h,f.apply(null,arguments)}function m(i,u){var l=Array.prototype.slice.call(arguments,1);return function(){var d=l.slice();return d.push.apply(d,arguments),i.apply(this,d)}}function g(i,u){function l(){}l.prototype=u.prototype,i.Z=u.prototype,i.prototype=new l,i.prototype.constructor=i,i.Ob=function(d,A,R){for(var D=Array(arguments.length-2),q=2;q<arguments.length;q++)D[q-2]=arguments[q];return u.prototype[A].apply(d,D)}}var E=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function b(i){const u=i.length;if(u>0){const l=Array(u);for(let d=0;d<u;d++)l[d]=i[d];return l}return[]}function V(i,u){for(let d=1;d<arguments.length;d++){const A=arguments[d];var l=typeof A;if(l=l!="object"?l:A?Array.isArray(A)?"array":l:"null",l=="array"||l=="object"&&typeof A.length=="number"){l=i.length||0;const R=A.length||0;i.length=l+R;for(let D=0;D<R;D++)i[l+D]=A[D]}else i.push(A)}}class k{constructor(u,l){this.i=u,this.j=l,this.h=0,this.g=null}get(){let u;return this.h>0?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function P(i){a.setTimeout(()=>{throw i},0)}function j(){var i=w;let u=null;return i.g&&(u=i.g,i.g=i.g.next,i.g||(i.h=null),u.next=null),u}class U{constructor(){this.h=this.g=null}add(u,l){const d=B.get();d.set(u,l),this.h?this.h.next=d:this.g=d,this.h=d}}var B=new k(()=>new W,i=>i.reset());class W{constructor(){this.next=this.g=this.h=null}set(u,l){this.h=u,this.g=l,this.next=null}reset(){this.next=this.g=this.h=null}}let dt,Z=!1,w=new U,p=()=>{const i=Promise.resolve(void 0);dt=()=>{i.then(y)}};function y(){for(var i;i=j();){try{i.h.call(i.g)}catch(l){P(l)}var u=B;u.j(i),u.h<100&&(u.h++,i.next=u.g,u.g=i)}Z=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function T(i,u){this.type=i,this.g=this.target=u,this.defaultPrevented=!1}T.prototype.h=function(){this.defaultPrevented=!0};var v=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var i=!1,u=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const l=()=>{};a.addEventListener("test",l,u),a.removeEventListener("test",l,u)}catch{}return i}();function _(i){return/^[\s\xa0]*$/.test(i)}function Ct(i,u){T.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,u)}g(Ct,T),Ct.prototype.init=function(i,u){const l=this.type=i.type,d=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=u,u=i.relatedTarget,u||(l=="mouseover"?u=i.fromElement:l=="mouseout"&&(u=i.toElement)),this.relatedTarget=u,d?(this.clientX=d.clientX!==void 0?d.clientX:d.pageX,this.clientY=d.clientY!==void 0?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&Ct.Z.h.call(this)},Ct.prototype.h=function(){Ct.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var we="closure_listenable_"+(Math.random()*1e6|0),xl=0;function Ml(i,u,l,d,A){this.listener=i,this.proxy=null,this.src=u,this.type=l,this.capture=!!d,this.ha=A,this.key=++xl,this.da=this.fa=!1}function er(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function nr(i,u,l){for(const d in i)u.call(l,i[d],d,i)}function Ll(i,u){for(const l in i)u.call(void 0,i[l],l,i)}function mo(i){const u={};for(const l in i)u[l]=i[l];return u}const po="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function go(i,u){let l,d;for(let A=1;A<arguments.length;A++){d=arguments[A];for(l in d)i[l]=d[l];for(let R=0;R<po.length;R++)l=po[R],Object.prototype.hasOwnProperty.call(d,l)&&(i[l]=d[l])}}function rr(i){this.src=i,this.g={},this.h=0}rr.prototype.add=function(i,u,l,d,A){const R=i.toString();i=this.g[R],i||(i=this.g[R]=[],this.h++);const D=ps(i,u,d,A);return D>-1?(u=i[D],l||(u.fa=!1)):(u=new Ml(u,this.src,R,!!d,A),u.fa=l,i.push(u)),u};function ms(i,u){const l=u.type;if(l in i.g){var d=i.g[l],A=Array.prototype.indexOf.call(d,u,void 0),R;(R=A>=0)&&Array.prototype.splice.call(d,A,1),R&&(er(u),i.g[l].length==0&&(delete i.g[l],i.h--))}}function ps(i,u,l,d){for(let A=0;A<i.length;++A){const R=i[A];if(!R.da&&R.listener==u&&R.capture==!!l&&R.ha==d)return A}return-1}var gs="closure_lm_"+(Math.random()*1e6|0),_s={};function _o(i,u,l,d,A){if(Array.isArray(u)){for(let R=0;R<u.length;R++)_o(i,u[R],l,d,A);return null}return l=To(l),i&&i[we]?i.J(u,l,c(d)?!!d.capture:!1,A):Fl(i,u,l,!1,d,A)}function Fl(i,u,l,d,A,R){if(!u)throw Error("Invalid event type");const D=c(A)?!!A.capture:!!A;let q=Es(i);if(q||(i[gs]=q=new rr(i)),l=q.add(u,l,d,D,R),l.proxy)return l;if(d=Ul(),l.proxy=d,d.src=i,d.listener=l,i.addEventListener)v||(A=D),A===void 0&&(A=!1),i.addEventListener(u.toString(),d,A);else if(i.attachEvent)i.attachEvent(Eo(u.toString()),d);else if(i.addListener&&i.removeListener)i.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");return l}function Ul(){function i(l){return u.call(i.src,i.listener,l)}const u=Bl;return i}function yo(i,u,l,d,A){if(Array.isArray(u))for(var R=0;R<u.length;R++)yo(i,u[R],l,d,A);else d=c(d)?!!d.capture:!!d,l=To(l),i&&i[we]?(i=i.i,R=String(u).toString(),R in i.g&&(u=i.g[R],l=ps(u,l,d,A),l>-1&&(er(u[l]),Array.prototype.splice.call(u,l,1),u.length==0&&(delete i.g[R],i.h--)))):i&&(i=Es(i))&&(u=i.g[u.toString()],i=-1,u&&(i=ps(u,l,d,A)),(l=i>-1?u[i]:null)&&ys(l))}function ys(i){if(typeof i!="number"&&i&&!i.da){var u=i.src;if(u&&u[we])ms(u.i,i);else{var l=i.type,d=i.proxy;u.removeEventListener?u.removeEventListener(l,d,i.capture):u.detachEvent?u.detachEvent(Eo(l),d):u.addListener&&u.removeListener&&u.removeListener(d),(l=Es(u))?(ms(l,i),l.h==0&&(l.src=null,u[gs]=null)):er(i)}}}function Eo(i){return i in _s?_s[i]:_s[i]="on"+i}function Bl(i,u){if(i.da)i=!0;else{u=new Ct(u,this);const l=i.listener,d=i.ha||i.src;i.fa&&ys(i),i=l.call(d,u)}return i}function Es(i){return i=i[gs],i instanceof rr?i:null}var Ts="__closure_events_fn_"+(Math.random()*1e9>>>0);function To(i){return typeof i=="function"?i:(i[Ts]||(i[Ts]=function(u){return i.handleEvent(u)}),i[Ts])}function wt(){I.call(this),this.i=new rr(this),this.M=this,this.G=null}g(wt,I),wt.prototype[we]=!0,wt.prototype.removeEventListener=function(i,u,l,d){yo(this,i,u,l,d)};function vt(i,u){var l,d=i.G;if(d)for(l=[];d;d=d.G)l.push(d);if(i=i.M,d=u.type||u,typeof u=="string")u=new T(u,i);else if(u instanceof T)u.target=u.target||i;else{var A=u;u=new T(d,i),go(u,A)}A=!0;let R,D;if(l)for(D=l.length-1;D>=0;D--)R=u.g=l[D],A=sr(R,d,!0,u)&&A;if(R=u.g=i,A=sr(R,d,!0,u)&&A,A=sr(R,d,!1,u)&&A,l)for(D=0;D<l.length;D++)R=u.g=l[D],A=sr(R,d,!1,u)&&A}wt.prototype.N=function(){if(wt.Z.N.call(this),this.i){var i=this.i;for(const u in i.g){const l=i.g[u];for(let d=0;d<l.length;d++)er(l[d]);delete i.g[u],i.h--}}this.G=null},wt.prototype.J=function(i,u,l,d){return this.i.add(String(i),u,!1,l,d)},wt.prototype.K=function(i,u,l,d){return this.i.add(String(i),u,!0,l,d)};function sr(i,u,l,d){if(u=i.i.g[String(u)],!u)return!0;u=u.concat();let A=!0;for(let R=0;R<u.length;++R){const D=u[R];if(D&&!D.da&&D.capture==l){const q=D.listener,ht=D.ha||D.src;D.fa&&ms(i.i,D),A=q.call(ht,d)!==!1&&A}}return A&&!d.defaultPrevented}function ql(i,u){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=f(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(u)>2147483647?-1:a.setTimeout(i,u||0)}function wo(i){i.g=ql(()=>{i.g=null,i.i&&(i.i=!1,wo(i))},i.l);const u=i.h;i.h=null,i.m.apply(null,u)}class jl extends I{constructor(u,l){super(),this.m=u,this.l=l,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:wo(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function cn(i){I.call(this),this.h=i,this.g={}}g(cn,I);var Io=[];function Ao(i){nr(i.g,function(u,l){this.g.hasOwnProperty(l)&&ys(u)},i),i.g={}}cn.prototype.N=function(){cn.Z.N.call(this),Ao(this)},cn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ws=a.JSON.stringify,$l=a.JSON.parse,zl=class{stringify(i){return a.JSON.stringify(i,void 0)}parse(i){return a.JSON.parse(i,void 0)}};function vo(){}function Ro(){}var ln={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Is(){T.call(this,"d")}g(Is,T);function As(){T.call(this,"c")}g(As,T);var Ie={},bo=null;function ir(){return bo=bo||new wt}Ie.Ia="serverreachability";function So(i){T.call(this,Ie.Ia,i)}g(So,T);function hn(i){const u=ir();vt(u,new So(u))}Ie.STAT_EVENT="statevent";function Co(i,u){T.call(this,Ie.STAT_EVENT,i),this.stat=u}g(Co,T);function Rt(i){const u=ir();vt(u,new Co(u,i))}Ie.Ja="timingevent";function Po(i,u){T.call(this,Ie.Ja,i),this.size=u}g(Po,T);function fn(i,u){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){i()},u)}function dn(){this.g=!0}dn.prototype.ua=function(){this.g=!1};function Gl(i,u,l,d,A,R){i.info(function(){if(i.g)if(R){var D="",q=R.split("&");for(let X=0;X<q.length;X++){var ht=q[X].split("=");if(ht.length>1){const mt=ht[0];ht=ht[1];const Ut=mt.split("_");D=Ut.length>=2&&Ut[1]=="type"?D+(mt+"="+ht+"&"):D+(mt+"=redacted&")}}}else D=null;else D=R;return"XMLHTTP REQ ("+d+") [attempt "+A+"]: "+u+`
`+l+`
`+D})}function Hl(i,u,l,d,A,R,D){i.info(function(){return"XMLHTTP RESP ("+d+") [ attempt "+A+"]: "+u+`
`+l+`
`+R+" "+D})}function Fe(i,u,l,d){i.info(function(){return"XMLHTTP TEXT ("+u+"): "+Wl(i,l)+(d?" "+d:"")})}function Kl(i,u){i.info(function(){return"TIMEOUT: "+u})}dn.prototype.info=function(){};function Wl(i,u){if(!i.g)return u;if(!u)return null;try{const R=JSON.parse(u);if(R){for(i=0;i<R.length;i++)if(Array.isArray(R[i])){var l=R[i];if(!(l.length<2)){var d=l[1];if(Array.isArray(d)&&!(d.length<1)){var A=d[0];if(A!="noop"&&A!="stop"&&A!="close")for(let D=1;D<d.length;D++)d[D]=""}}}}return ws(R)}catch{return u}}var or={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Vo={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Do;function vs(){}g(vs,vo),vs.prototype.g=function(){return new XMLHttpRequest},Do=new vs;function mn(i){return encodeURIComponent(String(i))}function Ql(i){var u=1;i=i.split(":");const l=[];for(;u>0&&i.length;)l.push(i.shift()),u--;return i.length&&l.push(i.join(":")),l}function Jt(i,u,l,d){this.j=i,this.i=u,this.l=l,this.S=d||1,this.V=new cn(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new No}function No(){this.i=null,this.g="",this.h=!1}var ko={},Rs={};function bs(i,u,l){i.M=1,i.A=ur(Ft(u)),i.u=l,i.R=!0,Oo(i,null)}function Oo(i,u){i.F=Date.now(),ar(i),i.B=Ft(i.A);var l=i.B,d=i.S;Array.isArray(d)||(d=[String(d)]),Ko(l.i,"t",d),i.C=0,l=i.j.L,i.h=new No,i.g=ha(i.j,l?u:null,!i.u),i.P>0&&(i.O=new jl(f(i.Y,i,i.g),i.P)),u=i.V,l=i.g,d=i.ba;var A="readystatechange";Array.isArray(A)||(A&&(Io[0]=A.toString()),A=Io);for(let R=0;R<A.length;R++){const D=_o(l,A[R],d||u.handleEvent,!1,u.h||u);if(!D)break;u.g[D.key]=D}u=i.J?mo(i.J):{},i.u?(i.v||(i.v="POST"),u["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,u)):(i.v="GET",i.g.ea(i.B,i.v,null,u)),hn(),Gl(i.i,i.v,i.B,i.l,i.S,i.u)}Jt.prototype.ba=function(i){i=i.target;const u=this.O;u&&ee(i)==3?u.j():this.Y(i)},Jt.prototype.Y=function(i){try{if(i==this.g)t:{const q=ee(this.g),ht=this.g.ya(),X=this.g.ca();if(!(q<3)&&(q!=3||this.g&&(this.h.h||this.g.la()||ta(this.g)))){this.K||q!=4||ht==7||(ht==8||X<=0?hn(3):hn(2)),Ss(this);var u=this.g.ca();this.X=u;var l=Xl(this);if(this.o=u==200,Hl(this.i,this.v,this.B,this.l,this.S,q,u),this.o){if(this.U&&!this.L){e:{if(this.g){var d,A=this.g;if((d=A.g?A.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(d)){var R=d;break e}}R=null}if(i=R)Fe(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Cs(this,i);else{this.o=!1,this.m=3,Rt(12),Ae(this),pn(this);break t}}if(this.R){i=!0;let mt;for(;!this.K&&this.C<l.length;)if(mt=Yl(this,l),mt==Rs){q==4&&(this.m=4,Rt(14),i=!1),Fe(this.i,this.l,null,"[Incomplete Response]");break}else if(mt==ko){this.m=4,Rt(15),Fe(this.i,this.l,l,"[Invalid Chunk]"),i=!1;break}else Fe(this.i,this.l,mt,null),Cs(this,mt);if(xo(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),q!=4||l.length!=0||this.h.h||(this.m=1,Rt(16),i=!1),this.o=this.o&&i,!i)Fe(this.i,this.l,l,"[Invalid Chunked Response]"),Ae(this),pn(this);else if(l.length>0&&!this.W){this.W=!0;var D=this.j;D.g==this&&D.aa&&!D.P&&(D.j.info("Great, no buffering proxy detected. Bytes received: "+l.length),Ms(D),D.P=!0,Rt(11))}}else Fe(this.i,this.l,l,null),Cs(this,l);q==4&&Ae(this),this.o&&!this.K&&(q==4?aa(this.j,this):(this.o=!1,ar(this)))}else hh(this.g),u==400&&l.indexOf("Unknown SID")>0?(this.m=3,Rt(12)):(this.m=0,Rt(13)),Ae(this),pn(this)}}}catch{}finally{}};function Xl(i){if(!xo(i))return i.g.la();const u=ta(i.g);if(u==="")return"";let l="";const d=u.length,A=ee(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return Ae(i),pn(i),"";i.h.i=new a.TextDecoder}for(let R=0;R<d;R++)i.h.h=!0,l+=i.h.i.decode(u[R],{stream:!(A&&R==d-1)});return u.length=0,i.h.g+=l,i.C=0,i.h.g}function xo(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function Yl(i,u){var l=i.C,d=u.indexOf(`
`,l);return d==-1?Rs:(l=Number(u.substring(l,d)),isNaN(l)?ko:(d+=1,d+l>u.length?Rs:(u=u.slice(d,d+l),i.C=d+l,u)))}Jt.prototype.cancel=function(){this.K=!0,Ae(this)};function ar(i){i.T=Date.now()+i.H,Mo(i,i.H)}function Mo(i,u){if(i.D!=null)throw Error("WatchDog timer not null");i.D=fn(f(i.aa,i),u)}function Ss(i){i.D&&(a.clearTimeout(i.D),i.D=null)}Jt.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(Kl(this.i,this.B),this.M!=2&&(hn(),Rt(17)),Ae(this),this.m=2,pn(this)):Mo(this,this.T-i)};function pn(i){i.j.I==0||i.K||aa(i.j,i)}function Ae(i){Ss(i);var u=i.O;u&&typeof u.dispose=="function"&&u.dispose(),i.O=null,Ao(i.V),i.g&&(u=i.g,i.g=null,u.abort(),u.dispose())}function Cs(i,u){try{var l=i.j;if(l.I!=0&&(l.g==i||Ps(l.h,i))){if(!i.L&&Ps(l.h,i)&&l.I==3){try{var d=l.Ba.g.parse(u)}catch{d=null}if(Array.isArray(d)&&d.length==3){var A=d;if(A[0]==0){t:if(!l.v){if(l.g)if(l.g.F+3e3<i.F)dr(l),hr(l);else break t;xs(l),Rt(18)}}else l.xa=A[1],0<l.xa-l.K&&A[2]<37500&&l.F&&l.A==0&&!l.C&&(l.C=fn(f(l.Va,l),6e3));Uo(l.h)<=1&&l.ta&&(l.ta=void 0)}else Re(l,11)}else if((i.L||l.g==i)&&dr(l),!_(u))for(A=l.Ba.g.parse(u),u=0;u<A.length;u++){let X=A[u];const mt=X[0];if(!(mt<=l.K))if(l.K=mt,X=X[1],l.I==2)if(X[0]=="c"){l.M=X[1],l.ba=X[2];const Ut=X[3];Ut!=null&&(l.ka=Ut,l.j.info("VER="+l.ka));const be=X[4];be!=null&&(l.za=be,l.j.info("SVER="+l.za));const ne=X[5];ne!=null&&typeof ne=="number"&&ne>0&&(d=1.5*ne,l.O=d,l.j.info("backChannelRequestTimeoutMs_="+d)),d=l;const re=i.g;if(re){const pr=re.g?re.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(pr){var R=d.h;R.g||pr.indexOf("spdy")==-1&&pr.indexOf("quic")==-1&&pr.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Vs(R,R.h),R.h=null))}if(d.G){const Ls=re.g?re.g.getResponseHeader("X-HTTP-Session-Id"):null;Ls&&(d.wa=Ls,Y(d.J,d.G,Ls))}}l.I=3,l.l&&l.l.ra(),l.aa&&(l.T=Date.now()-i.F,l.j.info("Handshake RTT: "+l.T+"ms")),d=l;var D=i;if(d.na=la(d,d.L?d.ba:null,d.W),D.L){Bo(d.h,D);var q=D,ht=d.O;ht&&(q.H=ht),q.D&&(Ss(q),ar(q)),d.g=D}else ia(d);l.i.length>0&&fr(l)}else X[0]!="stop"&&X[0]!="close"||Re(l,7);else l.I==3&&(X[0]=="stop"||X[0]=="close"?X[0]=="stop"?Re(l,7):Os(l):X[0]!="noop"&&l.l&&l.l.qa(X),l.A=0)}}hn(4)}catch{}}var Jl=class{constructor(i,u){this.g=i,this.map=u}};function Lo(i){this.l=i||10,a.PerformanceNavigationTiming?(i=a.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Fo(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function Uo(i){return i.h?1:i.g?i.g.size:0}function Ps(i,u){return i.h?i.h==u:i.g?i.g.has(u):!1}function Vs(i,u){i.g?i.g.add(u):i.h=u}function Bo(i,u){i.h&&i.h==u?i.h=null:i.g&&i.g.has(u)&&i.g.delete(u)}Lo.prototype.cancel=function(){if(this.i=qo(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function qo(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let u=i.i;for(const l of i.g.values())u=u.concat(l.G);return u}return b(i.i)}var jo=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Zl(i,u){if(i){i=i.split("&");for(let l=0;l<i.length;l++){const d=i[l].indexOf("=");let A,R=null;d>=0?(A=i[l].substring(0,d),R=i[l].substring(d+1)):A=i[l],u(A,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function Zt(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let u;i instanceof Zt?(this.l=i.l,gn(this,i.j),this.o=i.o,this.g=i.g,_n(this,i.u),this.h=i.h,Ds(this,Wo(i.i)),this.m=i.m):i&&(u=String(i).match(jo))?(this.l=!1,gn(this,u[1]||"",!0),this.o=yn(u[2]||""),this.g=yn(u[3]||"",!0),_n(this,u[4]),this.h=yn(u[5]||"",!0),Ds(this,u[6]||"",!0),this.m=yn(u[7]||"")):(this.l=!1,this.i=new Tn(null,this.l))}Zt.prototype.toString=function(){const i=[];var u=this.j;u&&i.push(En(u,$o,!0),":");var l=this.g;return(l||u=="file")&&(i.push("//"),(u=this.o)&&i.push(En(u,$o,!0),"@"),i.push(mn(l).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l=this.u,l!=null&&i.push(":",String(l))),(l=this.h)&&(this.g&&l.charAt(0)!="/"&&i.push("/"),i.push(En(l,l.charAt(0)=="/"?nh:eh,!0))),(l=this.i.toString())&&i.push("?",l),(l=this.m)&&i.push("#",En(l,sh)),i.join("")},Zt.prototype.resolve=function(i){const u=Ft(this);let l=!!i.j;l?gn(u,i.j):l=!!i.o,l?u.o=i.o:l=!!i.g,l?u.g=i.g:l=i.u!=null;var d=i.h;if(l)_n(u,i.u);else if(l=!!i.h){if(d.charAt(0)!="/")if(this.g&&!this.h)d="/"+d;else{var A=u.h.lastIndexOf("/");A!=-1&&(d=u.h.slice(0,A+1)+d)}if(A=d,A==".."||A==".")d="";else if(A.indexOf("./")!=-1||A.indexOf("/.")!=-1){d=A.lastIndexOf("/",0)==0,A=A.split("/");const R=[];for(let D=0;D<A.length;){const q=A[D++];q=="."?d&&D==A.length&&R.push(""):q==".."?((R.length>1||R.length==1&&R[0]!="")&&R.pop(),d&&D==A.length&&R.push("")):(R.push(q),d=!0)}d=R.join("/")}else d=A}return l?u.h=d:l=i.i.toString()!=="",l?Ds(u,Wo(i.i)):l=!!i.m,l&&(u.m=i.m),u};function Ft(i){return new Zt(i)}function gn(i,u,l){i.j=l?yn(u,!0):u,i.j&&(i.j=i.j.replace(/:$/,""))}function _n(i,u){if(u){if(u=Number(u),isNaN(u)||u<0)throw Error("Bad port number "+u);i.u=u}else i.u=null}function Ds(i,u,l){u instanceof Tn?(i.i=u,ih(i.i,i.l)):(l||(u=En(u,rh)),i.i=new Tn(u,i.l))}function Y(i,u,l){i.i.set(u,l)}function ur(i){return Y(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function yn(i,u){return i?u?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function En(i,u,l){return typeof i=="string"?(i=encodeURI(i).replace(u,th),l&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function th(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var $o=/[#\/\?@]/g,eh=/[#\?:]/g,nh=/[#\?]/g,rh=/[#\?@]/g,sh=/#/g;function Tn(i,u){this.h=this.g=null,this.i=i||null,this.j=!!u}function ve(i){i.g||(i.g=new Map,i.h=0,i.i&&Zl(i.i,function(u,l){i.add(decodeURIComponent(u.replace(/\+/g," ")),l)}))}n=Tn.prototype,n.add=function(i,u){ve(this),this.i=null,i=Ue(this,i);let l=this.g.get(i);return l||this.g.set(i,l=[]),l.push(u),this.h+=1,this};function zo(i,u){ve(i),u=Ue(i,u),i.g.has(u)&&(i.i=null,i.h-=i.g.get(u).length,i.g.delete(u))}function Go(i,u){return ve(i),u=Ue(i,u),i.g.has(u)}n.forEach=function(i,u){ve(this),this.g.forEach(function(l,d){l.forEach(function(A){i.call(u,A,d,this)},this)},this)};function Ho(i,u){ve(i);let l=[];if(typeof u=="string")Go(i,u)&&(l=l.concat(i.g.get(Ue(i,u))));else for(i=Array.from(i.g.values()),u=0;u<i.length;u++)l=l.concat(i[u]);return l}n.set=function(i,u){return ve(this),this.i=null,i=Ue(this,i),Go(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[u]),this.h+=1,this},n.get=function(i,u){return i?(i=Ho(this,i),i.length>0?String(i[0]):u):u};function Ko(i,u,l){zo(i,u),l.length>0&&(i.i=null,i.g.set(Ue(i,u),b(l)),i.h+=l.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],u=Array.from(this.g.keys());for(let d=0;d<u.length;d++){var l=u[d];const A=mn(l);l=Ho(this,l);for(let R=0;R<l.length;R++){let D=A;l[R]!==""&&(D+="="+mn(l[R])),i.push(D)}}return this.i=i.join("&")};function Wo(i){const u=new Tn;return u.i=i.i,i.g&&(u.g=new Map(i.g),u.h=i.h),u}function Ue(i,u){return u=String(u),i.j&&(u=u.toLowerCase()),u}function ih(i,u){u&&!i.j&&(ve(i),i.i=null,i.g.forEach(function(l,d){const A=d.toLowerCase();d!=A&&(zo(this,d),Ko(this,A,l))},i)),i.j=u}function oh(i,u){const l=new dn;if(a.Image){const d=new Image;d.onload=m(te,l,"TestLoadImage: loaded",!0,u,d),d.onerror=m(te,l,"TestLoadImage: error",!1,u,d),d.onabort=m(te,l,"TestLoadImage: abort",!1,u,d),d.ontimeout=m(te,l,"TestLoadImage: timeout",!1,u,d),a.setTimeout(function(){d.ontimeout&&d.ontimeout()},1e4),d.src=i}else u(!1)}function ah(i,u){const l=new dn,d=new AbortController,A=setTimeout(()=>{d.abort(),te(l,"TestPingServer: timeout",!1,u)},1e4);fetch(i,{signal:d.signal}).then(R=>{clearTimeout(A),R.ok?te(l,"TestPingServer: ok",!0,u):te(l,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(A),te(l,"TestPingServer: error",!1,u)})}function te(i,u,l,d,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),d(l)}catch{}}function uh(){this.g=new zl}function Ns(i){this.i=i.Sb||null,this.h=i.ab||!1}g(Ns,vo),Ns.prototype.g=function(){return new cr(this.i,this.h)};function cr(i,u){wt.call(this),this.H=i,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}g(cr,wt),n=cr.prototype,n.open=function(i,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=u,this.readyState=1,In(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const u={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(u.body=i),(this.H||a).fetch(new Request(this.D,u)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,wn(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,In(this)),this.g&&(this.readyState=3,In(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Qo(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function Qo(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var u=i.value?i.value:new Uint8Array(0);(u=this.B.decode(u,{stream:!i.done}))&&(this.response=this.responseText+=u)}i.done?wn(this):In(this),this.readyState==3&&Qo(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,wn(this))},n.Na=function(i){this.g&&(this.response=i,wn(this))},n.ga=function(){this.g&&wn(this)};function wn(i){i.readyState=4,i.l=null,i.j=null,i.B=null,In(i)}n.setRequestHeader=function(i,u){this.A.append(i,u)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],u=this.h.entries();for(var l=u.next();!l.done;)l=l.value,i.push(l[0]+": "+l[1]),l=u.next();return i.join(`\r
`)};function In(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(cr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Xo(i){let u="";return nr(i,function(l,d){u+=d,u+=":",u+=l,u+=`\r
`}),u}function ks(i,u,l){t:{for(d in l){var d=!1;break t}d=!0}d||(l=Xo(l),typeof i=="string"?l!=null&&mn(l):Y(i,u,l))}function nt(i){wt.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}g(nt,wt);var ch=/^https?$/i,lh=["POST","PUT"];n=nt.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,u,l,d){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);u=u?u.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Do.g(),this.g.onreadystatechange=E(f(this.Ca,this));try{this.B=!0,this.g.open(u,String(i),!0),this.B=!1}catch(R){Yo(this,R);return}if(i=l||"",l=new Map(this.headers),d)if(Object.getPrototypeOf(d)===Object.prototype)for(var A in d)l.set(A,d[A]);else if(typeof d.keys=="function"&&typeof d.get=="function")for(const R of d.keys())l.set(R,d.get(R));else throw Error("Unknown input type for opt_headers: "+String(d));d=Array.from(l.keys()).find(R=>R.toLowerCase()=="content-type"),A=a.FormData&&i instanceof a.FormData,!(Array.prototype.indexOf.call(lh,u,void 0)>=0)||d||A||l.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,D]of l)this.g.setRequestHeader(R,D);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(R){Yo(this,R)}};function Yo(i,u){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=u,i.o=5,Jo(i),lr(i)}function Jo(i){i.A||(i.A=!0,vt(i,"complete"),vt(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,vt(this,"complete"),vt(this,"abort"),lr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),lr(this,!0)),nt.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Zo(this):this.Xa())},n.Xa=function(){Zo(this)};function Zo(i){if(i.h&&typeof o<"u"){if(i.v&&ee(i)==4)setTimeout(i.Ca.bind(i),0);else if(vt(i,"readystatechange"),ee(i)==4){i.h=!1;try{const R=i.ca();t:switch(R){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break t;default:u=!1}var l;if(!(l=u)){var d;if(d=R===0){let D=String(i.D).match(jo)[1]||null;!D&&a.self&&a.self.location&&(D=a.self.location.protocol.slice(0,-1)),d=!ch.test(D?D.toLowerCase():"")}l=d}if(l)vt(i,"complete"),vt(i,"success");else{i.o=6;try{var A=ee(i)>2?i.g.statusText:""}catch{A=""}i.l=A+" ["+i.ca()+"]",Jo(i)}}finally{lr(i)}}}}function lr(i,u){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const l=i.g;i.g=null,u||vt(i,"ready");try{l.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function ee(i){return i.g?i.g.readyState:0}n.ca=function(){try{return ee(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var u=this.g.responseText;return i&&u.indexOf(i)==0&&(u=u.substring(i.length)),$l(u)}};function ta(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function hh(i){const u={};i=(i.g&&ee(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let d=0;d<i.length;d++){if(_(i[d]))continue;var l=Ql(i[d]);const A=l[0];if(l=l[1],typeof l!="string")continue;l=l.trim();const R=u[A]||[];u[A]=R,R.push(l)}Ll(u,function(d){return d.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function An(i,u,l){return l&&l.internalChannelParams&&l.internalChannelParams[i]||u}function ea(i){this.za=0,this.i=[],this.j=new dn,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=An("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=An("baseRetryDelayMs",5e3,i),this.Za=An("retryDelaySeedMs",1e4,i),this.Ta=An("forwardChannelMaxRetries",2,i),this.va=An("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new Lo(i&&i.concurrentRequestLimit),this.Ba=new uh,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=ea.prototype,n.ka=8,n.I=1,n.connect=function(i,u,l,d){Rt(0),this.W=i,this.H=u||{},l&&d!==void 0&&(this.H.OSID=l,this.H.OAID=d),this.F=this.X,this.J=la(this,null,this.W),fr(this)};function Os(i){if(na(i),i.I==3){var u=i.V++,l=Ft(i.J);if(Y(l,"SID",i.M),Y(l,"RID",u),Y(l,"TYPE","terminate"),vn(i,l),u=new Jt(i,i.j,u),u.M=2,u.A=ur(Ft(l)),l=!1,a.navigator&&a.navigator.sendBeacon)try{l=a.navigator.sendBeacon(u.A.toString(),"")}catch{}!l&&a.Image&&(new Image().src=u.A,l=!0),l||(u.g=ha(u.j,null),u.g.ea(u.A)),u.F=Date.now(),ar(u)}ca(i)}function hr(i){i.g&&(Ms(i),i.g.cancel(),i.g=null)}function na(i){hr(i),i.v&&(a.clearTimeout(i.v),i.v=null),dr(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&a.clearTimeout(i.m),i.m=null)}function fr(i){if(!Fo(i.h)&&!i.m){i.m=!0;var u=i.Ea;dt||p(),Z||(dt(),Z=!0),w.add(u,i),i.D=0}}function fh(i,u){return Uo(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=u.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=fn(f(i.Ea,i,u),ua(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const A=new Jt(this,this.j,i);let R=this.o;if(this.U&&(R?(R=mo(R),go(R,this.U)):R=this.U),this.u!==null||this.R||(A.J=R,R=null),this.S)t:{for(var u=0,l=0;l<this.i.length;l++){e:{var d=this.i[l];if("__data__"in d.map&&(d=d.map.__data__,typeof d=="string")){d=d.length;break e}d=void 0}if(d===void 0)break;if(u+=d,u>4096){u=l;break t}if(u===4096||l===this.i.length-1){u=l+1;break t}}u=1e3}else u=1e3;u=sa(this,A,u),l=Ft(this.J),Y(l,"RID",i),Y(l,"CVER",22),this.G&&Y(l,"X-HTTP-Session-Id",this.G),vn(this,l),R&&(this.R?u="headers="+mn(Xo(R))+"&"+u:this.u&&ks(l,this.u,R)),Vs(this.h,A),this.Ra&&Y(l,"TYPE","init"),this.S?(Y(l,"$req",u),Y(l,"SID","null"),A.U=!0,bs(A,l,null)):bs(A,l,u),this.I=2}}else this.I==3&&(i?ra(this,i):this.i.length==0||Fo(this.h)||ra(this))};function ra(i,u){var l;u?l=u.l:l=i.V++;const d=Ft(i.J);Y(d,"SID",i.M),Y(d,"RID",l),Y(d,"AID",i.K),vn(i,d),i.u&&i.o&&ks(d,i.u,i.o),l=new Jt(i,i.j,l,i.D+1),i.u===null&&(l.J=i.o),u&&(i.i=u.G.concat(i.i)),u=sa(i,l,1e3),l.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),Vs(i.h,l),bs(l,d,u)}function vn(i,u){i.H&&nr(i.H,function(l,d){Y(u,d,l)}),i.l&&nr({},function(l,d){Y(u,d,l)})}function sa(i,u,l){l=Math.min(i.i.length,l);const d=i.l?f(i.l.Ka,i.l,i):null;t:{var A=i.i;let q=-1;for(;;){const ht=["count="+l];q==-1?l>0?(q=A[0].g,ht.push("ofs="+q)):q=0:ht.push("ofs="+q);let X=!0;for(let mt=0;mt<l;mt++){var R=A[mt].g;const Ut=A[mt].map;if(R-=q,R<0)q=Math.max(0,A[mt].g-100),X=!1;else try{R="req"+R+"_"||"";try{var D=Ut instanceof Map?Ut:Object.entries(Ut);for(const[be,ne]of D){let re=ne;c(ne)&&(re=ws(ne)),ht.push(R+be+"="+encodeURIComponent(re))}}catch(be){throw ht.push(R+"type="+encodeURIComponent("_badmap")),be}}catch{d&&d(Ut)}}if(X){D=ht.join("&");break t}}D=void 0}return i=i.i.splice(0,l),u.G=i,D}function ia(i){if(!i.g&&!i.v){i.Y=1;var u=i.Da;dt||p(),Z||(dt(),Z=!0),w.add(u,i),i.A=0}}function xs(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=fn(f(i.Da,i),ua(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,oa(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=fn(f(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Rt(10),hr(this),oa(this))};function Ms(i){i.B!=null&&(a.clearTimeout(i.B),i.B=null)}function oa(i){i.g=new Jt(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var u=Ft(i.na);Y(u,"RID","rpc"),Y(u,"SID",i.M),Y(u,"AID",i.K),Y(u,"CI",i.F?"0":"1"),!i.F&&i.ia&&Y(u,"TO",i.ia),Y(u,"TYPE","xmlhttp"),vn(i,u),i.u&&i.o&&ks(u,i.u,i.o),i.O&&(i.g.H=i.O);var l=i.g;i=i.ba,l.M=1,l.A=ur(Ft(u)),l.u=null,l.R=!0,Oo(l,i)}n.Va=function(){this.C!=null&&(this.C=null,hr(this),xs(this),Rt(19))};function dr(i){i.C!=null&&(a.clearTimeout(i.C),i.C=null)}function aa(i,u){var l=null;if(i.g==u){dr(i),Ms(i),i.g=null;var d=2}else if(Ps(i.h,u))l=u.G,Bo(i.h,u),d=1;else return;if(i.I!=0){if(u.o)if(d==1){l=u.u?u.u.length:0,u=Date.now()-u.F;var A=i.D;d=ir(),vt(d,new Po(d,l)),fr(i)}else ia(i);else if(A=u.m,A==3||A==0&&u.X>0||!(d==1&&fh(i,u)||d==2&&xs(i)))switch(l&&l.length>0&&(u=i.h,u.i=u.i.concat(l)),A){case 1:Re(i,5);break;case 4:Re(i,10);break;case 3:Re(i,6);break;default:Re(i,2)}}}function ua(i,u){let l=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(l*=2),l*u}function Re(i,u){if(i.j.info("Error code "+u),u==2){var l=f(i.bb,i),d=i.Ua;const A=!d;d=new Zt(d||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||gn(d,"https"),ur(d),A?oh(d.toString(),l):ah(d.toString(),l)}else Rt(2);i.I=0,i.l&&i.l.pa(u),ca(i),na(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),Rt(2)):(this.j.info("Failed to ping google.com"),Rt(1))};function ca(i){if(i.I=0,i.ja=[],i.l){const u=qo(i.h);(u.length!=0||i.i.length!=0)&&(V(i.ja,u),V(i.ja,i.i),i.h.i.length=0,b(i.i),i.i.length=0),i.l.oa()}}function la(i,u,l){var d=l instanceof Zt?Ft(l):new Zt(l);if(d.g!="")u&&(d.g=u+"."+d.g),_n(d,d.u);else{var A=a.location;d=A.protocol,u=u?u+"."+A.hostname:A.hostname,A=+A.port;const R=new Zt(null);d&&gn(R,d),u&&(R.g=u),A&&_n(R,A),l&&(R.h=l),d=R}return l=i.G,u=i.wa,l&&u&&Y(d,l,u),Y(d,"VER",i.ka),vn(i,d),d}function ha(i,u,l){if(u&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return u=i.Aa&&!i.ma?new nt(new Ns({ab:l})):new nt(i.ma),u.Fa(i.L),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function fa(){}n=fa.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function mr(){}mr.prototype.g=function(i,u){return new Dt(i,u)};function Dt(i,u){wt.call(this),this.g=new ea(u),this.l=i,this.h=u&&u.messageUrlParams||null,i=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(i?i["X-WebChannel-Content-Type"]=u.messageContentType:i={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.sa&&(i?i["X-WebChannel-Client-Profile"]=u.sa:i={"X-WebChannel-Client-Profile":u.sa}),this.g.U=i,(i=u&&u.Qb)&&!_(i)&&(this.g.u=i),this.A=u&&u.supportsCrossDomainXhr||!1,this.v=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!_(u)&&(this.g.G=u,i=this.h,i!==null&&u in i&&(i=this.h,u in i&&delete i[u])),this.j=new Be(this)}g(Dt,wt),Dt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Dt.prototype.close=function(){Os(this.g)},Dt.prototype.o=function(i){var u=this.g;if(typeof i=="string"){var l={};l.__data__=i,i=l}else this.v&&(l={},l.__data__=ws(i),i=l);u.i.push(new Jl(u.Ya++,i)),u.I==3&&fr(u)},Dt.prototype.N=function(){this.g.l=null,delete this.j,Os(this.g),delete this.g,Dt.Z.N.call(this)};function da(i){Is.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var u=i.__sm__;if(u){t:{for(const l in u){i=l;break t}i=void 0}(this.i=i)&&(i=this.i,u=u!==null&&i in u?u[i]:void 0),this.data=u}else this.data=i}g(da,Is);function ma(){As.call(this),this.status=1}g(ma,As);function Be(i){this.g=i}g(Be,fa),Be.prototype.ra=function(){vt(this.g,"a")},Be.prototype.qa=function(i){vt(this.g,new da(i))},Be.prototype.pa=function(i){vt(this.g,new ma)},Be.prototype.oa=function(){vt(this.g,"b")},mr.prototype.createWebChannel=mr.prototype.g,Dt.prototype.send=Dt.prototype.o,Dt.prototype.open=Dt.prototype.m,Dt.prototype.close=Dt.prototype.close,Gu=function(){return new mr},zu=function(){return ir()},$u=Ie,Qs={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},or.NO_ERROR=0,or.TIMEOUT=8,or.HTTP_ERROR=6,Ar=or,Vo.COMPLETE="complete",ju=Vo,Ro.EventType=ln,ln.OPEN="a",ln.CLOSE="b",ln.ERROR="c",ln.MESSAGE="d",wt.prototype.listen=wt.prototype.J,bn=Ro,nt.prototype.listenOnce=nt.prototype.K,nt.prototype.getLastError=nt.prototype.Ha,nt.prototype.getLastErrorCode=nt.prototype.ya,nt.prototype.getStatus=nt.prototype.ca,nt.prototype.getResponseJson=nt.prototype.La,nt.prototype.getResponseText=nt.prototype.la,nt.prototype.send=nt.prototype.ea,nt.prototype.setWithCredentials=nt.prototype.Fa,qu=nt}).apply(typeof gr<"u"?gr:typeof self<"u"?self:typeof window<"u"?window:{});const va="@firebase/firestore",Ra="4.9.2";/**
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
 */class At{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}At.UNAUTHENTICATED=new At(null),At.GOOGLE_CREDENTIALS=new At("google-credentials-uid"),At.FIRST_PARTY=new At("first-party-uid"),At.MOCK_USER=new At("mock-user");/**
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
 */let en="12.3.0";/**
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
 */const De=new Mu("@firebase/firestore");function qe(){return De.logLevel}function O(n,...t){if(De.logLevel<=H.DEBUG){const e=t.map(Ti);De.debug(`Firestore (${en}): ${n}`,...e)}}function Xt(n,...t){if(De.logLevel<=H.ERROR){const e=t.map(Ti);De.error(`Firestore (${en}): ${n}`,...e)}}function We(n,...t){if(De.logLevel<=H.WARN){const e=t.map(Ti);De.warn(`Firestore (${en}): ${n}`,...e)}}function Ti(n){if(typeof n=="string")return n;try{/**
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
 */function M(n,t,e){let r="Unexpected state";typeof t=="string"?r=t:e=t,Hu(n,r,e)}function Hu(n,t,e){let r=`FIRESTORE (${en}) INTERNAL ASSERTION FAILED: ${t} (ID: ${n.toString(16)})`;if(e!==void 0)try{r+=" CONTEXT: "+JSON.stringify(e)}catch{r+=" CONTEXT: "+e}throw Xt(r),new Error(r)}function K(n,t,e,r){let s="Unexpected state";typeof e=="string"?s=e:r=e,n||Hu(t,s,r)}function F(n,t){return n}/**
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
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends ye{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class jt{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
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
 */class Ku{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class xf{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(At.UNAUTHENTICATED))}shutdown(){}}class Mf{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class Lf{constructor(t){this.t=t,this.currentUser=At.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){K(this.o===void 0,42304);let r=this.i;const s=h=>this.i!==r?(r=this.i,e(h)):Promise.resolve();let o=new jt;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new jt,t.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;t.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},c=h=>{O("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>c(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?c(h):(O("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new jt)}},0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(r=>this.i!==t?(O("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(K(typeof r.accessToken=="string",31837,{l:r}),new Ku(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return K(t===null||typeof t=="string",2055,{h:t}),new At(t)}}class Ff{constructor(t,e,r){this.P=t,this.T=e,this.I=r,this.type="FirstParty",this.user=At.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Uf{constructor(t,e,r){this.P=t,this.T=e,this.I=r}getToken(){return Promise.resolve(new Ff(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable(()=>e(At.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ba{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Bf{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,yi(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){K(this.o===void 0,3512);const r=o=>{o.error!=null&&O("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,O("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(o.token):Promise.resolve()};this.o=o=>{t.enqueueRetryable(()=>r(o))};const s=o=>{O("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?s(o):O("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new ba(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(K(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new ba(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function qf(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let r=0;r<n;r++)e[r]=Math.floor(256*Math.random());return e}/**
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
 */class wi{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=qf(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<e&&(r+=t.charAt(s[o]%62))}return r}}function $(n,t){return n<t?-1:n>t?1:0}function Xs(n,t){const e=Math.min(n.length,t.length);for(let r=0;r<e;r++){const s=n.charAt(r),o=t.charAt(r);if(s!==o)return Bs(s)===Bs(o)?$(s,o):Bs(s)?1:-1}return $(n.length,t.length)}const jf=55296,$f=57343;function Bs(n){const t=n.charCodeAt(0);return t>=jf&&t<=$f}function Qe(n,t,e){return n.length===t.length&&n.every((r,s)=>e(r,t[s]))}/**
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
 */const Sa="__name__";class Bt{constructor(t,e,r){e===void 0?e=0:e>t.length&&M(637,{offset:e,range:t.length}),r===void 0?r=t.length-e:r>t.length-e&&M(1746,{length:r,range:t.length-e}),this.segments=t,this.offset=e,this.len=r}get length(){return this.len}isEqual(t){return Bt.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Bt?t.forEach(r=>{e.push(r)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,r=this.limit();e<r;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const r=Math.min(t.length,e.length);for(let s=0;s<r;s++){const o=Bt.compareSegments(t.get(s),e.get(s));if(o!==0)return o}return $(t.length,e.length)}static compareSegments(t,e){const r=Bt.isNumericId(t),s=Bt.isNumericId(e);return r&&!s?-1:!r&&s?1:r&&s?Bt.extractNumericId(t).compare(Bt.extractNumericId(e)):Xs(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return ue.fromString(t.substring(4,t.length-2))}}class Q extends Bt{construct(t,e,r){return new Q(t,e,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const r of t){if(r.indexOf("//")>=0)throw new N(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);e.push(...r.split("/").filter(s=>s.length>0))}return new Q(e)}static emptyPath(){return new Q([])}}const zf=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Et extends Bt{construct(t,e,r){return new Et(t,e,r)}static isValidIdentifier(t){return zf.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Et.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Sa}static keyField(){return new Et([Sa])}static fromServerFormat(t){const e=[];let r="",s=0;const o=()=>{if(r.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(r),r=""};let a=!1;for(;s<t.length;){const c=t[s];if(c==="\\"){if(s+1===t.length)throw new N(S.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const h=t[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new N(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=h,s+=2}else c==="`"?(a=!a,s++):c!=="."||a?(r+=c,s++):(o(),s++)}if(o(),a)throw new N(S.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new Et(e)}static emptyPath(){return new Et([])}}/**
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
 */class x{constructor(t){this.path=t}static fromPath(t){return new x(Q.fromString(t))}static fromName(t){return new x(Q.fromString(t).popFirst(5))}static empty(){return new x(Q.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&Q.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return Q.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new x(new Q(t.slice()))}}/**
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
 */function Wu(n,t,e){if(!e)throw new N(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function Gf(n,t,e,r){if(t===!0&&r===!0)throw new N(S.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function Ca(n){if(!x.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Pa(n){if(x.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Qu(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Qr(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=function(r){return r.constructor?r.constructor.name:null}(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":M(12329,{type:typeof n})}function _t(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new N(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=Qr(n);throw new N(S.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}function Hf(n,t){if(t<=0)throw new N(S.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${t}.`)}/**
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
 */function ct(n,t){const e={typeString:n};return t&&(e.value=t),e}function Gn(n,t){if(!Qu(n))throw new N(S.INVALID_ARGUMENT,"JSON must be an object");let e;for(const r in t)if(t[r]){const s=t[r].typeString,o="value"in t[r]?{value:t[r].value}:void 0;if(!(r in n)){e=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){e=`JSON field '${r}' must be a ${s}.`;break}if(o!==void 0&&a!==o.value){e=`Expected '${r}' field to equal '${o.value}'`;break}}if(e)throw new N(S.INVALID_ARGUMENT,e);return!0}/**
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
 */const Va=-62135596800,Da=1e6;class J{static now(){return J.fromMillis(Date.now())}static fromDate(t){return J.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),r=Math.floor((t-1e3*e)*Da);return new J(e,r)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<Va)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Da}_compareTo(t){return this.seconds===t.seconds?$(this.nanoseconds,t.nanoseconds):$(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:J._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(Gn(t,J._jsonSchema))return new J(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-Va;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}J._jsonSchemaVersion="firestore/timestamp/1.0",J._jsonSchema={type:ct("string",J._jsonSchemaVersion),seconds:ct("number"),nanoseconds:ct("number")};/**
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
 */const Ln=-1;function Kf(n,t){const e=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=L.fromTimestamp(r===1e9?new J(e+1,0):new J(e,r));return new fe(s,x.empty(),t)}function Wf(n){return new fe(n.readTime,n.key,Ln)}class fe{constructor(t,e,r){this.readTime=t,this.documentKey=e,this.largestBatchId=r}static min(){return new fe(L.min(),x.empty(),Ln)}static max(){return new fe(L.max(),x.empty(),Ln)}}function Qf(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=x.comparator(n.documentKey,t.documentKey),e!==0?e:$(n.largestBatchId,t.largestBatchId))}/**
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
 */const Xf="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Yf{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
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
 */async function nn(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==Xf)throw n;O("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class C{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&M(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new C((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(t,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(e,o).next(r,s)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof C?e:C.resolve(e)}catch(e){return C.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):C.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):C.reject(e)}static resolve(t){return new C((e,r)=>{e(t)})}static reject(t){return new C((e,r)=>{r(t)})}static waitFor(t){return new C((e,r)=>{let s=0,o=0,a=!1;t.forEach(c=>{++s,c.next(()=>{++o,a&&o===s&&e()},h=>r(h))}),a=!0,o===s&&e()})}static or(t){let e=C.resolve(!1);for(const r of t)e=e.next(s=>s?C.resolve(s):r());return e}static forEach(t,e){const r=[];return t.forEach((s,o)=>{r.push(e.call(this,s,o))}),this.waitFor(r)}static mapArray(t,e){return new C((r,s)=>{const o=t.length,a=new Array(o);let c=0;for(let h=0;h<o;h++){const f=h;e(t[f]).next(m=>{a[f]=m,++c,c===o&&r(a)},m=>s(m))}})}static doWhile(t,e){return new C((r,s)=>{const o=()=>{t()===!0?e().next(()=>{o()},s):r()};o()})}}function Jf(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function rn(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Xr{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>e.writeSequenceNumber(r))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}Xr.ce=-1;/**
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
 */const Ii=-1;function Hn(n){return n==null}function Nr(n){return n===0&&1/n==-1/0}function Zf(n){return typeof n=="number"&&Number.isInteger(n)&&!Nr(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */const Xu="";function td(n){let t="";for(let e=0;e<n.length;e++)t.length>0&&(t=Na(t)),t=ed(n.get(e),t);return Na(t)}function ed(n,t){let e=t;const r=n.length;for(let s=0;s<r;s++){const o=n.charAt(s);switch(o){case"\0":e+="";break;case Xu:e+="";break;default:e+=o}}return e}function Na(n){return n+Xu+""}/**
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
 */function ka(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function Ee(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function Yu(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
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
 */class et{constructor(t,e){this.comparator=t,this.root=e||yt.EMPTY}insert(t,e){return new et(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,yt.BLACK,null,null))}remove(t){return new et(this.comparator,this.root.remove(t,this.comparator).copy(null,null,yt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const r=this.comparator(t,e.key);if(r===0)return e.value;r<0?e=e.left:r>0&&(e=e.right)}return null}indexOf(t){let e=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(t,r.key);if(s===0)return e+r.left.size;s<0?r=r.left:(e+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,r)=>(t(e,r),!1))}toString(){const t=[];return this.inorderTraversal((e,r)=>(t.push(`${e}:${r}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new _r(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new _r(this.root,t,this.comparator,!1)}getReverseIterator(){return new _r(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new _r(this.root,t,this.comparator,!0)}}class _r{constructor(t,e,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!t.isEmpty();)if(o=e?r(t.key,e):1,e&&s&&(o*=-1),o<0)t=this.isReverse?t.left:t.right;else{if(o===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class yt{constructor(t,e,r,s,o){this.key=t,this.value=e,this.color=r??yt.RED,this.left=s??yt.EMPTY,this.right=o??yt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,r,s,o){return new yt(t??this.key,e??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,r){let s=this;const o=r(t,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(t,e,r),null):o===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return yt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let r,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return yt.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,yt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,yt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw M(43730,{key:this.key,value:this.value});if(this.right.isRed())throw M(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw M(27949);return t+(this.isRed()?0:1)}}yt.EMPTY=null,yt.RED=!0,yt.BLACK=!1;yt.EMPTY=new class{constructor(){this.size=0}get key(){throw M(57766)}get value(){throw M(16141)}get color(){throw M(16727)}get left(){throw M(29726)}get right(){throw M(36894)}copy(t,e,r,s,o){return this}insert(t,e,r){return new yt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class ft{constructor(t){this.comparator=t,this.data=new et(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,r)=>(t(e),!1))}forEachInRange(t,e){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let r;for(r=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Oa(this.data.getIterator())}getIteratorFrom(t){return new Oa(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(r=>{e=e.add(r)}),e}isEqual(t){if(!(t instanceof ft)||this.size!==t.size)return!1;const e=this.data.getIterator(),r=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new ft(this.comparator);return e.data=t,e}}class Oa{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class kt{constructor(t){this.fields=t,t.sort(Et.comparator)}static empty(){return new kt([])}unionWith(t){let e=new ft(Et.comparator);for(const r of this.fields)e=e.add(r);for(const r of t)e=e.add(r);return new kt(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Qe(this.fields,t.fields,(e,r)=>e.isEqual(r))}}/**
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
 */class Ju extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Tt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Ju("Invalid base64 string: "+o):o}}(t);return new Tt(e)}static fromUint8Array(t){const e=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(t);return new Tt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return $(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Tt.EMPTY_BYTE_STRING=new Tt("");const nd=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function de(n){if(K(!!n,39018),typeof n=="string"){let t=0;const e=nd.exec(n);if(K(!!e,46558,{timestamp:n}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:it(n.seconds),nanos:it(n.nanos)}}function it(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function me(n){return typeof n=="string"?Tt.fromBase64String(n):Tt.fromUint8Array(n)}/**
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
 */const Zu="server_timestamp",tc="__type__",ec="__previous_value__",nc="__local_write_time__";function Ai(n){var e,r;return((r=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[tc])==null?void 0:r.stringValue)===Zu}function Yr(n){const t=n.mapValue.fields[ec];return Ai(t)?Yr(t):t}function Fn(n){const t=de(n.mapValue.fields[nc].timestampValue);return new J(t.seconds,t.nanos)}/**
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
 */class rd{constructor(t,e,r,s,o,a,c,h,f,m){this.databaseId=t,this.appId=e,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=h,this.useFetchStreams=f,this.isUsingEmulator=m}}const kr="(default)";class Un{constructor(t,e){this.projectId=t,this.database=e||kr}static empty(){return new Un("","")}get isDefaultDatabase(){return this.database===kr}isEqual(t){return t instanceof Un&&t.projectId===this.projectId&&t.database===this.database}}/**
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
 */const rc="__type__",sd="__max__",yr={mapValue:{}},sc="__vector__",Or="value";function pe(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Ai(n)?4:od(n)?9007199254740991:id(n)?10:11:M(28295,{value:n})}function Ht(n,t){if(n===t)return!0;const e=pe(n);if(e!==pe(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return Fn(n).isEqual(Fn(t));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=de(s.timestampValue),c=de(o.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos}(n,t);case 5:return n.stringValue===t.stringValue;case 6:return function(s,o){return me(s.bytesValue).isEqual(me(o.bytesValue))}(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return function(s,o){return it(s.geoPointValue.latitude)===it(o.geoPointValue.latitude)&&it(s.geoPointValue.longitude)===it(o.geoPointValue.longitude)}(n,t);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return it(s.integerValue)===it(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=it(s.doubleValue),c=it(o.doubleValue);return a===c?Nr(a)===Nr(c):isNaN(a)&&isNaN(c)}return!1}(n,t);case 9:return Qe(n.arrayValue.values||[],t.arrayValue.values||[],Ht);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},c=o.mapValue.fields||{};if(ka(a)!==ka(c))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(c[h]===void 0||!Ht(a[h],c[h])))return!1;return!0}(n,t);default:return M(52216,{left:n})}}function Bn(n,t){return(n.values||[]).find(e=>Ht(e,t))!==void 0}function Xe(n,t){if(n===t)return 0;const e=pe(n),r=pe(t);if(e!==r)return $(e,r);switch(e){case 0:case 9007199254740991:return 0;case 1:return $(n.booleanValue,t.booleanValue);case 2:return function(o,a){const c=it(o.integerValue||o.doubleValue),h=it(a.integerValue||a.doubleValue);return c<h?-1:c>h?1:c===h?0:isNaN(c)?isNaN(h)?0:-1:1}(n,t);case 3:return xa(n.timestampValue,t.timestampValue);case 4:return xa(Fn(n),Fn(t));case 5:return Xs(n.stringValue,t.stringValue);case 6:return function(o,a){const c=me(o),h=me(a);return c.compareTo(h)}(n.bytesValue,t.bytesValue);case 7:return function(o,a){const c=o.split("/"),h=a.split("/");for(let f=0;f<c.length&&f<h.length;f++){const m=$(c[f],h[f]);if(m!==0)return m}return $(c.length,h.length)}(n.referenceValue,t.referenceValue);case 8:return function(o,a){const c=$(it(o.latitude),it(a.latitude));return c!==0?c:$(it(o.longitude),it(a.longitude))}(n.geoPointValue,t.geoPointValue);case 9:return Ma(n.arrayValue,t.arrayValue);case 10:return function(o,a){var E,b,V,k;const c=o.fields||{},h=a.fields||{},f=(E=c[Or])==null?void 0:E.arrayValue,m=(b=h[Or])==null?void 0:b.arrayValue,g=$(((V=f==null?void 0:f.values)==null?void 0:V.length)||0,((k=m==null?void 0:m.values)==null?void 0:k.length)||0);return g!==0?g:Ma(f,m)}(n.mapValue,t.mapValue);case 11:return function(o,a){if(o===yr.mapValue&&a===yr.mapValue)return 0;if(o===yr.mapValue)return 1;if(a===yr.mapValue)return-1;const c=o.fields||{},h=Object.keys(c),f=a.fields||{},m=Object.keys(f);h.sort(),m.sort();for(let g=0;g<h.length&&g<m.length;++g){const E=Xs(h[g],m[g]);if(E!==0)return E;const b=Xe(c[h[g]],f[m[g]]);if(b!==0)return b}return $(h.length,m.length)}(n.mapValue,t.mapValue);default:throw M(23264,{he:e})}}function xa(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return $(n,t);const e=de(n),r=de(t),s=$(e.seconds,r.seconds);return s!==0?s:$(e.nanos,r.nanos)}function Ma(n,t){const e=n.values||[],r=t.values||[];for(let s=0;s<e.length&&s<r.length;++s){const o=Xe(e[s],r[s]);if(o)return o}return $(e.length,r.length)}function Ye(n){return Ys(n)}function Ys(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(e){const r=de(e);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(e){return me(e).toBase64()}(n.bytesValue):"referenceValue"in n?function(e){return x.fromName(e).toString()}(n.referenceValue):"geoPointValue"in n?function(e){return`geo(${e.latitude},${e.longitude})`}(n.geoPointValue):"arrayValue"in n?function(e){let r="[",s=!0;for(const o of e.values||[])s?s=!1:r+=",",r+=Ys(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(e){const r=Object.keys(e.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${Ys(e.fields[a])}`;return s+"}"}(n.mapValue):M(61005,{value:n})}function vr(n){switch(pe(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=Yr(n);return t?16+vr(t):16;case 5:return 2*n.stringValue.length;case 6:return me(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((s,o)=>s+vr(o),0)}(n.arrayValue);case 10:case 11:return function(r){let s=0;return Ee(r.fields,(o,a)=>{s+=o.length+vr(a)}),s}(n.mapValue);default:throw M(13486,{value:n})}}function La(n,t){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${t.path.canonicalString()}`}}function Js(n){return!!n&&"integerValue"in n}function vi(n){return!!n&&"arrayValue"in n}function Fa(n){return!!n&&"nullValue"in n}function Ua(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Rr(n){return!!n&&"mapValue"in n}function id(n){var e,r;return((r=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[rc])==null?void 0:r.stringValue)===sc}function Vn(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const t={mapValue:{fields:{}}};return Ee(n.mapValue.fields,(e,r)=>t.mapValue.fields[e]=Vn(r)),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=Vn(n.arrayValue.values[e]);return t}return{...n}}function od(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===sd}/**
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
 */class St{constructor(t){this.value=t}static empty(){return new St({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let r=0;r<t.length-1;++r)if(e=(e.mapValue.fields||{})[t.get(r)],!Rr(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=Vn(e)}setAll(t){let e=Et.emptyPath(),r={},s=[];t.forEach((a,c)=>{if(!e.isImmediateParentOf(c)){const h=this.getFieldsMap(e);this.applyChanges(h,r,s),r={},s=[],e=c.popLast()}a?r[c.lastSegment()]=Vn(a):s.push(c.lastSegment())});const o=this.getFieldsMap(e);this.applyChanges(o,r,s)}delete(t){const e=this.field(t.popLast());Rr(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return Ht(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let r=0;r<t.length;++r){let s=e.mapValue.fields[t.get(r)];Rr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(r)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,r){Ee(e,(s,o)=>t[s]=o);for(const s of r)delete t[s]}clone(){return new St(Vn(this.value))}}function ic(n){const t=[];return Ee(n.fields,(e,r)=>{const s=new Et([e]);if(Rr(r)){const o=ic(r.mapValue).fields;if(o.length===0)t.push(s);else for(const a of o)t.push(s.child(a))}else t.push(s)}),new kt(t)}/**
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
 */class gt{constructor(t,e,r,s,o,a,c){this.key=t,this.documentType=e,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=c}static newInvalidDocument(t){return new gt(t,0,L.min(),L.min(),L.min(),St.empty(),0)}static newFoundDocument(t,e,r,s){return new gt(t,1,e,L.min(),r,s,0)}static newNoDocument(t,e){return new gt(t,2,e,L.min(),L.min(),St.empty(),0)}static newUnknownDocument(t,e){return new gt(t,3,e,L.min(),L.min(),St.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(L.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=St.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=St.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=L.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof gt&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new gt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class xr{constructor(t,e){this.position=t,this.inclusive=e}}function Ba(n,t,e){let r=0;for(let s=0;s<n.position.length;s++){const o=t[s],a=n.position[s];if(o.field.isKeyField()?r=x.comparator(x.fromName(a.referenceValue),e.key):r=Xe(a,e.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function qa(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!Ht(n.position[e],t.position[e]))return!1;return!0}/**
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
 */class qn{constructor(t,e="asc"){this.field=t,this.dir=e}}function ad(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
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
 */class oc{}class at extends oc{constructor(t,e,r){super(),this.field=t,this.op=e,this.value=r}static create(t,e,r){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,r):new cd(t,e,r):e==="array-contains"?new fd(t,r):e==="in"?new dd(t,r):e==="not-in"?new md(t,r):e==="array-contains-any"?new pd(t,r):new at(t,e,r)}static createKeyFieldInFilter(t,e,r){return e==="in"?new ld(t,r):new hd(t,r)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(Xe(e,this.value)):e!==null&&pe(this.value)===pe(e)&&this.matchesComparison(Xe(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return M(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Lt extends oc{constructor(t,e){super(),this.filters=t,this.op=e,this.Pe=null}static create(t,e){return new Lt(t,e)}matches(t){return ac(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function ac(n){return n.op==="and"}function uc(n){return ud(n)&&ac(n)}function ud(n){for(const t of n.filters)if(t instanceof Lt)return!1;return!0}function Zs(n){if(n instanceof at)return n.field.canonicalString()+n.op.toString()+Ye(n.value);if(uc(n))return n.filters.map(t=>Zs(t)).join(",");{const t=n.filters.map(e=>Zs(e)).join(",");return`${n.op}(${t})`}}function cc(n,t){return n instanceof at?function(r,s){return s instanceof at&&r.op===s.op&&r.field.isEqual(s.field)&&Ht(r.value,s.value)}(n,t):n instanceof Lt?function(r,s){return s instanceof Lt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,c)=>o&&cc(a,s.filters[c]),!0):!1}(n,t):void M(19439)}function lc(n){return n instanceof at?function(e){return`${e.field.canonicalString()} ${e.op} ${Ye(e.value)}`}(n):n instanceof Lt?function(e){return e.op.toString()+" {"+e.getFilters().map(lc).join(" ,")+"}"}(n):"Filter"}class cd extends at{constructor(t,e,r){super(t,e,r),this.key=x.fromName(r.referenceValue)}matches(t){const e=x.comparator(t.key,this.key);return this.matchesComparison(e)}}class ld extends at{constructor(t,e){super(t,"in",e),this.keys=hc("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class hd extends at{constructor(t,e){super(t,"not-in",e),this.keys=hc("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function hc(n,t){var e;return(((e=t.arrayValue)==null?void 0:e.values)||[]).map(r=>x.fromName(r.referenceValue))}class fd extends at{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return vi(e)&&Bn(e.arrayValue,this.value)}}class dd extends at{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Bn(this.value.arrayValue,e)}}class md extends at{constructor(t,e){super(t,"not-in",e)}matches(t){if(Bn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!Bn(this.value.arrayValue,e)}}class pd extends at{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!vi(e)||!e.arrayValue.values)&&e.arrayValue.values.some(r=>Bn(this.value.arrayValue,r))}}/**
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
 */class gd{constructor(t,e=null,r=[],s=[],o=null,a=null,c=null){this.path=t,this.collectionGroup=e,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=c,this.Te=null}}function ja(n,t=null,e=[],r=[],s=null,o=null,a=null){return new gd(n,t,e,r,s,o,a)}function Ri(n){const t=F(n);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(r=>Zs(r)).join(","),e+="|ob:",e+=t.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),Hn(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(r=>Ye(r)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(r=>Ye(r)).join(",")),t.Te=e}return t.Te}function bi(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!ad(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!cc(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!qa(n.startAt,t.startAt)&&qa(n.endAt,t.endAt)}function ti(n){return x.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class sn{constructor(t,e=null,r=[],s=[],o=null,a="F",c=null,h=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=c,this.endAt=h,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function _d(n,t,e,r,s,o,a,c){return new sn(n,t,e,r,s,o,a,c)}function Jr(n){return new sn(n)}function $a(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function fc(n){return n.collectionGroup!==null}function Dn(n){const t=F(n);if(t.Ie===null){t.Ie=[];const e=new Set;for(const o of t.explicitOrderBy)t.Ie.push(o),e.add(o.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new ft(Et.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(f=>{f.isInequality()&&(c=c.add(f.field))})}),c})(t).forEach(o=>{e.has(o.canonicalString())||o.isKeyField()||t.Ie.push(new qn(o,r))}),e.has(Et.keyField().canonicalString())||t.Ie.push(new qn(Et.keyField(),r))}return t.Ie}function $t(n){const t=F(n);return t.Ee||(t.Ee=yd(t,Dn(n))),t.Ee}function yd(n,t){if(n.limitType==="F")return ja(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new qn(s.field,o)});const e=n.endAt?new xr(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new xr(n.startAt.position,n.startAt.inclusive):null;return ja(n.path,n.collectionGroup,t,n.filters,n.limit,e,r)}}function ei(n,t){const e=n.filters.concat([t]);return new sn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),e,n.limit,n.limitType,n.startAt,n.endAt)}function Mr(n,t,e){return new sn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function Zr(n,t){return bi($t(n),$t(t))&&n.limitType===t.limitType}function dc(n){return`${Ri($t(n))}|lt:${n.limitType}`}function je(n){return`Query(target=${function(e){let r=e.path.canonicalString();return e.collectionGroup!==null&&(r+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(r+=`, filters: [${e.filters.map(s=>lc(s)).join(", ")}]`),Hn(e.limit)||(r+=", limit: "+e.limit),e.orderBy.length>0&&(r+=`, orderBy: [${e.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),e.startAt&&(r+=", startAt: ",r+=e.startAt.inclusive?"b:":"a:",r+=e.startAt.position.map(s=>Ye(s)).join(",")),e.endAt&&(r+=", endAt: ",r+=e.endAt.inclusive?"a:":"b:",r+=e.endAt.position.map(s=>Ye(s)).join(",")),`Target(${r})`}($t(n))}; limitType=${n.limitType})`}function ts(n,t){return t.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):x.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,t)&&function(r,s){for(const o of Dn(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,t)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,t)&&function(r,s){return!(r.startAt&&!function(a,c,h){const f=Ba(a,c,h);return a.inclusive?f<=0:f<0}(r.startAt,Dn(r),s)||r.endAt&&!function(a,c,h){const f=Ba(a,c,h);return a.inclusive?f>=0:f>0}(r.endAt,Dn(r),s))}(n,t)}function Ed(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function mc(n){return(t,e)=>{let r=!1;for(const s of Dn(n)){const o=Td(s,t,e);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function Td(n,t,e){const r=n.field.isKeyField()?x.comparator(t.key,e.key):function(o,a,c){const h=a.data.field(o),f=c.data.field(o);return h!==null&&f!==null?Xe(h,f):M(42886)}(n.field,t,e);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return M(19790,{direction:n.dir})}}/**
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
 */class xe{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,t))return o}}has(t){return this.get(t)!==void 0}set(t,e){const r=this.mapKeyFn(t),s=this.inner[r];if(s===void 0)return this.inner[r]=[[t,e]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],t))return void(s[o]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return r.length===1?delete this.inner[e]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(t){Ee(this.inner,(e,r)=>{for(const[s,o]of r)t(s,o)})}isEmpty(){return Yu(this.inner)}size(){return this.innerSize}}/**
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
 */const wd=new et(x.comparator);function Yt(){return wd}const pc=new et(x.comparator);function Sn(...n){let t=pc;for(const e of n)t=t.insert(e.key,e);return t}function gc(n){let t=pc;return n.forEach((e,r)=>t=t.insert(e,r.overlayedDocument)),t}function Ce(){return Nn()}function _c(){return Nn()}function Nn(){return new xe(n=>n.toString(),(n,t)=>n.isEqual(t))}const Id=new et(x.comparator),Ad=new ft(x.comparator);function z(...n){let t=Ad;for(const e of n)t=t.add(e);return t}const vd=new ft($);function Rd(){return vd}/**
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
 */function Si(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Nr(t)?"-0":t}}function yc(n){return{integerValue:""+n}}function bd(n,t){return Zf(t)?yc(t):Si(n,t)}/**
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
 */class es{constructor(){this._=void 0}}function Sd(n,t,e){return n instanceof jn?function(s,o){const a={fields:{[tc]:{stringValue:Zu},[nc]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Ai(o)&&(o=Yr(o)),o&&(a.fields[ec]=o),{mapValue:a}}(e,t):n instanceof $n?Tc(n,t):n instanceof zn?wc(n,t):function(s,o){const a=Ec(s,o),c=za(a)+za(s.Ae);return Js(a)&&Js(s.Ae)?yc(c):Si(s.serializer,c)}(n,t)}function Cd(n,t,e){return n instanceof $n?Tc(n,t):n instanceof zn?wc(n,t):e}function Ec(n,t){return n instanceof Lr?function(r){return Js(r)||function(o){return!!o&&"doubleValue"in o}(r)}(t)?t:{integerValue:0}:null}class jn extends es{}class $n extends es{constructor(t){super(),this.elements=t}}function Tc(n,t){const e=Ic(t);for(const r of n.elements)e.some(s=>Ht(s,r))||e.push(r);return{arrayValue:{values:e}}}class zn extends es{constructor(t){super(),this.elements=t}}function wc(n,t){let e=Ic(t);for(const r of n.elements)e=e.filter(s=>!Ht(s,r));return{arrayValue:{values:e}}}class Lr extends es{constructor(t,e){super(),this.serializer=t,this.Ae=e}}function za(n){return it(n.integerValue||n.doubleValue)}function Ic(n){return vi(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
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
 */class Pd{constructor(t,e){this.field=t,this.transform=e}}function Vd(n,t){return n.field.isEqual(t.field)&&function(r,s){return r instanceof $n&&s instanceof $n||r instanceof zn&&s instanceof zn?Qe(r.elements,s.elements,Ht):r instanceof Lr&&s instanceof Lr?Ht(r.Ae,s.Ae):r instanceof jn&&s instanceof jn}(n.transform,t.transform)}class Dd{constructor(t,e){this.version=t,this.transformResults=e}}class ut{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new ut}static exists(t){return new ut(void 0,t)}static updateTime(t){return new ut(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function br(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class ns{}function Ac(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new Wn(n.key,ut.none()):new Kn(n.key,n.data,ut.none());{const e=n.data,r=St.empty();let s=new ft(Et.comparator);for(let o of t.fields)if(!s.has(o)){let a=e.field(o);a===null&&o.length>1&&(o=o.popLast(),a=e.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new Te(n.key,r,new kt(s.toArray()),ut.none())}}function Nd(n,t,e){n instanceof Kn?function(s,o,a){const c=s.value.clone(),h=Ha(s.fieldTransforms,o,a.transformResults);c.setAll(h),o.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,t,e):n instanceof Te?function(s,o,a){if(!br(s.precondition,o))return void o.convertToUnknownDocument(a.version);const c=Ha(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(vc(s)),h.setAll(c),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,t,e):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,t,e)}function kn(n,t,e,r){return n instanceof Kn?function(o,a,c,h){if(!br(o.precondition,a))return c;const f=o.value.clone(),m=Ka(o.fieldTransforms,h,a);return f.setAll(m),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),null}(n,t,e,r):n instanceof Te?function(o,a,c,h){if(!br(o.precondition,a))return c;const f=Ka(o.fieldTransforms,h,a),m=a.data;return m.setAll(vc(o)),m.setAll(f),a.convertToFoundDocument(a.version,m).setHasLocalMutations(),c===null?null:c.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(g=>g.field))}(n,t,e,r):function(o,a,c){return br(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c}(n,t,e)}function kd(n,t){let e=null;for(const r of n.fieldTransforms){const s=t.data.field(r.field),o=Ec(r.transform,s||null);o!=null&&(e===null&&(e=St.empty()),e.set(r.field,o))}return e||null}function Ga(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Qe(r,s,(o,a)=>Vd(o,a))}(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class Kn extends ns{constructor(t,e,r,s=[]){super(),this.key=t,this.value=e,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Te extends ns{constructor(t,e,r,s,o=[]){super(),this.key=t,this.data=e,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function vc(n){const t=new Map;return n.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const r=n.data.field(e);t.set(e,r)}}),t}function Ha(n,t,e){const r=new Map;K(n.length===e.length,32656,{Re:e.length,Ve:n.length});for(let s=0;s<e.length;s++){const o=n[s],a=o.transform,c=t.data.field(o.field);r.set(o.field,Cd(a,c,e[s]))}return r}function Ka(n,t,e){const r=new Map;for(const s of n){const o=s.transform,a=e.data.field(s.field);r.set(s.field,Sd(o,a,t))}return r}class Wn extends ns{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Rc extends ns{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class Od{constructor(t,e,r,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(t,e){const r=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(t.key)&&Nd(o,t,r[s])}}applyToLocalView(t,e){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(e=kn(r,t,e,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(e=kn(r,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const r=_c();return this.mutations.forEach(s=>{const o=t.get(s.key),a=o.overlayedDocument;let c=this.applyToLocalView(a,o.mutatedFields);c=e.has(s.key)?null:c;const h=Ac(a,c);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(L.min())}),r}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),z())}isEqual(t){return this.batchId===t.batchId&&Qe(this.mutations,t.mutations,(e,r)=>Ga(e,r))&&Qe(this.baseMutations,t.baseMutations,(e,r)=>Ga(e,r))}}class Ci{constructor(t,e,r,s){this.batch=t,this.commitVersion=e,this.mutationResults=r,this.docVersions=s}static from(t,e,r){K(t.mutations.length===r.length,58842,{me:t.mutations.length,fe:r.length});let s=function(){return Id}();const o=t.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new Ci(t,e,r,s)}}/**
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
 */class xd{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
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
 */class Md{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
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
 */var ot,G;function bc(n){switch(n){case S.OK:return M(64938);case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0;default:return M(15467,{code:n})}}function Sc(n){if(n===void 0)return Xt("GRPC error has no .code"),S.UNKNOWN;switch(n){case ot.OK:return S.OK;case ot.CANCELLED:return S.CANCELLED;case ot.UNKNOWN:return S.UNKNOWN;case ot.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case ot.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case ot.INTERNAL:return S.INTERNAL;case ot.UNAVAILABLE:return S.UNAVAILABLE;case ot.UNAUTHENTICATED:return S.UNAUTHENTICATED;case ot.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case ot.NOT_FOUND:return S.NOT_FOUND;case ot.ALREADY_EXISTS:return S.ALREADY_EXISTS;case ot.PERMISSION_DENIED:return S.PERMISSION_DENIED;case ot.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case ot.ABORTED:return S.ABORTED;case ot.OUT_OF_RANGE:return S.OUT_OF_RANGE;case ot.UNIMPLEMENTED:return S.UNIMPLEMENTED;case ot.DATA_LOSS:return S.DATA_LOSS;default:return M(39323,{code:n})}}(G=ot||(ot={}))[G.OK=0]="OK",G[G.CANCELLED=1]="CANCELLED",G[G.UNKNOWN=2]="UNKNOWN",G[G.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",G[G.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",G[G.NOT_FOUND=5]="NOT_FOUND",G[G.ALREADY_EXISTS=6]="ALREADY_EXISTS",G[G.PERMISSION_DENIED=7]="PERMISSION_DENIED",G[G.UNAUTHENTICATED=16]="UNAUTHENTICATED",G[G.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",G[G.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",G[G.ABORTED=10]="ABORTED",G[G.OUT_OF_RANGE=11]="OUT_OF_RANGE",G[G.UNIMPLEMENTED=12]="UNIMPLEMENTED",G[G.INTERNAL=13]="INTERNAL",G[G.UNAVAILABLE=14]="UNAVAILABLE",G[G.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function Ld(){return new TextEncoder}/**
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
 */const Fd=new ue([4294967295,4294967295],0);function Wa(n){const t=Ld().encode(n),e=new Bu;return e.update(t),new Uint8Array(e.digest())}function Qa(n){const t=new DataView(n.buffer),e=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),o=t.getUint32(12,!0);return[new ue([e,r],0),new ue([s,o],0)]}class Pi{constructor(t,e,r){if(this.bitmap=t,this.padding=e,this.hashCount=r,e<0||e>=8)throw new Cn(`Invalid padding: ${e}`);if(r<0)throw new Cn(`Invalid hash count: ${r}`);if(t.length>0&&this.hashCount===0)throw new Cn(`Invalid hash count: ${r}`);if(t.length===0&&e!==0)throw new Cn(`Invalid padding when bitmap length is 0: ${e}`);this.ge=8*t.length-e,this.pe=ue.fromNumber(this.ge)}ye(t,e,r){let s=t.add(e.multiply(ue.fromNumber(r)));return s.compare(Fd)===1&&(s=new ue([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.ge===0)return!1;const e=Wa(t),[r,s]=Qa(e);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);if(!this.we(a))return!1}return!0}static create(t,e,r){const s=t%8==0?0:8-t%8,o=new Uint8Array(Math.ceil(t/8)),a=new Pi(o,s,e);return r.forEach(c=>a.insert(c)),a}insert(t){if(this.ge===0)return;const e=Wa(t),[r,s]=Qa(e);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);this.Se(a)}}Se(t){const e=Math.floor(t/8),r=t%8;this.bitmap[e]|=1<<r}}class Cn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class rs{constructor(t,e,r,s,o){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(t,e,r){const s=new Map;return s.set(t,Qn.createSynthesizedTargetChangeForCurrentChange(t,e,r)),new rs(L.min(),s,new et($),Yt(),z())}}class Qn{constructor(t,e,r,s,o){this.resumeToken=t,this.current=e,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(t,e,r){return new Qn(r,e,z(),z(),z())}}/**
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
 */class Sr{constructor(t,e,r,s){this.be=t,this.removedTargetIds=e,this.key=r,this.De=s}}class Cc{constructor(t,e){this.targetId=t,this.Ce=e}}class Pc{constructor(t,e,r=Tt.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=r,this.cause=s}}class Xa{constructor(){this.ve=0,this.Fe=Ya(),this.Me=Tt.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(t){t.approximateByteSize()>0&&(this.Oe=!0,this.Me=t)}ke(){let t=z(),e=z(),r=z();return this.Fe.forEach((s,o)=>{switch(o){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:r=r.add(s);break;default:M(38017,{changeType:o})}}),new Qn(this.Me,this.xe,t,e,r)}qe(){this.Oe=!1,this.Fe=Ya()}Qe(t,e){this.Oe=!0,this.Fe=this.Fe.insert(t,e)}$e(t){this.Oe=!0,this.Fe=this.Fe.remove(t)}Ue(){this.ve+=1}Ke(){this.ve-=1,K(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class Ud{constructor(t){this.Ge=t,this.ze=new Map,this.je=Yt(),this.Je=Er(),this.He=Er(),this.Ye=new et($)}Ze(t){for(const e of t.be)t.De&&t.De.isFoundDocument()?this.Xe(e,t.De):this.et(e,t.key,t.De);for(const e of t.removedTargetIds)this.et(e,t.key,t.De)}tt(t){this.forEachTarget(t,e=>{const r=this.nt(e);switch(t.state){case 0:this.rt(e)&&r.Le(t.resumeToken);break;case 1:r.Ke(),r.Ne||r.qe(),r.Le(t.resumeToken);break;case 2:r.Ke(),r.Ne||this.removeTarget(e);break;case 3:this.rt(e)&&(r.We(),r.Le(t.resumeToken));break;case 4:this.rt(e)&&(this.it(e),r.Le(t.resumeToken));break;default:M(56790,{state:t.state})}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.ze.forEach((r,s)=>{this.rt(s)&&e(s)})}st(t){const e=t.targetId,r=t.Ce.count,s=this.ot(e);if(s){const o=s.target;if(ti(o))if(r===0){const a=new x(o.path);this.et(e,a,gt.newNoDocument(a,L.min()))}else K(r===1,20013,{expectedCount:r});else{const a=this._t(e);if(a!==r){const c=this.ut(t),h=c?this.ct(c,t,a):1;if(h!==0){this.it(e);const f=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(e,f)}}}}}ut(t){const e=t.Ce.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=e;let a,c;try{a=me(r).toUint8Array()}catch(h){if(h instanceof Ju)return We("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{c=new Pi(a,s,o)}catch(h){return We(h instanceof Cn?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return c.ge===0?null:c}ct(t,e,r){return e.Ce.count===r-this.Pt(t,e.targetId)?0:2}Pt(t,e){const r=this.Ge.getRemoteKeysForTarget(e);let s=0;return r.forEach(o=>{const a=this.Ge.ht(),c=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;t.mightContain(c)||(this.et(e,o,null),s++)}),s}Tt(t){const e=new Map;this.ze.forEach((o,a)=>{const c=this.ot(a);if(c){if(o.current&&ti(c.target)){const h=new x(c.target.path);this.It(h).has(a)||this.Et(a,h)||this.et(a,h,gt.newNoDocument(h,t))}o.Be&&(e.set(a,o.ke()),o.qe())}});let r=z();this.He.forEach((o,a)=>{let c=!0;a.forEachWhile(h=>{const f=this.ot(h);return!f||f.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(r=r.add(o))}),this.je.forEach((o,a)=>a.setReadTime(t));const s=new rs(t,e,this.Ye,this.je,r);return this.je=Yt(),this.Je=Er(),this.He=Er(),this.Ye=new et($),s}Xe(t,e){if(!this.rt(t))return;const r=this.Et(t,e.key)?2:0;this.nt(t).Qe(e.key,r),this.je=this.je.insert(e.key,e),this.Je=this.Je.insert(e.key,this.It(e.key).add(t)),this.He=this.He.insert(e.key,this.dt(e.key).add(t))}et(t,e,r){if(!this.rt(t))return;const s=this.nt(t);this.Et(t,e)?s.Qe(e,1):s.$e(e),this.He=this.He.insert(e,this.dt(e).delete(t)),this.He=this.He.insert(e,this.dt(e).add(t)),r&&(this.je=this.je.insert(e,r))}removeTarget(t){this.ze.delete(t)}_t(t){const e=this.nt(t).ke();return this.Ge.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}Ue(t){this.nt(t).Ue()}nt(t){let e=this.ze.get(t);return e||(e=new Xa,this.ze.set(t,e)),e}dt(t){let e=this.He.get(t);return e||(e=new ft($),this.He=this.He.insert(t,e)),e}It(t){let e=this.Je.get(t);return e||(e=new ft($),this.Je=this.Je.insert(t,e)),e}rt(t){const e=this.ot(t)!==null;return e||O("WatchChangeAggregator","Detected inactive target",t),e}ot(t){const e=this.ze.get(t);return e&&e.Ne?null:this.Ge.At(t)}it(t){this.ze.set(t,new Xa),this.Ge.getRemoteKeysForTarget(t).forEach(e=>{this.et(t,e,null)})}Et(t,e){return this.Ge.getRemoteKeysForTarget(t).has(e)}}function Er(){return new et(x.comparator)}function Ya(){return new et(x.comparator)}const Bd={asc:"ASCENDING",desc:"DESCENDING"},qd={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},jd={and:"AND",or:"OR"};class $d{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function ni(n,t){return n.useProto3Json||Hn(t)?t:{value:t}}function Fr(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Vc(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function zd(n,t){return Fr(n,t.toTimestamp())}function xt(n){return K(!!n,49232),L.fromTimestamp(function(e){const r=de(e);return new J(r.seconds,r.nanos)}(n))}function Vi(n,t){return ri(n,t).canonicalString()}function ri(n,t){const e=function(s){return new Q(["projects",s.projectId,"databases",s.database])}(n).child("documents");return t===void 0?e:e.child(t)}function Dc(n){const t=Q.fromString(n);return K(Lc(t),10190,{key:t.toString()}),t}function Ur(n,t){return Vi(n.databaseId,t.path)}function On(n,t){const e=Dc(t);if(e.get(1)!==n.databaseId.projectId)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+n.databaseId.projectId);if(e.get(3)!==n.databaseId.database)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+n.databaseId.database);return new x(kc(e))}function Nc(n,t){return Vi(n.databaseId,t)}function Gd(n){const t=Dc(n);return t.length===4?Q.emptyPath():kc(t)}function si(n){return new Q(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function kc(n){return K(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Ja(n,t,e){return{name:Ur(n,t),fields:e.value.mapValue.fields}}function Hd(n,t){return"found"in t?function(r,s){K(!!s.found,43571),s.found.name,s.found.updateTime;const o=On(r,s.found.name),a=xt(s.found.updateTime),c=s.found.createTime?xt(s.found.createTime):L.min(),h=new St({mapValue:{fields:s.found.fields}});return gt.newFoundDocument(o,a,c,h)}(n,t):"missing"in t?function(r,s){K(!!s.missing,3894),K(!!s.readTime,22933);const o=On(r,s.missing),a=xt(s.readTime);return gt.newNoDocument(o,a)}(n,t):M(7234,{result:t})}function Kd(n,t){let e;if("targetChange"in t){t.targetChange;const r=function(f){return f==="NO_CHANGE"?0:f==="ADD"?1:f==="REMOVE"?2:f==="CURRENT"?3:f==="RESET"?4:M(39313,{state:f})}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],o=function(f,m){return f.useProto3Json?(K(m===void 0||typeof m=="string",58123),Tt.fromBase64String(m||"")):(K(m===void 0||m instanceof Buffer||m instanceof Uint8Array,16193),Tt.fromUint8Array(m||new Uint8Array))}(n,t.targetChange.resumeToken),a=t.targetChange.cause,c=a&&function(f){const m=f.code===void 0?S.UNKNOWN:Sc(f.code);return new N(m,f.message||"")}(a);e=new Pc(r,s,o,c||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=On(n,r.document.name),o=xt(r.document.updateTime),a=r.document.createTime?xt(r.document.createTime):L.min(),c=new St({mapValue:{fields:r.document.fields}}),h=gt.newFoundDocument(s,o,a,c),f=r.targetIds||[],m=r.removedTargetIds||[];e=new Sr(f,m,h.key,h)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=On(n,r.document),o=r.readTime?xt(r.readTime):L.min(),a=gt.newNoDocument(s,o),c=r.removedTargetIds||[];e=new Sr([],c,a.key,a)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=On(n,r.document),o=r.removedTargetIds||[];e=new Sr([],o,s,null)}else{if(!("filter"in t))return M(11601,{Rt:t});{t.filter;const r=t.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new Md(s,o),c=r.targetId;e=new Cc(c,a)}}return e}function Oc(n,t){let e;if(t instanceof Kn)e={update:Ja(n,t.key,t.value)};else if(t instanceof Wn)e={delete:Ur(n,t.key)};else if(t instanceof Te)e={update:Ja(n,t.key,t.data),updateMask:nm(t.fieldMask)};else{if(!(t instanceof Rc))return M(16599,{Vt:t.type});e={verify:Ur(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(r=>function(o,a){const c=a.transform;if(c instanceof jn)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof $n)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof zn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof Lr)return{fieldPath:a.field.canonicalString(),increment:c.Ae};throw M(20930,{transform:a.transform})}(0,r))),t.precondition.isNone||(e.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:zd(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:M(27497)}(n,t.precondition)),e}function Wd(n,t){return n&&n.length>0?(K(t!==void 0,14353),n.map(e=>function(s,o){let a=s.updateTime?xt(s.updateTime):xt(o);return a.isEqual(L.min())&&(a=xt(o)),new Dd(a,s.transformResults||[])}(e,t))):[]}function Qd(n,t){return{documents:[Nc(n,t.path)]}}function Xd(n,t){const e={structuredQuery:{}},r=t.path;let s;t.collectionGroup!==null?(s=r,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),e.structuredQuery.from=[{collectionId:r.lastSegment()}]),e.parent=Nc(n,s);const o=function(f){if(f.length!==0)return Mc(Lt.create(f,"and"))}(t.filters);o&&(e.structuredQuery.where=o);const a=function(f){if(f.length!==0)return f.map(m=>function(E){return{field:$e(E.field),direction:Zd(E.dir)}}(m))}(t.orderBy);a&&(e.structuredQuery.orderBy=a);const c=ni(n,t.limit);return c!==null&&(e.structuredQuery.limit=c),t.startAt&&(e.structuredQuery.startAt=function(f){return{before:f.inclusive,values:f.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(f){return{before:!f.inclusive,values:f.position}}(t.endAt)),{ft:e,parent:s}}function Yd(n){let t=Gd(n.parent);const e=n.structuredQuery,r=e.from?e.from.length:0;let s=null;if(r>0){K(r===1,65062);const m=e.from[0];m.allDescendants?s=m.collectionId:t=t.child(m.collectionId)}let o=[];e.where&&(o=function(g){const E=xc(g);return E instanceof Lt&&uc(E)?E.getFilters():[E]}(e.where));let a=[];e.orderBy&&(a=function(g){return g.map(E=>function(V){return new qn(ze(V.field),function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(V.direction))}(E))}(e.orderBy));let c=null;e.limit&&(c=function(g){let E;return E=typeof g=="object"?g.value:g,Hn(E)?null:E}(e.limit));let h=null;e.startAt&&(h=function(g){const E=!!g.before,b=g.values||[];return new xr(b,E)}(e.startAt));let f=null;return e.endAt&&(f=function(g){const E=!g.before,b=g.values||[];return new xr(b,E)}(e.endAt)),_d(t,s,a,o,c,"F",h,f)}function Jd(n,t){const e=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M(28987,{purpose:s})}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function xc(n){return n.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const r=ze(e.unaryFilter.field);return at.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=ze(e.unaryFilter.field);return at.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=ze(e.unaryFilter.field);return at.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=ze(e.unaryFilter.field);return at.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return M(61313);default:return M(60726)}}(n):n.fieldFilter!==void 0?function(e){return at.create(ze(e.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return M(58110);default:return M(50506)}}(e.fieldFilter.op),e.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(e){return Lt.create(e.compositeFilter.filters.map(r=>xc(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return M(1026)}}(e.compositeFilter.op))}(n):M(30097,{filter:n})}function Zd(n){return Bd[n]}function tm(n){return qd[n]}function em(n){return jd[n]}function $e(n){return{fieldPath:n.canonicalString()}}function ze(n){return Et.fromServerFormat(n.fieldPath)}function Mc(n){return n instanceof at?function(e){if(e.op==="=="){if(Ua(e.value))return{unaryFilter:{field:$e(e.field),op:"IS_NAN"}};if(Fa(e.value))return{unaryFilter:{field:$e(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(Ua(e.value))return{unaryFilter:{field:$e(e.field),op:"IS_NOT_NAN"}};if(Fa(e.value))return{unaryFilter:{field:$e(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:$e(e.field),op:tm(e.op),value:e.value}}}(n):n instanceof Lt?function(e){const r=e.getFilters().map(s=>Mc(s));return r.length===1?r[0]:{compositeFilter:{op:em(e.op),filters:r}}}(n):M(54877,{filter:n})}function nm(n){const t=[];return n.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Lc(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class ie{constructor(t,e,r,s,o=L.min(),a=L.min(),c=Tt.EMPTY_BYTE_STRING,h=null){this.target=t,this.targetId=e,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=h}withSequenceNumber(t){return new ie(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new ie(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new ie(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new ie(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
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
 */class rm{constructor(t){this.yt=t}}function sm(n){const t=Yd({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Mr(t,t.limit,"L"):t}/**
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
 */class im{constructor(){this.Cn=new om}addToCollectionParentIndex(t,e){return this.Cn.add(e),C.resolve()}getCollectionParents(t,e){return C.resolve(this.Cn.getEntries(e))}addFieldIndex(t,e){return C.resolve()}deleteFieldIndex(t,e){return C.resolve()}deleteAllFieldIndexes(t){return C.resolve()}createTargetIndexes(t,e){return C.resolve()}getDocumentsMatchingTarget(t,e){return C.resolve(null)}getIndexType(t,e){return C.resolve(0)}getFieldIndexes(t,e){return C.resolve([])}getNextCollectionGroupToUpdate(t){return C.resolve(null)}getMinOffset(t,e){return C.resolve(fe.min())}getMinOffsetFromCollectionGroup(t,e){return C.resolve(fe.min())}updateCollectionGroup(t,e,r){return C.resolve()}updateIndexEntries(t,e){return C.resolve()}}class om{constructor(){this.index={}}add(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e]||new ft(Q.comparator),o=!s.has(r);return this.index[e]=s.add(r),o}has(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e];return s&&s.has(r)}getEntries(t){return(this.index[t]||new ft(Q.comparator)).toArray()}}/**
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
 */const Za={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Fc=41943040;class Pt{static withCacheSize(t){return new Pt(t,Pt.DEFAULT_COLLECTION_PERCENTILE,Pt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,r){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=r}}/**
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
 */Pt.DEFAULT_COLLECTION_PERCENTILE=10,Pt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Pt.DEFAULT=new Pt(Fc,Pt.DEFAULT_COLLECTION_PERCENTILE,Pt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Pt.DISABLED=new Pt(-1,0,0);/**
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
 */class Je{constructor(t){this.ar=t}next(){return this.ar+=2,this.ar}static ur(){return new Je(0)}static cr(){return new Je(-1)}}/**
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
 */const tu="LruGarbageCollector",am=1048576;function eu([n,t],[e,r]){const s=$(n,e);return s===0?$(t,r):s}class um{constructor(t){this.Ir=t,this.buffer=new ft(eu),this.Er=0}dr(){return++this.Er}Ar(t){const e=[t,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(e);else{const r=this.buffer.last();eu(e,r)<0&&(this.buffer=this.buffer.delete(r).add(e))}}get maxValue(){return this.buffer.last()[0]}}class cm{constructor(t,e,r){this.garbageCollector=t,this.asyncQueue=e,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(t){O(tu,`Garbage collection scheduled in ${t}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){rn(e)?O(tu,"Ignoring IndexedDB error during garbage collection: ",e):await nn(e)}await this.Vr(3e5)})}}class lm{constructor(t,e){this.mr=t,this.params=e}calculateTargetCount(t,e){return this.mr.gr(t).next(r=>Math.floor(e/100*r))}nthSequenceNumber(t,e){if(e===0)return C.resolve(Xr.ce);const r=new um(e);return this.mr.forEachTarget(t,s=>r.Ar(s.sequenceNumber)).next(()=>this.mr.pr(t,s=>r.Ar(s))).next(()=>r.maxValue)}removeTargets(t,e,r){return this.mr.removeTargets(t,e,r)}removeOrphanedDocuments(t,e){return this.mr.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(O("LruGarbageCollector","Garbage collection skipped; disabled"),C.resolve(Za)):this.getCacheSize(t).next(r=>r<this.params.cacheSizeCollectionThreshold?(O("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Za):this.yr(t,e))}getCacheSize(t){return this.mr.getCacheSize(t)}yr(t,e){let r,s,o,a,c,h,f;const m=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next(g=>(g>this.params.maximumSequenceNumbersToCollect?(O("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${g}`),s=this.params.maximumSequenceNumbersToCollect):s=g,a=Date.now(),this.nthSequenceNumber(t,s))).next(g=>(r=g,c=Date.now(),this.removeTargets(t,r,e))).next(g=>(o=g,h=Date.now(),this.removeOrphanedDocuments(t,r))).next(g=>(f=Date.now(),qe()<=H.DEBUG&&O("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-m}ms
	Determined least recently used ${s} in `+(c-a)+`ms
	Removed ${o} targets in `+(h-c)+`ms
	Removed ${g} documents in `+(f-h)+`ms
Total Duration: ${f-m}ms`),C.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:g})))}}function hm(n,t){return new lm(n,t)}/**
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
 */class fm{constructor(){this.changes=new xe(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,gt.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const r=this.changes.get(e);return r!==void 0?C.resolve(r):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
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
 */class dm{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
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
 */class mm{constructor(t,e,r,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=r,this.indexManager=s}getDocument(t,e){let r=null;return this.documentOverlayCache.getOverlay(t,e).next(s=>(r=s,this.remoteDocumentCache.getEntry(t,e))).next(s=>(r!==null&&kn(r.mutation,s,kt.empty(),J.now()),s))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.getLocalViewOfDocuments(t,r,z()).next(()=>r))}getLocalViewOfDocuments(t,e,r=z()){const s=Ce();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,r).next(o=>{let a=Sn();return o.forEach((c,h)=>{a=a.insert(c,h.overlayedDocument)}),a}))}getOverlayedDocuments(t,e){const r=Ce();return this.populateOverlays(t,r,e).next(()=>this.computeViews(t,e,r,z()))}populateOverlays(t,e,r){const s=[];return r.forEach(o=>{e.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(t,s).next(o=>{o.forEach((a,c)=>{e.set(a,c)})})}computeViews(t,e,r,s){let o=Yt();const a=Nn(),c=function(){return Nn()}();return e.forEach((h,f)=>{const m=r.get(f.key);s.has(f.key)&&(m===void 0||m.mutation instanceof Te)?o=o.insert(f.key,f):m!==void 0?(a.set(f.key,m.mutation.getFieldMask()),kn(m.mutation,f,m.mutation.getFieldMask(),J.now())):a.set(f.key,kt.empty())}),this.recalculateAndSaveOverlays(t,o).next(h=>(h.forEach((f,m)=>a.set(f,m)),e.forEach((f,m)=>c.set(f,new dm(m,a.get(f)??null))),c))}recalculateAndSaveOverlays(t,e){const r=Nn();let s=new et((a,c)=>a-c),o=z();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(a=>{for(const c of a)c.keys().forEach(h=>{const f=e.get(h);if(f===null)return;let m=r.get(h)||kt.empty();m=c.applyToLocalView(f,m),r.set(h,m);const g=(s.get(c.batchId)||z()).add(h);s=s.insert(c.batchId,g)})}).next(()=>{const a=[],c=s.getReverseIterator();for(;c.hasNext();){const h=c.getNext(),f=h.key,m=h.value,g=_c();m.forEach(E=>{if(!o.has(E)){const b=Ac(e.get(E),r.get(E));b!==null&&g.set(E,b),o=o.add(E)}}),a.push(this.documentOverlayCache.saveOverlays(t,f,g))}return C.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.recalculateAndSaveOverlays(t,r))}getDocumentsMatchingQuery(t,e,r,s){return function(a){return x.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):fc(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,r,s):this.getDocumentsMatchingCollectionQuery(t,e,r,s)}getNextDocuments(t,e,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,r.largestBatchId,s-o.size):C.resolve(Ce());let c=Ln,h=o;return a.next(f=>C.forEach(f,(m,g)=>(c<g.largestBatchId&&(c=g.largestBatchId),o.get(m)?C.resolve():this.remoteDocumentCache.getEntry(t,m).next(E=>{h=h.insert(m,E)}))).next(()=>this.populateOverlays(t,f,o)).next(()=>this.computeViews(t,h,f,z())).next(m=>({batchId:c,changes:gc(m)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new x(e)).next(r=>{let s=Sn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(t,e,r,s){const o=e.collectionGroup;let a=Sn();return this.indexManager.getCollectionParents(t,o).next(c=>C.forEach(c,h=>{const f=function(g,E){return new sn(E,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)}(e,h.child(o));return this.getDocumentsMatchingCollectionQuery(t,f,r,s).next(m=>{m.forEach((g,E)=>{a=a.insert(g,E)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(t,e,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,r,o,s))).next(a=>{o.forEach((h,f)=>{const m=f.getKey();a.get(m)===null&&(a=a.insert(m,gt.newInvalidDocument(m)))});let c=Sn();return a.forEach((h,f)=>{const m=o.get(h);m!==void 0&&kn(m.mutation,f,kt.empty(),J.now()),ts(e,f)&&(c=c.insert(h,f))}),c})}}/**
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
 */class pm{constructor(t){this.serializer=t,this.Lr=new Map,this.kr=new Map}getBundleMetadata(t,e){return C.resolve(this.Lr.get(e))}saveBundleMetadata(t,e){return this.Lr.set(e.id,function(s){return{id:s.id,version:s.version,createTime:xt(s.createTime)}}(e)),C.resolve()}getNamedQuery(t,e){return C.resolve(this.kr.get(e))}saveNamedQuery(t,e){return this.kr.set(e.name,function(s){return{name:s.name,query:sm(s.bundledQuery),readTime:xt(s.readTime)}}(e)),C.resolve()}}/**
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
 */class gm{constructor(){this.overlays=new et(x.comparator),this.qr=new Map}getOverlay(t,e){return C.resolve(this.overlays.get(e))}getOverlays(t,e){const r=Ce();return C.forEach(e,s=>this.getOverlay(t,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(t,e,r){return r.forEach((s,o)=>{this.St(t,e,o)}),C.resolve()}removeOverlaysForBatchId(t,e,r){const s=this.qr.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.qr.delete(r)),C.resolve()}getOverlaysForCollection(t,e,r){const s=Ce(),o=e.length+1,a=new x(e.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const h=c.getNext().value,f=h.getKey();if(!e.isPrefixOf(f.path))break;f.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return C.resolve(s)}getOverlaysForCollectionGroup(t,e,r,s){let o=new et((f,m)=>f-m);const a=this.overlays.getIterator();for(;a.hasNext();){const f=a.getNext().value;if(f.getKey().getCollectionGroup()===e&&f.largestBatchId>r){let m=o.get(f.largestBatchId);m===null&&(m=Ce(),o=o.insert(f.largestBatchId,m)),m.set(f.getKey(),f)}}const c=Ce(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((f,m)=>c.set(f,m)),!(c.size()>=s)););return C.resolve(c)}St(t,e,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.qr.get(s.largestBatchId).delete(r.key);this.qr.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new xd(e,r));let o=this.qr.get(e);o===void 0&&(o=z(),this.qr.set(e,o)),this.qr.set(e,o.add(r.key))}}/**
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
 */class _m{constructor(){this.sessionToken=Tt.EMPTY_BYTE_STRING}getSessionToken(t){return C.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,C.resolve()}}/**
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
 */class Di{constructor(){this.Qr=new ft(pt.$r),this.Ur=new ft(pt.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(t,e){const r=new pt(t,e);this.Qr=this.Qr.add(r),this.Ur=this.Ur.add(r)}Wr(t,e){t.forEach(r=>this.addReference(r,e))}removeReference(t,e){this.Gr(new pt(t,e))}zr(t,e){t.forEach(r=>this.removeReference(r,e))}jr(t){const e=new x(new Q([])),r=new pt(e,t),s=new pt(e,t+1),o=[];return this.Ur.forEachInRange([r,s],a=>{this.Gr(a),o.push(a.key)}),o}Jr(){this.Qr.forEach(t=>this.Gr(t))}Gr(t){this.Qr=this.Qr.delete(t),this.Ur=this.Ur.delete(t)}Hr(t){const e=new x(new Q([])),r=new pt(e,t),s=new pt(e,t+1);let o=z();return this.Ur.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(t){const e=new pt(t,0),r=this.Qr.firstAfterOrEqual(e);return r!==null&&t.isEqual(r.key)}}class pt{constructor(t,e){this.key=t,this.Yr=e}static $r(t,e){return x.comparator(t.key,e.key)||$(t.Yr,e.Yr)}static Kr(t,e){return $(t.Yr,e.Yr)||x.comparator(t.key,e.key)}}/**
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
 */class ym{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.tr=1,this.Zr=new ft(pt.$r)}checkEmpty(t){return C.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,r,s){const o=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Od(o,e,r,s);this.mutationQueue.push(a);for(const c of s)this.Zr=this.Zr.add(new pt(c.key,o)),this.indexManager.addToCollectionParentIndex(t,c.key.path.popLast());return C.resolve(a)}lookupMutationBatch(t,e){return C.resolve(this.Xr(e))}getNextMutationBatchAfterBatchId(t,e){const r=e+1,s=this.ei(r),o=s<0?0:s;return C.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return C.resolve(this.mutationQueue.length===0?Ii:this.tr-1)}getAllMutationBatches(t){return C.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const r=new pt(e,0),s=new pt(e,Number.POSITIVE_INFINITY),o=[];return this.Zr.forEachInRange([r,s],a=>{const c=this.Xr(a.Yr);o.push(c)}),C.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(t,e){let r=new ft($);return e.forEach(s=>{const o=new pt(s,0),a=new pt(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([o,a],c=>{r=r.add(c.Yr)})}),C.resolve(this.ti(r))}getAllMutationBatchesAffectingQuery(t,e){const r=e.path,s=r.length+1;let o=r;x.isDocumentKey(o)||(o=o.child(""));const a=new pt(new x(o),0);let c=new ft($);return this.Zr.forEachWhile(h=>{const f=h.key.path;return!!r.isPrefixOf(f)&&(f.length===s&&(c=c.add(h.Yr)),!0)},a),C.resolve(this.ti(c))}ti(t){const e=[];return t.forEach(r=>{const s=this.Xr(r);s!==null&&e.push(s)}),e}removeMutationBatch(t,e){K(this.ni(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Zr;return C.forEach(e.mutations,s=>{const o=new pt(s.key,e.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.Zr=r})}ir(t){}containsKey(t,e){const r=new pt(e,0),s=this.Zr.firstAfterOrEqual(r);return C.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,C.resolve()}ni(t,e){return this.ei(t)}ei(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Xr(t){const e=this.ei(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
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
 */class Em{constructor(t){this.ri=t,this.docs=function(){return new et(x.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const r=e.key,s=this.docs.get(r),o=s?s.size:0,a=this.ri(e);return this.docs=this.docs.insert(r,{document:e.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const r=this.docs.get(e);return C.resolve(r?r.document.mutableCopy():gt.newInvalidDocument(e))}getEntries(t,e){let r=Yt();return e.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():gt.newInvalidDocument(s))}),C.resolve(r)}getDocumentsMatchingQuery(t,e,r,s){let o=Yt();const a=e.path,c=new x(a.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(c);for(;h.hasNext();){const{key:f,value:{document:m}}=h.getNext();if(!a.isPrefixOf(f.path))break;f.path.length>a.length+1||Qf(Wf(m),r)<=0||(s.has(m.key)||ts(e,m))&&(o=o.insert(m.key,m.mutableCopy()))}return C.resolve(o)}getAllFromCollectionGroup(t,e,r,s){M(9500)}ii(t,e){return C.forEach(this.docs,r=>e(r))}newChangeBuffer(t){return new Tm(this)}getSize(t){return C.resolve(this.size)}}class Tm extends fm{constructor(t){super(),this.Nr=t}applyChanges(t){const e=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?e.push(this.Nr.addEntry(t,s)):this.Nr.removeEntry(r)}),C.waitFor(e)}getFromCache(t,e){return this.Nr.getEntry(t,e)}getAllFromCache(t,e){return this.Nr.getEntries(t,e)}}/**
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
 */class wm{constructor(t){this.persistence=t,this.si=new xe(e=>Ri(e),bi),this.lastRemoteSnapshotVersion=L.min(),this.highestTargetId=0,this.oi=0,this._i=new Di,this.targetCount=0,this.ai=Je.ur()}forEachTarget(t,e){return this.si.forEach((r,s)=>e(s)),C.resolve()}getLastRemoteSnapshotVersion(t){return C.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return C.resolve(this.oi)}allocateTargetId(t){return this.highestTargetId=this.ai.next(),C.resolve(this.highestTargetId)}setTargetsMetadata(t,e,r){return r&&(this.lastRemoteSnapshotVersion=r),e>this.oi&&(this.oi=e),C.resolve()}Pr(t){this.si.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.ai=new Je(e),this.highestTargetId=e),t.sequenceNumber>this.oi&&(this.oi=t.sequenceNumber)}addTargetData(t,e){return this.Pr(e),this.targetCount+=1,C.resolve()}updateTargetData(t,e){return this.Pr(e),C.resolve()}removeTargetData(t,e){return this.si.delete(e.target),this._i.jr(e.targetId),this.targetCount-=1,C.resolve()}removeTargets(t,e,r){let s=0;const o=[];return this.si.forEach((a,c)=>{c.sequenceNumber<=e&&r.get(c.targetId)===null&&(this.si.delete(a),o.push(this.removeMatchingKeysForTargetId(t,c.targetId)),s++)}),C.waitFor(o).next(()=>s)}getTargetCount(t){return C.resolve(this.targetCount)}getTargetData(t,e){const r=this.si.get(e)||null;return C.resolve(r)}addMatchingKeys(t,e,r){return this._i.Wr(e,r),C.resolve()}removeMatchingKeys(t,e,r){this._i.zr(e,r);const s=this.persistence.referenceDelegate,o=[];return s&&e.forEach(a=>{o.push(s.markPotentiallyOrphaned(t,a))}),C.waitFor(o)}removeMatchingKeysForTargetId(t,e){return this._i.jr(e),C.resolve()}getMatchingKeysForTargetId(t,e){const r=this._i.Hr(e);return C.resolve(r)}containsKey(t,e){return C.resolve(this._i.containsKey(e))}}/**
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
 */class Uc{constructor(t,e){this.ui={},this.overlays={},this.ci=new Xr(0),this.li=!1,this.li=!0,this.hi=new _m,this.referenceDelegate=t(this),this.Pi=new wm(this),this.indexManager=new im,this.remoteDocumentCache=function(s){return new Em(s)}(r=>this.referenceDelegate.Ti(r)),this.serializer=new rm(e),this.Ii=new pm(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new gm,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let r=this.ui[t.toKey()];return r||(r=new ym(e,this.referenceDelegate),this.ui[t.toKey()]=r),r}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(t,e,r){O("MemoryPersistence","Starting transaction:",t);const s=new Im(this.ci.next());return this.referenceDelegate.Ei(),r(s).next(o=>this.referenceDelegate.di(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Ai(t,e){return C.or(Object.values(this.ui).map(r=>()=>r.containsKey(t,e)))}}class Im extends Yf{constructor(t){super(),this.currentSequenceNumber=t}}class Ni{constructor(t){this.persistence=t,this.Ri=new Di,this.Vi=null}static mi(t){return new Ni(t)}get fi(){if(this.Vi)return this.Vi;throw M(60996)}addReference(t,e,r){return this.Ri.addReference(r,e),this.fi.delete(r.toString()),C.resolve()}removeReference(t,e,r){return this.Ri.removeReference(r,e),this.fi.add(r.toString()),C.resolve()}markPotentiallyOrphaned(t,e){return this.fi.add(e.toString()),C.resolve()}removeTarget(t,e){this.Ri.jr(e.targetId).forEach(s=>this.fi.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,e.targetId).next(s=>{s.forEach(o=>this.fi.add(o.toString()))}).next(()=>r.removeTargetData(t,e))}Ei(){this.Vi=new Set}di(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return C.forEach(this.fi,r=>{const s=x.fromPath(r);return this.gi(t,s).next(o=>{o||e.removeEntry(s,L.min())})}).next(()=>(this.Vi=null,e.apply(t)))}updateLimboDocument(t,e){return this.gi(t,e).next(r=>{r?this.fi.delete(e.toString()):this.fi.add(e.toString())})}Ti(t){return 0}gi(t,e){return C.or([()=>C.resolve(this.Ri.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ai(t,e)])}}class Br{constructor(t,e){this.persistence=t,this.pi=new xe(r=>td(r.path),(r,s)=>r.isEqual(s)),this.garbageCollector=hm(this,e)}static mi(t,e){return new Br(t,e)}Ei(){}di(t){return C.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}gr(t){const e=this.wr(t);return this.persistence.getTargetCache().getTargetCount(t).next(r=>e.next(s=>r+s))}wr(t){let e=0;return this.pr(t,r=>{e++}).next(()=>e)}pr(t,e){return C.forEach(this.pi,(r,s)=>this.br(t,r,s).next(o=>o?C.resolve():e(s)))}removeTargets(t,e,r){return this.persistence.getTargetCache().removeTargets(t,e,r)}removeOrphanedDocuments(t,e){let r=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.ii(t,a=>this.br(t,a,e).next(c=>{c||(r++,o.removeEntry(a,L.min()))})).next(()=>o.apply(t)).next(()=>r)}markPotentiallyOrphaned(t,e){return this.pi.set(e,t.currentSequenceNumber),C.resolve()}removeTarget(t,e){const r=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,r)}addReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),C.resolve()}removeReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),C.resolve()}updateLimboDocument(t,e){return this.pi.set(e,t.currentSequenceNumber),C.resolve()}Ti(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=vr(t.data.value)),e}br(t,e,r){return C.or([()=>this.persistence.Ai(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.pi.get(e);return C.resolve(s!==void 0&&s>r)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
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
 */class ki{constructor(t,e,r,s){this.targetId=t,this.fromCache=e,this.Es=r,this.ds=s}static As(t,e){let r=z(),s=z();for(const o of e.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new ki(t,e.fromCache,r,s)}}/**
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
 */class Am{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
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
 */class vm{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=function(){return Ch()?8:Jf(gi())>0?6:4}()}initialize(t,e){this.ps=t,this.indexManager=e,this.Rs=!0}getDocumentsMatchingQuery(t,e,r,s){const o={result:null};return this.ys(t,e).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.ws(t,e,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new Am;return this.Ss(t,e,a).next(c=>{if(o.result=c,this.Vs)return this.bs(t,e,a,c.size)})}).next(()=>o.result)}bs(t,e,r,s){return r.documentReadCount<this.fs?(qe()<=H.DEBUG&&O("QueryEngine","SDK will not create cache indexes for query:",je(e),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),C.resolve()):(qe()<=H.DEBUG&&O("QueryEngine","Query:",je(e),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.gs*s?(qe()<=H.DEBUG&&O("QueryEngine","The SDK decides to create cache indexes for query:",je(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,$t(e))):C.resolve())}ys(t,e){if($a(e))return C.resolve(null);let r=$t(e);return this.indexManager.getIndexType(t,r).next(s=>s===0?null:(e.limit!==null&&s===1&&(e=Mr(e,null,"F"),r=$t(e)),this.indexManager.getDocumentsMatchingTarget(t,r).next(o=>{const a=z(...o);return this.ps.getDocuments(t,a).next(c=>this.indexManager.getMinOffset(t,r).next(h=>{const f=this.Ds(e,c);return this.Cs(e,f,a,h.readTime)?this.ys(t,Mr(e,null,"F")):this.vs(t,f,e,h)}))})))}ws(t,e,r,s){return $a(e)||s.isEqual(L.min())?C.resolve(null):this.ps.getDocuments(t,r).next(o=>{const a=this.Ds(e,o);return this.Cs(e,a,r,s)?C.resolve(null):(qe()<=H.DEBUG&&O("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),je(e)),this.vs(t,a,e,Kf(s,Ln)).next(c=>c))})}Ds(t,e){let r=new ft(mc(t));return e.forEach((s,o)=>{ts(t,o)&&(r=r.add(o))}),r}Cs(t,e,r,s){if(t.limit===null)return!1;if(r.size!==e.size)return!0;const o=t.limitType==="F"?e.last():e.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Ss(t,e,r){return qe()<=H.DEBUG&&O("QueryEngine","Using full collection scan to execute query:",je(e)),this.ps.getDocumentsMatchingQuery(t,e,fe.min(),r)}vs(t,e,r,s){return this.ps.getDocumentsMatchingQuery(t,r,s).next(o=>(e.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
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
 */const Oi="LocalStore",Rm=3e8;class bm{constructor(t,e,r,s){this.persistence=t,this.Fs=e,this.serializer=s,this.Ms=new et($),this.xs=new xe(o=>Ri(o),bi),this.Os=new Map,this.Ns=t.getRemoteDocumentCache(),this.Pi=t.getTargetCache(),this.Ii=t.getBundleCache(),this.Bs(r)}Bs(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new mm(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.Ms))}}function Sm(n,t,e,r){return new bm(n,t,e,r)}async function Bc(n,t){const e=F(n);return await e.persistence.runTransaction("Handle user change","readonly",r=>{let s;return e.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,e.Bs(t),e.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],c=[];let h=z();for(const f of s){a.push(f.batchId);for(const m of f.mutations)h=h.add(m.key)}for(const f of o){c.push(f.batchId);for(const m of f.mutations)h=h.add(m.key)}return e.localDocuments.getDocuments(r,h).next(f=>({Ls:f,removedBatchIds:a,addedBatchIds:c}))})})}function Cm(n,t){const e=F(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=t.batch.keys(),o=e.Ns.newChangeBuffer({trackRemovals:!0});return function(c,h,f,m){const g=f.batch,E=g.keys();let b=C.resolve();return E.forEach(V=>{b=b.next(()=>m.getEntry(h,V)).next(k=>{const P=f.docVersions.get(V);K(P!==null,48541),k.version.compareTo(P)<0&&(g.applyToRemoteDocument(k,f),k.isValidDocument()&&(k.setReadTime(f.commitVersion),m.addEntry(k)))})}),b.next(()=>c.mutationQueue.removeMutationBatch(h,g))}(e,r,t,o).next(()=>o.apply(r)).next(()=>e.mutationQueue.performConsistencyCheck(r)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(r,s,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(c){let h=z();for(let f=0;f<c.mutationResults.length;++f)c.mutationResults[f].transformResults.length>0&&(h=h.add(c.batch.mutations[f].key));return h}(t))).next(()=>e.localDocuments.getDocuments(r,s))})}function qc(n){const t=F(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Pi.getLastRemoteSnapshotVersion(e))}function Pm(n,t){const e=F(n),r=t.snapshotVersion;let s=e.Ms;return e.persistence.runTransaction("Apply remote event","readwrite-primary",o=>{const a=e.Ns.newChangeBuffer({trackRemovals:!0});s=e.Ms;const c=[];t.targetChanges.forEach((m,g)=>{const E=s.get(g);if(!E)return;c.push(e.Pi.removeMatchingKeys(o,m.removedDocuments,g).next(()=>e.Pi.addMatchingKeys(o,m.addedDocuments,g)));let b=E.withSequenceNumber(o.currentSequenceNumber);t.targetMismatches.get(g)!==null?b=b.withResumeToken(Tt.EMPTY_BYTE_STRING,L.min()).withLastLimboFreeSnapshotVersion(L.min()):m.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(m.resumeToken,r)),s=s.insert(g,b),function(k,P,j){return k.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-k.snapshotVersion.toMicroseconds()>=Rm?!0:j.addedDocuments.size+j.modifiedDocuments.size+j.removedDocuments.size>0}(E,b,m)&&c.push(e.Pi.updateTargetData(o,b))});let h=Yt(),f=z();if(t.documentUpdates.forEach(m=>{t.resolvedLimboDocuments.has(m)&&c.push(e.persistence.referenceDelegate.updateLimboDocument(o,m))}),c.push(Vm(o,a,t.documentUpdates).next(m=>{h=m.ks,f=m.qs})),!r.isEqual(L.min())){const m=e.Pi.getLastRemoteSnapshotVersion(o).next(g=>e.Pi.setTargetsMetadata(o,o.currentSequenceNumber,r));c.push(m)}return C.waitFor(c).next(()=>a.apply(o)).next(()=>e.localDocuments.getLocalViewOfDocuments(o,h,f)).next(()=>h)}).then(o=>(e.Ms=s,o))}function Vm(n,t,e){let r=z(),s=z();return e.forEach(o=>r=r.add(o)),t.getEntries(n,r).next(o=>{let a=Yt();return e.forEach((c,h)=>{const f=o.get(c);h.isFoundDocument()!==f.isFoundDocument()&&(s=s.add(c)),h.isNoDocument()&&h.version.isEqual(L.min())?(t.removeEntry(c,h.readTime),a=a.insert(c,h)):!f.isValidDocument()||h.version.compareTo(f.version)>0||h.version.compareTo(f.version)===0&&f.hasPendingWrites?(t.addEntry(h),a=a.insert(c,h)):O(Oi,"Ignoring outdated watch update for ",c,". Current version:",f.version," Watch version:",h.version)}),{ks:a,qs:s}})}function Dm(n,t){const e=F(n);return e.persistence.runTransaction("Get next mutation batch","readonly",r=>(t===void 0&&(t=Ii),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t)))}function Nm(n,t){const e=F(n);return e.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return e.Pi.getTargetData(r,t).next(o=>o?(s=o,C.resolve(s)):e.Pi.allocateTargetId(r).next(a=>(s=new ie(t,a,"TargetPurposeListen",r.currentSequenceNumber),e.Pi.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=e.Ms.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.Ms=e.Ms.insert(r.targetId,r),e.xs.set(t,r.targetId)),r})}async function ii(n,t,e){const r=F(n),s=r.Ms.get(t),o=e?"readwrite":"readwrite-primary";try{e||await r.persistence.runTransaction("Release target",o,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!rn(a))throw a;O(Oi,`Failed to update sequence numbers for target ${t}: ${a}`)}r.Ms=r.Ms.remove(t),r.xs.delete(s.target)}function nu(n,t,e){const r=F(n);let s=L.min(),o=z();return r.persistence.runTransaction("Execute query","readwrite",a=>function(h,f,m){const g=F(h),E=g.xs.get(m);return E!==void 0?C.resolve(g.Ms.get(E)):g.Pi.getTargetData(f,m)}(r,a,$t(t)).next(c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(a,c.targetId).next(h=>{o=h})}).next(()=>r.Fs.getDocumentsMatchingQuery(a,t,e?s:L.min(),e?o:z())).next(c=>(km(r,Ed(t),c),{documents:c,Qs:o})))}function km(n,t,e){let r=n.Os.get(t)||L.min();e.forEach((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)}),n.Os.set(t,r)}class ru{constructor(){this.activeTargetIds=Rd()}zs(t){this.activeTargetIds=this.activeTargetIds.add(t)}js(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Gs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class Om{constructor(){this.Mo=new ru,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,r){}addLocalQueryTarget(t,e=!0){return e&&this.Mo.zs(t),this.xo[t]||"not-current"}updateQueryState(t,e,r){this.xo[t]=e}removeLocalQueryTarget(t){this.Mo.js(t)}isLocalQueryTarget(t){return this.Mo.activeTargetIds.has(t)}clearQueryState(t){delete this.xo[t]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(t){return this.Mo.activeTargetIds.has(t)}start(){return this.Mo=new ru,Promise.resolve()}handleUserChange(t,e,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
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
 */class xm{Oo(t){}shutdown(){}}/**
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
 */const su="ConnectivityMonitor";class iu{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(t){this.qo.push(t)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){O(su,"Network connectivity changed: AVAILABLE");for(const t of this.qo)t(0)}ko(){O(su,"Network connectivity changed: UNAVAILABLE");for(const t of this.qo)t(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Tr=null;function oi(){return Tr===null?Tr=function(){return 268435456+Math.round(2147483648*Math.random())}():Tr++,"0x"+Tr.toString(16)}/**
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
 */const qs="RestConnection",Mm={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Lm{get $o(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=e+"://"+t.host,this.Ko=`projects/${r}/databases/${s}`,this.Wo=this.databaseId.database===kr?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Go(t,e,r,s,o){const a=oi(),c=this.zo(t,e.toUriEncodedString());O(qs,`Sending RPC '${t}' ${a}:`,c,r);const h={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(h,s,o);const{host:f}=new URL(c),m=Oe(f);return this.Jo(t,c,h,r,m).then(g=>(O(qs,`Received RPC '${t}' ${a}: `,g),g),g=>{throw We(qs,`RPC '${t}' ${a} failed with error: `,g,"url: ",c,"request:",r),g})}Ho(t,e,r,s,o,a){return this.Go(t,e,r,s,o)}jo(t,e,r){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+en}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach((s,o)=>t[o]=s),r&&r.headers.forEach((s,o)=>t[o]=s)}zo(t,e){const r=Mm[t];return`${this.Uo}/v1/${e}:${r}`}terminate(){}}/**
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
 */class Fm{constructor(t){this.Yo=t.Yo,this.Zo=t.Zo}Xo(t){this.e_=t}t_(t){this.n_=t}r_(t){this.i_=t}onMessage(t){this.s_=t}close(){this.Zo()}send(t){this.Yo(t)}o_(){this.e_()}__(){this.n_()}a_(t){this.i_(t)}u_(t){this.s_(t)}}/**
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
 */const It="WebChannelConnection";class Um extends Lm{constructor(t){super(t),this.c_=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}Jo(t,e,r,s,o){const a=oi();return new Promise((c,h)=>{const f=new qu;f.setWithCredentials(!0),f.listenOnce(ju.COMPLETE,()=>{try{switch(f.getLastErrorCode()){case Ar.NO_ERROR:const g=f.getResponseJson();O(It,`XHR for RPC '${t}' ${a} received:`,JSON.stringify(g)),c(g);break;case Ar.TIMEOUT:O(It,`RPC '${t}' ${a} timed out`),h(new N(S.DEADLINE_EXCEEDED,"Request time out"));break;case Ar.HTTP_ERROR:const E=f.getStatus();if(O(It,`RPC '${t}' ${a} failed with status:`,E,"response text:",f.getResponseText()),E>0){let b=f.getResponseJson();Array.isArray(b)&&(b=b[0]);const V=b==null?void 0:b.error;if(V&&V.status&&V.message){const k=function(j){const U=j.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(U)>=0?U:S.UNKNOWN}(V.status);h(new N(k,V.message))}else h(new N(S.UNKNOWN,"Server responded with status "+f.getStatus()))}else h(new N(S.UNAVAILABLE,"Connection failed."));break;default:M(9055,{l_:t,streamId:a,h_:f.getLastErrorCode(),P_:f.getLastError()})}}finally{O(It,`RPC '${t}' ${a} completed.`)}});const m=JSON.stringify(s);O(It,`RPC '${t}' ${a} sending request:`,s),f.send(e,"POST",m,r,15)})}T_(t,e,r){const s=oi(),o=[this.Uo,"/","google.firestore.v1.Firestore","/",t,"/channel"],a=Gu(),c=zu(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},f=this.longPollingOptions.timeoutSeconds;f!==void 0&&(h.longPollingTimeout=Math.round(1e3*f)),this.useFetchStreams&&(h.useFetchStreams=!0),this.jo(h.initMessageHeaders,e,r),h.encodeInitMessageHeaders=!0;const m=o.join("");O(It,`Creating RPC '${t}' stream ${s}: ${m}`,h);const g=a.createWebChannel(m,h);this.I_(g);let E=!1,b=!1;const V=new Fm({Yo:P=>{b?O(It,`Not sending because RPC '${t}' stream ${s} is closed:`,P):(E||(O(It,`Opening RPC '${t}' stream ${s} transport.`),g.open(),E=!0),O(It,`RPC '${t}' stream ${s} sending:`,P),g.send(P))},Zo:()=>g.close()}),k=(P,j,U)=>{P.listen(j,B=>{try{U(B)}catch(W){setTimeout(()=>{throw W},0)}})};return k(g,bn.EventType.OPEN,()=>{b||(O(It,`RPC '${t}' stream ${s} transport opened.`),V.o_())}),k(g,bn.EventType.CLOSE,()=>{b||(b=!0,O(It,`RPC '${t}' stream ${s} transport closed`),V.a_(),this.E_(g))}),k(g,bn.EventType.ERROR,P=>{b||(b=!0,We(It,`RPC '${t}' stream ${s} transport errored. Name:`,P.name,"Message:",P.message),V.a_(new N(S.UNAVAILABLE,"The operation could not be completed")))}),k(g,bn.EventType.MESSAGE,P=>{var j;if(!b){const U=P.data[0];K(!!U,16349);const B=U,W=(B==null?void 0:B.error)||((j=B[0])==null?void 0:j.error);if(W){O(It,`RPC '${t}' stream ${s} received error:`,W);const dt=W.status;let Z=function(y){const I=ot[y];if(I!==void 0)return Sc(I)}(dt),w=W.message;Z===void 0&&(Z=S.INTERNAL,w="Unknown error status: "+dt+" with message "+W.message),b=!0,V.a_(new N(Z,w)),g.close()}else O(It,`RPC '${t}' stream ${s} received:`,U),V.u_(U)}}),k(c,$u.STAT_EVENT,P=>{P.stat===Qs.PROXY?O(It,`RPC '${t}' stream ${s} detected buffering proxy`):P.stat===Qs.NOPROXY&&O(It,`RPC '${t}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{V.__()},0),V}terminate(){this.c_.forEach(t=>t.close()),this.c_=[]}I_(t){this.c_.push(t)}E_(t){this.c_=this.c_.filter(e=>e===t)}}function js(){return typeof document<"u"?document:null}/**
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
 */function ss(n){return new $d(n,!0)}/**
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
 */class xi{constructor(t,e,r=1e3,s=1.5,o=6e4){this.Mi=t,this.timerId=e,this.d_=r,this.A_=s,this.R_=o,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(t){this.cancel();const e=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,e-r);s>0&&O("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,()=>(this.f_=Date.now(),t())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
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
 */const ou="PersistentStream";class jc{constructor(t,e,r,s,o,a,c,h){this.Mi=t,this.S_=r,this.b_=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=h,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new xi(t,e)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(t){this.Q_(),this.stream.send(t)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(t,e){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,t!==4?this.M_.reset():e&&e.code===S.RESOURCE_EXHAUSTED?(Xt(e.toString()),Xt("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):e&&e.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.r_(e)}K_(){}auth(){this.state=1;const t=this.W_(this.D_),e=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.D_===e&&this.G_(r,s)},r=>{t(()=>{const s=new N(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(s)})})}G_(t,e){const r=this.W_(this.D_);this.stream=this.j_(t,e),this.stream.Xo(()=>{r(()=>this.listener.Xo())}),this.stream.t_(()=>{r(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(s=>{r(()=>this.z_(s))}),this.stream.onMessage(s=>{r(()=>++this.F_==1?this.J_(s):this.onNext(s))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(t){return O(ou,`close with error: ${t}`),this.stream=null,this.close(4,t)}W_(t){return e=>{this.Mi.enqueueAndForget(()=>this.D_===t?e():(O(ou,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Bm extends jc{constructor(t,e,r,s,o,a){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,r,s,a),this.serializer=o}j_(t,e){return this.connection.T_("Listen",t,e)}J_(t){return this.onNext(t)}onNext(t){this.M_.reset();const e=Kd(this.serializer,t),r=function(o){if(!("targetChange"in o))return L.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?L.min():a.readTime?xt(a.readTime):L.min()}(t);return this.listener.H_(e,r)}Y_(t){const e={};e.database=si(this.serializer),e.addTarget=function(o,a){let c;const h=a.target;if(c=ti(h)?{documents:Qd(o,h)}:{query:Xd(o,h).ft},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=Vc(o,a.resumeToken);const f=ni(o,a.expectedCount);f!==null&&(c.expectedCount=f)}else if(a.snapshotVersion.compareTo(L.min())>0){c.readTime=Fr(o,a.snapshotVersion.toTimestamp());const f=ni(o,a.expectedCount);f!==null&&(c.expectedCount=f)}return c}(this.serializer,t);const r=Jd(this.serializer,t);r&&(e.labels=r),this.q_(e)}Z_(t){const e={};e.database=si(this.serializer),e.removeTarget=t,this.q_(e)}}class qm extends jc{constructor(t,e,r,s,o,a){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,r,s,a),this.serializer=o}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(t,e){return this.connection.T_("Write",t,e)}J_(t){return K(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,K(!t.writeResults||t.writeResults.length===0,55816),this.listener.ta()}onNext(t){K(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.M_.reset();const e=Wd(t.writeResults,t.commitTime),r=xt(t.commitTime);return this.listener.na(r,e)}ra(){const t={};t.database=si(this.serializer),this.q_(t)}ea(t){const e={streamToken:this.lastStreamToken,writes:t.map(r=>Oc(this.serializer,r))};this.q_(e)}}/**
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
 */class jm{}class $m extends jm{constructor(t,e,r,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=r,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.")}Go(t,e,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Go(t,ri(e,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(S.UNKNOWN,o.toString())})}Ho(t,e,r,s,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,c])=>this.connection.Ho(t,ri(e,r),s,a,c,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new N(S.UNKNOWN,a.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class zm{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(t){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ca("Offline")))}set(t){this.Pa(),this.oa=0,t==="Online"&&(this.aa=!1),this.ca(t)}ca(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}la(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Xt(e),this.aa=!1):O("OnlineStateTracker",e)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
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
 */const Ne="RemoteStore";class Gm{constructor(t,e,r,s,o){this.localStore=t,this.datastore=e,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=o,this.Aa.Oo(a=>{r.enqueueAndForget(async()=>{Me(this)&&(O(Ne,"Restarting streams for network reachability change."),await async function(h){const f=F(h);f.Ea.add(4),await Xn(f),f.Ra.set("Unknown"),f.Ea.delete(4),await is(f)}(this))})}),this.Ra=new zm(r,s)}}async function is(n){if(Me(n))for(const t of n.da)await t(!0)}async function Xn(n){for(const t of n.da)await t(!1)}function $c(n,t){const e=F(n);e.Ia.has(t.targetId)||(e.Ia.set(t.targetId,t),Ui(e)?Fi(e):on(e).O_()&&Li(e,t))}function Mi(n,t){const e=F(n),r=on(e);e.Ia.delete(t),r.O_()&&zc(e,t),e.Ia.size===0&&(r.O_()?r.L_():Me(e)&&e.Ra.set("Unknown"))}function Li(n,t){if(n.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(L.min())>0){const e=n.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}on(n).Y_(t)}function zc(n,t){n.Va.Ue(t),on(n).Z_(t)}function Fi(n){n.Va=new Ud({getRemoteKeysForTarget:t=>n.remoteSyncer.getRemoteKeysForTarget(t),At:t=>n.Ia.get(t)||null,ht:()=>n.datastore.serializer.databaseId}),on(n).start(),n.Ra.ua()}function Ui(n){return Me(n)&&!on(n).x_()&&n.Ia.size>0}function Me(n){return F(n).Ea.size===0}function Gc(n){n.Va=void 0}async function Hm(n){n.Ra.set("Online")}async function Km(n){n.Ia.forEach((t,e)=>{Li(n,t)})}async function Wm(n,t){Gc(n),Ui(n)?(n.Ra.ha(t),Fi(n)):n.Ra.set("Unknown")}async function Qm(n,t,e){if(n.Ra.set("Online"),t instanceof Pc&&t.state===2&&t.cause)try{await async function(s,o){const a=o.cause;for(const c of o.targetIds)s.Ia.has(c)&&(await s.remoteSyncer.rejectListen(c,a),s.Ia.delete(c),s.Va.removeTarget(c))}(n,t)}catch(r){O(Ne,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await qr(n,r)}else if(t instanceof Sr?n.Va.Ze(t):t instanceof Cc?n.Va.st(t):n.Va.tt(t),!e.isEqual(L.min()))try{const r=await qc(n.localStore);e.compareTo(r)>=0&&await function(o,a){const c=o.Va.Tt(a);return c.targetChanges.forEach((h,f)=>{if(h.resumeToken.approximateByteSize()>0){const m=o.Ia.get(f);m&&o.Ia.set(f,m.withResumeToken(h.resumeToken,a))}}),c.targetMismatches.forEach((h,f)=>{const m=o.Ia.get(h);if(!m)return;o.Ia.set(h,m.withResumeToken(Tt.EMPTY_BYTE_STRING,m.snapshotVersion)),zc(o,h);const g=new ie(m.target,h,f,m.sequenceNumber);Li(o,g)}),o.remoteSyncer.applyRemoteEvent(c)}(n,e)}catch(r){O(Ne,"Failed to raise snapshot:",r),await qr(n,r)}}async function qr(n,t,e){if(!rn(t))throw t;n.Ea.add(1),await Xn(n),n.Ra.set("Offline"),e||(e=()=>qc(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{O(Ne,"Retrying IndexedDB access"),await e(),n.Ea.delete(1),await is(n)})}function Hc(n,t){return t().catch(e=>qr(n,e,t))}async function os(n){const t=F(n),e=ge(t);let r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:Ii;for(;Xm(t);)try{const s=await Dm(t.localStore,r);if(s===null){t.Ta.length===0&&e.L_();break}r=s.batchId,Ym(t,s)}catch(s){await qr(t,s)}Kc(t)&&Wc(t)}function Xm(n){return Me(n)&&n.Ta.length<10}function Ym(n,t){n.Ta.push(t);const e=ge(n);e.O_()&&e.X_&&e.ea(t.mutations)}function Kc(n){return Me(n)&&!ge(n).x_()&&n.Ta.length>0}function Wc(n){ge(n).start()}async function Jm(n){ge(n).ra()}async function Zm(n){const t=ge(n);for(const e of n.Ta)t.ea(e.mutations)}async function tp(n,t,e){const r=n.Ta.shift(),s=Ci.from(r,t,e);await Hc(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await os(n)}async function ep(n,t){t&&ge(n).X_&&await async function(r,s){if(function(a){return bc(a)&&a!==S.ABORTED}(s.code)){const o=r.Ta.shift();ge(r).B_(),await Hc(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await os(r)}}(n,t),Kc(n)&&Wc(n)}async function au(n,t){const e=F(n);e.asyncQueue.verifyOperationInProgress(),O(Ne,"RemoteStore received new credentials");const r=Me(e);e.Ea.add(3),await Xn(e),r&&e.Ra.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Ea.delete(3),await is(e)}async function np(n,t){const e=F(n);t?(e.Ea.delete(2),await is(e)):t||(e.Ea.add(2),await Xn(e),e.Ra.set("Unknown"))}function on(n){return n.ma||(n.ma=function(e,r,s){const o=F(e);return o.sa(),new Bm(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Xo:Hm.bind(null,n),t_:Km.bind(null,n),r_:Wm.bind(null,n),H_:Qm.bind(null,n)}),n.da.push(async t=>{t?(n.ma.B_(),Ui(n)?Fi(n):n.Ra.set("Unknown")):(await n.ma.stop(),Gc(n))})),n.ma}function ge(n){return n.fa||(n.fa=function(e,r,s){const o=F(e);return o.sa(),new qm(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Xo:()=>Promise.resolve(),t_:Jm.bind(null,n),r_:ep.bind(null,n),ta:Zm.bind(null,n),na:tp.bind(null,n)}),n.da.push(async t=>{t?(n.fa.B_(),await os(n)):(await n.fa.stop(),n.Ta.length>0&&(O(Ne,`Stopping write stream with ${n.Ta.length} pending writes`),n.Ta=[]))})),n.fa}/**
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
 */class Bi{constructor(t,e,r,s,o){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new jt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,r,s,o){const a=Date.now()+r,c=new Bi(t,e,a,s,o);return c.start(r),c}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(S.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function qi(n,t){if(Xt("AsyncQueue",`${t}: ${n}`),rn(n))return new N(S.UNAVAILABLE,`${t}: ${n}`);throw n}/**
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
 */class He{static emptySet(t){return new He(t.comparator)}constructor(t){this.comparator=t?(e,r)=>t(e,r)||x.comparator(e.key,r.key):(e,r)=>x.comparator(e.key,r.key),this.keyedMap=Sn(),this.sortedSet=new et(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,r)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof He)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const r=new He;return r.comparator=this.comparator,r.keyedMap=t,r.sortedSet=e,r}}/**
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
 */class uu{constructor(){this.ga=new et(x.comparator)}track(t){const e=t.doc.key,r=this.ga.get(e);r?t.type!==0&&r.type===3?this.ga=this.ga.insert(e,t):t.type===3&&r.type!==1?this.ga=this.ga.insert(e,{type:r.type,doc:t.doc}):t.type===2&&r.type===2?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):t.type===2&&r.type===0?this.ga=this.ga.insert(e,{type:0,doc:t.doc}):t.type===1&&r.type===0?this.ga=this.ga.remove(e):t.type===1&&r.type===2?this.ga=this.ga.insert(e,{type:1,doc:r.doc}):t.type===0&&r.type===1?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):M(63341,{Rt:t,pa:r}):this.ga=this.ga.insert(e,t)}ya(){const t=[];return this.ga.inorderTraversal((e,r)=>{t.push(r)}),t}}class Ze{constructor(t,e,r,s,o,a,c,h,f){this.query=t,this.docs=e,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=h,this.hasCachedResults=f}static fromInitialDocuments(t,e,r,s,o){const a=[];return e.forEach(c=>{a.push({type:0,doc:c})}),new Ze(t,e,He.emptySet(e),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&Zr(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,r=t.docChanges;if(e.length!==r.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==r[s].type||!e[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
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
 */class rp{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(t=>t.Da())}}class sp{constructor(){this.queries=cu(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(e,r){const s=F(e),o=s.queries;s.queries=cu(),o.forEach((a,c)=>{for(const h of c.Sa)h.onError(r)})})(this,new N(S.ABORTED,"Firestore shutting down"))}}function cu(){return new xe(n=>dc(n),Zr)}async function ji(n,t){const e=F(n);let r=3;const s=t.query;let o=e.queries.get(s);o?!o.ba()&&t.Da()&&(r=2):(o=new rp,r=t.Da()?0:1);try{switch(r){case 0:o.wa=await e.onListen(s,!0);break;case 1:o.wa=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(a){const c=qi(a,`Initialization of query '${je(t.query)}' failed`);return void t.onError(c)}e.queries.set(s,o),o.Sa.push(t),t.va(e.onlineState),o.wa&&t.Fa(o.wa)&&zi(e)}async function $i(n,t){const e=F(n),r=t.query;let s=3;const o=e.queries.get(r);if(o){const a=o.Sa.indexOf(t);a>=0&&(o.Sa.splice(a,1),o.Sa.length===0?s=t.Da()?0:1:!o.ba()&&t.Da()&&(s=2))}switch(s){case 0:return e.queries.delete(r),e.onUnlisten(r,!0);case 1:return e.queries.delete(r),e.onUnlisten(r,!1);case 2:return e.onLastRemoteStoreUnlisten(r);default:return}}function ip(n,t){const e=F(n);let r=!1;for(const s of t){const o=s.query,a=e.queries.get(o);if(a){for(const c of a.Sa)c.Fa(s)&&(r=!0);a.wa=s}}r&&zi(e)}function op(n,t,e){const r=F(n),s=r.queries.get(t);if(s)for(const o of s.Sa)o.onError(e);r.queries.delete(t)}function zi(n){n.Ca.forEach(t=>{t.next()})}var ai,lu;(lu=ai||(ai={})).Ma="default",lu.Cache="cache";class Gi{constructor(t,e,r){this.query=t,this.xa=e,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(t){if(!this.options.includeMetadataChanges){const r=[];for(const s of t.docChanges)s.type!==3&&r.push(s);t=new Ze(t.query,t.docs,t.oldDocs,r,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.Oa?this.Ba(t)&&(this.xa.next(t),e=!0):this.La(t,this.onlineState)&&(this.ka(t),e=!0),this.Na=t,e}onError(t){this.xa.error(t)}va(t){this.onlineState=t;let e=!1;return this.Na&&!this.Oa&&this.La(this.Na,t)&&(this.ka(this.Na),e=!0),e}La(t,e){if(!t.fromCache||!this.Da())return!0;const r=e!=="Offline";return(!this.options.qa||!r)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}Ba(t){if(t.docChanges.length>0)return!0;const e=this.Na&&this.Na.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}ka(t){t=Ze.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.Oa=!0,this.xa.next(t)}Da(){return this.options.source!==ai.Cache}}/**
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
 */class Qc{constructor(t){this.key=t}}class Xc{constructor(t){this.key=t}}class ap{constructor(t,e){this.query=t,this.Ya=e,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=z(),this.mutatedKeys=z(),this.eu=mc(t),this.tu=new He(this.eu)}get nu(){return this.Ya}ru(t,e){const r=e?e.iu:new uu,s=e?e.tu:this.tu;let o=e?e.mutatedKeys:this.mutatedKeys,a=s,c=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,f=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((m,g)=>{const E=s.get(m),b=ts(this.query,g)?g:null,V=!!E&&this.mutatedKeys.has(E.key),k=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations);let P=!1;E&&b?E.data.isEqual(b.data)?V!==k&&(r.track({type:3,doc:b}),P=!0):this.su(E,b)||(r.track({type:2,doc:b}),P=!0,(h&&this.eu(b,h)>0||f&&this.eu(b,f)<0)&&(c=!0)):!E&&b?(r.track({type:0,doc:b}),P=!0):E&&!b&&(r.track({type:1,doc:E}),P=!0,(h||f)&&(c=!0)),P&&(b?(a=a.add(b),o=k?o.add(m):o.delete(m)):(a=a.delete(m),o=o.delete(m)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const m=this.query.limitType==="F"?a.last():a.first();a=a.delete(m.key),o=o.delete(m.key),r.track({type:1,doc:m})}return{tu:a,iu:r,Cs:c,mutatedKeys:o}}su(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,r,s){const o=this.tu;this.tu=t.tu,this.mutatedKeys=t.mutatedKeys;const a=t.iu.ya();a.sort((m,g)=>function(b,V){const k=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M(20277,{Rt:P})}};return k(b)-k(V)}(m.type,g.type)||this.eu(m.doc,g.doc)),this.ou(r),s=s??!1;const c=e&&!s?this._u():[],h=this.Xa.size===0&&this.current&&!s?1:0,f=h!==this.Za;return this.Za=h,a.length!==0||f?{snapshot:new Ze(this.query,t.tu,o,a,t.mutatedKeys,h===0,f,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:c}:{au:c}}va(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new uu,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(t){return!this.Ya.has(t)&&!!this.tu.has(t)&&!this.tu.get(t).hasLocalMutations}ou(t){t&&(t.addedDocuments.forEach(e=>this.Ya=this.Ya.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ya=this.Ya.delete(e)),this.current=t.current)}_u(){if(!this.current)return[];const t=this.Xa;this.Xa=z(),this.tu.forEach(r=>{this.uu(r.key)&&(this.Xa=this.Xa.add(r.key))});const e=[];return t.forEach(r=>{this.Xa.has(r)||e.push(new Xc(r))}),this.Xa.forEach(r=>{t.has(r)||e.push(new Qc(r))}),e}cu(t){this.Ya=t.Qs,this.Xa=z();const e=this.ru(t.documents);return this.applyChanges(e,!0)}lu(){return Ze.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const Hi="SyncEngine";class up{constructor(t,e,r){this.query=t,this.targetId=e,this.view=r}}class cp{constructor(t){this.key=t,this.hu=!1}}class lp{constructor(t,e,r,s,o,a){this.localStore=t,this.remoteStore=e,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new xe(c=>dc(c),Zr),this.Iu=new Map,this.Eu=new Set,this.du=new et(x.comparator),this.Au=new Map,this.Ru=new Di,this.Vu={},this.mu=new Map,this.fu=Je.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function hp(n,t,e=!0){const r=nl(n);let s;const o=r.Tu.get(t);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.lu()):s=await Yc(r,t,e,!0),s}async function fp(n,t){const e=nl(n);await Yc(e,t,!0,!1)}async function Yc(n,t,e,r){const s=await Nm(n.localStore,$t(t)),o=s.targetId,a=n.sharedClientState.addLocalQueryTarget(o,e);let c;return r&&(c=await dp(n,t,o,a==="current",s.resumeToken)),n.isPrimaryClient&&e&&$c(n.remoteStore,s),c}async function dp(n,t,e,r,s){n.pu=(g,E,b)=>async function(k,P,j,U){let B=P.view.ru(j);B.Cs&&(B=await nu(k.localStore,P.query,!1).then(({documents:w})=>P.view.ru(w,B)));const W=U&&U.targetChanges.get(P.targetId),dt=U&&U.targetMismatches.get(P.targetId)!=null,Z=P.view.applyChanges(B,k.isPrimaryClient,W,dt);return fu(k,P.targetId,Z.au),Z.snapshot}(n,g,E,b);const o=await nu(n.localStore,t,!0),a=new ap(t,o.Qs),c=a.ru(o.documents),h=Qn.createSynthesizedTargetChangeForCurrentChange(e,r&&n.onlineState!=="Offline",s),f=a.applyChanges(c,n.isPrimaryClient,h);fu(n,e,f.au);const m=new up(t,e,a);return n.Tu.set(t,m),n.Iu.has(e)?n.Iu.get(e).push(t):n.Iu.set(e,[t]),f.snapshot}async function mp(n,t,e){const r=F(n),s=r.Tu.get(t),o=r.Iu.get(s.targetId);if(o.length>1)return r.Iu.set(s.targetId,o.filter(a=>!Zr(a,t))),void r.Tu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await ii(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),e&&Mi(r.remoteStore,s.targetId),ui(r,s.targetId)}).catch(nn)):(ui(r,s.targetId),await ii(r.localStore,s.targetId,!0))}async function pp(n,t){const e=F(n),r=e.Tu.get(t),s=e.Iu.get(r.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(r.targetId),Mi(e.remoteStore,r.targetId))}async function gp(n,t,e){const r=Ap(n);try{const s=await function(a,c){const h=F(a),f=J.now(),m=c.reduce((b,V)=>b.add(V.key),z());let g,E;return h.persistence.runTransaction("Locally write mutations","readwrite",b=>{let V=Yt(),k=z();return h.Ns.getEntries(b,m).next(P=>{V=P,V.forEach((j,U)=>{U.isValidDocument()||(k=k.add(j))})}).next(()=>h.localDocuments.getOverlayedDocuments(b,V)).next(P=>{g=P;const j=[];for(const U of c){const B=kd(U,g.get(U.key).overlayedDocument);B!=null&&j.push(new Te(U.key,B,ic(B.value.mapValue),ut.exists(!0)))}return h.mutationQueue.addMutationBatch(b,f,j,c)}).next(P=>{E=P;const j=P.applyToLocalDocumentSet(g,k);return h.documentOverlayCache.saveOverlays(b,P.batchId,j)})}).then(()=>({batchId:E.batchId,changes:gc(g)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),function(a,c,h){let f=a.Vu[a.currentUser.toKey()];f||(f=new et($)),f=f.insert(c,h),a.Vu[a.currentUser.toKey()]=f}(r,s.batchId,e),await Yn(r,s.changes),await os(r.remoteStore)}catch(s){const o=qi(s,"Failed to persist write");e.reject(o)}}async function Jc(n,t){const e=F(n);try{const r=await Pm(e.localStore,t);t.targetChanges.forEach((s,o)=>{const a=e.Au.get(o);a&&(K(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.hu=!0:s.modifiedDocuments.size>0?K(a.hu,14607):s.removedDocuments.size>0&&(K(a.hu,42227),a.hu=!1))}),await Yn(e,r,t)}catch(r){await nn(r)}}function hu(n,t,e){const r=F(n);if(r.isPrimaryClient&&e===0||!r.isPrimaryClient&&e===1){const s=[];r.Tu.forEach((o,a)=>{const c=a.view.va(t);c.snapshot&&s.push(c.snapshot)}),function(a,c){const h=F(a);h.onlineState=c;let f=!1;h.queries.forEach((m,g)=>{for(const E of g.Sa)E.va(c)&&(f=!0)}),f&&zi(h)}(r.eventManager,t),s.length&&r.Pu.H_(s),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function _p(n,t,e){const r=F(n);r.sharedClientState.updateQueryState(t,"rejected",e);const s=r.Au.get(t),o=s&&s.key;if(o){let a=new et(x.comparator);a=a.insert(o,gt.newNoDocument(o,L.min()));const c=z().add(o),h=new rs(L.min(),new Map,new et($),a,c);await Jc(r,h),r.du=r.du.remove(o),r.Au.delete(t),Ki(r)}else await ii(r.localStore,t,!1).then(()=>ui(r,t,e)).catch(nn)}async function yp(n,t){const e=F(n),r=t.batch.batchId;try{const s=await Cm(e.localStore,t);tl(e,r,null),Zc(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await Yn(e,s)}catch(s){await nn(s)}}async function Ep(n,t,e){const r=F(n);try{const s=await function(a,c){const h=F(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",f=>{let m;return h.mutationQueue.lookupMutationBatch(f,c).next(g=>(K(g!==null,37113),m=g.keys(),h.mutationQueue.removeMutationBatch(f,g))).next(()=>h.mutationQueue.performConsistencyCheck(f)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(f,m,c)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(f,m)).next(()=>h.localDocuments.getDocuments(f,m))})}(r.localStore,t);tl(r,t,e),Zc(r,t),r.sharedClientState.updateMutationState(t,"rejected",e),await Yn(r,s)}catch(s){await nn(s)}}function Zc(n,t){(n.mu.get(t)||[]).forEach(e=>{e.resolve()}),n.mu.delete(t)}function tl(n,t,e){const r=F(n);let s=r.Vu[r.currentUser.toKey()];if(s){const o=s.get(t);o&&(e?o.reject(e):o.resolve(),s=s.remove(t)),r.Vu[r.currentUser.toKey()]=s}}function ui(n,t,e=null){n.sharedClientState.removeLocalQueryTarget(t);for(const r of n.Iu.get(t))n.Tu.delete(r),e&&n.Pu.yu(r,e);n.Iu.delete(t),n.isPrimaryClient&&n.Ru.jr(t).forEach(r=>{n.Ru.containsKey(r)||el(n,r)})}function el(n,t){n.Eu.delete(t.path.canonicalString());const e=n.du.get(t);e!==null&&(Mi(n.remoteStore,e),n.du=n.du.remove(t),n.Au.delete(e),Ki(n))}function fu(n,t,e){for(const r of e)r instanceof Qc?(n.Ru.addReference(r.key,t),Tp(n,r)):r instanceof Xc?(O(Hi,"Document no longer in limbo: "+r.key),n.Ru.removeReference(r.key,t),n.Ru.containsKey(r.key)||el(n,r.key)):M(19791,{wu:r})}function Tp(n,t){const e=t.key,r=e.path.canonicalString();n.du.get(e)||n.Eu.has(r)||(O(Hi,"New document in limbo: "+e),n.Eu.add(r),Ki(n))}function Ki(n){for(;n.Eu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const t=n.Eu.values().next().value;n.Eu.delete(t);const e=new x(Q.fromString(t)),r=n.fu.next();n.Au.set(r,new cp(e)),n.du=n.du.insert(e,r),$c(n.remoteStore,new ie($t(Jr(e.path)),r,"TargetPurposeLimboResolution",Xr.ce))}}async function Yn(n,t,e){const r=F(n),s=[],o=[],a=[];r.Tu.isEmpty()||(r.Tu.forEach((c,h)=>{a.push(r.pu(h,t,e).then(f=>{var m;if((f||e)&&r.isPrimaryClient){const g=f?!f.fromCache:(m=e==null?void 0:e.targetChanges.get(h.targetId))==null?void 0:m.current;r.sharedClientState.updateQueryState(h.targetId,g?"current":"not-current")}if(f){s.push(f);const g=ki.As(h.targetId,f);o.push(g)}}))}),await Promise.all(a),r.Pu.H_(s),await async function(h,f){const m=F(h);try{await m.persistence.runTransaction("notifyLocalViewChanges","readwrite",g=>C.forEach(f,E=>C.forEach(E.Es,b=>m.persistence.referenceDelegate.addReference(g,E.targetId,b)).next(()=>C.forEach(E.ds,b=>m.persistence.referenceDelegate.removeReference(g,E.targetId,b)))))}catch(g){if(!rn(g))throw g;O(Oi,"Failed to update sequence numbers: "+g)}for(const g of f){const E=g.targetId;if(!g.fromCache){const b=m.Ms.get(E),V=b.snapshotVersion,k=b.withLastLimboFreeSnapshotVersion(V);m.Ms=m.Ms.insert(E,k)}}}(r.localStore,o))}async function wp(n,t){const e=F(n);if(!e.currentUser.isEqual(t)){O(Hi,"User change. New user:",t.toKey());const r=await Bc(e.localStore,t);e.currentUser=t,function(o,a){o.mu.forEach(c=>{c.forEach(h=>{h.reject(new N(S.CANCELLED,a))})}),o.mu.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await Yn(e,r.Ls)}}function Ip(n,t){const e=F(n),r=e.Au.get(t);if(r&&r.hu)return z().add(r.key);{let s=z();const o=e.Iu.get(t);if(!o)return s;for(const a of o){const c=e.Tu.get(a);s=s.unionWith(c.view.nu)}return s}}function nl(n){const t=F(n);return t.remoteStore.remoteSyncer.applyRemoteEvent=Jc.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=Ip.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=_p.bind(null,t),t.Pu.H_=ip.bind(null,t.eventManager),t.Pu.yu=op.bind(null,t.eventManager),t}function Ap(n){const t=F(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=yp.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=Ep.bind(null,t),t}class jr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=ss(t.databaseInfo.databaseId),this.sharedClientState=this.Du(t),this.persistence=this.Cu(t),await this.persistence.start(),this.localStore=this.vu(t),this.gcScheduler=this.Fu(t,this.localStore),this.indexBackfillerScheduler=this.Mu(t,this.localStore)}Fu(t,e){return null}Mu(t,e){return null}vu(t){return Sm(this.persistence,new vm,t.initialUser,this.serializer)}Cu(t){return new Uc(Ni.mi,this.serializer)}Du(t){return new Om}async terminate(){var t,e;(t=this.gcScheduler)==null||t.stop(),(e=this.indexBackfillerScheduler)==null||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}jr.provider={build:()=>new jr};class vp extends jr{constructor(t){super(),this.cacheSizeBytes=t}Fu(t,e){K(this.persistence.referenceDelegate instanceof Br,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new cm(r,t.asyncQueue,e)}Cu(t){const e=this.cacheSizeBytes!==void 0?Pt.withCacheSize(this.cacheSizeBytes):Pt.DEFAULT;return new Uc(r=>Br.mi(r,e),this.serializer)}}class ci{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>hu(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=wp.bind(null,this.syncEngine),await np(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new sp}()}createDatastore(t){const e=ss(t.databaseInfo.databaseId),r=function(o){return new Um(o)}(t.databaseInfo);return function(o,a,c,h){return new $m(o,a,c,h)}(t.authCredentials,t.appCheckCredentials,r,e)}createRemoteStore(t){return function(r,s,o,a,c){return new Gm(r,s,o,a,c)}(this.localStore,this.datastore,t.asyncQueue,e=>hu(this.syncEngine,e,0),function(){return iu.v()?new iu:new xm}())}createSyncEngine(t,e){return function(s,o,a,c,h,f,m){const g=new lp(s,o,a,c,h,f);return m&&(g.gu=!0),g}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(s){const o=F(s);O(Ne,"RemoteStore shutting down."),o.Ea.add(5),await Xn(o),o.Aa.shutdown(),o.Ra.set("Unknown")}(this.remoteStore),(t=this.datastore)==null||t.terminate(),(e=this.eventManager)==null||e.terminate()}}ci.provider={build:()=>new ci};/**
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
 */class Wi{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ou(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ou(this.observer.error,t):Xt("Uncaught Error in snapshot listener:",t.toString()))}Nu(){this.muted=!0}Ou(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
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
 */class Rp{constructor(t){this.datastore=t,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(t){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new N(S.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const e=await async function(s,o){const a=F(s),c={documents:o.map(g=>Ur(a.serializer,g))},h=await a.Ho("BatchGetDocuments",a.serializer.databaseId,Q.emptyPath(),c,o.length),f=new Map;h.forEach(g=>{const E=Hd(a.serializer,g);f.set(E.key.toString(),E)});const m=[];return o.forEach(g=>{const E=f.get(g.toString());K(!!E,55234,{key:g}),m.push(E)}),m}(this.datastore,t);return e.forEach(r=>this.recordVersion(r)),e}set(t,e){this.write(e.toMutation(t,this.precondition(t))),this.writtenDocs.add(t.toString())}update(t,e){try{this.write(e.toMutation(t,this.preconditionForUpdate(t)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(t.toString())}delete(t){this.write(new Wn(t,this.precondition(t))),this.writtenDocs.add(t.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const t=this.readVersions;this.mutations.forEach(e=>{t.delete(e.key.toString())}),t.forEach((e,r)=>{const s=x.fromPath(r);this.mutations.push(new Rc(s,this.precondition(s)))}),await async function(r,s){const o=F(r),a={writes:s.map(c=>Oc(o.serializer,c))};await o.Go("Commit",o.serializer.databaseId,Q.emptyPath(),a)}(this.datastore,this.mutations),this.committed=!0}recordVersion(t){let e;if(t.isFoundDocument())e=t.version;else{if(!t.isNoDocument())throw M(50498,{Gu:t.constructor.name});e=L.min()}const r=this.readVersions.get(t.key.toString());if(r){if(!e.isEqual(r))throw new N(S.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(t.key.toString(),e)}precondition(t){const e=this.readVersions.get(t.toString());return!this.writtenDocs.has(t.toString())&&e?e.isEqual(L.min())?ut.exists(!1):ut.updateTime(e):ut.none()}preconditionForUpdate(t){const e=this.readVersions.get(t.toString());if(!this.writtenDocs.has(t.toString())&&e){if(e.isEqual(L.min()))throw new N(S.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return ut.updateTime(e)}return ut.exists(!0)}write(t){this.ensureCommitNotCalled(),this.mutations.push(t)}ensureCommitNotCalled(){}}/**
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
 */class bp{constructor(t,e,r,s,o){this.asyncQueue=t,this.datastore=e,this.options=r,this.updateFunction=s,this.deferred=o,this.zu=r.maxAttempts,this.M_=new xi(this.asyncQueue,"transaction_retry")}ju(){this.zu-=1,this.Ju()}Ju(){this.M_.p_(async()=>{const t=new Rp(this.datastore),e=this.Hu(t);e&&e.then(r=>{this.asyncQueue.enqueueAndForget(()=>t.commit().then(()=>{this.deferred.resolve(r)}).catch(s=>{this.Yu(s)}))}).catch(r=>{this.Yu(r)})})}Hu(t){try{const e=this.updateFunction(t);return!Hn(e)&&e.catch&&e.then?e:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(e){return this.deferred.reject(e),null}}Yu(t){this.zu>0&&this.Zu(t)?(this.zu-=1,this.asyncQueue.enqueueAndForget(()=>(this.Ju(),Promise.resolve()))):this.deferred.reject(t)}Zu(t){if((t==null?void 0:t.name)==="FirebaseError"){const e=t.code;return e==="aborted"||e==="failed-precondition"||e==="already-exists"||!bc(e)}return!1}}/**
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
 */const _e="FirestoreClient";class Sp{constructor(t,e,r,s,o){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=r,this.databaseInfo=s,this.user=At.UNAUTHENTICATED,this.clientId=wi.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{O(_e,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(O(_e,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new jt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const r=qi(e,"Failed to shutdown persistence");t.reject(r)}}),t.promise}}async function $s(n,t){n.asyncQueue.verifyOperationInProgress(),O(_e,"Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let r=e.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Bc(t.localStore,s),r=s)}),t.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=t}async function du(n,t){n.asyncQueue.verifyOperationInProgress();const e=await Cp(n);O(_e,"Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener(r=>au(t.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>au(t.remoteStore,s)),n._onlineComponents=t}async function Cp(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){O(_e,"Using user provided OfflineComponentProvider");try{await $s(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(s){return s.name==="FirebaseError"?s.code===S.FAILED_PRECONDITION||s.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(e))throw e;We("Error using user provided cache. Falling back to memory cache: "+e),await $s(n,new jr)}}else O(_e,"Using default OfflineComponentProvider"),await $s(n,new vp(void 0));return n._offlineComponents}async function Qi(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(O(_e,"Using user provided OnlineComponentProvider"),await du(n,n._uninitializedComponentsProvider._online)):(O(_e,"Using default OnlineComponentProvider"),await du(n,new ci))),n._onlineComponents}function Pp(n){return Qi(n).then(t=>t.syncEngine)}function Vp(n){return Qi(n).then(t=>t.datastore)}async function $r(n){const t=await Qi(n),e=t.eventManager;return e.onListen=hp.bind(null,t.syncEngine),e.onUnlisten=mp.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=fp.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=pp.bind(null,t.syncEngine),e}function Dp(n,t,e={}){const r=new jt;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,c,h,f){const m=new Wi({next:E=>{m.Nu(),a.enqueueAndForget(()=>$i(o,g));const b=E.docs.has(c);!b&&E.fromCache?f.reject(new N(S.UNAVAILABLE,"Failed to get document because the client is offline.")):b&&E.fromCache&&h&&h.source==="server"?f.reject(new N(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):f.resolve(E)},error:E=>f.reject(E)}),g=new Gi(Jr(c.path),m,{includeMetadataChanges:!0,qa:!0});return ji(o,g)}(await $r(n),n.asyncQueue,t,e,r)),r.promise}function rl(n,t,e={}){const r=new jt;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,c,h,f){const m=new Wi({next:E=>{m.Nu(),a.enqueueAndForget(()=>$i(o,g)),E.fromCache&&h.source==="server"?f.reject(new N(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):f.resolve(E)},error:E=>f.reject(E)}),g=new Gi(c,m,{includeMetadataChanges:!0,qa:!0});return ji(o,g)}(await $r(n),n.asyncQueue,t,e,r)),r.promise}/**
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
 */function sl(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
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
 */const mu=new Map;/**
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
 */const il="firestore.googleapis.com",pu=!0;class gu{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new N(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=il,this.ssl=pu}else this.host=t.host,this.ssl=t.ssl??pu;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=Fc;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<am)throw new N(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}Gf("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=sl(t.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class as{constructor(t,e,r,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new gu({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new N(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new gu(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new xf;switch(r.type){case"firstParty":return new Uf(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const r=mu.get(e);r&&(O("ComponentProvider","Removing Datastore"),mu.delete(e),r.terminate())}(this),Promise.resolve()}}function Np(n,t,e,r={}){var f;n=_t(n,as);const s=Oe(t),o=n._getSettings(),a={...o,emulatorOptions:n._getEmulatorOptions()},c=`${t}:${e}`;s&&(mi(`https://${c}`),pi("Firestore",!0)),o.host!==il&&o.host!==c&&We("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h={...o,host:c,ssl:s,emulatorOptions:r};if(!Vr(h,a)&&(n._setSettings(h),r.mockUserToken)){let m,g;if(typeof r.mockUserToken=="string")m=r.mockUserToken,g=At.MOCK_USER;else{m=Ou(r.mockUserToken,(f=n._app)==null?void 0:f.options.projectId);const E=r.mockUserToken.sub||r.mockUserToken.user_id;if(!E)throw new N(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");g=new At(E)}n._authCredentials=new Mf(new Ku(m,g))}}/**
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
 */class Kt{constructor(t,e,r){this.converter=e,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new Kt(this.firestore,t,this._query)}}class tt{constructor(t,e,r){this.converter=e,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ce(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new tt(this.firestore,t,this._key)}toJSON(){return{type:tt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,r){if(Gn(e,tt._jsonSchema))return new tt(t,r||null,new x(Q.fromString(e.referencePath)))}}tt._jsonSchemaVersion="firestore/documentReference/1.0",tt._jsonSchema={type:ct("string",tt._jsonSchemaVersion),referencePath:ct("string")};class ce extends Kt{constructor(t,e,r){super(t,e,Jr(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new tt(this.firestore,null,new x(t))}withConverter(t){return new ce(this.firestore,t,this._path)}}function M_(n,t,...e){if(n=lt(n),Wu("collection","path",t),n instanceof as){const r=Q.fromString(t,...e);return Pa(r),new ce(n,null,r)}{if(!(n instanceof tt||n instanceof ce))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Q.fromString(t,...e));return Pa(r),new ce(n.firestore,null,r)}}function kp(n,t,...e){if(n=lt(n),arguments.length===1&&(t=wi.newId()),Wu("doc","path",t),n instanceof as){const r=Q.fromString(t,...e);return Ca(r),new tt(n,null,new x(r))}{if(!(n instanceof tt||n instanceof ce))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Q.fromString(t,...e));return Ca(r),new tt(n.firestore,n instanceof ce?n.converter:null,new x(r))}}/**
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
 */const _u="AsyncQueue";class yu{constructor(t=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new xi(this,"async_queue_retry"),this._c=()=>{const r=js();r&&O(_u,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=t;const e=js();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.uc(),this.cc(t)}enterRestrictedMode(t){if(!this.ec){this.ec=!0,this.sc=t||!1;const e=js();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this._c)}}enqueue(t){if(this.uc(),this.ec)return new Promise(()=>{});const e=new jt;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Xu.push(t),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(t){if(!rn(t))throw t;O(_u,"Operation failed with retryable error: "+t)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(t){const e=this.ac.then(()=>(this.rc=!0,t().catch(r=>{throw this.nc=r,this.rc=!1,Xt("INTERNAL UNHANDLED ERROR: ",Eu(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=e,e}enqueueAfterDelay(t,e,r){this.uc(),this.oc.indexOf(t)>-1&&(e=0);const s=Bi.createAndSchedule(this,t,e,r,o=>this.hc(o));return this.tc.push(s),s}uc(){this.nc&&M(47125,{Pc:Eu(this.nc)})}verifyOperationInProgress(){}async Tc(){let t;do t=this.ac,await t;while(t!==this.ac)}Ic(t){for(const e of this.tc)if(e.timerId===t)return!0;return!1}Ec(t){return this.Tc().then(()=>{this.tc.sort((e,r)=>e.targetTimeMs-r.targetTimeMs);for(const e of this.tc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Tc()})}dc(t){this.oc.push(t)}hc(t){const e=this.tc.indexOf(t);this.tc.splice(e,1)}}function Eu(n){let t=n.message||"";return n.stack&&(t=n.stack.includes(n.message)?n.stack:n.message+`
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
 */function Tu(n){return function(e,r){if(typeof e!="object"||e===null)return!1;const s=e;for(const o of r)if(o in s&&typeof s[o]=="function")return!0;return!1}(n,["next","error","complete"])}class Mt extends as{constructor(t,e,r,s){super(t,e,r,s),this.type="firestore",this._queue=new yu,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new yu(t),this._firestoreClient=void 0,await t}}}function L_(n,t){const e=typeof n=="object"?n:Ei(),r=typeof n=="string"?n:kr,s=_i(e,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=di("firestore");o&&Np(s,...o)}return s}function Le(n){if(n._terminated)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Op(n),n._firestoreClient}function Op(n){var r,s,o;const t=n._freezeSettings(),e=function(c,h,f,m){return new rd(c,h,f,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,sl(m.experimentalLongPollingOptions),m.useFetchStreams,m.isUsingEmulator)}(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,t);n._componentsProvider||(s=t.localCache)!=null&&s._offlineComponentProvider&&((o=t.localCache)!=null&&o._onlineComponentProvider)&&(n._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),n._firestoreClient=new Sp(n._authCredentials,n._appCheckCredentials,n._queue,e,n._componentsProvider&&function(c){const h=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(h),_online:h}}(n._componentsProvider))}/**
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
 */class Nt{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Nt(Tt.fromBase64String(t))}catch(e){throw new N(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Nt(Tt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:Nt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(Gn(t,Nt._jsonSchema))return Nt.fromBase64String(t.bytes)}}Nt._jsonSchemaVersion="firestore/bytes/1.0",Nt._jsonSchema={type:ct("string",Nt._jsonSchemaVersion),bytes:ct("string")};/**
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
 */class an{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new N(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Et(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
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
 */class us{constructor(t){this._methodName=t}}/**
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
 */class zt{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new N(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new N(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return $(this._lat,t._lat)||$(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:zt._jsonSchemaVersion}}static fromJSON(t){if(Gn(t,zt._jsonSchema))return new zt(t.latitude,t.longitude)}}zt._jsonSchemaVersion="firestore/geoPoint/1.0",zt._jsonSchema={type:ct("string",zt._jsonSchemaVersion),latitude:ct("number"),longitude:ct("number")};/**
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
 */class Gt{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,t._values)}toJSON(){return{type:Gt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(Gn(t,Gt._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every(e=>typeof e=="number"))return new Gt(t.vectorValues);throw new N(S.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Gt._jsonSchemaVersion="firestore/vectorValue/1.0",Gt._jsonSchema={type:ct("string",Gt._jsonSchemaVersion),vectorValues:ct("object")};/**
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
 */const xp=/^__.*__$/;class Mp{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return this.fieldMask!==null?new Te(t,this.data,this.fieldMask,e,this.fieldTransforms):new Kn(t,this.data,e,this.fieldTransforms)}}class ol{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return new Te(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function al(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M(40011,{Ac:n})}}class Xi{constructor(t,e,r,s,o,a){this.settings=t,this.databaseId=e,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.Rc(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(t){return new Xi({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),r=this.Vc({path:e,fc:!1});return r.gc(t),r}yc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),r=this.Vc({path:e,fc:!1});return r.Rc(),r}wc(t){return this.Vc({path:void 0,fc:!0})}Sc(t){return zr(t,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}Rc(){if(this.path)for(let t=0;t<this.path.length;t++)this.gc(this.path.get(t))}gc(t){if(t.length===0)throw this.Sc("Document fields must not be empty");if(al(this.Ac)&&xp.test(t))throw this.Sc('Document fields cannot begin and end with "__"')}}class Lp{constructor(t,e,r){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=r||ss(t)}Cc(t,e,r,s=!1){return new Xi({Ac:t,methodName:e,Dc:r,path:Et.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function un(n){const t=n._freezeSettings(),e=ss(n._databaseId);return new Lp(n._databaseId,!!t.ignoreUndefinedProperties,e)}function cs(n,t,e,r,s,o={}){const a=n.Cc(o.merge||o.mergeFields?2:0,t,e,s);to("Data must be an object, but it was:",a,r);const c=ul(r,a);let h,f;if(o.merge)h=new kt(a.fieldMask),f=a.fieldTransforms;else if(o.mergeFields){const m=[];for(const g of o.mergeFields){const E=li(t,g,e);if(!a.contains(E))throw new N(S.INVALID_ARGUMENT,`Field '${E}' is specified in your field mask but missing from your input data.`);ll(m,E)||m.push(E)}h=new kt(m),f=a.fieldTransforms.filter(g=>h.covers(g.field))}else h=null,f=a.fieldTransforms;return new Mp(new St(c),h,f)}class ls extends us{_toFieldTransform(t){if(t.Ac!==2)throw t.Ac===1?t.Sc(`${this._methodName}() can only appear at the top level of your update data`):t.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof ls}}class Yi extends us{_toFieldTransform(t){return new Pd(t.path,new jn)}isEqual(t){return t instanceof Yi}}function Ji(n,t,e,r){const s=n.Cc(1,t,e);to("Data must be an object, but it was:",s,r);const o=[],a=St.empty();Ee(r,(h,f)=>{const m=eo(t,h,e);f=lt(f);const g=s.yc(m);if(f instanceof ls)o.push(m);else{const E=Jn(f,g);E!=null&&(o.push(m),a.set(m,E))}});const c=new kt(o);return new ol(a,c,s.fieldTransforms)}function Zi(n,t,e,r,s,o){const a=n.Cc(1,t,e),c=[li(t,r,e)],h=[s];if(o.length%2!=0)throw new N(S.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let E=0;E<o.length;E+=2)c.push(li(t,o[E])),h.push(o[E+1]);const f=[],m=St.empty();for(let E=c.length-1;E>=0;--E)if(!ll(f,c[E])){const b=c[E];let V=h[E];V=lt(V);const k=a.yc(b);if(V instanceof ls)f.push(b);else{const P=Jn(V,k);P!=null&&(f.push(b),m.set(b,P))}}const g=new kt(f);return new ol(m,g,a.fieldTransforms)}function Fp(n,t,e,r=!1){return Jn(e,n.Cc(r?4:3,t))}function Jn(n,t){if(cl(n=lt(n)))return to("Unsupported field value:",t,n),ul(n,t);if(n instanceof us)return function(r,s){if(!al(s.Ac))throw s.Sc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.fc&&t.Ac!==4)throw t.Sc("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const c of r){let h=Jn(c,s.wc(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,t)}return function(r,s){if((r=lt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return bd(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=J.fromDate(r);return{timestampValue:Fr(s.serializer,o)}}if(r instanceof J){const o=new J(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Fr(s.serializer,o)}}if(r instanceof zt)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Nt)return{bytesValue:Vc(s.serializer,r._byteString)};if(r instanceof tt){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Sc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Vi(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Gt)return function(a,c){return{mapValue:{fields:{[rc]:{stringValue:sc},[Or]:{arrayValue:{values:a.toArray().map(f=>{if(typeof f!="number")throw c.Sc("VectorValues must only contain numeric values.");return Si(c.serializer,f)})}}}}}}(r,s);throw s.Sc(`Unsupported field value: ${Qr(r)}`)}(n,t)}function ul(n,t){const e={};return Yu(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Ee(n,(r,s)=>{const o=Jn(s,t.mc(r));o!=null&&(e[r]=o)}),{mapValue:{fields:e}}}function cl(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof J||n instanceof zt||n instanceof Nt||n instanceof tt||n instanceof us||n instanceof Gt)}function to(n,t,e){if(!cl(e)||!Qu(e)){const r=Qr(e);throw r==="an object"?t.Sc(n+" a custom object"):t.Sc(n+" "+r)}}function li(n,t,e){if((t=lt(t))instanceof an)return t._internalPath;if(typeof t=="string")return eo(n,t);throw zr("Field path arguments must be of type string or ",n,!1,void 0,e)}const Up=new RegExp("[~\\*/\\[\\]]");function eo(n,t,e){if(t.search(Up)>=0)throw zr(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new an(...t.split("."))._internalPath}catch{throw zr(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function zr(n,t,e,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let c=`Function ${t}() called with invalid data`;e&&(c+=" (via `toFirestore()`)"),c+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new N(S.INVALID_ARGUMENT,c+n+h)}function ll(n,t){return n.some(e=>e.isEqual(t))}/**
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
 */class Gr{constructor(t,e,r,s,o){this._firestore=t,this._userDataWriter=e,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new tt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new Bp(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(hs("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class Bp extends Gr{data(){return super.data()}}function hs(n,t){return typeof t=="string"?eo(n,t):t instanceof an?t._internalPath:t._delegate._internalPath}/**
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
 */function hl(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new N(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class no{}class ro extends no{}function F_(n,t,...e){let r=[];t instanceof no&&r.push(t),r=r.concat(e),function(o){const a=o.filter(h=>h instanceof so).length,c=o.filter(h=>h instanceof fs).length;if(a>1||a>0&&c>0)throw new N(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)n=s._apply(n);return n}class fs extends ro{constructor(t,e,r){super(),this._field=t,this._op=e,this._value=r,this.type="where"}static _create(t,e,r){return new fs(t,e,r)}_apply(t){const e=this._parse(t);return fl(t._query,e),new Kt(t.firestore,t.converter,ei(t._query,e))}_parse(t){const e=un(t.firestore);return function(o,a,c,h,f,m,g){let E;if(f.isKeyField()){if(m==="array-contains"||m==="array-contains-any")throw new N(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${m}' queries on documentId().`);if(m==="in"||m==="not-in"){Iu(g,m);const V=[];for(const k of g)V.push(wu(h,o,k));E={arrayValue:{values:V}}}else E=wu(h,o,g)}else m!=="in"&&m!=="not-in"&&m!=="array-contains-any"||Iu(g,m),E=Fp(c,a,g,m==="in"||m==="not-in");return at.create(f,m,E)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function U_(n,t,e){const r=t,s=hs("where",n);return fs._create(s,r,e)}class so extends no{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new so(t,e)}_parse(t){const e=this._queryConstraints.map(r=>r._parse(t)).filter(r=>r.getFilters().length>0);return e.length===1?e[0]:Lt.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(s,o){let a=s;const c=o.getFlattenedFilters();for(const h of c)fl(a,h),a=ei(a,h)}(t._query,e),new Kt(t.firestore,t.converter,ei(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class io extends ro{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new io(t,e)}_apply(t){const e=function(s,o,a){if(s.startAt!==null)throw new N(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new N(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new qn(o,a)}(t._query,this._field,this._direction);return new Kt(t.firestore,t.converter,function(s,o){const a=s.explicitOrderBy.concat([o]);return new sn(s.path,s.collectionGroup,a,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(t._query,e))}}function B_(n,t="asc"){const e=t,r=hs("orderBy",n);return io._create(r,e)}class oo extends ro{constructor(t,e,r){super(),this.type=t,this._limit=e,this._limitType=r}static _create(t,e,r){return new oo(t,e,r)}_apply(t){return new Kt(t.firestore,t.converter,Mr(t._query,this._limit,this._limitType))}}function q_(n){return Hf("limit",n),oo._create("limit",n,"F")}function wu(n,t,e){if(typeof(e=lt(e))=="string"){if(e==="")throw new N(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!fc(t)&&e.indexOf("/")!==-1)throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const r=t.path.child(Q.fromString(e));if(!x.isDocumentKey(r))throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return La(n,new x(r))}if(e instanceof tt)return La(n,e._key);throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Qr(e)}.`)}function Iu(n,t){if(!Array.isArray(n)||n.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function fl(n,t){const e=function(s,o){for(const a of s)for(const c of a.getFlattenedFilters())if(o.indexOf(c.op)>=0)return c.op;return null}(n.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class dl{convertValue(t,e="none"){switch(pe(t)){case 0:return null;case 1:return t.booleanValue;case 2:return it(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(me(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw M(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const r={};return Ee(t,(s,o)=>{r[s]=this.convertValue(o,e)}),r}convertVectorValue(t){var r,s,o;const e=(o=(s=(r=t.fields)==null?void 0:r[Or].arrayValue)==null?void 0:s.values)==null?void 0:o.map(a=>it(a.doubleValue));return new Gt(e)}convertGeoPoint(t){return new zt(it(t.latitude),it(t.longitude))}convertArray(t,e){return(t.values||[]).map(r=>this.convertValue(r,e))}convertServerTimestamp(t,e){switch(e){case"previous":const r=Yr(t);return r==null?null:this.convertValue(r,e);case"estimate":return this.convertTimestamp(Fn(t));default:return null}}convertTimestamp(t){const e=de(t);return new J(e.seconds,e.nanos)}convertDocumentKey(t,e){const r=Q.fromString(t);K(Lc(r),9688,{name:t});const s=new Un(r.get(1),r.get(3)),o=new x(r.popFirst(5));return s.isEqual(e)||Xt(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),o}}/**
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
 */function ds(n,t,e){let r;return r=n?e&&(e.merge||e.mergeFields)?n.toFirestore(t,e):n.toFirestore(t):t,r}class qp extends dl{constructor(t){super(),this.firestore=t}convertBytes(t){return new Nt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new tt(this.firestore,null,e)}}class Ge{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class le extends Gr{constructor(t,e,r,s,o,a){super(t,e,r,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=o}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Cr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const r=this._document.data.field(hs("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=le._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}le._jsonSchemaVersion="firestore/documentSnapshot/1.0",le._jsonSchema={type:ct("string",le._jsonSchemaVersion),bundleSource:ct("string","DocumentSnapshot"),bundleName:ct("string"),bundle:ct("string")};class Cr extends le{data(t={}){return super.data(t)}}class he{constructor(t,e,r,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new Ge(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(r=>{t.call(e,new Cr(this._firestore,this._userDataWriter,r.key,r,new Ge(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new N(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(c=>{const h=new Cr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Ge(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(c=>o||c.type!==3).map(c=>{const h=new Cr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Ge(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let f=-1,m=-1;return c.type!==0&&(f=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),m=a.indexOf(c.doc.key)),{type:jp(c.type),doc:h,oldIndex:f,newIndex:m}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=he._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=wi.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],r=[],s=[];return this.docs.forEach(o=>{o._document!==null&&(e.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))}),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function jp(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M(61501,{type:n})}}/**
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
 */function j_(n){n=_t(n,tt);const t=_t(n.firestore,Mt);return Dp(Le(t),n._key).then(e=>ml(t,n,e))}he._jsonSchemaVersion="firestore/querySnapshot/1.0",he._jsonSchema={type:ct("string",he._jsonSchemaVersion),bundleSource:ct("string","QuerySnapshot"),bundleName:ct("string"),bundle:ct("string")};class Zn extends dl{constructor(t){super(),this.firestore=t}convertBytes(t){return new Nt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new tt(this.firestore,null,e)}}function $_(n){n=_t(n,Kt);const t=_t(n.firestore,Mt),e=Le(t),r=new Zn(t);return hl(n._query),rl(e,n._query).then(s=>new he(t,r,n,s))}function z_(n){n=_t(n,Kt);const t=_t(n.firestore,Mt),e=Le(t),r=new Zn(t);return rl(e,n._query,{source:"server"}).then(s=>new he(t,r,n,s))}function G_(n,t,e){n=_t(n,tt);const r=_t(n.firestore,Mt),s=ds(n.converter,t,e);return tr(r,[cs(un(r),"setDoc",n._key,s,n.converter!==null,e).toMutation(n._key,ut.none())])}function H_(n,t,e,...r){n=_t(n,tt);const s=_t(n.firestore,Mt),o=un(s);let a;return a=typeof(t=lt(t))=="string"||t instanceof an?Zi(o,"updateDoc",n._key,t,e,r):Ji(o,"updateDoc",n._key,t),tr(s,[a.toMutation(n._key,ut.exists(!0))])}function K_(n){return tr(_t(n.firestore,Mt),[new Wn(n._key,ut.none())])}function W_(n,t){const e=_t(n.firestore,Mt),r=kp(n),s=ds(n.converter,t);return tr(e,[cs(un(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,ut.exists(!1))]).then(()=>r)}function Q_(n,...t){var h,f,m;n=lt(n);let e={includeMetadataChanges:!1,source:"default"},r=0;typeof t[r]!="object"||Tu(t[r])||(e=t[r++]);const s={includeMetadataChanges:e.includeMetadataChanges,source:e.source};if(Tu(t[r])){const g=t[r];t[r]=(h=g.next)==null?void 0:h.bind(g),t[r+1]=(f=g.error)==null?void 0:f.bind(g),t[r+2]=(m=g.complete)==null?void 0:m.bind(g)}let o,a,c;if(n instanceof tt)a=_t(n.firestore,Mt),c=Jr(n._key.path),o={next:g=>{t[r]&&t[r](ml(a,n,g))},error:t[r+1],complete:t[r+2]};else{const g=_t(n,Kt);a=_t(g.firestore,Mt),c=g._query;const E=new Zn(a);o={next:b=>{t[r]&&t[r](new he(a,E,g,b))},error:t[r+1],complete:t[r+2]},hl(n._query)}return function(E,b,V,k){const P=new Wi(k),j=new Gi(b,P,V);return E.asyncQueue.enqueueAndForget(async()=>ji(await $r(E),j)),()=>{P.Nu(),E.asyncQueue.enqueueAndForget(async()=>$i(await $r(E),j))}}(Le(a),c,s,o)}function tr(n,t){return function(r,s){const o=new jt;return r.asyncQueue.enqueueAndForget(async()=>gp(await Pp(r),s,o)),o.promise}(Le(n),t)}function ml(n,t,e){const r=e.docs.get(t._key),s=new Zn(n);return new le(n,s,t._key,r,new Ge(e.hasPendingWrites,e.fromCache),t.converter)}/**
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
 */const $p={maxAttempts:5};/**
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
 */class zp{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=un(t)}set(t,e,r){this._verifyNotCommitted();const s=oe(t,this._firestore),o=ds(s.converter,e,r),a=cs(this._dataReader,"WriteBatch.set",s._key,o,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,ut.none())),this}update(t,e,r,...s){this._verifyNotCommitted();const o=oe(t,this._firestore);let a;return a=typeof(e=lt(e))=="string"||e instanceof an?Zi(this._dataReader,"WriteBatch.update",o._key,e,r,s):Ji(this._dataReader,"WriteBatch.update",o._key,e),this._mutations.push(a.toMutation(o._key,ut.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=oe(t,this._firestore);return this._mutations=this._mutations.concat(new Wn(e._key,ut.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new N(S.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function oe(n,t){if((n=lt(n)).firestore!==t)throw new N(S.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
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
 */class Gp{constructor(t,e){this._firestore=t,this._transaction=e,this._dataReader=un(t)}get(t){const e=oe(t,this._firestore),r=new qp(this._firestore);return this._transaction.lookup([e._key]).then(s=>{if(!s||s.length!==1)return M(24041);const o=s[0];if(o.isFoundDocument())return new Gr(this._firestore,r,o.key,o,e.converter);if(o.isNoDocument())return new Gr(this._firestore,r,e._key,null,e.converter);throw M(18433,{doc:o})})}set(t,e,r){const s=oe(t,this._firestore),o=ds(s.converter,e,r),a=cs(this._dataReader,"Transaction.set",s._key,o,s.converter!==null,r);return this._transaction.set(s._key,a),this}update(t,e,r,...s){const o=oe(t,this._firestore);let a;return a=typeof(e=lt(e))=="string"||e instanceof an?Zi(this._dataReader,"Transaction.update",o._key,e,r,s):Ji(this._dataReader,"Transaction.update",o._key,e),this._transaction.update(o._key,a),this}delete(t){const e=oe(t,this._firestore);return this._transaction.delete(e._key),this}}/**
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
 */class Hp extends Gp{constructor(t,e){super(t,e),this._firestore=t}get(t){const e=oe(t,this._firestore),r=new Zn(this._firestore);return super.get(t).then(s=>new le(this._firestore,r,e._key,s._document,new Ge(!1,!1),e.converter))}}function X_(n,t,e){n=_t(n,Mt);const r={...$p,...e};return function(o){if(o.maxAttempts<1)throw new N(S.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r),function(o,a,c){const h=new jt;return o.asyncQueue.enqueueAndForget(async()=>{const f=await Vp(o);new bp(o.asyncQueue,f,c,a,h).ju()}),h.promise}(Le(n),s=>t(new Hp(n,s)),r)}function Y_(){return new Yi("serverTimestamp")}/**
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
 */function J_(n){return Le(n=_t(n,Mt)),new zp(n,t=>tr(n,t))}(function(t,e=!0){(function(s){en=s})(Lu),Ke(new Ve("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),c=new Mt(new Lf(r.getProvider("auth-internal")),new Bf(a,r.getProvider("app-check-internal")),function(f,m){if(!Object.prototype.hasOwnProperty.apply(f.options,["projectId"]))throw new N(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Un(f.options.projectId,m)}(a,s),a);return o={useFetchStreams:e,...o},c._setSettings(o),c},"PUBLIC").setMultipleInstances(!0)),Wt(va,Ra,t),Wt(va,Ra,"esm2020")})();/**
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
 */const Kp="type.googleapis.com/google.protobuf.Int64Value",Wp="type.googleapis.com/google.protobuf.UInt64Value";function pl(n,t){const e={};for(const r in n)n.hasOwnProperty(r)&&(e[r]=t(n[r]));return e}function Hr(n){if(n==null)return null;if(n instanceof Number&&(n=n.valueOf()),typeof n=="number"&&isFinite(n)||n===!0||n===!1||Object.prototype.toString.call(n)==="[object String]")return n;if(n instanceof Date)return n.toISOString();if(Array.isArray(n))return n.map(t=>Hr(t));if(typeof n=="function"||typeof n=="object")return pl(n,t=>Hr(t));throw new Error("Data cannot be encoded in JSON: "+n)}function tn(n){if(n==null)return n;if(n["@type"])switch(n["@type"]){case Kp:case Wp:{const t=Number(n.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+n);return t}default:throw new Error("Data cannot be decoded from JSON: "+n)}return Array.isArray(n)?n.map(t=>tn(t)):typeof n=="function"||typeof n=="object"?pl(n,t=>tn(t)):n}/**
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
 */const ao="functions";/**
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
 */const Au={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Vt extends ye{constructor(t,e,r){super(`${ao}/${t}`,e||""),this.details=r,Object.setPrototypeOf(this,Vt.prototype)}}function Qp(n){if(n>=200&&n<300)return"ok";switch(n){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function Kr(n,t){let e=Qp(n),r=e,s;try{const o=t&&t.error;if(o){const a=o.status;if(typeof a=="string"){if(!Au[a])return new Vt("internal","internal");e=Au[a],r=a}const c=o.message;typeof c=="string"&&(r=c),s=o.details,s!==void 0&&(s=tn(s))}}catch{}return e==="ok"?null:new Vt(e,r,s)}/**
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
 */class Xp{constructor(t,e,r,s){this.app=t,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,yi(t)&&t.settings.appCheckToken&&(this.serverAppAppCheckToken=t.settings.appCheckToken),this.auth=e.getImmediate({optional:!0}),this.messaging=r.getImmediate({optional:!0}),this.auth||e.get().then(o=>this.auth=o,()=>{}),this.messaging||r.get().then(o=>this.messaging=o,()=>{}),this.appCheck||s==null||s.get().then(o=>this.appCheck=o,()=>{})}async getAuthToken(){if(this.auth)try{const t=await this.auth.getToken();return t==null?void 0:t.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(t){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const e=t?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return e.error?null:e.token}return null}async getContext(t){const e=await this.getAuthToken(),r=await this.getMessagingToken(),s=await this.getAppCheckToken(t);return{authToken:e,messagingToken:r,appCheckToken:s}}}/**
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
 */const hi="us-central1",Yp=/^data: (.*?)(?:\n|$)/;function Jp(n){let t=null;return{promise:new Promise((e,r)=>{t=setTimeout(()=>{r(new Vt("deadline-exceeded","deadline-exceeded"))},n)}),cancel:()=>{t&&clearTimeout(t)}}}class Zp{constructor(t,e,r,s,o=hi,a=(...c)=>fetch(...c)){this.app=t,this.fetchImpl=a,this.emulatorOrigin=null,this.contextProvider=new Xp(t,e,r,s),this.cancelAllRequests=new Promise(c=>{this.deleteService=()=>Promise.resolve(c())});try{const c=new URL(o);this.customDomain=c.origin+(c.pathname==="/"?"":c.pathname),this.region=hi}catch{this.customDomain=null,this.region=o}}_delete(){return this.deleteService()}_url(t){const e=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${e}/${this.region}/${t}`:this.customDomain!==null?`${this.customDomain}/${t}`:`https://${this.region}-${e}.cloudfunctions.net/${t}`}}function tg(n,t,e){const r=Oe(t);n.emulatorOrigin=`http${r?"s":""}://${t}:${e}`,r&&(mi(n.emulatorOrigin+"/backends"),pi("Functions",!0))}function eg(n,t,e){const r=s=>rg(n,t,s,{});return r.stream=(s,o)=>ig(n,t,s,o),r}function gl(n){return n.emulatorOrigin&&Oe(n.emulatorOrigin)?"include":void 0}async function ng(n,t,e,r,s){e["Content-Type"]="application/json";let o;try{o=await r(n,{method:"POST",body:JSON.stringify(t),headers:e,credentials:gl(s)})}catch{return{status:0,json:null}}let a=null;try{a=await o.json()}catch{}return{status:o.status,json:a}}async function _l(n,t){const e={},r=await n.contextProvider.getContext(t.limitedUseAppCheckTokens);return r.authToken&&(e.Authorization="Bearer "+r.authToken),r.messagingToken&&(e["Firebase-Instance-ID-Token"]=r.messagingToken),r.appCheckToken!==null&&(e["X-Firebase-AppCheck"]=r.appCheckToken),e}function rg(n,t,e,r){const s=n._url(t);return sg(n,s,e,r)}async function sg(n,t,e,r){e=Hr(e);const s={data:e},o=await _l(n,r),a=r.timeout||7e4,c=Jp(a),h=await Promise.race([ng(t,s,o,n.fetchImpl,n),c.promise,n.cancelAllRequests]);if(c.cancel(),!h)throw new Vt("cancelled","Firebase Functions instance was deleted.");const f=Kr(h.status,h.json);if(f)throw f;if(!h.json)throw new Vt("internal","Response is not valid JSON object.");let m=h.json.data;if(typeof m>"u"&&(m=h.json.result),typeof m>"u")throw new Vt("internal","Response is missing data field.");return{data:tn(m)}}function ig(n,t,e,r){const s=n._url(t);return og(n,s,e,r||{})}async function og(n,t,e,r){var E;e=Hr(e);const s={data:e},o=await _l(n,r);o["Content-Type"]="application/json",o.Accept="text/event-stream";let a;try{a=await n.fetchImpl(t,{method:"POST",body:JSON.stringify(s),headers:o,signal:r==null?void 0:r.signal,credentials:gl(n)})}catch(b){if(b instanceof Error&&b.name==="AbortError"){const k=new Vt("cancelled","Request was cancelled.");return{data:Promise.reject(k),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(k)}}}}}}const V=Kr(0,null);return{data:Promise.reject(V),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(V)}}}}}}let c,h;const f=new Promise((b,V)=>{c=b,h=V});(E=r==null?void 0:r.signal)==null||E.addEventListener("abort",()=>{const b=new Vt("cancelled","Request was cancelled.");h(b)});const m=a.body.getReader(),g=ag(m,c,h,r==null?void 0:r.signal);return{stream:{[Symbol.asyncIterator](){const b=g.getReader();return{async next(){const{value:V,done:k}=await b.read();return{value:V,done:k}},async return(){return await b.cancel(),{done:!0,value:void 0}}}}},data:f}}function ag(n,t,e,r){const s=(a,c)=>{const h=a.match(Yp);if(!h)return;const f=h[1];try{const m=JSON.parse(f);if("result"in m){t(tn(m.result));return}if("message"in m){c.enqueue(tn(m.message));return}if("error"in m){const g=Kr(0,m);c.error(g),e(g);return}}catch(m){if(m instanceof Vt){c.error(m),e(m);return}}},o=new TextDecoder;return new ReadableStream({start(a){let c="";return h();async function h(){if(r!=null&&r.aborted){const f=new Vt("cancelled","Request was cancelled");return a.error(f),e(f),Promise.resolve()}try{const{value:f,done:m}=await n.read();if(m){c.trim()&&s(c.trim(),a),a.close();return}if(r!=null&&r.aborted){const E=new Vt("cancelled","Request was cancelled");a.error(E),e(E),await n.cancel();return}c+=o.decode(f,{stream:!0});const g=c.split(`
`);c=g.pop()||"";for(const E of g)E.trim()&&s(E.trim(),a);return h()}catch(f){const m=f instanceof Vt?f:Kr(0,null);a.error(m),e(m)}}},cancel(){return n.cancel()}})}const vu="@firebase/functions",Ru="0.13.1";/**
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
 */const ug="auth-internal",cg="app-check-internal",lg="messaging-internal";function hg(n){const t=(e,{instanceIdentifier:r})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider(ug),a=e.getProvider(lg),c=e.getProvider(cg);return new Zp(s,o,a,c,r)};Ke(new Ve(ao,t,"PUBLIC").setMultipleInstances(!0)),Wt(vu,Ru,n),Wt(vu,Ru,"esm2020")}/**
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
 */function Z_(n=Ei(),t=hi){const r=_i(lt(n),ao).getImmediate({identifier:t}),s=di("functions");return s&&fg(r,...s),r}function fg(n,t,e){tg(lt(n),t,e)}function ty(n,t,e){return eg(lt(n),t)}hg();/**
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
 */const yl="firebasestorage.googleapis.com",El="storageBucket",dg=2*60*1e3,mg=10*60*1e3;/**
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
 */class st extends ye{constructor(t,e,r=0){super(zs(t),`Firebase Storage: ${e} (${zs(t)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,st.prototype)}get status(){return this.status_}set status(t){this.status_=t}_codeEquals(t){return zs(t)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(t){this.customData.serverResponse=t,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var rt;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(rt||(rt={}));function zs(n){return"storage/"+n}function uo(){const n="An unknown error occurred, please check the error payload for server response.";return new st(rt.UNKNOWN,n)}function pg(n){return new st(rt.OBJECT_NOT_FOUND,"Object '"+n+"' does not exist.")}function gg(n){return new st(rt.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function _g(){const n="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new st(rt.UNAUTHENTICATED,n)}function yg(){return new st(rt.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Eg(n){return new st(rt.UNAUTHORIZED,"User does not have permission to access '"+n+"'.")}function Tg(){return new st(rt.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function wg(){return new st(rt.CANCELED,"User canceled the upload/download.")}function Ig(n){return new st(rt.INVALID_URL,"Invalid URL '"+n+"'.")}function Ag(n){return new st(rt.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function vg(){return new st(rt.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+El+"' property when initializing the app?")}function Rg(){return new st(rt.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function bg(){return new st(rt.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function Sg(n){return new st(rt.UNSUPPORTED_ENVIRONMENT,`${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function fi(n){return new st(rt.INVALID_ARGUMENT,n)}function Tl(){return new st(rt.APP_DELETED,"The Firebase app was deleted.")}function Cg(n){return new st(rt.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function xn(n,t){return new st(rt.INVALID_FORMAT,"String does not match format '"+n+"': "+t)}function Rn(n){throw new st(rt.INTERNAL_ERROR,"Internal error: "+n)}/**
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
 */class Ot{constructor(t,e){this.bucket=t,this.path_=e}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const t=encodeURIComponent;return"/b/"+t(this.bucket)+"/o/"+t(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(t,e){let r;try{r=Ot.makeFromUrl(t,e)}catch{return new Ot(t,"")}if(r.path==="")return r;throw Ag(t)}static makeFromUrl(t,e){let r=null;const s="([A-Za-z0-9.\\-_]+)";function o(W){W.path.charAt(W.path.length-1)==="/"&&(W.path_=W.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+s+a,"i"),h={bucket:1,path:3};function f(W){W.path_=decodeURIComponent(W.path)}const m="v[A-Za-z0-9_]+",g=e.replace(/[.]/g,"\\."),E="(/([^?#]*).*)?$",b=new RegExp(`^https?://${g}/${m}/b/${s}/o${E}`,"i"),V={bucket:1,path:3},k=e===yl?"(?:storage.googleapis.com|storage.cloud.google.com)":e,P="([^?#]*)",j=new RegExp(`^https?://${k}/${s}/${P}`,"i"),B=[{regex:c,indices:h,postModify:o},{regex:b,indices:V,postModify:f},{regex:j,indices:{bucket:1,path:2},postModify:f}];for(let W=0;W<B.length;W++){const dt=B[W],Z=dt.regex.exec(t);if(Z){const w=Z[dt.indices.bucket];let p=Z[dt.indices.path];p||(p=""),r=new Ot(w,p),dt.postModify(r);break}}if(r==null)throw Ig(t);return r}}class Pg{constructor(t){this.promise_=Promise.reject(t)}getPromise(){return this.promise_}cancel(t=!1){}}/**
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
 */function Vg(n,t,e){let r=1,s=null,o=null,a=!1,c=0;function h(){return c===2}let f=!1;function m(...P){f||(f=!0,t.apply(null,P))}function g(P){s=setTimeout(()=>{s=null,n(b,h())},P)}function E(){o&&clearTimeout(o)}function b(P,...j){if(f){E();return}if(P){E(),m.call(null,P,...j);return}if(h()||a){E(),m.call(null,P,...j);return}r<64&&(r*=2);let B;c===1?(c=2,B=0):B=(r+Math.random())*1e3,g(B)}let V=!1;function k(P){V||(V=!0,E(),!f&&(s!==null?(P||(c=2),clearTimeout(s),g(0)):P||(c=1)))}return g(0),o=setTimeout(()=>{a=!0,k(!0)},e),k}function Dg(n){n(!1)}/**
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
 */function Ng(n){return n!==void 0}function kg(n){return typeof n=="object"&&!Array.isArray(n)}function co(n){return typeof n=="string"||n instanceof String}function bu(n){return lo()&&n instanceof Blob}function lo(){return typeof Blob<"u"}function Su(n,t,e,r){if(r<t)throw fi(`Invalid value for '${n}'. Expected ${t} or greater.`);if(r>e)throw fi(`Invalid value for '${n}'. Expected ${e} or less.`)}/**
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
 */function ho(n,t,e){let r=t;return e==null&&(r=`https://${t}`),`${e}://${r}/v0${n}`}function wl(n){const t=encodeURIComponent;let e="?";for(const r in n)if(n.hasOwnProperty(r)){const s=t(r)+"="+t(n[r]);e=e+s+"&"}return e=e.slice(0,-1),e}var Pe;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(Pe||(Pe={}));/**
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
 */function Og(n,t){const e=n>=500&&n<600,s=[408,429].indexOf(n)!==-1,o=t.indexOf(n)!==-1;return e||s||o}/**
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
 */class xg{constructor(t,e,r,s,o,a,c,h,f,m,g,E=!0,b=!1){this.url_=t,this.method_=e,this.headers_=r,this.body_=s,this.successCodes_=o,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=h,this.timeout_=f,this.progressCallback_=m,this.connectionFactory_=g,this.retry=E,this.isUsingEmulator=b,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((V,k)=>{this.resolve_=V,this.reject_=k,this.start_()})}start_(){const t=(r,s)=>{if(s){r(!1,new wr(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const a=c=>{const h=c.loaded,f=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(h,f)};this.progressCallback_!==null&&o.addUploadProgressListener(a),o.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(a),this.pendingConnection_=null;const c=o.getErrorCode()===Pe.NO_ERROR,h=o.getStatus();if(!c||Og(h,this.additionalRetryCodes_)&&this.retry){const m=o.getErrorCode()===Pe.ABORT;r(!1,new wr(!1,null,m));return}const f=this.successCodes_.indexOf(h)!==-1;r(!0,new wr(f,o))})},e=(r,s)=>{const o=this.resolve_,a=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const h=this.callback_(c,c.getResponse());Ng(h)?o(h):o()}catch(h){a(h)}else if(c!==null){const h=uo();h.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,h)):a(h)}else if(s.canceled){const h=this.appDelete_?Tl():wg();a(h)}else{const h=Tg();a(h)}};this.canceled_?e(!1,new wr(!1,null,!0)):this.backoffId_=Vg(t,e,this.timeout_)}getPromise(){return this.promise_}cancel(t){this.canceled_=!0,this.appDelete_=t||!1,this.backoffId_!==null&&Dg(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class wr{constructor(t,e,r){this.wasSuccessCode=t,this.connection=e,this.canceled=!!r}}function Mg(n,t){t!==null&&t.length>0&&(n.Authorization="Firebase "+t)}function Lg(n,t){n["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}function Fg(n,t){t&&(n["X-Firebase-GMPID"]=t)}function Ug(n,t){t!==null&&(n["X-Firebase-AppCheck"]=t)}function Bg(n,t,e,r,s,o,a=!0,c=!1){const h=wl(n.urlParams),f=n.url+h,m=Object.assign({},n.headers);return Fg(m,t),Mg(m,e),Lg(m,o),Ug(m,r),new xg(f,n.method,m,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,s,a,c)}/**
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
 */function qg(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function jg(...n){const t=qg();if(t!==void 0){const e=new t;for(let r=0;r<n.length;r++)e.append(n[r]);return e.getBlob()}else{if(lo())return new Blob(n);throw new st(rt.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function $g(n,t,e){return n.webkitSlice?n.webkitSlice(t,e):n.mozSlice?n.mozSlice(t,e):n.slice?n.slice(t,e):null}/**
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
 */function zg(n){if(typeof atob>"u")throw Sg("base-64");return atob(n)}/**
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
 */const qt={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Gs{constructor(t,e){this.data=t,this.contentType=e||null}}function Gg(n,t){switch(n){case qt.RAW:return new Gs(Il(t));case qt.BASE64:case qt.BASE64URL:return new Gs(Al(n,t));case qt.DATA_URL:return new Gs(Kg(t),Wg(t))}throw uo()}function Il(n){const t=[];for(let e=0;e<n.length;e++){let r=n.charCodeAt(e);if(r<=127)t.push(r);else if(r<=2047)t.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(e<n.length-1&&(n.charCodeAt(e+1)&64512)===56320))t.push(239,191,189);else{const o=r,a=n.charCodeAt(++e);r=65536|(o&1023)<<10|a&1023,t.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?t.push(239,191,189):t.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(t)}function Hg(n){let t;try{t=decodeURIComponent(n)}catch{throw xn(qt.DATA_URL,"Malformed data URL.")}return Il(t)}function Al(n,t){switch(n){case qt.BASE64:{const s=t.indexOf("-")!==-1,o=t.indexOf("_")!==-1;if(s||o)throw xn(n,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case qt.BASE64URL:{const s=t.indexOf("+")!==-1,o=t.indexOf("/")!==-1;if(s||o)throw xn(n,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let e;try{e=zg(t)}catch(s){throw s.message.includes("polyfill")?s:xn(n,"Invalid character found")}const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r}class vl{constructor(t){this.base64=!1,this.contentType=null;const e=t.match(/^data:([^,]+)?,/);if(e===null)throw xn(qt.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=e[1]||null;r!=null&&(this.base64=Qg(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=t.substring(t.indexOf(",")+1)}}function Kg(n){const t=new vl(n);return t.base64?Al(qt.BASE64,t.rest):Hg(t.rest)}function Wg(n){return new vl(n).contentType}function Qg(n,t){return n.length>=t.length?n.substring(n.length-t.length)===t:!1}/**
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
 */class se{constructor(t,e){let r=0,s="";bu(t)?(this.data_=t,r=t.size,s=t.type):t instanceof ArrayBuffer?(e?this.data_=new Uint8Array(t):(this.data_=new Uint8Array(t.byteLength),this.data_.set(new Uint8Array(t))),r=this.data_.length):t instanceof Uint8Array&&(e?this.data_=t:(this.data_=new Uint8Array(t.length),this.data_.set(t)),r=t.length),this.size_=r,this.type_=s}size(){return this.size_}type(){return this.type_}slice(t,e){if(bu(this.data_)){const r=this.data_,s=$g(r,t,e);return s===null?null:new se(s)}else{const r=new Uint8Array(this.data_.buffer,t,e-t);return new se(r,!0)}}static getBlob(...t){if(lo()){const e=t.map(r=>r instanceof se?r.data_:r);return new se(jg.apply(null,e))}else{const e=t.map(a=>co(a)?Gg(qt.RAW,a).data:a.data_);let r=0;e.forEach(a=>{r+=a.byteLength});const s=new Uint8Array(r);let o=0;return e.forEach(a=>{for(let c=0;c<a.length;c++)s[o++]=a[c]}),new se(s,!0)}}uploadData(){return this.data_}}/**
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
 */function Rl(n){let t;try{t=JSON.parse(n)}catch{return null}return kg(t)?t:null}/**
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
 */function Xg(n){if(n.length===0)return null;const t=n.lastIndexOf("/");return t===-1?"":n.slice(0,t)}function Yg(n,t){const e=t.split("/").filter(r=>r.length>0).join("/");return n.length===0?e:n+"/"+e}function bl(n){const t=n.lastIndexOf("/",n.length-2);return t===-1?n:n.slice(t+1)}/**
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
 */function Jg(n,t){return t}class bt{constructor(t,e,r,s){this.server=t,this.local=e||t,this.writable=!!r,this.xform=s||Jg}}let Ir=null;function Zg(n){return!co(n)||n.length<2?n:bl(n)}function Sl(){if(Ir)return Ir;const n=[];n.push(new bt("bucket")),n.push(new bt("generation")),n.push(new bt("metageneration")),n.push(new bt("name","fullPath",!0));function t(o,a){return Zg(a)}const e=new bt("name");e.xform=t,n.push(e);function r(o,a){return a!==void 0?Number(a):a}const s=new bt("size");return s.xform=r,n.push(s),n.push(new bt("timeCreated")),n.push(new bt("updated")),n.push(new bt("md5Hash",null,!0)),n.push(new bt("cacheControl",null,!0)),n.push(new bt("contentDisposition",null,!0)),n.push(new bt("contentEncoding",null,!0)),n.push(new bt("contentLanguage",null,!0)),n.push(new bt("contentType",null,!0)),n.push(new bt("metadata","customMetadata",!0)),Ir=n,Ir}function t_(n,t){function e(){const r=n.bucket,s=n.fullPath,o=new Ot(r,s);return t._makeStorageReference(o)}Object.defineProperty(n,"ref",{get:e})}function e_(n,t,e){const r={};r.type="file";const s=e.length;for(let o=0;o<s;o++){const a=e[o];r[a.local]=a.xform(r,t[a.server])}return t_(r,n),r}function Cl(n,t,e){const r=Rl(t);return r===null?null:e_(n,r,e)}function n_(n,t,e,r){const s=Rl(t);if(s===null||!co(s.downloadTokens))return null;const o=s.downloadTokens;if(o.length===0)return null;const a=encodeURIComponent;return o.split(",").map(f=>{const m=n.bucket,g=n.fullPath,E="/b/"+a(m)+"/o/"+a(g),b=ho(E,e,r),V=wl({alt:"media",token:f});return b+V})[0]}function r_(n,t){const e={},r=t.length;for(let s=0;s<r;s++){const o=t[s];o.writable&&(e[o.server]=n[o.local])}return JSON.stringify(e)}class Pl{constructor(t,e,r,s){this.url=t,this.method=e,this.handler=r,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
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
 */function Vl(n){if(!n)throw uo()}function s_(n,t){function e(r,s){const o=Cl(n,s,t);return Vl(o!==null),o}return e}function i_(n,t){function e(r,s){const o=Cl(n,s,t);return Vl(o!==null),n_(o,s,n.host,n._protocol)}return e}function Dl(n){function t(e,r){let s;return e.getStatus()===401?e.getErrorText().includes("Firebase App Check token is invalid")?s=yg():s=_g():e.getStatus()===402?s=gg(n.bucket):e.getStatus()===403?s=Eg(n.path):s=r,s.status=e.getStatus(),s.serverResponse=r.serverResponse,s}return t}function o_(n){const t=Dl(n);function e(r,s){let o=t(r,s);return r.getStatus()===404&&(o=pg(n.path)),o.serverResponse=s.serverResponse,o}return e}function a_(n,t,e){const r=t.fullServerUrl(),s=ho(r,n.host,n._protocol),o="GET",a=n.maxOperationRetryTime,c=new Pl(s,o,i_(n,e),a);return c.errorHandler=o_(t),c}function u_(n,t){return n&&n.contentType||t&&t.type()||"application/octet-stream"}function c_(n,t,e){const r=Object.assign({},e);return r.fullPath=n.path,r.size=t.size(),r.contentType||(r.contentType=u_(null,t)),r}function l_(n,t,e,r,s){const o=t.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function c(){let B="";for(let W=0;W<2;W++)B=B+Math.random().toString().slice(2);return B}const h=c();a["Content-Type"]="multipart/related; boundary="+h;const f=c_(t,r,s),m=r_(f,e),g="--"+h+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+m+`\r
--`+h+`\r
Content-Type: `+f.contentType+`\r
\r
`,E=`\r
--`+h+"--",b=se.getBlob(g,r,E);if(b===null)throw Rg();const V={name:f.fullPath},k=ho(o,n.host,n._protocol),P="POST",j=n.maxUploadRetryTime,U=new Pl(k,P,s_(n,e),j);return U.urlParams=V,U.headers=a,U.body=b.uploadData(),U.errorHandler=Dl(t),U}class h_{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=Pe.NO_ERROR,this.sendPromise_=new Promise(t=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=Pe.ABORT,t()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=Pe.NETWORK_ERROR,t()}),this.xhr_.addEventListener("load",()=>{t()})})}send(t,e,r,s,o){if(this.sent_)throw Rn("cannot .send() more than once");if(Oe(t)&&r&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(e,t,!0),o!==void 0)for(const a in o)o.hasOwnProperty(a)&&this.xhr_.setRequestHeader(a,o[a].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Rn("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Rn("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw Rn("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Rn("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(t){return this.xhr_.getResponseHeader(t)}addUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",t)}removeUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",t)}}class f_ extends h_{initXhr(){this.xhr_.responseType="text"}}function Nl(){return new f_}/**
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
 */class ke{constructor(t,e){this._service=t,e instanceof Ot?this._location=e:this._location=Ot.makeFromUrl(e,t.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(t,e){return new ke(t,e)}get root(){const t=new Ot(this._location.bucket,"");return this._newRef(this._service,t)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return bl(this._location.path)}get storage(){return this._service}get parent(){const t=Xg(this._location.path);if(t===null)return null;const e=new Ot(this._location.bucket,t);return new ke(this._service,e)}_throwIfRoot(t){if(this._location.path==="")throw Cg(t)}}function d_(n,t,e){n._throwIfRoot("uploadBytes");const r=l_(n.storage,n._location,Sl(),new se(t,!0),e);return n.storage.makeRequestWithTokens(r,Nl).then(s=>({metadata:s,ref:n}))}function m_(n){n._throwIfRoot("getDownloadURL");const t=a_(n.storage,n._location,Sl());return n.storage.makeRequestWithTokens(t,Nl).then(e=>{if(e===null)throw bg();return e})}function p_(n,t){const e=Yg(n._location.path,t),r=new Ot(n._location.bucket,e);return new ke(n.storage,r)}/**
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
 */function g_(n){return/^[A-Za-z]+:\/\//.test(n)}function __(n,t){return new ke(n,t)}function kl(n,t){if(n instanceof fo){const e=n;if(e._bucket==null)throw vg();const r=new ke(e,e._bucket);return t!=null?kl(r,t):r}else return t!==void 0?p_(n,t):n}function y_(n,t){if(t&&g_(t)){if(n instanceof fo)return __(n,t);throw fi("To use ref(service, url), the first argument must be a Storage instance.")}else return kl(n,t)}function Cu(n,t){const e=t==null?void 0:t[El];return e==null?null:Ot.makeFromBucketSpec(e,n)}function E_(n,t,e,r={}){n.host=`${t}:${e}`;const s=Oe(t);s&&(mi(`https://${n.host}/b`),pi("Storage",!0)),n._isUsingEmulator=!0,n._protocol=s?"https":"http";const{mockUserToken:o}=r;o&&(n._overrideAuthToken=typeof o=="string"?o:Ou(o,n.app.options.projectId))}class fo{constructor(t,e,r,s,o,a=!1){this.app=t,this._authProvider=e,this._appCheckProvider=r,this._url=s,this._firebaseVersion=o,this._isUsingEmulator=a,this._bucket=null,this._host=yl,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=dg,this._maxUploadRetryTime=mg,this._requests=new Set,s!=null?this._bucket=Ot.makeFromBucketSpec(s,this._host):this._bucket=Cu(this._host,this.app.options)}get host(){return this._host}set host(t){this._host=t,this._url!=null?this._bucket=Ot.makeFromBucketSpec(this._url,t):this._bucket=Cu(t,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(t){Su("time",0,Number.POSITIVE_INFINITY,t),this._maxUploadRetryTime=t}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(t){Su("time",0,Number.POSITIVE_INFINITY,t),this._maxOperationRetryTime=t}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const t=this._authProvider.getImmediate({optional:!0});if(t){const e=await t.getToken();if(e!==null)return e.accessToken}return null}async _getAppCheckToken(){if(yi(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=this._appCheckProvider.getImmediate({optional:!0});return t?(await t.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(t=>t.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(t){return new ke(this,t)}_makeRequest(t,e,r,s,o=!0){if(this._deleted)return new Pg(Tl());{const a=Bg(t,this._appId,r,s,e,this._firebaseVersion,o,this._isUsingEmulator);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(t,e){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(t,e,r,s).getPromise()}}const Pu="@firebase/storage",Vu="0.14.0";/**
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
 */const Ol="storage";function ey(n,t,e){return n=lt(n),d_(n,t,e)}function ny(n){return n=lt(n),m_(n)}function ry(n,t){return n=lt(n),y_(n,t)}function sy(n=Ei(),t){n=lt(n);const r=_i(n,Ol).getImmediate({identifier:t}),s=di("storage");return s&&T_(r,...s),r}function T_(n,t,e,r={}){E_(n,t,e,r)}function w_(n,{instanceIdentifier:t}){const e=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),s=n.getProvider("app-check-internal");return new fo(e,r,s,t,Lu)}function I_(){Ke(new Ve(Ol,w_,"PUBLIC").setMultipleInstances(!0)),Wt(Pu,Vu,""),Wt(Pu,Vu,"esm2020")}I_();export{zt as $,sy as A,Z_ as B,Ve as C,M_ as D,xu as E,ye as F,W_ as G,kp as H,H_ as I,K_ as J,U_ as K,Mu as L,B_ as M,q_ as N,F_ as O,Q_ as P,Y_ as Q,G_ as R,Lu as S,ty as T,J_ as U,ry as V,ey as W,ny as X,z_ as Y,J as Z,Ke as _,C_ as a,tt as a0,Nt as a1,$_ as a2,j_ as a3,X_ as a4,S_ as b,yi as c,lt as d,gi as e,O_ as f,v_ as g,H as h,R_ as i,yh as j,Oe as k,Ei as l,_i as m,Ah as n,Vr as o,mi as p,D_ as q,Wt as r,P_ as s,V_ as t,pi as u,N_ as v,k_ as w,b_ as x,vf as y,L_ as z};
