interface Props {
  title: string;
  thumbnail: string;
  url: string;
}

export default function VideoCard({
  title,
  thumbnail,
  url,
}: Props) {
  return (
    <a
      href={url}
      target="_blank"
      className="
      border
      rounded
      overflow-hidden
      block
      "
    >
      <img
        src={thumbnail}
        alt={title}
      />

      <div className="p-3">
        {title}
      </div>
    </a>
  );
}