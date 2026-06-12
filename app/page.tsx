import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Home() {
  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <main style={{flex:1,padding:'24px'}}>
        <Header />
        <h1>Pin Plan Dashboard</h1>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
          {['Weight','Sleep','Recovery','Mood'].map(x => (
            <div key={x} style={{background:'#151B23',padding:'16px',borderRadius:'12px'}}>{x}</div>
          ))}
        </div>
      </main>
    </div>
  );
}
