'use client';

/**
 * Tavlo - QR Scanner Component
 * 
 * Floating Action Button that opens a full-screen QR scanner.
 * Scans table QR codes and redirects to the menu page.
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './QRScanner.module.css';

// QR Icon SVG
const QRIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3z" />
        <path d="M17 17h4v4h-4z" />
        <path d="M14 17v4" />
        <path d="M17 14h4" />
    </svg>
);

// Close Icon
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

interface QRScannerProps {
    onScan?: (tableId: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<HTMLDivElement>(null);
    const html5QrCodeRef = useRef<unknown>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen && scannerRef.current && !html5QrCodeRef.current) {
            initScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isOpen]);

    const initScanner = async () => {
        try {
            setError(null);
            setIsScanning(true);

            // Dynamic import to avoid SSR issues
            const { Html5Qrcode } = await import('html5-qrcode');

            const scanner = new Html5Qrcode('qr-reader');
            html5QrCodeRef.current = scanner;

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    handleScanSuccess(decodedText);
                },
                () => {
                    // Ignore scan failures (expected during scanning)
                }
            );
        } catch (err) {
            console.error('QR Scanner Error:', err);
            setError('Camera access denied or not available');
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                const scanner = html5QrCodeRef.current as { stop: () => Promise<void> };
                await scanner.stop();
            } catch {
                // Ignore stop errors
            }
            html5QrCodeRef.current = null;
        }
        setIsScanning(false);
    };

    const handleScanSuccess = (decodedText: string) => {
        // Extract tableId from QR code URL or direct value
        let tableId = decodedText;

        // If it's a URL, extract the tableId
        if (decodedText.includes('/menu/')) {
            const match = decodedText.match(/\/menu\/([^/?]+)/);
            if (match) {
                tableId = match[1];
            }
        }

        // Stop scanner and close modal
        stopScanner();
        setIsOpen(false);

        // Notify parent or redirect
        if (onScan) {
            onScan(tableId);
        } else {
            router.push(`/menu/${tableId}`);
        }
    };

    const handleClose = () => {
        stopScanner();
        setIsOpen(false);
        setError(null);
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={styles.fab}
                onClick={() => setIsOpen(true)}
                aria-label="Scan QR Code"
            >
                <QRIcon />
            </button>

            {/* Full-screen Scanner Modal */}
            {isOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h2>Scan Table QR Code</h2>
                        <button
                            className={styles.closeBtn}
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <div className={styles.scannerContainer}>
                        <div
                            id="qr-reader"
                            ref={scannerRef}
                            className={styles.scanner}
                        />

                        {!isScanning && !error && (
                            <div className={styles.loading}>
                                <div className={styles.spinner} />
                                <p>Initializing camera...</p>
                            </div>
                        )}

                        {error && (
                            <div className={styles.error}>
                                <p>{error}</p>
                                <button onClick={initScanner}>
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.instructions}>
                        <p>Point your camera at the QR code on the table</p>
                    </div>
                </div>
            )}
        </>
    );
}
