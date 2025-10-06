'use client';

import Layout from '@/app/components/Layout';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { useEffect } from 'react';

export default function InvoiceUploadPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);


  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file =>
      file.type === 'application/pdf' ||
      file.type.startsWith('image/')
    );

    setUploadedFiles(prev => [...prev, ...validFiles]);

    // Simulate upload progress
    validFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">請求書アップロード</h1>
          <p className="text-sm text-gray-600 mt-1">請求書をアップロードしてOCR処理を開始します</p>
        </div>

        {/* アップロードエリア */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ファイルアップロード</h2>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="text-4xl text-gray-400">📁</div>
              <div>
                <p className="text-gray-700">ファイルをドラッグ&ドロップ</p>
                <p className="text-sm text-gray-500 mt-1">または</p>
              </div>
              <button
                onClick={() => router.push('/invoices/check')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ファイルを選択
              </button>
              <p className="text-xs text-gray-500">対応形式: PDF, JPEG, PNG (最大10MB/ファイル)</p>
            </div>
          </div>

          {/* アップロードファイルリスト */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">アップロード中のファイル</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                        <div className="w-32">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress[file.name]}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {uploadProgress[file.name] === 100 && (
                        <span className="text-green-600">✓</span>
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setUploadedFiles([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  クリア
                </button>
                <button
                  onClick={() => router.push('/invoices/check')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  OCR処理開始
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}