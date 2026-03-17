const fs=require("fs"),path=require("path"),b="/Users/MAC/Imisioluwa/frontend-next";
var d=["app/(store)/product/[slug]","app/(store)/category/[slug]","app/admin/(protected)/products","app/admin/(protected)/categories","app/admin/(protected)/orders","app/admin/(protected)/customers","app/admin/(protected)/shipping","app/admin/(protected)/settings"];
d.forEach(function(x){fs.mkdirSync(path.join(b,x),{recursive:true});console.log("Created: "+path.join(b,x))});
