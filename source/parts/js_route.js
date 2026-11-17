function route(){
 let h=location.hash.slice(1);if(!V[h])h='home';
 const authPg=x=>x==='login'||x==='signup';
 if(!S.user&&!authPg(h)){h='login';try{history.replaceState(null,'','#login');}catch(e){}}
 else if(S.user&&authPg(h)){h='home';try{history.replaceState(null,'','#home');}catch(e){}}
 if(authPg(h)&&S.route!==h)S.auth={step:'phone'};
 S.route=h;render();window.scrollTo(0,0);
}
