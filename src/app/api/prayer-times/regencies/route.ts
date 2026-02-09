import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';

  const API_BASE_URL = process.env.NEXT_PUBLIC_PRAYER_TIMES_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_PRAYER_TIMES_API_KEY;

  try {
    const response = await fetch(
      `${API_BASE_URL}/regencies?page=${page}`,
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
    console.error('Error fetching regencies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regencies' },
      { status: 500 }
    );
  }
}
