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
      rel="noopener noreferrer"
      className="
      block
      border
      rounded-lg
      overflow-hidden
      hover:shadow-lg
      transition
      bg-white
      "
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full"
      />

      <div className="p-3">
        <p className="font-medium">
          {title}
        </p>
      </div>
    </a>
  );
}