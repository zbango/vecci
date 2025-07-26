'use client';

import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import {
  CloudUpload,
  MoreVertical,
  Search,
  Settings2,
  User2,
} from 'lucide-react';
import {
  ColumnDef,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Input, InputWrapper } from '@/components/ui/input';
import React, { useMemo, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { Button } from '@/components/ui/button';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { PageHeader } from '@/components/ui/page-header';
import { UnitDialog } from './components/unit-dialog';

interface IUnit {
  id: string;
  type: string;
  code: string;
  area: number;
  headquarter: string;
  reference: string;
}

const units: IUnit[] = [
  {
    id: '173594941-2',
    type: 'Departamento',
    code: '101',
    area: 80,
    headquarter: 'Sede Principal',
    reference: 'N/A',
  },
  {
    id: '103594941-2',
    type: 'Departamento',
    code: 'A102',
    area: 90,
    headquarter: 'Sede Principal',
    reference: 'Torre A',
  },
];

export default function UnitsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: true },
  ]);

  const columns = useMemo<ColumnDef<IUnit>[]>(
    () => [
      {
        accessorKey: 'type',
        id: 'type',
        header: ({ column }) => (
          <DataGridColumnHeader title="Tipo" column={column} />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-base font-medium">
                  {row.original.type
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[#111B37]">
                  {row.original.code}
                </span>
              </div>
            </div>
          );
        },
        size: 290,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'code',
        id: 'code',
        header: ({ column }) => (
          <DataGridColumnHeader title="Nombre o código" column={column} />
        ),
        cell: ({ row }) => <span>{row.original.code}</span>,
        size: 290,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'area',
        id: 'area',
        header: ({ column }) => (
          <DataGridColumnHeader title="Metraje (m2)" column={column} />
        ),
        cell: ({ row }) => <span>{row.original.area}</span>,
        size: 130,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'headquarter',
        id: 'headquarter',
        header: ({ column }) => (
          <DataGridColumnHeader title="Sede" column={column} />
        ),
        cell: ({ row }) => <span>{row.original.headquarter}</span>,
        size: 130,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'reference',
        id: 'reference',
        header: ({ column }) => (
          <DataGridColumnHeader title="Referencia" column={column} />
        ),
        cell: ({ row }) => <span>{row.original.reference}</span>,
        size: 130,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        header: () => <span className="text-sm font-normal">Acciones</span>,
        cell: () => (
          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
            <MoreVertical className="h-6 w-6 text-[#78829D]" />
          </Button>
        ),
        size: 130,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: units,
    pageCount: Math.ceil((units?.length || 0) / pagination.pageSize),
    getRowId: (row: IUnit) => row.id,
    state: {
      pagination,
      sorting,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-8 px-5 py-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Unidades"
        description="Crea y gestiona las unidades inmobiliarias de tu comunidad"
        actions={
          <>
            <Button
              variant="secondary"
              size="md"
              className="bg-white border shadow-sm h-[34px] px-3 py-2"
            >
              <CloudUpload className="mr-1 h-4 w-4" />
              Carga masiva
            </Button>
            <Button
              variant="primary"
              size="md"
              className="h-[34px] px-3 py-2"
              onClick={() => setDialogOpen(true)}
            >
              <User2 className="mr-1 h-4 w-4" />
              Nuevo Unidad
            </Button>
          </>
        }
      />

      <DataGrid table={table} recordCount={units?.length || 0}>
        <Card>
          <CardHeader className="py-3">
            <CardTitle>Mostrando 10 de 100 unidades</CardTitle>
            <CardToolbar>
              <InputWrapper>
                <Button
                  size="sm"
                  variant="dim"
                  mode="icon"
                  className="size-5 -ms-0.5"
                >
                  <Search />
                </Button>
                <Input type="text" placeholder="Buscar Unidad" />
              </InputWrapper>
              <DataGridColumnVisibility
                table={table}
                trigger={
                  <Button variant="outline" size="sm">
                    <Settings2 />
                    Filtros
                  </Button>
                }
              />
            </CardToolbar>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>

      <UnitDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
