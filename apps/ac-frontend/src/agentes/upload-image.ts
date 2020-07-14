import { useState } from 'react';
import { environment } from '../environments/environment';

export function doUploadImage(fotoInicial?: string) {
    const [isUploading, setIsUploading] = useState(false);
    const [foto, setFoto] = useState<any | null>(fotoInicial ? { id: fotoInicial } : null);

    const handler = (file: File) => {
        setIsUploading(true);
        compress(file).then((newFile: File) => {
            return uploadFile(newFile);
        }).then((response) => {
            setIsUploading(false);
            setFoto(response[0]);
        });
    }

    return [foto, isUploading, handler, setFoto];

}

export function uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file, file.name)
    return fetch(`${environment.API}api/images`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
}

export function checkExtension(file: File) {
    return file.type.startsWith('image');
}

export function compress(file: File) {
    return new Promise((resolve, reject) => {
        const width = 350; // For scaling relative to width
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ev => {
            const img = new Image();
            img.src = (ev.target as any).result;
            (img.onload = () => {
                const elem = document.createElement('canvas'); // Use Angular's Renderer2 method
                const scaleFactor = width / img.width;
                elem.width = width;
                elem.height = img.height * scaleFactor;
                const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
                ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
                ctx.canvas.toBlob(
                    blob => {
                        return resolve(
                            new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            }),
                        );
                    },
                    'image/jpeg',
                    1,
                );
            }),
                (reader.onerror = error => reject(error));
        };

    })
}