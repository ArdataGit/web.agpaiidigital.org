import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const regencyCode = searchParams.get('regency_code');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const page = searchParams.get('page') || '1';

  if (!regencyCode || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_PRAYER_TIMES_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_PRAYER_TIMES_API_KEY;

  try {
    const response = await fetch(
      `${API_BASE_URL}?regency_code=${regencyCode}&start_date=${startDate}&end_date=${endDate}&page=${page}`,
      {
        headers: {
          'accept': 'application/json',
          'x-api-co-id': API_KEY || '',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}
