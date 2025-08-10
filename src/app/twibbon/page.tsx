import TwibbonGenerator from '@/components/TwibbonGenerator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buat Twibbon',
  description: 'Sing paling elek olih hadiah',
};

const TwibbonPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          Gawe Twibbon bar kwe
        </h1>
        <p className="mt-3 text-xl text-gray-600 dark:text-gray-400">
          update status neng WA lur
        </p>
      </div>
      <TwibbonGenerator twibbonSrc="/images/twibbon3.PNG" />
    </div>
  );
};

export default TwibbonPage;
