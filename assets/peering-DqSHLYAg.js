import{c as a,I as Z,d as C,u as N,r as T,z as P,A as K,B as ee,b as v,e as r,j as d,g as i,h as n,L as B,a as U,f as g,D as te,O as M,y as x,F as S,k as E,s as b,q as _,P as X,Q as q,l as $,_ as A,M as ne,m as re,R as ae,n as Y,t as oe,G as O,T as se,W as V,X as ie,Y as le,o as pe,H as ue,E as j,Z as ce,$ as fe,i as D}from"./index-tT9SxIPK.js";import{R as de}from"./RouterLocationAvatar-DcqCds2h.js";import{H as ve,S as me,a as ge}from"./SmileTwoTone-L94jeJZG.js";import{N as _e}from"./NodeIndexOutlined-BRFNOl7K.js";import{S as H}from"./SendOutlined-6Sz6F_ij.js";var ke={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M945 412H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h256c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM811 548H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h122c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM477.3 322.5H434c-6.2 0-11.2 5-11.2 11.2v248c0 3.6 1.7 6.9 4.6 9l148.9 108.6c5 3.6 12 2.6 15.6-2.4l25.7-35.1v-.1c3.6-5 2.5-12-2.5-15.6l-126.7-91.6V333.7c.1-6.2-5-11.2-11.1-11.2z"}},{tag:"path",attrs:{d:"M804.8 673.9H747c-5.6 0-10.9 2.9-13.9 7.7a321 321 0 01-44.5 55.7 317.17 317.17 0 01-101.3 68.3c-39.3 16.6-81 25-124 25-43.1 0-84.8-8.4-124-25-37.9-16-72-39-101.3-68.3s-52.3-63.4-68.3-101.3c-16.6-39.2-25-80.9-25-124 0-43.1 8.4-84.7 25-124 16-37.9 39-72 68.3-101.3 29.3-29.3 63.4-52.3 101.3-68.3 39.2-16.6 81-25 124-25 43.1 0 84.8 8.4 124 25 37.9 16 72 39 101.3 68.3a321 321 0 0144.5 55.7c3 4.8 8.3 7.7 13.9 7.7h57.8c6.9 0 11.3-7.2 8.2-13.3-65.2-129.7-197.4-214-345-215.7-216.1-2.7-395.6 174.2-396 390.1C71.6 727.5 246.9 903 463.2 903c149.5 0 283.9-84.6 349.8-215.8a9.18 9.18 0 00-8.2-13.3z"}}]},name:"field-time",theme:"outlined"};function G(u){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?Object(arguments[e]):{},c=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(c=c.concat(Object.getOwnPropertySymbols(t).filter(function(f){return Object.getOwnPropertyDescriptor(t,f).enumerable}))),c.forEach(function(f){ye(u,f,t[f])})}return u}function ye(u,e,t){return e in u?Object.defineProperty(u,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):u[e]=t,u}var z=function(e,t){var c=G({},e,t.attrs);return a(Z,G({},c,{icon:ke}),null)};z.displayName="FieldTimeOutlined";z.inheritAttrs=!1;const be=C({__name:"stepsBar",props:{step:{},loading:{type:Boolean}},setup(u){const e=u,t=N().t,c=T("finish"),f=T("wait"),o=T("wait"),l=T("wait"),s=P(()=>e.step),p=P(()=>e.loading),h=K(()=>s.value,I=>{switch(I){case"interface":c.value="finish",f.value="process",o.value="wait",l.value="wait";break;case"setup":c.value="finish",f.value="finish",o.value="process",l.value="wait";break;case"done":c.value="finish",f.value="finish",o.value="finish",l.value="finish";break;default:case"preference":c.value="finish",f.value="wait",o.value="wait",l.value="wait";break}});return ee(()=>{h()}),(I,m)=>{const k=v("a-step"),L=v("a-steps");return r(),d(L,null,{default:i(()=>[a(k,{status:c.value,title:n(t)("pages.peering.step1")},{icon:i(()=>[s.value==="preference"&&p.value?(r(),d(n(B),{key:0})):(r(),d(n(ve),{key:1}))]),_:1},8,["status","title"]),a(k,{status:f.value,title:n(t)("pages.peering.step2")},{icon:i(()=>[s.value==="interface"&&p.value?(r(),d(n(B),{key:0})):(r(),d(n(_e),{key:1}))]),_:1},8,["status","title"]),a(k,{status:o.value,title:n(t)("pages.peering.step3")},{icon:i(()=>[s.value==="setup"&&p.value?(r(),d(n(B),{key:0})):(r(),d(n(z),{key:1}))]),_:1},8,["status","title"]),a(k,{status:l.value,title:n(t)("pages.peering.step4")},{icon:i(()=>[s.value==="done"&&p.value?(r(),d(n(B),{key:0})):(r(),d(n(me),{key:1}))]),_:1},8,["status","title"])]),_:1})}}}),J=u=>(X("data-v-892c0cdd"),u=u(),q(),u),Ie=J(()=>$("br",null,null,-1)),Fe=J(()=>$("br",null,null,-1)),he=C({__name:"preferenceBox",props:{router:{},nextStep:{type:Function},preferenceForm:{}},setup(u){const e=u,t=N().t,c=U(),f=()=>{c.replace({path:"/nodes"}),window.scrollTo(0,0)};return(o,l)=>{const s=v("a-alert"),p=v("a-input"),h=v("a-form-item"),I=v("a-radio"),m=v("a-radio-group"),k=v("a-checkbox"),L=v("a-checkbox-group"),F=v("a-button"),w=v("a-form");return r(),g(S,null,[a(s,{message:n(te)(n(t)("pages.peering.step1Introduction")),type:"info"},null,8,["message"]),Ie,a(w,{model:e.preferenceForm,"label-col":{span:8},"wrapper-col":{span:16},class:"peerInfoForm"},{default:i(()=>[n(M)?(r(),d(h,{key:0,name:"peerAsn",label:n(t)("pages.peering.asn")},{default:i(()=>[a(p,{type:"number",value:e.preferenceForm.asn,"onUpdate:value":l[0]||(l[0]=y=>e.preferenceForm.asn=y),"addon-before":"AS",placeholder:`${n(t)("pages.signIn.pleaseInput")} ${n(t)("pages.peering.asn")}`},null,8,["value","placeholder"])]),_:1},8,["label"])):x("",!0),a(h,{label:n(t)("pages.peering.linkType")},{default:i(()=>[a(m,{value:e.preferenceForm.linkType,"onUpdate:value":l[1]||(l[1]=y=>e.preferenceForm.linkType=y)},{default:i(()=>[(r(!0),g(S,null,E(e.router.linkTypes,y=>(r(),d(I,{key:`linkType_${y}`,value:y},{default:i(()=>[b(_(n(t)(`pages.peering.${y}`)),1)]),_:2},1032,["value"]))),128))]),_:1},8,["value"])]),_:1},8,["label"]),a(h,{label:n(t)("pages.peering.bgpExtensions")},{default:i(()=>[a(L,{value:e.preferenceForm.bgpExtensions,"onUpdate:value":l[2]||(l[2]=y=>e.preferenceForm.bgpExtensions=y)},{default:i(()=>[(r(!0),g(S,null,E(e.router.extensions,y=>(r(),d(k,{key:`extension_${y}`,value:y},{default:i(()=>[b(_(n(t)(`pages.peering['${y}']`)),1)]),_:2},1032,["value"]))),128))]),_:1},8,["value"])]),_:1},8,["label"]),Fe,a(h,{"wrapper-col":{offset:8,span:16}},{default:i(()=>[a(F,{style:{"margin-right":"20px"},onClick:l[3]||(l[3]=y=>f())},{default:i(()=>[b(_(n(t)("pages.peering.backTop")),1)]),_:1}),a(F,{type:"primary",onClick:l[4]||(l[4]=y=>e.nextStep())},{icon:i(()=>[a(n(H))]),default:i(()=>[b(" "+_(n(t)("pages.signIn.continue")),1)]),_:1})]),_:1})]),_:1},8,["model"])],64)}}}),Le=A(he,[["__scopeId","data-v-892c0cdd"]]),xe={class:"detail"},$e={key:0},Se={key:1},we={key:2},Te={key:3},Oe=["innerHTML"],Ce=["innerHTML"],Ne=C({__name:"peerInfoCard",props:{router:{},routerInfo:{}},setup(u){const e=new ne;e.use(re,{attrs:{target:"_blank"}});const t=u,c=N().t;return(f,o)=>(r(),g("div",{class:Y(`info ${n(oe)}`)},[$("h2",null,_(n(c)("pages.peering.step2Introduction")),1),$("ul",xe,[t.router.ipv4?(r(),g("li",$e,[b("ASN"),$("code",null,_(n(ae).netAsn),1)])):x("",!0),t.router.ipv4?(r(),g("li",Se,[b("IPv4"),$("code",null,_(t.router.ipv4),1)])):x("",!0),t.router.ipv6?(r(),g("li",we,[b("IPv6"),$("code",null,_(t.router.ipv6),1)])):x("",!0),t.router.ipv6LinkLocal?(r(),g("li",Te,[b("IPv6 Link Local"),$("code",null,_(t.router.ipv6LinkLocal),1)])):x("",!0)]),t.router.description?(r(),g("div",{key:0,class:"desc",innerHTML:n(e).render(t.router.description)},null,8,Oe)):x("",!0),t.routerInfo&&t.routerInfo.info?(r(),g("div",{key:1,class:"desc",innerHTML:n(e).render(t.routerInfo.info)},null,8,Ce)):x("",!0)],2))}}),Q=A(Ne,[["__scopeId","data-v-a40847fa"]]),Pe=u=>(X("data-v-17abc537"),u=u(),q(),u),Ee=Pe(()=>$("br",null,null,-1)),Ae=C({__name:"interfaceBox",props:{router:{},nextStep:{type:Function},prevStep:{type:Function},routerInfo:{},preferenceForm:{},interfaceForm:{}},setup(u){const e=u,t=N().t,c=()=>{if(!e.interfaceForm.ipv4&&!e.interfaceForm.ipv6&&!e.interfaceForm.ipv6LinkLocal||!e.interfaceForm.useIpv4&&!e.interfaceForm.useIpv6&&!e.interfaceForm.useIpv6LinkLocal){O.error({centered:!0,title:t("pages.peering.step2"),content:t("pages.peering.mustEnableAtleastOneProtocol")});return}if(e.preferenceForm.linkType!=="direct"&&!e.interfaceForm.credential){O.error({centered:!0,title:t("pages.peering.step2"),content:t("pages.peering.mustEnterTunnelInformation")});return}if(!e.routerInfo||!e.routerInfo.passthrough){O.error({centered:!0,title:t("pages.peering.step2"),content:t("pages.signIn.errorOccurred")});return}if(e.interfaceForm.useIpv4&&!e.interfaceForm.ipv4||e.interfaceForm.useIpv6&&!e.interfaceForm.ipv6||e.interfaceForm.ipv6LinkLocal&&!e.interfaceForm.ipv6LinkLocal){O.error({centered:!0,title:t("pages.peering.step2"),content:t("pages.peering.inputValid")});return}e.interfaceForm.useIpv4||(e.interfaceForm.ipv4=""),e.interfaceForm.useIpv6||(e.interfaceForm.ipv6=""),e.interfaceForm.useIpv6LinkLocal||(e.interfaceForm.ipv6LinkLocal="");try{if(e.interfaceForm.ipv4!==""&&!se.test(e.interfaceForm.ipv4)||e.interfaceForm.ipv6!==""&&!V.test(e.interfaceForm.ipv6)||e.interfaceForm.ipv6LinkLocal!==""&&!V.test(e.interfaceForm.ipv6LinkLocal))throw new Error("Invalid IP");if(e.interfaceForm.endpoint.trim()!==""){if(e.interfaceForm.endpoint.indexOf(":")===-1)throw new Error("Invalid endpoint");const f=new URL(`https://${e.interfaceForm.endpoint}`);e.interfaceForm.endpoint=f.host}else e.interfaceForm.endpoint=""}catch{O.error({centered:!0,title:t("pages.peering.step2"),content:t("pages.peering.inputValid")});return}e.nextStep(),window.scrollTo(0,0)};return(f,o)=>{const l=v("a-switch"),s=v("a-form-item"),p=v("a-textarea"),h=v("a-button"),I=v("a-form");return r(),g(S,null,[a(Q,{router:e.router,"router-info":e.routerInfo},null,8,["router","router-info"]),a(I,{model:e.preferenceForm,class:"peerInfoForm"},{default:i(()=>[a(s,{label:n(t)("pages.peering.useIpv4")},{default:i(()=>[a(l,{checked:e.interfaceForm.useIpv4,"onUpdate:checked":o[0]||(o[0]=m=>e.interfaceForm.useIpv4=m)},null,8,["checked"])]),_:1},8,["label"]),e.interfaceForm.useIpv4?(r(),d(s,{key:0,name:"ipv4",label:n(t)("pages.peering.ipv4")},{default:i(()=>[a(p,{"auto-size":"",value:e.interfaceForm.ipv4,"onUpdate:value":o[1]||(o[1]=m=>e.interfaceForm.ipv4=m),placeholder:`${n(t)("pages.signIn.pleaseInput")} ${n(t)("pages.peering.ipv4")}`},null,8,["value","placeholder"])]),_:1},8,["label"])):x("",!0),a(s,{label:n(t)("pages.peering.useIpv6")},{default:i(()=>[a(l,{checked:f.interfaceForm.useIpv6,"onUpdate:checked":o[2]||(o[2]=m=>f.interfaceForm.useIpv6=m)},null,8,["checked"])]),_:1},8,["label"]),e.interfaceForm.useIpv6?(r(),d(s,{key:1,name:"ipv6",label:n(t)("pages.peering.ipv6")},{default:i(()=>[a(p,{"auto-size":"",value:e.interfaceForm.ipv6,"onUpdate:value":o[3]||(o[3]=m=>e.interfaceForm.ipv6=m),placeholder:`${n(t)("pages.signIn.pleaseInput")} ${n(t)("pages.peering.ipv6")}`},null,8,["value","placeholder"])]),_:1},8,["label"])):x("",!0),a(s,{label:n(t)("pages.peering.useIpv6LinkLocal")},{default:i(()=>[a(l,{checked:f.interfaceForm.useIpv6LinkLocal,"onUpdate:checked":o[4]||(o[4]=m=>f.interfaceForm.useIpv6LinkLocal=m)},null,8,["checked"])]),_:1},8,["label"]),e.interfaceForm.useIpv6LinkLocal?(r(),d(s,{key:2,name:"ipv6LinkLocal",label:n(t)("pages.peering.ipv6LinkLocal")},{default:i(()=>[a(p,{"auto-size":"",value:e.interfaceForm.ipv6LinkLocal,"onUpdate:value":o[5]||(o[5]=m=>e.interfaceForm.ipv6LinkLocal=m),placeholder:`${n(t)("pages.signIn.pleaseInput")} ${n(t)("pages.peering.ipv6LinkLocal")}`},null,8,["value","placeholder"])]),_:1},8,["label"])):x("",!0),f.preferenceForm.linkType!=="direct"?(r(),g(S,{key:3},[a(s,{name:"endpoint",label:n(t)("pages.peering.endpoint")},{default:i(()=>[a(p,{"auto-size":"",value:e.interfaceForm.endpoint,"onUpdate:value":o[6]||(o[6]=m=>e.interfaceForm.endpoint=m),placeholder:`${n(t)("pages.peering.tunnelEndpointHint")}`},null,8,["value","placeholder"])]),_:1},8,["label"]),a(s,{name:"credential",label:n(t)("pages.peering.credential")},{default:i(()=>[a(p,{"auto-size":"",value:e.interfaceForm.credential,"onUpdate:value":o[7]||(o[7]=m=>e.interfaceForm.credential=m),placeholder:`${n(t)("pages.peering.tunnelCredentialHint")}`},null,8,["value","placeholder"])]),_:1},8,["label"])],64)):x("",!0),Ee,a(s,{"wrapper-col":{offset:8,span:16}},{default:i(()=>[a(h,{style:{"margin-right":"20px"},onClick:o[8]||(o[8]=m=>e.prevStep())},{default:i(()=>[b(_(n(t)("pages.peering.back")),1)]),_:1}),a(h,{type:"primary",onClick:c},{icon:i(()=>[a(n(H))]),default:i(()=>[b(" "+_(n(t)("pages.signIn.continue")),1)]),_:1})]),_:1})]),_:1},8,["model"])],64)}}}),Be=A(Ae,[["__scopeId","data-v-17abc537"]]),Me={class:"header"},Ue={class:"buttons"},He=C({__name:"setupBox",props:{nextStep:{type:Function},prevStep:{type:Function},router:{},routerInfo:{},loading:{type:Boolean},preferenceForm:{},interfaceForm:{}},setup(u){const e=N().t,t=u,c=P(()=>{const l={};for(const s in t.interfaceForm){const p=t.interfaceForm[s];(typeof p=="string"&&p!==""||typeof p!="string"&&!p)&&Object.assign(l,{[s]:p})}return l}),f=P(()=>{const l={};for(const s in t.preferenceForm){const p=t.preferenceForm[s];s!=="asn"&&Object.assign(l,{[s]:p})}return l}),o=P(()=>t.loading);return(l,s)=>{const p=v("a-descriptions-item"),h=v("a-descriptions"),I=v("a-button"),m=v("a-spin");return r(),d(m,{spinning:o.value},{default:i(()=>[$("h2",Me,_(n(e)("pages.peering.step3Introduction")),1),a(h,{layout:"vertical",bordered:"",size:"small",column:2,class:"summary"},{default:i(()=>[(r(!0),g(S,null,E(f.value,(k,L)=>(r(),d(p,{key:`preferenceForm_${L}`,label:n(e)(`pages.peering['${L}']`)},{default:i(()=>[L==="linkType"?(r(),g(S,{key:0},[b(_(n(e)(`pages.peering['${k}']`)),1)],64)):L==="bgpExtensions"&&Array.isArray(k)?(r(!0),g(S,{key:1},E(k,F=>(r(),g("span",{class:"tag",key:F},_(n(e)(`pages.peering['${F}']`)),1))),128)):(r(),g(S,{key:2},[b(_(k),1)],64))]),_:2},1032,["label"]))),128)),(r(!0),g(S,null,E(c.value,(k,L)=>(r(),d(p,{key:`interfaceForm_${L}`,label:n(e)(`pages.peering['${L}']`)},{default:i(()=>[typeof k=="boolean"?(r(),g(S,{key:0},[k?(r(),d(n(ie),{key:0})):(r(),d(n(le),{key:1}))],64)):(r(),g(S,{key:1},[b(_(k),1)],64))]),_:2},1032,["label"]))),128))]),_:1}),a(Q,{router:t.router,"router-info":t.routerInfo},null,8,["router","router-info"]),$("div",Ue,[a(I,{onClick:s[0]||(s[0]=k=>t.prevStep())},{default:i(()=>[b(_(n(e)("pages.peering.back")),1)]),_:1}),a(I,{type:"primary",onClick:s[1]||(s[1]=k=>t.nextStep())},{icon:i(()=>[a(n(H))]),default:i(()=>[b(" "+_(n(e)("pages.signIn.continue")),1)]),_:1})])]),_:1},8,["spinning"])}}}),ze=A(He,[["__scopeId","data-v-b80dcbf1"]]),Re=C({__name:"doneBox",props:{router:{}},setup(u){const e=N().t,t=U(),c=u,f=()=>{t.replace({path:"/manage"})},o=()=>{t.replace({path:"/"})};return(l,s)=>{const p=v("a-button"),h=v("a-result");return r(),d(h,{title:n(e)("pages.peering.thankYou"),"sub-title":c.router.autoPeering?n(e)("pages.peering.step4Introduction"):n(e)("pages.peering.step4IntroductionReview")},{icon:i(()=>[a(n(ge))]),extra:i(()=>[a(p,{key:"manageSessions",type:"primary",onClick:f},{default:i(()=>[b(_(n(e)("pages.signIn.manageSessions")),1)]),_:1}),a(p,{key:"topPage",onClick:o},{default:i(()=>[b(_(n(e)("pages.signIn.topPage")),1)]),_:1})]),_:1},8,["title","sub-title"])}}}),Ve={key:0,class:"header"},je={class:"avatar"},De=C({__name:"peering",setup(u){var k,L;const e=N().t,t=U(),c=T(!1),f=t.currentRoute.value.params.uuid||null,o=T(null);try{const F=localStorage.getItem("routers");F&&(o.value=JSON.parse(F).find(w=>w.uuid===f)||null)}catch(F){console.error(F)}const l=T("preference");pe(()=>{if(window.scrollTo(0,0),!ue.value){j.info(e("pages.nodes.pleaseSignIn")),t.replace({path:"/signin"});return}if(!o.value){j.error(e("pages.peering.couldNotGetData")),t.back();return}});const s=T({asn:"424242",linkType:((k=o.value)==null?void 0:k.linkTypes[0])||"",bgpExtensions:((L=o.value)==null?void 0:L.extensions)||[]}),p=T(null),h=async()=>{var F;if(M.value&&(s.value.asn===""||isNaN(Number(s.value.asn))||Number(s.value.asn)<ce||Number(s.value.asn)>fe)){O.error({centered:!0,title:"Admin Peering",content:`${e("pages.signIn.pleaseInput")} ${e("pages.peering.asn")}`});return}try{p.value=null,c.value=!0,p.value=await D(e,"/session",{action:"info",router:(F=o.value)==null?void 0:F.uuid,data:{linkType:s.value.linkType,bgpExtensions:s.value.bgpExtensions}}),l.value="interface",window.scrollTo(0,0)}catch(w){console.error(w)}finally{c.value=!1}},I=T({useIpv4:!0,ipv4:"",useIpv6:!0,ipv6:"",useIpv6LinkLocal:!0,ipv6LinkLocal:"",endpoint:"",credential:""}),m=async()=>{var F;try{c.value=!0;const w={action:"add",router:(F=o.value)==null?void 0:F.uuid,ipv4:I.value.ipv4,ipv6:I.value.ipv6,ipv6LinkLocal:I.value.ipv6LinkLocal,type:s.value.linkType,extensions:s.value.bgpExtensions,endpoint:I.value.endpoint,credential:I.value.credential,data:p.value};if(M.value&&Object.assign(w,{asn:Number(s.value.asn)}),await D(e,"/session",w)!==null){l.value="done",window.scrollTo(0,0);return}O.error({centered:!0,title:e("pages.peering.step3"),content:e("pages.signIn.errorOccurred")})}catch(w){console.error(w)}finally{c.value=!1}};return(F,w)=>{var R;const y=v("a-spin"),W=v("a-layout-content");return r(),g("section",null,[o.value?(r(),g("h1",Ve,[$("div",je,[a(de,{router:o.value},null,8,["router"])]),b(" "+_((R=o.value)==null?void 0:R.name),1)])):x("",!0),o.value?(r(),d(W,{key:1,id:"peering"},{default:i(()=>[a(be,{class:"steps",step:l.value,loading:c.value},null,8,["step","loading"]),a(y,{spinning:c.value},{default:i(()=>[$("section",{class:Y(`box ${l.value||""}`)},[l.value==="preference"?(r(),d(Le,{key:0,router:o.value,"preference-form":s.value,nextStep:h},null,8,["router","preference-form"])):l.value==="interface"?(r(),d(Be,{key:1,router:o.value,"router-info":p.value,"preference-form":s.value,"interface-form":I.value,nextStep:()=>l.value="setup",prevStep:()=>l.value="preference"},null,8,["router","router-info","preference-form","interface-form","nextStep","prevStep"])):l.value==="setup"?(r(),d(ze,{key:2,"preference-form":s.value,loading:c.value,router:o.value,"router-info":p.value,"interface-form":I.value,nextStep:m,prevStep:()=>l.value="interface"},null,8,["preference-form","loading","router","router-info","interface-form","prevStep"])):l.value==="done"?(r(),d(Re,{key:3,router:o.value},null,8,["router"])):x("",!0)],2)]),_:1},8,["spinning"])]),_:1})):x("",!0)])}}}),Qe=A(De,[["__scopeId","data-v-1c57d790"]]);export{Qe as default};