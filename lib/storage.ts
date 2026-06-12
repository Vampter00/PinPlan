export const storage = {
 get:(k:string)=>JSON.parse(localStorage.getItem(k)||'null'),
 set:(k:string,v:any)=>localStorage.setItem(k,JSON.stringify(v))
};
