'use client';

import {Card, Checkbox, IconButton, Input, ThemeProvider, Typography} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {parse} from 'csv/sync';
import {ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/outline";
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from "react-loading-skeleton";
import {useQueryState} from "next-usequerystate";

const Loading = () => {
    return <Typography className="text-center text-lg p-5">
        Loading...
    </Typography>;
};

const Paginator = ({count, page, setPage}: { count: number, page: number, setPage: (x: number) => void }) => {
    const [pageInput, setPageInput] = useState(page);

    const next = () => {
        if (page < count) {
            setPage(page + 1);
        }
    };

    const prev = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleSetPage = () => {
        if (pageInput > count)
            setPage(count);
        else if (pageInput < 1)
            setPage(1);
        else
            setPage(pageInput);
    }

    useEffect(() => {
        // Keep pageInput synced with active page
        setPageInput(page);
    }, [page])

    useEffect(() => {
        // When count changes (search input was changed), reset the page number
        setPage(1);
    }, [count, setPage]);


    return (
        <div className="flex items-center gap-8 m-auto p-2">
            <IconButton
                size="sm"
                variant="outlined"
                onClick={prev}
                disabled={page <= 1}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4"/>
            </IconButton>
            <Typography color="gray" className="font-normal text-center">
                Page <strong className="text-gray-900"><input
                type="number"
                value={pageInput}
                className="text-center w-12"
                onChange={e => setPageInput(Number(e.target.value))}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        handleSetPage();
                    }
                }}
                onBlur={handleSetPage}
                onFocus={handleSetPage}
            /></strong> of{" "}
                <strong className="text-gray-900">{Math.max(1, count)}</strong>
            </Typography>
            <IconButton
                size="sm"
                variant="outlined"
                onClick={next}
                disabled={page >= count}
            >
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4"/>
            </IconButton>
        </div>
    );
}

const formatTimeDelta = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    seconds = Math.floor(seconds);
    return `${hours}h ${minutes}m ${seconds}s`;
}


const Data = ({sortIndex, records, currentPage, itemsPerPage, sortReverse}: {
    sortIndex: number,
    records: Array<string | number>[] | null,
    currentPage: number,
    itemsPerPage: number,
    sortReverse: boolean
}) => {
    if (records !== null && records.length != 0) {
        if (sortReverse) {
            records.sort((a, b) => (a[sortIndex] > b[sortIndex]) ? -1 : ((b[sortIndex] > a[sortIndex]) ? 1 : 0));
        } else {
            records.sort((a, b) => (a[sortIndex] > b[sortIndex]) ? 1 : ((b[sortIndex] > a[sortIndex]) ? -1 : 0));
        }
        const sliceStart = (currentPage - 1) * itemsPerPage;
        records = records.slice(sliceStart, sliceStart + itemsPerPage);
        return (
            <>
                {records.map(([callsign, model, time, last_seen], index) => {
                    // const isLast = index === records.length - 1;
                    // const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                    const classes = "p-4 border-b border-blue-gray-50"
                    return (
                        <tr key={index}>
                            <td className={classes}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {callsign}
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {model}
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {formatTimeDelta(time as number)}
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {last_seen == 0 ? "Never" : (new Date(last_seen as number * 1000)).toLocaleString()}
                                </Typography>
                            </td>
                        </tr>
                    );
                })}
            </>
        )
    } else if (records == null) {
        // [...Array(itemsPerPage).keys()]
        // The checker doesn't like this approach. So for now, let's do something else.
        let x = [];
        for (let i = 0; i < itemsPerPage; i++) {
            x.push(i);
        }
        return (
            <>
                {x.map((index) => {
                    const classes = "p-4 border-b border-blue-gray-50"
                    return (
                        <tr key={index}>
                            <td className={classes}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    <Skeleton style={{width: `${25 + Math.floor(Math.random() * 75)}%`}}/>
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    <Skeleton style={{width: `${25 + Math.floor(Math.random() * 75)}%`}}/>
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    <Skeleton style={{width: `${25 + Math.floor(Math.random() * 75)}%`}}/>
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    <Skeleton style={{width: `${25 + Math.floor(Math.random() * 75)}%`}}/>
                                </Typography>
                            </td>
                        </tr>
                    );
                })}
            </>
        )
    }
}

