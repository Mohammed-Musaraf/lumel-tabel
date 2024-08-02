import {
  Button,
  Input,
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { InventoryData } from "../types";
import {
  data,
  increaseAllocationPercentage,
  setAllocationValue,
} from "../util";

const Table = () => {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [tableData, setTableData] = React.useState<InventoryData[]>(data);

  const increaseAllocation = (row: Row<InventoryData>) => {
    setTableData((prev) =>
      increaseAllocationPercentage(prev, row, Number(inputValue))
    );
    setInputValue("");
  };

  const setAllocation = (row: Row<InventoryData>) => {
    setTableData((prev) => setAllocationValue(prev, row, Number(inputValue)));
    setInputValue("");
  };

  const inputColumn: ColumnDef<InventoryData> = React.useMemo(
    () => ({
      accessorKey: "input",
      header: () => "Input",
      footer: (props) => props.column.id,
      cell: ({ row, getValue }) => (
        <Input
          variant="outline"
          placeholder="Enter value"
          size="sm"
          type="number"
          onChange={(e) => setInputValue(e.target.value)}
        />
      ),
    }),
    [tableData]
  );

  const columns = React.useMemo<ColumnDef<InventoryData>[]>(
    () => [
      {
        accessorKey: "label",
        header: ({ table }) => (
          <>
            <button
              {...{
                onClick: table.getToggleAllRowsExpandedHandler(),
              }}
            >
              {table.getIsAllRowsExpanded() ? "👇" : "👉"}
            </button>{" "}
            Label
          </>
        ),
        cell: ({ row, getValue }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
          >
            <div>
              {row.getCanExpand() ? (
                <button
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? "👇" : "👉"}
                </button>
              ) : (
                "🔵"
              )}{" "}
              {getValue<boolean>()}
            </div>
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.value,
        id: "value",
        cell: (info) => info.getValue(),
        header: () => <span>Value</span>,
        footer: (props) => props.column.id,
      },
      inputColumn,
      {
        accessorKey: "allocation %",
        header: () => <span>Allocation %</span>,
        footer: (props) => props.column.id,
        cell: ({ row, getValue }) => (
          <Button
            colorScheme="blue"
            size="xs"
            onClick={() => increaseAllocation(row)}
          >
            Increase allocation
          </Button>
        ),
      },
      {
        accessorKey: "allocation val",
        header: "Allocation Val",
        footer: (props) => props.column.id,
        cell: ({ row, getValue }) => (
          <Button
            colorScheme="blue"
            size="xs"
            onClick={() => setAllocation(row)}
          >
            Set allocation
          </Button>
        ),
      },
      {
        accessorKey: "variance",
        header: "Variance %",
        footer: (props) => props.column.id,
        cell: ({ row, getValue }) => <div> {getValue<boolean>()}%</div>,
      },
    ],
    [inputValue]
  );
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.children as unknown as InventoryData[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // filterFromLeafRows: true,
    // maxLeafRowFilterDepth: 0,
    debugTable: true,
  });

  return (
    <VStack
      maxW="1080px"
      mx="auto"
      borderWidth="1px"
      borderRadius="4px"
      boxShadow="md"
      mt="4"
    >
      <ChakraTable>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </ChakraTable>
    </VStack>
  );
};

export default Table;
