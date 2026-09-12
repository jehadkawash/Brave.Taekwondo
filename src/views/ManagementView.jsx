import React,{useState,useLayoutEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import ManagementPortal from '../../management/main';
import styles from '../../management/style.css?inline';
export default function ManagementView(props){
 const host=useRef(null);const [root,setRoot]=useState(null);
 useLayoutEffect(()=>{setRoot(host.current.shadowRoot || host.current.attachShadow({mode:'open'}));},[]);
 return <div ref={host}>{root&&createPortal(<><style>{styles.replaceAll('body{',':host{')}</style><ManagementPortal {...props}/></>,root)}</div>;
}
