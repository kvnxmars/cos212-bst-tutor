export default function VideoEmbed({ videoId, title }) {
  return (
    <div className="video-embed-frame">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?cc_load_policy=1&cc_lang_pref=en`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}