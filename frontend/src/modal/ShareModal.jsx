
import { toast } from "react-toastify";
import "../modalSytles/ShareModal.css";

const ShareModal = ({
  isOpen,
  onClose,
  video,
  videoId,
  
}) => {

  if (!isOpen) return null;

  const videoUrl = `${window.location.origin}/watch/${videoId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(videoUrl);
    // await increaseShareApi(videoId);
    // setShareCount(prev => prev + 1);
    toast.info("Link Copied");
  };

  const handleWhatsApp = async () => {
    // await increaseShareApi(videoId);
    // setShareCount(prev => prev + 1);

    window.open(
      `https://api.whatsapp.com/send?text=${videoUrl}`,
      "_blank"
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
    //   await increaseShareApi(videoId);
    //   setShareCount(prev => prev + 1);

      await navigator.share({
        title: video.title,
        url: videoUrl,
      });
    } else {
        toast.info("Native share not supported")
    //   alert("Native share not supported");
    }
  };

  return (
    <div className="share-overlay">
      <div className="share-box">

        <h3>Share this video</h3>

        <input type="text" value={videoUrl} readOnly />

        <div className="share-actions">
          <button onClick={handleCopy}>Copy Link</button>
          <button onClick={handleWhatsApp}>WhatsApp</button>
          <button onClick={handleNativeShare}>Native Share</button>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
};

export default ShareModal;