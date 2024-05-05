"use client";

import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

// import { read, utils } from "xlsx";
import { ChangeEvent } from "react";

interface FileInputEvent extends Event {
  target: HTMLInputElement & {
    files: FileList;
  };
}

interface ColType { 
  title: string,
  tag: string, 
  link: string, 
  address: string 
}

interface RowType extends ColType {
  worksheet: string,
  problem_number: number,
}

export function InputFile() {

  const fileReader = async (e: React.ChangeEvent extends FileInputEvent ? FileInputEvent: ChangeEvent<HTMLInputElement>) => {
    // try{
    //   const workbook = read(await e.target.files![0].arrayBuffer(), { });
    //   console.log(workbook)

    //   const rows: RowType[] = [];

    //   workbook.SheetNames.forEach(sheetName => {
    //     const worksheet = workbook.Sheets[sheetName];
    //     const ref = utils.decode_range(worksheet["!ref"]!);

    //     console.log(worksheet, ref);

    //     // For future enhancement - add upper and lower limits for rows ex. - [15, 350]

    //     for (let row = 5; row < ref.e.r; row++) {
    //       const cols: ColType = {} as ColType;
    //       for (let col = 0; col < ref.e.c; col++) {

    //         const address = utils.encode_cell({ r: row, c: col });
    //         const cell = worksheet[address];

    //         if (!cell) continue;

    //         if (!cell.l) {
    //           if (address.includes('A')) {
    //             cols.tag = cell.v;
    //           }
    //           continue;
    //         }

    //         const link = worksheet[address].l;

    //         cols.title = cell.v;
    //         cols.address = address;
    //         cols.link = link.Target;
    //       }

    //       rows.push({worksheet: sheetName, problem_number: row - 5,  ...cols });
    //     }
    //   })

    //   console.log(rows);

    //   /// run the query command for saving to the database ......

    // } catch(error){
    //   console.log(error);
    // }
  } 

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="document">Import Problem Sheet</Label>
      <Input 
        id="document" 
        type="file"
        onChange={(e) => fileReader(e)}
        accept=".ods, .csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
      />
    </div>
  )
}