import {NextResponse} from 'next/server';

export const runtime = 'edge'; // 'nodejs' is the default

const fetchData = async() => {
    const response = await fetch('http://mpserver.opredflag.com/hour_output.csv', { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.text();
}

export async function GET() {
    const data = await fetchData();

    return NextResponse.json(
        {
            body: data,
        },
        {
            status: 200,
            headers: {
                "Cache-Control": "s-maxage=10, stale-while-revalidate=50"
            }
        },

    );
}
