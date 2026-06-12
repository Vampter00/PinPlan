export default function Sidebar() {
  const items = ['Dashboard','Metrics','Training','Wellness','Journal','Analytics','Settings'];
  return (
    <aside style={{width:'220px',background:'#151B23',minHeight:'100vh',padding:'20px'}}>
      <h2>Pin Plan</h2>
      {items.map(i => <div key={i} style={{padding:'8px 0'}}>{i}</div>)}
    </aside>
  );
}
