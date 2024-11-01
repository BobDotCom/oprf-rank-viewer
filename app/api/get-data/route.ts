// import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
// import {parse} from "csv/sync";

export const runtime = 'edge'; // 'nodejs' is the default

const fetchData = async() => {
    const response = await fetch('http://mpserver.opredflag.com/hour_output.csv');
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
                "Cache-Control": "max-age=10, s-maxage=1, stale-while-revalidate=3600"
            }
        },

    );
}
