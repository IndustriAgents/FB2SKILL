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
    <div className="field">
      <label>{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`dropzone${dragging ? " is-dragging" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip,application/zip"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        {file ? (
          <>
            <div className="dz-file">{file.name}</div>
            <div className="dz-meta">
              {(file.size / 1024 / 1024).toFixed(2)} MB · ready to upload
            </div>
          </>
        ) : (
          <>
            <div className="dz-hint">
              Drop your IEC 61499 project <code>.zip</code> here
            </div>
            <div className="dz-sub">or click to browse</div>
          </>
        )}
      </div>
    </div>
  );
}
