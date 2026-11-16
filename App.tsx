import React, { useMemo, useState } from "react";
import { ArrowDownUp, ArrowRight, Bell, CheckCircle2, ChevronDown, CircleHelp, Clock3, Coins, Copy, Globe2, Headphones, LayoutDashboard, LogIn, Menu, MessageCircle, Search, Settings, ShieldCheck, Wallet, X } from "lucide-react";

type Currency = { id:string; name:string; ticker:string; type:"crypto"|"fiat"; icon:string; network?:string };
type Pair = { from:string; to:string; rate:number; fee:number; min:number; max:number; active:boolean };
const currencies:Currency[] = [
 {id:"binance",name:"Binance USDT",ticker:"USDT",type:"crypto",icon:"🟡",network:"Binance"},
 {id:"trc20",name:"USDT TRC20",ticker:"USDT",type:"crypto",icon:"₮",network:"TRON (TRC20)"},
 {id:"bep20",name:"USDT BEP20",ticker:"USDT",type:"crypto",icon:"₮",network:"BNB Smart Chain (BEP20)"},
 {id:"btc",name:"Bitcoin",ticker:"BTC",type:"crypto",icon:"₿",network:"Bitcoin"},
 {id:"ltc",name:"Litecoin",ticker:"LTC",type:"crypto",icon:"Ł",network:"Litecoin"},
 {id:"nagad",name:"Nagad",ticker:"BDT",type:"fiat",icon:"N",network:"Bangladesh"},
 {id:"bkash",name:"bKash",ticker:"BDT",type:"fiat",icon:"b",network:"Bangladesh"},
 {id:"rocket",name:"Rocket",ticker:"BDT",type:"fiat",icon:"R",network:"Bangladesh"}
];
const initialPairs:Pair[] = [
 {from:"trc20",to:"nagad",rate:120,fee:0,min:10,max:10000,active:true},
 {from:"trc20",to:"bkash",rate:119.5,fee:0,min:10,max:10000,active:true},
 {from:"trc20",to:"rocket",rate:119,fee:0,min:10,max:10000,active:true},
 {from:"binance",to:"nagad",rate:120,fee:0,min:10,max:10000,active:true},
 {from:"bep20",to:"bkash",rate:119.5,fee:0,min:10,max:10000,active:true},
 {from:"btc",to:"trc20",rate:65000,fee:0,min:0.001,max:2,active:true},
 {from:"ltc",to:"trc20",rate:85,fee:0,min:0.1,max:100,active:true}
];
const money=(n:number, digits=2)=>Number.isFinite(n)?n.toLocaleString("en-US",{maximumFractionDigits:digits,minimumFractionDigits:0}):"0";
const getCurrency=(id:string)=>currencies.find(c=>c.id===id)!;
export default function App(){
 const [lang,setLang]=useState<"EN"|"বাংলা">("EN");
 const [page,setPage]=useState("Exchange");
 const [menu,setMenu]=useState(false);
 const [from,setFrom]=useState("trc20");
 const [to,setTo]=useState("nagad");
 const [amount,setAmount]=useState("100");
 const [pairs,setPairs]=useState(initialPairs);
 const [orders,setOrders]=useState<any[]>([]);
 const [modal,setModal]=useState<"order"|"login"|"support"|null>(null);
 const [name,setName]=useState("");
 const [phone,setPhone]=useState("");
 const [email,setEmail]=useState("");
 const [note,setNote]=useState("");
 const [notice,setNotice]=useState("");
 const [admin,setAdmin]=useState(false);
 const [logged,setLogged]=useState(false);
 const [search,setSearch]=useState("");
 const [operator,setOperator]=useState(true);
 const [reserves,setReserves]=useState<Record<string,number>>({binance:5000,trc20:2500,bep20:1500,btc:0.5,ltc:200,nagad:500000,bkash:450000,rocket:300000});
 const [activeTab,setActiveTab]=useState("Rates");
 const [showAll,setShowAll]=useState(false);
 const pair=pairs.find(p=>p.from===from&&p.to===to&&p.active);
 const rate=pair?.rate ?? 0;
 const fee=pair?.fee ?? 0;
 const n= Math.max(0,Number(amount)||0);
 const receive=useMemo(()=>n*rate*(1-fee/100),[n,rate,fee]);
 const valid=!!pair && n>=pair.min && n<=pair.max && n>0 && (reserves[to]??0)>0;
 const t=(en:string,bn:string)=>lang==="EN"?en:bn;
 const swap=()=>{setFrom(to);setTo(from);setAmount("100");};
 const selectCurrency=(id:string,side:"from"|"to")=>{if(side==="from"){setFrom(id);if(id===to)setTo(from==="trc20"?"nagad":"trc20")}else{setTo(id);if(id===from)setFrom(to==="nagad"?"trc20":"nagad")}};
 const submitOrder=(e:React.FormEvent)=>{e.preventDefault(); if(!valid){setNotice(t("This pair or amount is unavailable in demo mode.","এই পেয়ার বা পরিমাণ ডেমো মোডে পাওয়া যাচ্ছে না।"));return;}
 const id="DBS-"+Date.now().toString().slice(-8); const o={id,name,phone,email,from,to,amount:n,receive,rate,status:"Pending",note,date:new Date().toLocaleString()};
 setOrders(old=>[o,...old]);setModal(null);setPage("My Orders");setNotice(t("Demo order created: ","ডেমো অর্ডার তৈরি হয়েছে: ")+id);};
 const navItems=["Exchange","Rates","Track Order","My Orders","Help"];
 const navIcons=[Coins,Globe2,Search,Wallet,CircleHelp];
 const doNav=(p:string)=>{setPage(p);setMenu(false);if(p==="Admin")setAdmin(true);else setAdmin(false)};
 const statusColor=(s:string)=>s==="Completed"?"green":s==="Rejected"?"red":s==="Processing"?"gold":"blue";
 return <div className="app">
  <div className="topbar"><span>● {t("Demo exchange platform","ডেমো এক্সচেঞ্জ প্ল্যাটফর্ম")}</span><span><Clock3 size={13}/> {t("Support hours: 24/7","সাপোর্ট: ২৪/৭")} <b className="live">{operator?t("ONLINE","অনলাইন"):t("OFFLINE","অফলাইন")}</b></span></div>
  <header className="header">
   <button className="iconbtn mobile" onClick={()=>setMenu(!menu)} aria-label="Menu">{menu?<X/>:<Menu/>}</button>
   <button className="brand" onClick={()=>doNav("Exchange")}><span className="brandmark">D</span><span><strong>DOLLAR<span>BUY SELL</span></strong><small>24/7 SERVICE</small></span></button>
   <nav>{navItems.map((p,i)=><button className={page===p?"navactive":""} onClick={()=>doNav(p)} key={p}>{React.createElement(navIcons[i],{size:16})}{t(p,["এক্সচেঞ্জ","রেট","অর্ডার ট্র্যাক","আমার অর্ডার","সাহায্য"][i])}</button>)}</nav>
   <div className="head-actions"><button className="lang" onClick={()=>setLang(lang==="EN"?"বাংলা":"EN")}><Globe2 size={16}/>{lang==="EN"?"বাংলা":"English"}</button><button className="login" onClick={()=>setModal("login")}><LogIn size={16}/>{logged?t("Account","অ্যাকাউন্ট"):t("Login","লগইন")}</button></div>
  </header>
  {menu&&<div className="mobilemenu">{navItems.map(p=><button onClick={()=>doNav(p)}>{p}</button>)}<button onClick={()=>doNav("Admin")}>Admin Demo</button></div>}
  <main>
   <section className="hero">
    <div className="hero-copy"><div className="eyebrow"><span className="dot"/> {t("SIMPLE • FAST • TRANSPARENT","সহজ • দ্রুত • স্বচ্ছ")}</div><h1>{t("Exchange smarter.","স্মার্টভাবে এক্সচেঞ্জ করুন।")}<em>{t("Move money with confidence.","আস্থা নিয়ে লেনদেনের পরিকল্পনা করুন।")}</em></h1><p>{t("A clean, easy-to-use demo exchange experience for digital currencies and local payment methods.","ডিজিটাল কারেন্সি ও স্থানীয় পেমেন্টের জন্য সহজ ডেমো এক্সচেঞ্জ অভিজ্ঞতা।")}</p><div className="hero-points"><span><ShieldCheck/> {t("Transparent rates","স্বচ্ছ রেট")}</span><span><Clock3/> 24/7 {t("Support","সাপোর্ট")}</span></div></div>
    <div className="hero-card"><div className="hero-card-top"><span>{t("EXCHANGE SNAPSHOT","এক্সচেঞ্জ সংক্ষিপ্তসার")}</span><span className="demo-tag">DEMO</span></div><div className="snapshot"><div><small>USDT</small><b>₮</b><strong>Digital assets</strong></div><ArrowRight/><div><small>BDT</small><b>৳</b><strong>Local payment</strong></div></div><div className="hero-stats"><div><small>{t("Supported options","সাপোর্টেড অপশন")}</small><b>08</b></div><div><small>{t("Platform status","প্ল্যাটফর্ম অবস্থা")}</small><b className="green-text">{t("Online","অনলাইন")}</b></div></div></div>
   </section>
   {notice&&<div className="notice"><CheckCircle2 size={17}/>{notice}<button onClick={()=>setNotice("")}><X size={15}/></button></div>}
   {page==="Exchange"&&<section className="exchange-layout">
    <div className="section-heading"><div><span className="eyebrow">EXCHANGE DESK</span><h2>{t("Make an exchange","এক্সচেঞ্জ করুন")}</h2><p>{t("Choose what you send and what you would like to receive.","আপনি কী পাঠাবেন এবং কী পেতে চান তা নির্বাচন করুন।")}</p></div><span className="demo-tag">DEMO MODE</span></div>
    <div className="exchange-card">
     <div className="exchange-columns">
      <div className="amount-panel"><label>{t("YOU SEND","আপনি পাঠাবেন")}</label><div className="select-wrap"><span className="coin-icon">{getCurrency(from).icon}</span><select value={from} onChange={e=>selectCurrency(e.target.value,"from")}>{currencies.map(c=><option value={c.id}>{c.name} · {c.ticker}</option>)}</select><ChevronDown/></div><div className="amount-line"><input value={amount} onChange={e=>setAmount(e.target.value)} type="number" min="0" step="any" placeholder="0.00"/><span>{getCurrency(from).ticker}</span></div><div className="hint">{pair?`${t("Min","সর্বনিম্ন")} ${pair.min} · ${t("Max","সর্বোচ্চ")} ${money(pair.max,6)}`:t("Select an available exchange pair","একটি চালু এক্সচেঞ্জ পেয়ার নির্বাচন করুন")}</div></div>
      <button className="swap" onClick={swap} title="Swap direction"><ArrowDownUp/></button>
      <div className="amount-panel"><label>{t("YOU GET","আপনি পাবেন")}</label><div className="select-wrap"><span className="coin-icon">{getCurrency(to).icon}</span><select value={to} onChange={e=>selectCurrency(e.target.value,"to")}>{currencies.map(c=><option value={c.id}>{c.name} · {c.ticker}</option>)}</select><ChevronDown/></div><div className="amount-line output"><strong>{money(receive,8)}</strong><span>{getCurrency(to).ticker}</span></div><div className="hint">{t("Estimated amount after fee","ফি বাদে আনুমানিক পরিমাণ")}</div></div>
     </div>
     <div className="rate-strip"><span>{t("Exchange rate","এক্সচেঞ্জ রেট")}: <b>{rate?`1 ${getCurrency(from).ticker} = ${money(rate,8)} ${getCurrency(to).ticker}`:t("Not configured","সেট করা হয়নি")}</b></span><span>{t("Fee","ফি")}: <b>{fee}%</b></span><span>{t("Updated","আপডেট")}: <b>{pair?"Manual demo rate":"—"}</b></span></div>
     {!pair&&<div className="warning">ⓘ {t("This demo pair has no configured rate. Select a configured pair or set one in Admin Demo.","এই ডেমো পেয়ারটির রেট সেট করা নেই। অন্য পেয়ার নির্বাচন করুন অথবা Admin Demo-তে রেট সেট করুন।")}</div>}
     {pair&&n>0&&(n<pair.min||n>pair.max)&&<div className="warning">{t("Amount is outside the configured limits.","পরিমাণ নির্ধারিত সীমার বাইরে।")}</div>}
     <div className="reserve-row"><span><span className="dot"/> {t("Demo reserve","ডেমো রিজার্ভ")}</span><b>{money(reserves[to]??0,6)} {getCurrency(to).ticker}</b></div>
     <button className="primary full" disabled={!valid} onClick={()=>setModal("order")}>{t("EXCHANGE NOW","এখনই এক্সচেঞ্জ করুন")} <ArrowRight size={18}/></button>
     <p className="fineprint"><ShieldCheck size={14}/> {t("Demo only. No real funds are transferred or settled.","শুধুমাত্র ডেমো। কোনো বাস্তব অর্থ স্থানান্তর বা নিষ্পত্তি হয় না।")}</p>
    </div>
    <div className="feature-grid"><div><ShieldCheck/><b>{t("Clear information","পরিষ্কার তথ্য")}</b><small>{t("Rates and fees shown before order creation.","অর্ডারের আগে রেট ও ফি দেখানো হয়।")}</small></div><div><Clock3/><b>{t("Always accessible","সবসময় ব্যবহারযোগ্য")}</b><small>{t("Explore the demo experience anytime.","যেকোনো সময় ডেমো ব্যবহার করুন।")}</small></div><div><Headphones/><b>{t("Customer support","কাস্টমার সাপোর্ট")}</b><small>{t("Support details can be configured by admin.","অ্যাডমিন সাপোর্ট তথ্য সেট করতে পারবেন।")}</small></div></div>
   </section>}
   {page==="Rates"&&<section className="content-card"><div className="section-heading"><div><span className="eyebrow">MARKET CONFIGURATION</span><h2>{t("Exchange rates","এক্সচেঞ্জ রেট")}</h2><p>{t("Illustrative admin-configured demo rates. Not live market prices.","অ্যাডমিন নির্ধারিত উদাহরণমূলক ডেমো রেট। লাইভ বাজারদর নয়।")}</p></div></div><div className="table-wrap"><table><thead><tr><th>PAIR</th><th>RATE</th><th>FEE</th><th>STATUS</th></tr></thead><tbody>{pairs.map(p=><tr><td>{getCurrency(p.from).name} → {getCurrency(p.to).name}</td><td>{money(p.rate,8)}</td><td>{p.fee}%</td><td><span className="pill green-pill">{p.active?"Active":"Paused"}</span></td></tr>)}</tbody></table></div></section>}
   {page==="Track Order"&&<section className="content-card"><span className="eyebrow">ORDER TRACKING</span><h2>{t("Track your order","আপনার অর্ডার খুঁজুন")}</h2><p>{t("Your demo order reference appears after submission.","অর্ডার জমা দেওয়ার পর ডেমো রেফারেন্স নম্বর পাবেন।")}</p><div className="searchbar"><Search/><input placeholder="DBS-12345678" value={search} onChange={e=>setSearch(e.target.value)}/><button className="primary" onClick={()=>{const o=orders.find(x=>x.id.toLowerCase()===search.toLowerCase());setNotice(o?`${o.id}: ${o.status}`:t("Order not found in this browser session.","এই ব্রাউজার সেশনে অর্ডার পাওয়া যায়নি।"));}}> {t("Track","খুঁজুন")}</button></div></section>}
   {page==="My Orders"&&<section className="content-card"><span className="eyebrow">CUSTOMER AREA</span><h2>{t("My demo orders","আমার ডেমো অর্ডার")}</h2>{orders.length===0?<div className="empty"><Wallet/><b>{t("No orders yet","এখনো কোনো অর্ডার নেই")}</b><p>{t("Create a demo exchange to see it here.","এখানে দেখতে একটি ডেমো এক্সচেঞ্জ তৈরি করুন।")}</p><button className="primary" onClick={()=>doNav("Exchange")}>{t("Start exchange","এক্সচেঞ্জ শুরু করুন")}</button></div>:<div className="table-wrap"><table><thead><tr><th>ORDER</th><th>PAIR</th><th>YOU SEND</th><th>YOU GET</th><th>STATUS</th></tr></thead><tbody>{orders.map(o=><tr><td>{o.id}</td><td>{getCurrency(o.from).ticker} → {getCurrency(o.to).ticker}</td><td>{money(o.amount,8)}</td><td>{money(o.receive,8)}</td><td><span className={`pill ${statusColor(o.status)}-pill`}>{o.status}</span></td></tr>)}</tbody></table></div>}</section>}
   {page==="Help"&&<section className="content-card"><span className="eyebrow">HELP CENTER</span><h2>{t("How can we help?","কীভাবে সাহায্য করতে পারি?")}</h2><p>{t("This is a demo platform. Configure official support details in the admin settings before publishing.","এটি একটি ডেমো প্ল্যাটফর্ম। প্রকাশের আগে Admin Settings-এ অফিসিয়াল সাপোর্ট তথ্য যুক্ত করুন।")}</p><button className="primary" onClick={()=>setModal("support")}><MessageCircle/> {t("Contact demo support","সাপোর্টে যোগাযোগ")}</button></section>}
   {page==="Admin"&&admin&&<section className="content-card admin"><div className="section-heading"><div><span className="eyebrow">CONTROL CENTER · DEMO</span><h2>Admin Dashboard</h2><p>Configure demo pairs, rates, limits and reserve figures.</p></div><span className="demo-tag">LOCAL DEMO</span></div><div className="admin-tabs">{["Rates","Reserves","Orders","Settings"].map(x=><button className={activeTab===x?"selected":""} onClick={()=>setActiveTab(x)}>{x}</button>)}</div>
    {activeTab==="Rates"&&<div className="admin-list">{pairs.map((p,i)=><div className="admin-row"><div><b>{getCurrency(p.from).name} → {getCurrency(p.to).name}</b><small>Rate · Fee · Limits</small></div><label>Rate<input type="number" value={p.rate} onChange={e=>setPairs(old=>old.map((x,j)=>j===i?{...x,rate:Number(e.target.value)}:x))}/></label><label>Fee %<input type="number" value={p.fee} onChange={e=>setPairs(old=>old.map((x,j)=>j===i?{...x,fee:Number(e.target.value)}:x))}/></label><button className="toggle" onClick={()=>setPairs(old=>old.map((x,j)=>j===i?{...x,active:!x.active}:x))}>{p.active?"Enabled":"Disabled"}</button></div>)}</div>}
    {activeTab==="Reserves"&&<div className="admin-list">{currencies.map(c=><div className="admin-row"><div><b>{c.name}</b><small>Demo reserve only</small></div><label>Reserve<input type="number" value={reserves[c.id]??0} onChange={e=>setReserves(old=>({...old,[c.id]:Number(e.target.value)}))}/></label></div>)}</div>}
    {activeTab==="Orders"&&<div className="table-wrap"><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>PAIR</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{orders.map((o,i)=><tr><td>{o.id}</td><td>{o.name}</td><td>{getCurrency(o.from).ticker} → {getCurrency(o.to).ticker}</td><td>{o.status}</td><td><select value={o.status} onChange={e=>setOrders(old=>old.map((x,j)=>j===i?{...x,status:e.target.value}:x))}>{["Pending","Under Review","Approved","Processing","Completed","Rejected","Cancelled"].map(s=><option>{s}</option>)}</select></td></tr>)}</tbody></table>{orders.length===0&&<p className="empty">No demo orders.</p>}</div>}
    {activeTab==="Settings"&&<div className="settings-panel"><div><b>Operator availability</b><p>Show online/offline demo status.</p></div><button className="toggle" onClick={()=>setOperator(!operator)}>{operator?"Online":"Offline"}</button><div><b>Platform language</b><p>Use the header switch to preview Bangla and English.</p></div></div>}
   </section>}
   {page!=="Admin"&&<button className="admin-shortcut" onClick={()=>{setAdmin(true);setPage("Admin")}}><Settings size={15}/> Admin Demo</button>}
  </main>
  <footer><div className="footer-main"><div className="brand footer-brand"><span className="brandmark">D</span><span><strong>DOLLAR<span>BUY SELL</span></strong><small>24/7 SERVICE</small></span></div><p>{t("A demonstration interface for exploring currency exchange workflows.","কারেন্সি এক্সচেঞ্জ প্রক্রিয়া দেখার জন্য একটি ডেমো ইন্টারফেস।")}</p><div className="footer-links"><button onClick={()=>doNav("Exchange")}>Exchange</button><button onClick={()=>doNav("Rates")}>Rates</button><button onClick={()=>doNav("Help")}>Support</button></div></div><div className="footer-bottom"><span>© 2026 Dollar Buy Sell 24/7 Service</span><span>DEMO ONLY · NO REAL TRANSACTIONS</span></div></footer>
  <button className="chat-float" onClick={()=>setModal("support")} aria-label="Support"><MessageCircle/></button>
  {modal==="order"&&<div className="overlay"><form className="modal" onSubmit={submitOrder}><div className="modal-head"><div><span className="eyebrow">DEMO ORDER</span><h3>{t("Confirm exchange request","এক্সচেঞ্জ অনুরোধ নিশ্চিত করুন")}</h3></div><button type="button" className="iconbtn" onClick={()=>setModal(null)}><X/></button></div><div className="summary"><div><small>{t("You send","আপনি পাঠাবেন")}</small><b>{money(n,8)} {getCurrency(from).ticker} · {getCurrency(from).name}</b></div><div><small>{t("Estimated receive","আনুমানিক পাবেন")}</small><b className="green-text">{money(receive,8)} {getCurrency(to).ticker}</b></div><div><small>{t("Rate / fee","রেট / ফি")}</small><b>{money(rate,8)} / {fee}%</b></div></div><label>{t("Full name","পূর্ণ নাম")}<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><label>{t("Email","ইমেইল")}<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>{t("Mobile number","মোবাইল নম্বর")}<input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+880..."/></label><label>{t("Order note (optional)","অর্ডার নোট (ঐচ্ছিক)")}<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Additional information"/></label><label className="check"><input type="checkbox" required/> {t("I understand this is a demo request only.","আমি বুঝেছি এটি শুধুমাত্র একটি ডেমো অনুরোধ।")}</label><button className="primary full" type="submit">{t("Create demo order","ডেমো অর্ডার তৈরি করুন")}</button><p className="fineprint">Never share passwords, OTPs, seed phrases or private keys.</p></form></div>}
  {modal==="login"&&<div className="overlay"><div className="modal"><div className="modal-head"><div><span className="eyebrow">CUSTOMER ACCESS</span><h3>{t("Demo sign in","ডেমো লগইন")}</h3></div><button className="iconbtn" onClick={()=>setModal(null)}><X/></button></div><p>This preview does not have production authentication. Connect Supabase Auth before launch.</p><label>Display name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><button className="primary full" onClick={()=>{setLogged(true);setModal(null);setNotice("Demo session started. Production login is not connected.");}}>Continue in demo</button></div></div>}
  {modal==="support"&&<div className="overlay"><div className="modal"><div className="modal-head"><div><span className="eyebrow">SUPPORT</span><h3>{t("Customer support","কাস্টমার সাপোর্ট")}</h3></div><button className="iconbtn" onClick={()=>setModal(null)}><X/></button></div><p>{t("Support contact details have not been configured yet. Add your verified business contact in Admin Settings before publishing.","সাপোর্টের তথ্য এখনো সেট করা হয়নি। প্রকাশের আগে Admin Settings-এ যাচাইকৃত যোগাযোগের তথ্য যুক্ত করুন।")}</p><button className="primary full" onClick={()=>setModal(null)}>OK</button></div></div>}
 </div>
}