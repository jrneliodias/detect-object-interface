import { useEffect, useState } from "react";
import { Payment, columns } from "./ui/table/columns"
import { DataTable } from "./ui/table/data-table"

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        // ...
    ]
}

export default function DetectTable() {
    const [data, setData] = useState<Payment[]>([]);

    useEffect(() => {
        async function fetchData() {
            const fetchedData = await getData()
            setData(fetchedData)

        }

        fetchData()
    }, [])

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
