import{C as o}from"./index-BzkuOFb5.js";const O={title:"样式规范/背景色",component:o,tags:["autodocs"],render:(F,{argTypes:v})=>({props:Object.keys(v),components:{CpisTag:o},template:'<div class="cpis-orange-1 w-10">123</div>'}),argTypes:{type:{description:"状态",control:"select",options:["submitted","draft","completed","cancelled","overdue"]},label:{description:"标签内文字",control:"text"}},args:{type:"submitted",label:"文字"}},e={args:{type:"submitted",label:"提交"},name:"提交"},a={args:{type:"draft",label:"拟稿"},name:"拟稿"},r={args:{type:"completed",label:"完成"},name:"完成"},s={args:{type:"cancelled",label:"取消"},name:"取消"},t={args:{type:"overdue",label:"超期"},name:"超期"};var n,c,l;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    type: 'submitted',
    label: '提交'
  },
  name: '提交'
}`,...(l=(c=e.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var p,u,d;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    type: 'draft',
    label: '拟稿'
  },
  name: '拟稿'
}`,...(d=(u=a.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};var m,i,g;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    type: 'completed',
    label: '完成'
  },
  name: '完成'
}`,...(g=(i=r.parameters)==null?void 0:i.docs)==null?void 0:g.source}}};var b,y,D;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    type: 'cancelled',
    label: '取消'
  },
  name: '取消'
}`,...(D=(y=s.parameters)==null?void 0:y.docs)==null?void 0:D.source}}};var C,S,f;t.parameters={...t.parameters,docs:{...(C=t.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    type: 'overdue',
    label: '超期'
  },
  name: '超期'
}`,...(f=(S=t.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};const x=["Submitted","Draft","Completed","Cancelled","Overdue"];export{s as Cancelled,r as Completed,a as Draft,t as Overdue,e as Submitted,x as __namedExportsOrder,O as default};
