"use client"

import { useState, FormEvent, useRef } from 'react';

export const VideoUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Видео успешно загружено:', result);
        
        // Создаем превью видео
        const video = videoRef.current;
        if (video) {
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () => {
            video.currentTime = 0;
          };
          video.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob(async (blob) => {
              if (blob) {
                const imageFormData = new FormData();
                imageFormData.append('image', blob, 'first_frame.jpg');
                
                const imageResponse = await fetch('/api/save-image', {
                  method: 'POST',
                  body: imageFormData,
                });
                
                if (imageResponse.ok) {
                  console.log('Первый кадр сохранен');
                } else {
                  console.error('Ошибка при сохранении первого кадра');
                }
              }
            }, 'image/jpeg');
          };
        }
      } else {
        console.error('Ошибка при загрузке видео');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit">Загрузить видео</button>
      <video ref={videoRef} style={{ display: 'none' }} />
    </form>
  );
}