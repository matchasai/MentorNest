
const YouTubePlayerSimple = ({ videoUrl, title }) => {
  // Extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  
  if (!videoId) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">Invalid YouTube URL</div>
        <div className="text-sm text-gray-500">Please provide a valid YouTube video URL</div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1&iv_load_policy=3`;

  return (
    <div className="relative group bg-black rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-96 rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubePlayerSimple;
