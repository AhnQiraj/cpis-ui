import{e as S,a as _,h as E,b as C,c as A,S as T,d as m}from"./index-PqU85aF2.js";import"./_commonjsHelpers-Cpj98o6Y.js";const{addons:R}=__STORYBOOK_MODULE_PREVIEW_API__,{logger:y}=__STORYBOOK_MODULE_CLIENT_LOGGER__;var j=["props","events","slots","methods"];function D(t,e){let{type:r,values:o}=e;if(!(Array.isArray(o)&&o.length&&r&&r.name!=="enum"))return!1;let n=o.join(", "),{summary:s}=t.type;return s=s?`${s}: ${n}`:n,Object.assign(t.type,{...t.type,name:"enum",value:o,summary:s}),t}function B(t,e){let r=t,o=!1,n=[D];for(let s=0,i=n.length;s<i;s+=1){let a=n[s](t,e);a&&(r=a,o=!0)}return[r,o]}var I=t=>{if(!E(t))return null;let e={};return j.forEach(r=>{C(t,r).forEach(({propDef:o,docgenInfo:n,jsDocTags:s})=>{let[i,a]=B(o,n),{name:p,type:l,description:$,defaultValue:h,required:d}=i,c;a?c=l:c=r==="props"?A(n):{name:"void"},e[p]={name:p,description:$,type:{required:d,...c},table:{type:l,jsDocTags:s,defaultValue:h,category:r}}})}),e},Y=t=>{var o;let e=(o=t==null?void 0:t.parameters.docs)==null?void 0:o.source,r=t==null?void 0:t.parameters.__isArgsStory;return(e==null?void 0:e.type)===m.DYNAMIC?!1:!r||(e==null?void 0:e.code)||(e==null?void 0:e.type)===m.CODE},K=(t,e)=>{let r=t(),o="";if(Y(e))return r;let n=R.getChannel(),s=b(r.options.STORYBOOK_WRAPS),i=a=>{try{let p=g(a,s);if(!p){y.warn(`Failed to find story component in the rendered tree: ${s}`);return}a.source=u(p._vnode)}catch(p){y.warn(`Failed to generate dynamic story source: ${p}`)}};return{components:{Story:r},data(){return{source:o}},updated(){i(this)},mounted(){this.$watch("source",a=>n.emit(T,e.id,`<template>${a}</template>`,"vue")),i(this)},template:"<story />"}};function u(t){var o,n,s;let e=[...(o=t.data)!=null&&o.slot?[["slot",t.data.slot]]:[],["class",N(t)],...(n=t.componentOptions)!=null&&n.propsData?Object.entries(t.componentOptions.propsData):[],...(s=t.data)!=null&&s.attrs?Object.entries(t.data.attrs):[]].filter(([i],a,p)=>p.findIndex(l=>l[0]===i)===a).map(([i,a])=>P(i,a)).filter(Boolean).join(" ");if(!t.componentOptions)return t.tag?t.children?`<${t.tag} ${e}>${t.children.map(u).join("")}</${t.tag}>`:`<${t.tag} ${e}/>`:t.text?/[<>"&]/.test(t.text)?`{{\`${t.text.replace(/`/g,"\\`")}\`}}`:t.text:"";let r=t.componentOptions.tag||t.tag||"unknown-component";return t.componentOptions.children?`<${r} ${e}>${t.componentOptions.children.map(u).join("")}</${r}>`:`<${r} ${e}/>`}function N(t){var e;if(!(!t.data||!t.data.staticClass&&!t.data.class))return[...((e=t.data.staticClass)==null?void 0:e.split(" "))??[],...O(t.data.class)].filter(Boolean).join(" ")||void 0}function O(t){return t?typeof t=="string"?[t]:t instanceof Array?t.map(O).reduce((e,r)=>[...e,...r],[]):typeof t=="object"?Object.entries(t).filter(([,e])=>!!e).map(([e])=>e):[]:[]}function P(t,e){return typeof e>"u"||typeof e=="function"?null:e===!0?t:typeof e=="string"?`${t}=${f(e)}`:`:${t}=${f(JSON.stringify(e))}`}function f(t){return t.includes('"')&&!t.includes("'")?`'${t}'`:`"${t.replace(/"/g,"&quot;")}"`}function b(t){let e=t;for(;e&&e.options&&e.options.components&&e.options.components.story&&e.options.components.story.options&&e.options.components.story.options.STORYBOOK_WRAPS;)e=e.options.components.story.options.STORYBOOK_WRAPS;return e}function g(t,e){if(t.$vnode&&t.$vnode.componentOptions&&t.$vnode.componentOptions.Ctor===e)return t;for(let r=0,o=t.$children.length;r<o;r+=1){let n=g(t.$children[r],e);if(n)return n}return null}var L={docs:{story:{inline:!0,iframeHeight:"120px"},extractArgTypes:I,extractComponentDescription:S}},W=[K],q=[_];export{q as argTypesEnhancers,W as decorators,L as parameters};
