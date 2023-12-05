'use client';

import {ThemeProvider, Typography} from "@material-tailwind/react";
import {Main, MainSkeleton} from "@/app/components";
import 'react-loading-skeleton/dist/skeleton.css';
import {Suspense} from "react";

export default function Home() {

    return (
        <ThemeProvider>
            <div className="m-5 sm:m-10 border rounded-xl border-blue-gray-50 p-5 bg-[#f8fafc]">
                <div className="px-0 sm:px-4">
                    <Typography variant="h3">OPRF Hour Tracker</Typography>
                    <Typography variant="lead">A simple viewer for the OPRF hour tracker</Typography>
                    <Typography variant="small">
                        Note: There are multiple ways to earn hours towards OPRF ranks, but this (unofficial) page only
                        uses the flight tracker, so some results are not included. For accurate (but slightly outdated) numbers, see <a
                        href="https://opredflag.com/pages/rankshours" className="break-words text-blue-800 after:content-['_↗']">https://opredflag.com/pages/rankshours</a>.
                    </Typography>
                </div>
                <div className="mt-6 border-t border-blue-gray-50">
                    <dl className="divide-y divide-blue-gray-50">
                        <div className="px-0 py-3 sm:px-4 sm:py-6">
                            <Typography variant="h6" className="mb-4">
                                Tracking Data
                            </Typography>
                            <Suspense fallback={<MainSkeleton/>}>
                                <Main/>
                            </Suspense>
                        </div>
                    </dl>
                </div>
            </div>
        </ThemeProvider>
    )
}
