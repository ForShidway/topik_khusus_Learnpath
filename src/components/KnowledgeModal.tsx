"use client";

interface Props {
  topic: string;
  open: boolean;
  onClose: () => void;
  onContinue: (level: string) => void;
}

export default function KnowledgeModal({
  topic,
  open,
  onClose,
  onContinue,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
      fixed inset-0
      bg-black/50
      flex
      items-center
      justify-center
      "
    >
      <div
        className="
        bg-white
        rounded-xl
        p-6
        w-[400px]
        "
      >
        <h2 className="text-xl font-bold mb-4">
          {topic}
        </h2>

        <p className="mb-4">
          Apakah Anda sudah memiliki
          pengetahuan tentang topik ini?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() =>
              onContinue("beginner")
            }
            className="border rounded p-2"
          >
            Belum Pernah Belajar
          </button>

          <button
            onClick={() =>
              onContinue("intermediate")
            }
            className="border rounded p-2"
          >
            Sedikit Mengetahui
          </button>

          <button
            onClick={() =>
              onContinue("advanced")
            }
            className="border rounded p-2"
          >
            Sudah Cukup Paham
          </button>
        </div>

        <button
          onClick={onClose}
          className="
          mt-4
          text-red-500
          "
        >
          Tutup
        </button>
      </div>
    </div>
  );
}