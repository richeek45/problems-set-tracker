"use client";

import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { inRange } from "lodash";
import { read, utils } from "xlsx";
import { ChangeEvent, useState } from "react";
import { Difficulty, Status } from ".prisma/client";
import { ConfirmUploadDialog } from "./confirmUploadDialog";

interface FileInputEvent extends Event {
  target: HTMLInputElement & {
    files: FileList;
  };
}

interface ColType { 
  title: string,
  tags: string[], 
  url: string, 
  // address: string 
}

export interface RowType extends ColType {
  status: Status, 
  problem_number: number, 
  difficulty: Difficulty,
  attempts: number,
  favourites: boolean 
}

const fixedRowProperties = { 
  status: Status.TODO, 
  attempts: 0,
  favourites: false 
}

export function InputFile() {
  const [rows, setRows] = useState<RowType[]>([]);

  const fileReader = async (e: React.ChangeEvent extends FileInputEvent ? FileInputEvent: ChangeEvent<HTMLInputElement>) => {
    try{
      const workbook = read(await e.target.files![0].arrayBuffer(), { });
      console.log(workbook)

      let rows: RowType[] = [];

      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const ref = utils.decode_range(worksheet["!ref"]!);

        console.log(worksheet, ref);

        // For future enhancement - add upper and lower limits for rows ex. - [15, 350]

        for (let row = 5; row < ref.e.r; row++) {
          const cols: ColType = {} as ColType;
          for (let col = 0; col < ref.e.c; col++) {

            const address = utils.encode_cell({ r: row, c: col });
            const cell = worksheet[address];

            if (!cell) continue;

            if (!cell.l) {
              if (address.includes('A')) {
                cols.tags = [cell.v];
              }
              continue;
            }

            const url = worksheet[address].l;

            cols.title = cell.v;
            // cols.address = address;
            cols.url = url.Target;
          }

          if (Object.keys(cols).length) {
            rows.push({ problem_number: row - 4, ...fixedRowProperties, difficulty: Difficulty.EASY,  ...cols });
          }
        }
      })

      let problemByTags = new Map(); 
      rows.forEach(row => {
        const tags = row.tags[0];
        const tagNumber = problemByTags.get(tags);
        if (tagNumber) {
          problemByTags.set(tags, tagNumber + 1);
        } else {
          problemByTags.set(tags, 1);
        }
      })

      let tagCount = 0; // reset tagCount after every new tags encountered... 
      let currentTag = '';

      // add 40% of one tags = EASY, 40-80% MEDIUM, 80-100% HARD
      rows = rows.map(row => {
        const tags = row.tags[0];

        // tags has changed while iterating
        if (tags !== currentTag) {
          tagCount = 0;
        }

        currentTag = tags;
        const tagAmount = problemByTags.get(tags); // 36 -> Array

        if (inRange(tagCount, tagAmount * 0.4)) {
          tagCount ++;
          return { ...row, status: Status.TODO, difficulty: Difficulty.EASY }
        } 

        if (inRange(tagCount, tagAmount * 0.4, tagAmount * 0.8)) {
          tagCount ++;
          return { ...row, difficulty: Difficulty.MEDIUM }
        } 

        if (inRange(tagCount, tagAmount * 0.8, tagAmount)) {
          tagCount ++;
          return { ...row, difficulty: Difficulty.HARD }
        } 

        return { ...row, difficulty: Difficulty.EASY };
      })

      console.log(rows, problemByTags);
      // find way to import different file formats
      setRows(rows);

    } catch(error){
      console.log(error);
    }
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
      <ConfirmUploadDialog rows={rows} />
    </div>
  )
}