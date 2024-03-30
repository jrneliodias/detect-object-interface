import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Detection } from "@/App";

type DetectTableProps = {

    lastDetections: Detection[] | null
}

export default function DetectTable({ lastDetections }: DetectTableProps) {

    useEffect(() => {



    }, [])

    return (
        <div className="container">
            <Table>
                <TableHeader>
                    <TableRow>

                        <TableHead>Frame Number</TableHead>
                        <TableHead>Box Left</TableHead>
                        <TableHead>Box Top</TableHead>
                        <TableHead>Box Width</TableHead>
                        <TableHead>Box Height</TableHead>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Confidence</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>


                    {lastDetections && (lastDetections.map((detection) => (
                        <TableRow key={detection.id}>

                            <TableCell>{detection.frame_number}</TableCell>
                            <TableCell>{detection.box_left}</TableCell>
                            <TableCell>{detection.box_top}</TableCell>
                            <TableCell>{detection.box_width}</TableCell>
                            <TableCell>{detection.box_height}</TableCell>
                            <TableCell>{detection.class_name}</TableCell>
                            <TableCell>{detection.confidence}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
        </div>
    )
}
