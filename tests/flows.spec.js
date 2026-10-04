import {test,expect} from '@playwright/test';
test('main local flows and responsive layout',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByText('Find your kind of')).toBeVisible();
 const nav=async name=>page.locator('nav:visible').getByRole('button',{name,exact:true}).click();
 await page.getByRole('button',{name:'React to post',exact:true}).first().click();
 await page.getByRole('button',{name:'Save post',exact:true}).first().click();
 await page.getByRole('button',{name:'Follow',exact:true}).first().click();
 await nav('Create');await page.getByLabel('Caption',{exact:true}).fill('A test moment worth sharing');
 await page.getByRole('button',{name:'Save draft',exact:true}).click();
 await page.getByLabel('Upload local media').setInputFiles({name:'tiny.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jS1kAAAAASUVORK5CYII=','base64')});
 await expect(page.getByAltText('Local upload preview')).toBeVisible();
 await page.getByRole('button',{name:'Preview',exact:true}).click();await expect(page.getByRole('button',{name:'React to post',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Publish post',exact:false}).click();
 await expect(page.getByText('A test moment worth sharing',{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'Comment on post',exact:true}).first().click();
 await page.getByLabel('Comment',{exact:true}).fill('Love this little moment');await page.getByRole('button',{name:'Send comment',exact:true}).click();
 await expect(page.getByText('Love this little moment')).toBeVisible();await page.getByRole('button',{name:'Close dialog'}).click();
 await nav('Profile');await page.getByRole('button',{name:'Edit profile'}).click();await page.getByLabel('Display name',{exact:true}).fill('Alex Test');await page.getByRole('button',{name:'Save profile'}).click();
 await page.reload();await nav('Profile');await expect(page.getByRole('heading',{name:'Alex Test'})).toBeVisible();
 await nav('Chats');await page.getByRole('button',{name:/June Park.*Found|June Park.*light/}).click();await page.getByLabel('Message',{exact:true}).fill('See you Saturday!');await page.getByRole('button',{name:'Send message',exact:true}).click();await expect(page.getByText('See you Saturday!')).toBeVisible();await page.getByRole('button',{name:'React to message'}).last().click();
 await page.getByRole('button',{name:'Ask MOVA',exact:true}).first().click();await page.getByRole('button',{name:'Help me organise this appointment'}).click();await page.getByRole('button',{name:'Approve demo action'}).click();await expect(page.getByText('Approved locally · no external action taken')).toBeVisible();
 await nav('Feed');await page.getByRole('button',{name:'Share post',exact:true}).first().click();await page.getByRole('dialog').getByRole('button',{name:/June Park/}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`tests/${test.info().project.name}.png`,fullPage:false});expect(errors).toEqual([]);
});

test('templates, drafts, moderation, blocking, keyboard and reset',async({page})=>{
 await page.goto('/');const nav=async name=>page.locator('nav:visible').getByRole('button',{name,exact:true}).click();
 await nav('Create');await page.getByRole('button',{name:'Styled article',exact:true}).click();await page.getByLabel('Headline',{exact:true}).fill('Small things matter');await page.getByLabel('Your story',{exact:true}).fill('A longer story about noticing the little things.');await page.getByRole('button',{name:'coral',exact:true}).click();await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.reload();await nav('Create');await page.getByRole('button',{name:/Small things matter/}).click();await expect(page.getByLabel('Headline',{exact:true})).toHaveValue('Small things matter');await page.getByRole('button',{name:/Publish post/}).click();
 await page.getByRole('button',{name:'Open post details'}).first().focus();await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'Post options'}).first().click();await page.getByLabel('Content visibility').selectOption('Only me');await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:'Post options'}).nth(1).click();await page.getByRole('button',{name:'Report post',exact:true}).click();await page.getByRole('button',{name:'Spam or misleading content'}).click();await expect(page.getByRole('status').filter({hasText:'Report recorded locally'})).toBeVisible();
 await page.getByRole('button',{name:'Post options'}).nth(1).click();await page.getByRole('button',{name:'Block Sol Rivera'}).click();await expect(page.locator('.feed-list .post').filter({hasText:'A little reminder to take the scenic route'})).toHaveCount(0);
 await nav('Profile');await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('button',{name:'Unblock Sol Rivera'}).click();await page.getByRole('button',{name:'Reset demo data'}).click();await page.getByRole('button',{name:'Reset all demo data'}).click();await expect(page.getByText('Small things matter',{exact:false})).toHaveCount(0);
});

test('account UI persists posts and exchanges real messages',async({page,playwright},info)=>{
 const suffix=info.project.name+Date.now();const bob=await playwright.request.newContext({baseURL:'http://localhost:3001'});
 const seed={profile:{id:'me',name:'Robin',handle:'robin_'+suffix,bio:'Test account',avatar:'R',color:'#b49aff',style:'plain'},posts:[{id:'remote_'+suffix,creator:'me',type:'quick',title:'A backend friend moment '+suffix,text:'',visibility:'Public',comments:[],likes:0}],liked:[],saved:[],follows:[],blocked:[],reports:[],drafts:[],chats:[],assistant:[]};
 await bob.post('/api/auth/register',{data:{email:suffix+'@friend.test',password:'a-strong-test-password'}});await bob.put('/api/state',{data:{revision:0,data:seed}});
 await page.goto('/');await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByRole('button',{name:'New here? Create an account'}).click();await page.getByLabel('Email',{exact:true}).fill(suffix+'@mova.test');await page.getByLabel('Password',{exact:true}).fill('a-strong-test-password');await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(page.getByRole('button',{name:'Sign out',exact:true})).toBeVisible();
 const nav=async name=>page.locator('nav:visible').getByRole('button',{name,exact:true}).click();await nav('Create');await page.getByLabel('Caption',{exact:true}).fill('My durable account post '+suffix);await page.getByRole('button',{name:/Publish post/}).click();await expect.poll(async()=>{const r=await page.request.get('/api/state');return (await r.json()).data?.posts.some(p=>p.title==='My durable account post '+suffix)}).toBe(true);
 await page.reload();await expect(page.getByRole('button',{name:'Sign out',exact:true})).toBeVisible();await expect(page.getByText('My durable account post '+suffix,{exact:false}).first()).toBeVisible();
 await nav('Chats');await page.getByLabel('Friend handle').fill(seed.profile.handle);await page.getByRole('button',{name:'New chat',exact:true}).click();await page.getByLabel('Message',{exact:true}).fill('A real message from my account');await page.getByRole('button',{name:'Send message',exact:true}).click();await expect(page.getByText('A real message from my account')).toBeVisible();
 const chats=await (await bob.get('/api/conversations')).json();expect(chats.chats[0].messages[0].text).toBe('A real message from my account');await bob.post('/api/conversations/'+chats.chats[0].id+'/messages',{data:{text:'And a real reply!'}});await expect(page.getByText('And a real reply!')).toBeVisible({timeout:12000});
 await page.getByRole('button',{name:'Ask MOVA',exact:true}).first().click();await page.getByRole('button',{name:'Draft a reply',exact:true}).click();await page.getByRole('button',{name:'Approve demo action'}).click();await expect(page.getByText('Approved locally · no external action taken')).toBeVisible();
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();await expect(page.getByText('My durable account post '+suffix,{exact:false})).toHaveCount(0);await bob.dispose();
});
