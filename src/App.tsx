import { Navbar } from '@components/Navbar/Navbar';
import ClientPortfolio from '@sections/ClientPortfolio/ClientPortfolio';

export default function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <ClientPortfolio />
      </main>
    </>
  );
}
