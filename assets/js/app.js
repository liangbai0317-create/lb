const STORAGE_KEY='love-food-partner-answers-v2';
const load=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{answers:{},order:[]}}catch{return{answers:{},order:[]}}};
const save=s=>localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
const resolveResult=state=>{
 const entries=Object.entries(state.answers),ritual=new Set(['2:A','3:B','6:A']),soft=new Set(['4:B','5:C','6:C']);
 if(entries.filter(([q,a])=>ritual.has(q+':'+a)).length>=3)return'b';
 if(entries.filter(([q,a])=>soft.has(q+':'+a)).length>=3)return'f';
 const counts={A:0,B:0,C:0,D:0};entries.forEach(([,a])=>{if(a in counts)counts[a]++});
 const max=Math.max(...Object.values(counts)),tied=Object.keys(counts).filter(a=>counts[a]===max);
 const winner=[...state.order].reverse().find(item=>tied.includes(item.a))?.a||tied[0]||'A';
 return{A:'d',B:'a',C:'e',D:'c'}[winner];
};
document.addEventListener('click',event=>{
 const reset=event.target.closest('[data-reset]');if(reset)localStorage.removeItem(STORAGE_KEY);
 const choice=event.target.closest('[data-question][data-answer]');
 if(choice){const state=load(),q=String(choice.dataset.question),a=choice.dataset.answer;state.answers[q]=a;state.order=state.order.filter(item=>item.q!==q);state.order.push({q,a});save(state)}
 const submit=event.target.closest('[data-final-submit]');
 if(submit){event.preventDefault();location.href='result-'+resolveResult(load())+'.html';return}
 const back=event.target.closest('[data-back]');
 if(back){event.preventDefault();if(history.length>1)history.back();else location.href=document.body.dataset.home||'index.html'}
});