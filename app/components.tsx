import {Suspense, useEffect, useState} from "react";
import {Card, Checkbox, IconButton, Input, Typography} from "@material-tailwind/react";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
// import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";
import {useQueryState} from "next-usequerystate";
import {parse} from "csv/sync";

export const formatTimeDelta = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    seconds = Math.floor(seconds);
    return `${hours}h ${minutes}m ${seconds}s`;
}

export const Paginator = ({count, page, setPage}: { count: number, page: number, setPage: (x: number) => void }) => {
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

export const DataSkeleton = ({itemsPerPage}: { itemsPerPage: number }) => {
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

export const Data = ({sortIndex, records, currentPage, itemsPerPage, sortReverse, fetchError}: {
    sortIndex: number,
    records: Array<string | number>[] | null,
    currentPage: number,
    itemsPerPage: number,
    sortReverse: boolean,
    fetchError: boolean
}) => {
    if (!fetchError && records !== null && records.length != 0) {
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
    } else if (!fetchError && records == null) {
        return <DataSkeleton itemsPerPage={itemsPerPage}/>;
    }
}

export const MainSkeleton = () => {
    const itemsPerPage = 25;

    return (
        <Card className="w-full overflow-scroll">
            <div className="bg-blue-gray-50 flex flex-col md:flex-row px-4 pt-4">
                <div className="flex-grow">
                    {/*<Skeleton containerClassName="flex-1" height={40}/>*/}
                    <Input
                        label="Filter"
                    />
                </div>
                <div className="flex justify-center">
                    <Checkbox label="Case-sensitive" disabled/>
                    <Checkbox label="Hide empty" disabled checked/>
                    {/*<Skeleton containerClassName="w-[155px] flex-1 p-3 pr-0" height={20}/>*/}
                    {/*<Skeleton containerClassName="w-[130px] flex-1 p-3 pr-0" height={20}/>*/}
                </div>
            </div>
            <table className="w-full min-w-max table-fixed text-left">
                <thead>

                <tr>
                    <th className="border-b bg-blue-gray-50 border-blue-gray-100 p-4">
                        <div className="flex gap-1">
                            {/*<Skeleton containerClassName="flex-1"*/}
                            {/*          style={{width: `${25 + Math.floor(Math.random() * 75)}%`}}/>*/}
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Callsign
                            </Typography>
                            <ChevronDownIcon className="h-4 w-4"/>
                        </div>
                    </th>
                    <th className="border-b bg-blue-gray-50 border-blue-gray-100 p-4">
                        <div className="flex gap-1">
                            {/*<Skeleton containerClassName="flex-1"*/}
                            {/*          style={{width: `${25 + Math.floor(Math.random() * 75)}%`}}/>*/}
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Model
                            </Typography>
                        </div>
                    </th>
                    <th className="border-b bg-blue-gray-50 border-blue-gray-100 p-4">
                        <div className="flex gap-1">
                            {/*<Skeleton containerClassName="flex-1"*/}
                            {/*          style={{width: `${25 + Math.floor(Math.random() * 75)}%`}}/>*/}
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Time
                            </Typography>
                        </div>
                    </th>
                    <th className="border-b bg-blue-gray-50 border-blue-gray-100 p-4">
                        <div className="flex gap-1">
                            {/*<Skeleton containerClassName="flex-1"*/}
                            {/*          style={{width: `${25 + Math.floor(Math.random() * 75)}%`}}/>*/}
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                Last seen
                            </Typography>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                <DataSkeleton itemsPerPage={itemsPerPage}/>
                </tbody>
            </table>
            {/*<Paginator count={totalPages} page={currentPage} setPage={setCurrentPage}/>*/}
        </Card>
    );
}

export const Main = () => {
    const [sortIndex, setSortIndex] = useState(0);
    const [records, setRecords] = useState<Array<string | number>[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useQueryState('q');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [hideZeroTime, setHideZeroTime] = useState(true);
    const [sortReverse, setSortReverse] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    const itemsPerPage = 25;

    useEffect(() => {
        fetch('http://mpserver.opredflag.com/hour_output.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text();
            })
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
            })
            .catch(error => {
                console.error(error);
                setFetchError(true);
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
        <Card className="w-full overflow-hidden">
            <div className="bg-blue-gray-50 flex flex-col md:flex-row px-4 pt-4">
                <div className="flex-grow">
                    <Input
                        label="Filter"
                        placeholder={searchFocused ? "B-1, callsign: KODIAK" : undefined}
                        value={searchTerm || undefined}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    /></div>
                <div className="flex justify-center">
                    <Checkbox label="Case-sensitive" checked={caseSensitive}
                              onChange={e => setCaseSensitive(e.target.checked)}/>
                    <Checkbox label="Hide Empty" checked={hideZeroTime}
                              onChange={e => setHideZeroTime(e.target.checked)}/>
                </div>
            </div>
            <div className="overflow-x-scroll sm:overflow-x-auto">
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
                    <Suspense fallback={<DataSkeleton itemsPerPage={itemsPerPage}/>}>
                        <Data
                            sortIndex={sortIndex}
                            records={filteredRecords || null}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            sortReverse={sortReverse}
                            fetchError={fetchError}
                        />
                    </Suspense>
                    </tbody>
                </table>
            </div>
            {(!fetchError && filteredRecords != null && filteredRecords.length == 0) &&
                <div className="flex justify-center items-center p-5 border-b border-blue-gray-100">
                    <MagnifyingGlassIcon className="h-7 w-7"/>
                    <Typography className="text-center pl-2">
                        No results
                    </Typography>
                </div>
            }
            {fetchError &&
                <div className="flex justify-center items-center p-5 border-b border-blue-gray-100">
                    <ExclamationTriangleIcon className="h-7 w-7"/>
                    <Typography className="text-center pl-2">
                        Error occurred while fetching data
                    </Typography>
                </div>
            }
            <Paginator count={totalPages} page={currentPage} setPage={setCurrentPage}/>
        </Card>
    );
}
