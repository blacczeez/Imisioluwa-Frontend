import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Imisioluwa — Authentic African Traditional & Spiritual Products';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #3B2318 0%, #5C3D2E 50%, #D4764E 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '0.05em',
            marginBottom: '20px',
            fontFamily: 'serif',
          }}
        >
          IMISIOLUWA
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '40px',
          }}
        >
          God&apos;s Inspiration
        </div>
        <div
          style={{
            width: 80,
            height: 2,
            backgroundColor: 'rgba(255,255,255,0.3)',
            marginBottom: '40px',
          }}
        />
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Shop Authentic African Traditional & Spiritual Products
        </div>
        <div
          style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.6)',
            marginTop: '16px',
          }}
        >
          Soaps • Oils • Herbal Remedies • Food & Spices
        </div>
      </div>
    ),
    { ...size }
  );
}
