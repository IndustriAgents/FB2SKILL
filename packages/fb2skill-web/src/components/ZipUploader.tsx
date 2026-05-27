import { useRef, useState } from "react";

interface Props {
  onFile: (f: File) => void;
  file: File | null;
  label?: string;
}

export default function ZipUploader({ onFile, file, label = "Project zip" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition ${
          dragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-300 bg-white hover:border-slate-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip,application/zip"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        {file ? (
          <div className="text-sm">
            <div className="font-medium text-slate-900">{file.name}</div>
            <div className="text-slate-500 text-xs">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            Drop a .zip of your IEC 61499 project here, or click to browse
          </div>
        )}
      </div>
    </div>
  );
}
