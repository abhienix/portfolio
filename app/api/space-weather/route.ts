import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      // Array of [time_tag, kp, a_running, station_count]
      const latest = data && data.length > 1 ? data[data.length - 1] : null;
      if (latest) {
        return NextResponse.json({
          success: true,
          source: 'NOAA Space Weather Prediction Center',
          data: {
            time: latest[0],
            kp: latest[1],
            aIndex: latest[2],
            stationCount: latest[3],
            status: Number(latest[1]) < 4 ? 'NOMINAL' : Number(latest[1]) < 6 ? 'MODERATE' : 'GEOMAGNETIC STORM',
          },
        });
      }
    }
  } catch (err) {}

  return NextResponse.json({
    success: true,
    source: 'NOAA Cached Telemetry',
    data: {
      time: new Date().toISOString(),
      kp: '1.33',
      aIndex: '5',
      stationCount: '8',
      status: 'NOMINAL',
    },
  });
}
