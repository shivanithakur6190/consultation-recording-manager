import React from 'react';
import { getMediaType } from '../../utils/helpers';
import { Music } from 'lucide-react';

const MediaPlayer = ({ url, title }) => {
  const mediaType = getMediaType(url);

  if (mediaType === 'audio') {
    return (
      <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
          <Music size={32} className="text-white" />
        </div>
        <p className="text-sm font-medium text-text-dark dark:text-textLight text-center">
          {title}
        </p>
        <audio controls className="w-full" controlsList="nodownload">
          <source src={url} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-3 overflow-hidden">
      <video controls className="w-full rounded-xl max-h-[480px] bg-black" controlsList="nodownload">
        <source src={url} />
        Your browser does not support the video element.
      </video>
    </div>
  );
};

export default MediaPlayer;