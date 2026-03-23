import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #3B2318 0%, #5C3D2E 50%, #D4764E 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: 'white',
            fontFamily: 'serif',
            letterSpacing: '0.02em',
          }}
        >
          I
        </div>
      </div>
    ),
    { ...size }
  );
}
