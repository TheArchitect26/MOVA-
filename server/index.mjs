import http from 'node:http';
import {mkdirSync,readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createApp} from './app.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const database=process.env.DATABASE_PATH||resolve(root,'data/mova.sqlite');mkdirSync(dirname(database),{recursive:true});
const app=createApp({database,secureCookies:process.env.NODE_ENV==='production',apiKey:process.env.OPENAI_API_KEY||'',model:process.env.OPENAI_MODEL||'gpt-4.1-mini',allowedOrigins:process.env.NODE_ENV==='production'?[]:['http://localhost:5173','http://127.0.0.1:5173']});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer(async(req,res)=>{try{
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; media-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');
 if(req.url.startsWith('/api/')){let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>20*1024*1024){res.writeHead(413,{'content-type':'application/json'});res.end(JSON.stringify({error:'Request too large.'}));return}chunks.push(chunk)}
 const origin=process.env.APP_ORIGIN||`http://localhost:${process.env.PORT||3001}`;
 const request=new Request(new URL(req.url,origin),{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});const response=await app.handle(request);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
 }
 const url=new URL(req.url,'http://localhost');let path=resolve(root,'dist','.'+decodeURIComponent(url.pathname));if(!path.startsWith(resolve(root,'dist')+'/')&&path!==resolve(root,'dist')){res.writeHead(403);res.end();return}if(!existsSync(path)||statSync(path).isDirectory())path=resolve(root,'dist/index.html');if(!existsSync(path)){res.writeHead(503);res.end('Build MOVA first with npm run build.');return}res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(readFileSync(path));
 }catch{res.writeHead(500);res.end('Request failed.')}});
server.listen(Number(process.env.PORT||3001),process.env.HOST||'127.0.0.1',()=>console.log(`MOVA is running at http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||3001}`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>{app.close();process.exit(0)}));
