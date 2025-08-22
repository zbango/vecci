'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Building,
  CloudUpload,
  Eye,
  MoreVertical,
  Pencil,
  Search,
  Settings2,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input, InputWrapper } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  createUnit,
  getUnits,
  IUnit,
  type SearchParams,
} from '@/app/actions/units';
import { UnitDialog } from './components/unit-dialog';

// Initial values for new user
const initialValues: any = {
  id: '',
  isPublic: false,
  avatar: '',
  firstName: '',
  secondName: '',
  firstLastName: '',
  secondLastName: '',
  nationality: 'Ecuador',
  identificationType: 'Cédula de Identidad',
  identificationNumber: '',
  birthDate: new Date(),
  mobilePhone: '',
  homePhone: '',
  residentRole: '',
  adminRole: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  isTrashed: false,
  isProtected: false,
  createdByUserId: '',
  email: '',
};

export default function UnitsPage() {
  const [editingUnit, setEditingUnit] = useState<any | null>(null);
  const [viewingUnit, setViewingUnit] = useState<any | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<{
    units: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    units: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'type', desc: true },
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
                  {row.original.type}
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
        cell: ({ row }) => <span>{row.original.identification}</span>,
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
        cell: ({ row }) => <span>{row.original.headquarters.type}</span>,
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
        cell: ({ row }) => (
          <div className="flex justify-center w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-7 w-7" mode="icon" variant="ghost">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start">
                <DropdownMenuItem onClick={() => console.log(row.original)}>
                  <Eye />
                  Ver
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                  <Pencil />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
    data: data?.units || [],
    pageCount: Math.ceil((data?.total || 0) / pagination.pageSize),
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

  const handleSaveUnit = async (unitData: any) => {
    try {
      const form = new FormData();
      form.append('unit', JSON.stringify(unitData));
      await createUnit(form);
      // refresh data
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort:
          sorting[0]?.id === 'name'
            ? 'identification'
            : sorting[0]?.id || 'createdAt',
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };
      const result = await getUnits(params);
      setData(result as any);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving unit:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort:
          sorting[0]?.id === 'name'
            ? 'identification'
            : sorting[0]?.id || 'createdAt',
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };
      const result = await getUnits(params);
      setData(result as any);
    };
    startTransition(() => {
      fetchData();
    });
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, sorting]);

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
              <Building />
              Nueva Unidad
            </Button>
          </>
        }
      />
      <DataGrid table={table} recordCount={data?.total || 0}>
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
                <Input
                  type="text"
                  placeholder="Buscar Unidad"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
      <UnitDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingUnit(null);
            setViewingUnit(null);
          }
        }}
        initialValues={editingUnit || viewingUnit || initialValues}
        onSave={handleSaveUnit}
        isReadOnly={!!viewingUnit}
      />
    </div>
  );
}
