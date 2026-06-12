export const storage = {
  get(key:string){
    if(typeof window==='undefined') return null;
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  },
  set(key:string,value:any){
    localStorage.setItem(key, JSON.stringify(value));
  }
};
