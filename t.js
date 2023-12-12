let sec=60;

let day=Math.floor(sec/86400)
let hour= Math.floor(sec/3600);
let minutes=Math.floor(sec/60)%60;

console.log(day+' day '+ hour+' hour '+minutes+' minutes')

