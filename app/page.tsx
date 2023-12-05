'use client';

import {ThemeProvider, Typography} from "@material-tailwind/react";
import {Main, MainSkeleton} from "@/app/components";
import 'react-loading-skeleton/dist/skeleton.css';
import {Suspense} from "react";

export default function Home() {

    return (
        <ThemeProvider>
            <div className="m-10 border rounded border-gray-100 p-5">
                <div className="px-4 sm:px-0">
                    <Typography variant="h3">OPRF Hour Tracker</Typography>
                    <Typography variant="lead">A simple viewer for the OPRF hour tracker</Typography>
                    <Typography variant="small">
                        Note: Some results may not be included. For accurate (but slightly outdated) numbers, see <a
                        href="https://opredflag.com/pages/rankshours">https://opredflag.com/pages/rankshours</a>
                    </Typography>
                </div>
                <div className="mt-6 border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                                <dt>
                                    <Typography variant="h6">
                                        Tracking Data
                                    </Typography>
                                </dt>
                                <dd className="mt-2 text-sm text-gray-900 sm:col-span-3 sm:mt-0">

                                </dd>
                                <div className="col-span-4">
                                        <Suspense fallback={<MainSkeleton />}>
                                            <Main/>
                                        </Suspense>
                                </div>
                            </div>
                        </div>
                    </dl>
                </div>
            </div>
        </ThemeProvider>
    )
}
