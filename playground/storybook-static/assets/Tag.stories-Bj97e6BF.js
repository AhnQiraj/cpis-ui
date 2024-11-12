import{C as o}from"./index-BzkuOFb5.js";const A={title:"原子组件/标签",component:o,tags:["autodocs"],render:(v,{argTypes:F})=>({props:Object.keys(F),components:{CpisTag:o},template:'<CpisTag :type="type" >{{label}}</CpisTag>'}),argTypes:{type:{description:"状态",control:"select",options:["submitted","draft","completed","cancelled","overdue"]},label:{description:"标签内文字",control:"text"}},args:{type:"submitted",label:"文字"}},e={args:{type:"submitted",label:"提交"},name:"提交"},a={args:{type:"draft",label:"拟稿"},name:"拟稿"},r={args:{type:"completed",label:"完成"},name:"完成"},s={args:{type:"cancelled",label:"取消"},name:"取消"},t={args:{type:"overdue",label:"超期"},name:"超期"};var n,c,p;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    type: 'submitted',
    label: '提交'
  },
  name: '提交'
}`,...(p=(c=e.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var l,u,m;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    type: 'draft',
    label: '拟稿'
  },
  name: '拟稿'
}`,...(m=(u=a.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var d,i,g;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(D=(y=s.parameters)==null?void 0:y.docs)==null?void 0:D.source}}};var C,f,S;t.parameters={...t.parameters,docs:{...(C=t.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    type: 'overdue',
    label: '超期'
  },
  name: '超期'
}`,...(S=(f=t.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};const O=["Submitted","Draft","Completed","Cancelled","Overdue"];export{s as Cancelled,r as Completed,a as Draft,t as Overdue,e as Submitted,O as __namedExportsOrder,A as default};
