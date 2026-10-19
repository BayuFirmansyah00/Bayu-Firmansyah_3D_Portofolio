import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  if (!props.link) {
    // Tanpa tautan, elemen ini hanya bingkai gambar. <a> tanpa href bukan
    // link sungguhan (tidak bisa difokus, tidak punya nama aksesibel).
    return (
      <div className="work-image">
        <div className="work-image-in">
          <img src={props.image} alt={props.alt} loading="lazy" />
        </div>
      </div>
    );
  }

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        data-cursor={"disable"}
      >
        <div className="work-link">
          <MdArrowOutward />
        </div>
        <img src={props.image} alt={props.alt} loading="lazy" />
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;
