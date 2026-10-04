export async function api(path,body,method=body===undefined?'GET':'POST'){
 const response=await fetch('/api'+path,{method,credentials:'same-origin',headers:body===undefined?{}:{'content-type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
 let result;try{result=await response.json()}catch{throw new Error('The MOVA server is unavailable. Start the backend, or continue in local demo mode.')}
 if(!response.ok)throw new Error(result.error||'Request failed.');return result;
}
export const accountSnapshot=data=>({...data,posts:data.posts.filter(p=>!p.creatorProfile).map(({publicLikes,publicComments,...post})=>post),chats:data.chats.filter(c=>!c.real),assistant:[]});
