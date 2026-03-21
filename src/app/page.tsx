import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/hero/HeroScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width:'100vw', height:'100vh', background:'#000010',
      display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div style={{
        width:3, height:3, borderRadius:'50%', background:'#7A3CFF',
        boxShadow:'0 0 60px 30px rgba(122,60,255,0.5)',
      }}/>
    </div>
  ),
});

export default function Home() {
  return <main><HeroScene /></main>;
}
