import { Loader2 } from 'lucide-react';
import { createRoot } from 'react-dom/client';

export const openFullscreenLoader = (text: string) => {
  const loaderContainer = document.createElement('div');
  document.body.appendChild(loaderContainer);
  const loaderRoot = createRoot(loaderContainer);

  loaderRoot?.render(<FullScreenLoader text={text} />);

  return () => {
    loaderRoot?.unmount();
    document.body.removeChild(loaderContainer);
  };
};

export const FullScreenLoader = ({ text }: { text: string }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <p className="text-lg font-semibold">{text}</p>
    </div>
  </div>
);
