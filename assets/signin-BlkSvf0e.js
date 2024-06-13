import{d as A,u as R,r as y,z as T,A as V,B as D,b as u,e as p,j as g,g as n,c as l,h as e,L as M,C as E,U as W,D as B,s as C,q as f,l as k,f as P,k as L,F as O,y as z,a as j,o as H,E as F,i as U,G as N,H as G,_ as X}from"./index-tT9SxIPK.js";import{H as J,S as Y,a as Z}from"./SmileTwoTone-L94jeJZG.js";import{S as Q}from"./SendOutlined-6Sz6F_ij.js";const ee=A({__name:"stepsBar",props:{step:{},customQueryTitle:{},customChooseTitle:{},loading:{type:Boolean}},setup(q){const t=q,a=R().t,s=y("finish"),r=y("wait"),_=y("wait"),d=y("wait"),o=T(()=>t.step),c=T(()=>t.loading),w=T(()=>t.customQueryTitle),S=T(()=>t.customChooseTitle),x=V(()=>o.value,i=>{switch(i){case"choose":s.value="finish",r.value="process",_.value="wait",d.value="wait";break;case"challenge":s.value="finish",r.value="finish",_.value="process",d.value="wait";break;case"done":s.value="finish",r.value="finish",_.value="finish",d.value="finish";break;default:case"query":s.value="finish",r.value="wait",_.value="wait",d.value="wait";break}});return D(()=>{x()}),(i,v)=>{const h=u("a-step"),I=u("a-steps");return p(),g(I,null,{default:n(()=>[l(h,{status:s.value,title:`${w.value||e(a)("pages.signIn.step1")}`},{icon:n(()=>[o.value==="query"&&c.value?(p(),g(e(M),{key:0})):(p(),g(e(E),{key:1}))]),_:1},8,["status","title"]),l(h,{status:r.value,title:`${S.value||e(a)("pages.signIn.step2")}`},{icon:n(()=>[o.value==="choose"&&c.value?(p(),g(e(M),{key:0})):(p(),g(e(J),{key:1}))]),_:1},8,["status","title"]),l(h,{status:_.value,title:e(a)("pages.signIn.step3")},{icon:n(()=>[o.value==="challenge"&&c.value?(p(),g(e(M),{key:0})):(p(),g(e(W),{key:1}))]),_:1},8,["status","title"]),l(h,{status:d.value,title:`${e(a)("pages.signIn.step4")}`},{icon:n(()=>[o.value==="done"&&c.value?(p(),g(e(M),{key:0})):(p(),g(e(Y),{key:1}))]),_:1},8,["status","title"])]),_:1})}}}),ae=k("br",null,null,-1),te={href:"https://dn42.dev",target:"_blank"},ne=A({__name:"queryBox",props:{queryAsn:{type:Function},loading:{type:Boolean}},setup(q){const t=q,a=R().t,s=y({asn:Number(localStorage.getItem("lastAsn")||"424242")}),r=T(()=>t.loading);return(_,d)=>{const o=u("a-alert"),c=u("a-button"),w=u("a-input-search"),S=u("a-form-item"),x=u("a-form"),i=u("a-spin");return p(),g(i,{tip:`${e(a)("pages.signIn.queryingSignInMethod")}`,spinning:r.value},{default:n(()=>[l(o,{message:e(B)(e(a)("pages.signIn.step1Introduction")),type:"info"},null,8,["message"]),ae,l(x,{model:s.value,"label-col":{span:8},"wrapper-col":{span:16}},{default:n(()=>[l(S,{name:"asn",label:e(a)("pages.signIn.asn"),rules:[{required:!0,message:`${e(a)("pages.signIn.pleaseInput")} ${e(a)("pages.signIn.asn")}`}]},{default:n(()=>[l(w,{style:{width:"320px"},type:"number",value:s.value.asn,"onUpdate:value":d[0]||(d[0]=v=>s.value.asn=v),onSearch:d[1]||(d[1]=v=>_.queryAsn(s.value.asn)),size:"large","addon-before":"AS",placeholder:"424242〇〇〇〇",disabled:_.loading},{enterButton:n(()=>[l(c,{type:"primary",disabled:_.loading},{icon:n(()=>[l(e(Q))]),default:n(()=>[C(" "+f(e(a)("pages.signIn.signIn")),1)]),_:1},8,["disabled"])]),_:1},8,["value","disabled"])]),_:1},8,["label","rules"]),l(S,{"wrapper-col":{offset:8,span:16}},{default:n(()=>[k("a",te,f(e(a)("pages.signIn.signUp")),1)]),_:1})]),_:1},8,["model"])]),_:1},8,["tip","spinning"])}}}),se=k("br",null,null,-1),le={style:{"margin-left":"20px","font-style":"italic"}},oe={style:{"word-break":"break-all","font-size":"12px","user-select":"text"}},ue=k("br",null,null,-1),ie=A({__name:"chooseBox",props:{authQueryResp:{},requestChallenge:{type:Function},loading:{type:Boolean},prevStep:{type:Function}},setup(q){const t=q,a=R().t,s=y({method:0}),r=T(()=>t.loading),_=T(()=>t.authQueryResp),d=y("desc_0");return(o,c)=>{const w=u("a-alert"),S=u("a-collapse-panel"),x=u("a-collapse"),i=u("a-radio"),v=u("a-radio-group"),h=u("a-form-item"),I=u("a-button"),K=u("a-form"),m=u("a-spin");return p(),g(m,{tip:`${e(a)("pages.signIn.pleaseWait")}`,spinning:r.value},{default:n(()=>[l(w,{message:e(B)(e(a)("pages.signIn.step2Introduction")),type:"success"},null,8,["message"]),se,l(K,{model:s.value,"label-col":{span:8},"wrapper-col":{span:16}},{default:n(()=>[l(x,{accordion:"",activeKey:d.value,"onUpdate:activeKey":c[0]||(c[0]=$=>d.value=$)},{default:n(()=>{var $;return[(p(!0),P(O,null,L(($=_.value)==null?void 0:$.availableAuthMethods,b=>(p(),g(S,{key:`desc_${b.id}`},{header:n(()=>[k("b",null,f(b.id+1),1),k("span",le,f(b.type),1)]),default:n(()=>[k("span",oe,f(b.data||(b.type==="password"?e(a)("pages.signIn.useSitePassword"):"")),1)]),_:2},1024))),128))]}),_:1},8,["activeKey"]),ue,l(h,{label:e(a)("pages.signIn.authenticateWith")},{default:n(()=>[l(v,{value:s.value.method,"onUpdate:value":c[1]||(c[1]=$=>s.value.method=$)},{default:n(()=>{var $;return[(p(!0),P(O,null,L(($=_.value)==null?void 0:$.availableAuthMethods,b=>(p(),g(i,{key:`method_${b.id}`,value:b.id},{default:n(()=>[C(f(b.id+1)+" ("+f(b.type)+") ",1)]),_:2},1032,["value"]))),128))]}),_:1},8,["value"])]),_:1},8,["label"]),l(h,{"wrapper-col":{offset:8,span:16}},{default:n(()=>[l(I,{style:{"margin-right":"20px"},onClick:c[2]||(c[2]=$=>t.prevStep())},{default:n(()=>[C(f(e(a)("pages.peering.back")),1)]),_:1}),l(I,{type:"primary",onClick:c[3]||(c[3]=$=>t.requestChallenge(s.value.method)),disabled:o.loading},{icon:n(()=>[l(e(Q))]),default:n(()=>[C(" "+f(e(a)("pages.signIn.continue")),1)]),_:1},8,["disabled"])]),_:1})]),_:1},8,["model"])]),_:1},8,["tip","spinning"])}}}),re=k("br",null,null,-1),pe={style:{"font-style":"italic"}},ce={style:{"word-break":"break-all","font-size":"12px","user-select":"text"}},ge=k("br",null,null,-1),de=A({__name:"challengeBox",props:{authRequestResp:{},challenge:{type:Function},loading:{type:Boolean},type:{},prevStep:{type:Function}},setup(q){const t=q,a=R().t,s=y({publicKey:"",challengeText:""}),r=T(()=>t.loading);T(()=>t.authRequestResp);const _=y("challengeHint");return(d,o)=>{const c=u("a-alert"),w=u("a-collapse-panel"),S=u("a-collapse"),x=u("a-textarea"),i=u("a-form-item"),v=u("a-input-password"),h=u("a-button"),I=u("a-form"),K=u("a-spin");return p(),g(K,{tip:`${e(a)("pages.signIn.pleaseWait")}`,spinning:r.value},{default:n(()=>[l(c,{message:e(B)(e(a)("pages.signIn.step3Introduction")),type:"success"},null,8,["message"]),re,l(I,{model:s.value,"label-col":{span:8},"wrapper-col":{span:16}},{default:n(()=>[l(S,{accordion:"",activeKey:_.value,"onUpdate:activeKey":o[0]||(o[0]=m=>_.value=m)},{default:n(()=>[l(w,{key:"challengeHint"},{header:n(()=>[k("span",pe,f(e(a)("pages.signIn.challengeHint")),1)]),default:n(()=>{var m;return[k("span",ce,f((m=t.authRequestResp)==null?void 0:m.authChallenge),1)]}),_:1})]),_:1},8,["activeKey"]),ge,t.type==="pgp-fingerprint"?(p(),g(i,{key:0,name:"publicKey",label:`${e(a)("pages.signIn.pgpPublicKey")}`,rules:[{required:!0,message:`${e(a)("pages.signIn.pleaseInput")} ${e(a)("pages.signIn.pgpPublicKey")}`}]},{default:n(()=>[l(x,{"auto-size":"",value:s.value.publicKey,"onUpdate:value":o[1]||(o[1]=m=>s.value.publicKey=m),placeholder:`${e(a)("pages.signIn.pgpPublicKey")}`},null,8,["value","placeholder"])]),_:1},8,["label","rules"])):z("",!0),l(i,{name:"challengeText",label:e(a)("pages.signIn.challengeText"),rules:[{required:!0,message:`${e(a)("pages.signIn.pleaseInput")} ${e(a)("pages.signIn.challengeText")}`}]},{default:n(()=>[t.type==="password"?(p(),g(v,{key:0,autocomplete:"password",value:s.value.challengeText,"onUpdate:value":o[2]||(o[2]=m=>s.value.challengeText=m),placeholder:e(a)("pages.signIn.challengeTextPlaceholder")},null,8,["value","placeholder"])):(p(),g(x,{key:1,"auto-size":"",value:s.value.challengeText,"onUpdate:value":o[3]||(o[3]=m=>s.value.challengeText=m),placeholder:`${e(a)("pages.signIn.challengeTextPlaceholder")}`},null,8,["value","placeholder"]))]),_:1},8,["label","rules"]),l(i,{"wrapper-col":{offset:8,span:16}},{default:n(()=>[l(h,{style:{"margin-right":"20px"},onClick:o[4]||(o[4]=m=>t.prevStep())},{default:n(()=>[C(f(e(a)("pages.peering.back")),1)]),_:1}),l(h,{type:"primary",onClick:o[5]||(o[5]=m=>t.challenge(s.value)),disabled:d.loading},{icon:n(()=>[l(e(Q))]),default:n(()=>[C(" "+f(e(a)("pages.signIn.continue")),1)]),_:1},8,["disabled"])]),_:1})]),_:1},8,["model"])]),_:1},8,["tip","spinning"])}}}),_e=A({__name:"doneBox",setup(q){const t=R().t,a=j(),s=y(""),r=y("");H(()=>{s.value=localStorage.getItem("asn")||"",r.value=localStorage.getItem("person")||""});const _=()=>{a.replace({path:"/manage"})},d=()=>{a.replace({path:"/"})};return(o,c)=>{const w=u("a-button"),S=u("a-result");return p(),g(S,{title:`${e(t)("pages.signIn.welcomeBack")} ${r.value||s.value||""}`,"sub-title":e(t)("pages.signIn.step4Introduction")},{icon:n(()=>[l(e(Z))]),extra:n(()=>[l(w,{key:"manageSessions",type:"primary",onClick:_},{default:n(()=>[C(f(e(t)("pages.signIn.manageSessions")),1)]),_:1}),l(w,{key:"topPage",onClick:d},{default:n(()=>[C(f(e(t)("pages.signIn.topPage")),1)]),_:1})]),_:1},8,["title","sub-title"])}}}),ve={class:"header"},me={class:"box"},he=0,ye=4294967295,fe=A({__name:"signin",setup(q){H(()=>{window.scrollTo(0,0)});const t=R().t,a=y("0"),s=y("query"),r=y(!1),_=y(""),d=y(""),o=y(null),c=y(null),w=async i=>{if(a.value="0",!i||i<he||i>ye){F.error(`${t("pages.signIn.pleaseInput")} ${t("pages.signIn.asn")}`);return}try{o.value=null,r.value=!0;const v=await U(t,"/auth",{action:"query",asn:i});if(v.availableAuthMethods.length===0){N.error({centered:!0,title:t("pages.signIn.signIn"),content:B(t("pages.signIn.couldNotFindAuthMethod"))});return}o.value=v,s.value="choose",_.value=`${t("pages.signIn.hi")} ${v.person}`,a.value=i.toString(),window.scrollTo(0,0)}catch(v){console.error(v)}finally{r.value=!1}},S=async i=>{var v,h;try{c.value=null,r.value=!0;const I=await U(t,"/auth",{action:"request",authMethod:i,authState:(v=o.value)==null?void 0:v.authState});if(!I.authState||!I.authChallenge){N.error({centered:!0,title:t("pages.signIn.signIn"),content:B(t("pages.signIn.errorOccurred"))});return}c.value=I,s.value="challenge",d.value=(h=o.value)==null?void 0:h.availableAuthMethods[i].type,window.scrollTo(0,0)}catch(I){console.error(I)}finally{r.value=!1}},x=async i=>{var v,h,I,K;if(i.challengeText===""){F.error(`${t("pages.signIn.pleaseInput")} ${t("pages.signIn.challengeText")}`);return}try{r.value=!0;let m="";i.publicKey?m={publicKey:i.publicKey,signedMessage:i.challengeText}:m=i.challengeText;const $=await U(t,"/auth",{action:"challenge",authState:(v=c.value)==null?void 0:v.authState,data:m});if(!$||!$.authResult){N.error({centered:!0,title:t("pages.signIn.signIn"),content:B(t("pages.signIn.signInFailed"))});return}localStorage.setItem("person",((h=o.value)==null?void 0:h.person)||""),(I=o.value)==null||I.availableAuthMethods.forEach(b=>{b&&b.type==="e-mail"&&b.data&&localStorage.setItem("email",b.data)}),localStorage.setItem("asn",a.value),localStorage.setItem("lastAsn",a.value),G.value=!0,s.value="done",F.info(`${t("pages.signIn.welcomeBack")} ${((K=o.value)==null?void 0:K.person)||a.value}`),window.scrollTo(0,0)}catch(m){console.error(m)}finally{r.value=!1}};return(i,v)=>{const h=u("a-layout-content");return p(),P("section",null,[k("h1",ve,f(e(t)("pages.signIn.signIn")),1),l(h,{id:"signin"},{default:n(()=>[l(ee,{class:"steps",step:s.value,"custom-query-title":_.value,"custom-choose-title":d.value,loading:r.value},null,8,["step","custom-query-title","custom-choose-title","loading"]),k("section",me,[s.value==="query"?(p(),g(ne,{key:0,loading:r.value,"query-asn":w},null,8,["loading"])):s.value==="choose"?(p(),g(ie,{key:1,"prev-step":()=>s.value="query",loading:r.value,"auth-query-resp":o.value,"request-challenge":S},null,8,["prev-step","loading","auth-query-resp"])):s.value==="challenge"?(p(),g(de,{key:2,"prev-step":()=>s.value="choose",loading:r.value,"auth-request-resp":c.value,challenge:x,type:d.value},null,8,["prev-step","loading","auth-request-resp","type"])):s.value==="done"?(p(),g(_e,{key:3})):z("",!0)])]),_:1})])}}}),ke=X(fe,[["__scopeId","data-v-05974f4c"]]);export{ke as default};