import React, { useState, useRef } from "react";
import { useUploadSong } from "@hooks/useMusic";
import { handleApiError } from "@api/client";
import AppShell from "@components/layout/AppShell";
import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import { MdCloudUpload } from "react-icons/md";
import { FaMusic, FaEye, FaEyeSlash } from "react-icons/fa6";

const Upload = () => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    description: "",
    public: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadSong();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("audio/")) {
        setError("Please select an audio file");
        return;
      }
      setFile(selectedFile);
      setError(null);

      // Auto-fill title from filename if title is empty
      if (!formData.title && selectedFile.name) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setFormData((prev) => ({
          ...prev,
          title: nameWithoutExt,
        }));
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.type.startsWith("audio/")) {
        setError("Please select an audio file");
        return;
      }
      setFile(droppedFile);
      setError(null);

      // Auto-fill title from filename if title is empty
      if (!formData.title && droppedFile.name) {
        const nameWithoutExt = droppedFile.name.replace(/\.[^/.]+$/, "");
        setFormData((prev) => ({
          ...prev,
          title: nameWithoutExt,
        }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError("Please select an audio file");
      return;
    }

    if (!formData.title || !formData.artist) {
      setError("Title and artist are required");
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("audio", file);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("artist", formData.artist);

      if (formData.album) {
        uploadFormData.append("album", formData.album);
      }
      if (formData.genre) {
        uploadFormData.append("genre", formData.genre);
      }
      if (formData.description) {
        uploadFormData.append("description", formData.description);
      }

      uploadFormData.append("public", formData.public.toString());

      const response = await uploadMutation.mutateAsync(uploadFormData);

      setSuccess(`Successfully uploaded: ${response.song.title}`);
      setFormData({
        title: "",
        artist: "",
        album: "",
        genre: "",
        description: "",
        public: true,
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const genres = [
    "",
    "Pop",
    "Rock",
    "Hip Hop",
    "Jazz",
    "Classical",
    "Electronic",
    "R&B",
    "Country",
    "Folk",
    "Blues",
    "Reggae",
    "Punk",
    "Metal",
    "Alternative",
    "Indie",
    "Acoustic",
    "Other",
  ];

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <Card className="p-8 bg-surface">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Upload Music
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || uploadMutation.error) && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error || handleApiError(uploadMutation.error)}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Drag and drop area */}
            <div
              className={
                "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition " +
                (dragActive
                  ? "border-brand bg-gray-900/60"
                  : "border-border bg-background")
              }
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleBrowseClick}
            >
              <MdCloudUpload className="text-brand text-4xl mb-2" />
              <p className="text-primary font-semibold mb-1">
                {file ? file.name : "Drag & drop your audio file here"}
              </p>
              <p className="text-muted text-sm mb-2">
                or click to browse files
              </p>
              <p className="text-muted text-xs">
                Supports: MP3, WAV, FLAC, M4A, AAC
              </p>
              <input
                type="file"
                id="audio"
                ref={fileInputRef}
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Song Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Enter song title"
                />
              </div>

              {/* Artist */}
              <div>
                <label
                  htmlFor="artist"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Artist *
                </label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  required
                  value={formData.artist}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Enter artist name"
                />
              </div>

              {/* Album */}
              <div>
                <label
                  htmlFor="album"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Album
                </label>
                <input
                  type="text"
                  id="album"
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Enter album name"
                />
              </div>

              {/* Genre */}
              <div className="md:col-span-2">
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Genre
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                  style={{
                    colorScheme: "dark",
                  }}
                >
                  {genres.map((genre) => (
                    <option
                      key={genre}
                      value={genre}
                      className="bg-background text-primary hover:bg-gray-700"
                      style={{
                        backgroundColor: "#1a1a1a",
                        color: "#ffffff",
                      }}
                    >
                      {genre || "Select genre..."}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                  placeholder="Add a description for your song..."
                />
              </div>

              {/* Public Toggle */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="public"
                    className="block text-sm font-medium text-primary"
                  >
                    Visibility
                  </label>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm ${
                        !formData.public ? "text-primary" : "text-muted"
                      }`}
                    >
                      Private
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          public: !prev.public,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.public ? "bg-brand" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.public ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-sm ${
                        formData.public ? "text-primary" : "text-muted"
                      }`}
                    >
                      Public
                    </span>
                    {formData.public ? (
                      <FaEye className="text-green-500 ml-1" size={16} />
                    ) : (
                      <FaEyeSlash className="text-gray-500 ml-1" size={16} />
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted mt-1">
                  {formData.public
                    ? "Anyone can see and play this song"
                    : "Only you can see this song"}
                </p>
              </div>
            </div>

            <Button
              type="submit"
              loading={uploadMutation.isPending}
              className="w-full mt-6"
              disabled={uploadMutation.isPending}
              icon={<FaMusic />}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Song"}
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
};

export default Upload;