export default function Home() {
    const [sortIndex, setSortIndex] = useState(0);
    const [records, setRecords] = useState<Array<string | number>[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useQueryState('q');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [hideZeroTime, setHideZeroTime] = useState(true);
    const [sortReverse, setSortReverse] = useState(false);

    const itemsPerPage = 25;

    useEffect(() => {
        fetch('http://mpserver.opredflag.com/hour_output.csv')
            .then(response => response.text())
            .then(data => {
                let recordsData = parse(data, {
                    trim: true,
                    skip_empty_lines: true,
                });
                recordsData = recordsData.map((record: Array<string | number>) => {
                    record[2] = Number(record[2]);
                    record[3] = Number(record[3]);
                    return record;
                });
                recordsData.shift();
                setRecords(recordsData);
            });
    }, []);

    useEffect(() => {
        // When sorting is changed, reset the page number
        setCurrentPage(1);
    }, [sortIndex, sortReverse]);

    const checkValue = (input: string, value: string) => {
        if (caseSensitive) {
            return input.includes(value);
        } else {
            return input.toLowerCase().includes(value.toLowerCase());
        }
    }
    const filteredRecords = records?.filter(record => {
        if (hideZeroTime && record[2] === 0) return false;
        record = [record[0], record[1], formatTimeDelta(record[2] as number), record[3] == 0 ? "Never" : (new Date(record[3] as number * 1000)).toLocaleString()];
        const terms = searchTerm?.split(",") || [];
        return terms.every(term => {
            term = term.trim()
            if (term.includes(":")) {
                const [category, ...extra] = term.split(":");
                const value = extra.join(":").trim();
                let column = -1;
                switch (category.trim()) {
                    case "callsign":
                        column = 0;
                        break;
                    case "model":
                        column = 1;
                        break;
                    case "time":
                        column = 2;
                        break;
                    case "last seen":
                        column = 3;
                        break;
                }
                if (column != -1) {
                    return checkValue(record[column].toString(), value);
                }
            } else if (record.some(field => {
                return checkValue(field.toString(), term);
            })) {
                return true;
            }
        })
    });

    const totalRecords = filteredRecords ? filteredRecords.length : 0;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <ThemeProvider>
            <div className="m-10 border rounded border-gray-100 p-5">
                <div className="px-4 sm:px-0">
                    <Typography variant="h3">OPRF Hour Tracker</Typography>
                    <Typography variant="lead">A simple viewer for the OPRF hour tracker</Typography>
                    <Typography>
                        Note: Some results may not be included. For accurate (but slightly outdated) numbers, see <a href="https://opredflag.com/pages/rankshours">https://opredflag.com/pages/rankshours</a>
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
                                    <div className=" flex flex-col md:flex-row pb-3">
                                        <div className="flex-grow">
                                            <Input
                                                label="Filter"
                                                placeholder={searchFocused ? "B-1, callsign: KODIAK" : undefined}
                                                value={searchTerm || undefined}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onFocus={() => setSearchFocused(true)}
                                                onBlur={() => setSearchFocused(false)}
                                            /></div>
                                        <div className="flex justify-center ">
                                            <Checkbox label="Case-sensitive" checked={caseSensitive}
                                                      onChange={e => setCaseSensitive(e.target.checked)}/>
                                            <Checkbox label="Hide Empty" checked={hideZeroTime}
                                                      onChange={e => setHideZeroTime(e.target.checked)}/>
                                        </div>
                                    </div>
                                    <Card className="w-full overflow-scroll">
                                        <table className="w-full min-w-max table-fixed text-left">
                                            <thead>
                                            <tr>
                                                {["Callsign", "Model", "Time", "Last seen"].map((head, index) => (
                                                    <th
                                                        key={head}
                                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                                        onClick={() => {
                                                            if (sortIndex == index)
                                                                setSortReverse(!sortReverse);
                                                            else
                                                                setSortReverse(index == 2 || index == 3);
                                                            setSortIndex(index);
                                                        }}
                                                    >
                                                        <div className="flex gap-1">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal leading-none opacity-70"
                                                            >
                                                                {head}
                                                            </Typography>
                                                            {(index == 2 || index == 3 ? !sortReverse : sortReverse) ?
                                                                <ChevronUpIcon
                                                                    className={`h-4 w-4 ${sortIndex === index ? "" : "opacity-0"}`}/> :
                                                                <ChevronDownIcon
                                                                    className={`h-4 w-4 ${sortIndex === index ? "" : "opacity-0"}`}/>
                                                            }
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <Data sortIndex={sortIndex} records={filteredRecords || null}
                                                  currentPage={currentPage}
                                                  itemsPerPage={itemsPerPage} sortReverse={sortReverse}/>
                                            </tbody>
                                        </table>
                                        {(filteredRecords != null && filteredRecords.length == 0) &&
                                            <div>
                                                <Typography className={"text-center w-full m-auto p-5"}>
                                                    No results
                                                </Typography>
                                            </div>
                                        }
                                        <Paginator count={totalPages} page={currentPage} setPage={setCurrentPage}/>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </dl>
                </div>
            </div>
        </ThemeProvider>
    )
}