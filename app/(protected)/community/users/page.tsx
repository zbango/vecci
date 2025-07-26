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
  Column,
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
import { UserDialog } from './components/user-dialog';

interface IUser {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  units: number;
  resident: string;
  admin: string;
}

const users: IUser[] = [
  {
    id: '173594941-2',
    name: 'Tyler Hero',
    avatar: '/media/avatars/300-1.png',
    phone: '+593 930 12 4567',
    email: 'tyler.hero@gmail.com',
    units: 2,
    resident: 'Propietario',
    admin: 'Admin',
  },
  {
    id: '103594941-2',
    name: 'Esther Howard',
    avatar: '/media/avatars/300-2.png',
    phone: '+593 981 45 2379',
    email: 'esther.howard@gmail.com',
    units: 1,
    resident: 'Propietario',
    admin: 'Admin',
  },
  {
    id: '113594784-2',
    name: 'Jacob Jones',
    avatar: '/media/avatars/300-3.png',
    phone: '+593 930 12 4567',
    email: 'tyler.hero@gmail.com',
    units: 2,
    resident: 'Propietario',
    admin: 'N/A',
  },
  {
    id: '160033140-7',
    name: 'Cody Fisher',
    avatar: '/media/avatars/300-4.png',
    phone: '+593 991 78 6032',
    email: 'cody.fisher@gmail.com',
    units: 1,
    resident: 'Propietario',
    admin: 'N/A',
  },
  {
    id: '183519941-1',
    name: 'Leslie Alexander',
    avatar: '/media/avatars/300-5.png',
    phone: '+593 987 20 4581',
    email: 'leslie.alexander@gmail.com',
    units: 1,
    resident: 'Propietario',
    admin: 'N/A',
  },
  {
    id: '113594784-2',
    name: 'Robert Fox',
    avatar: '/media/avatars/300-6.png',
    phone: '+593 995 10 3344',
    email: 'robert.fox@gmail.com',
    units: 1,
    resident: 'Inquilino',
    admin: 'N/A',
  },
  {
    id: '87654321',
    name: 'Guy Hawkins',
    avatar: '/media/avatars/300-7.png',
    phone: '+593 972 66 8820',
    email: 'guy.hawkins@gmail.com',
    units: 2,
    resident: 'Propietario',
    admin: 'N/A',
  },
  {
    id: 'ZX654321',
    name: 'Theresa Webb',
    avatar: '/media/avatars/300-8.png',
    phone: '+593 989 77 1903',
    email: 'theresa.webb@gmail.com',
    units: 1,
    resident: 'Propietario',
    admin: 'N/A',
  },
  {
    id: '160033140-7',
    name: 'Marvin McKinney',
    avatar: '/media/avatars/300-9.png',
    phone: '+593 960 05 6612',
    email: 'marvin.mckenney@gmail.com',
    units: 1,
    resident: 'Inquilino',
    admin: 'N/A',
  },
  {
    id: '172534659-7',
    name: 'Ronald Richards',
    avatar: '/media/avatars/300-10.png',
    phone: '+593 976 84 9901',
    email: 'ronald.richards@gmail.com',
    units: 1,
    resident: 'Propietario',
    admin: 'N/A',
  },
];

export default function UsersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: true },
  ]);

  // const commonColumnProps = {
  //   enableSorting: true,
  //   enableHiding: false,
  // };

  const createCenteredHeader = (title: string) => {
    const CenteredHeader = ({ column }: { column: Column<IUser, unknown> }) => (
      <div className="flex justify-center w-full">
        <DataGridColumnHeader title={title} column={column} />
      </div>
    );
    CenteredHeader.displayName = 'CenteredHeader';
    return CenteredHeader;
  };

  const CenteredWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-center w-full">
      {children}
    </div>
  );

  const columns = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <div className="pl-13">
            <DataGridColumnHeader title="Usuario" column={column} />
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#F0F1F6] rounded-full flex items-center justify-center">
                <span className="text-base font-medium text-[#4B5675]">
                  {row.original.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[#111B37]">
                  {row.original.name}
                </span>
                <span className="text-sm font-normal text-[#4B5675]">
                  Cédula: {row.original.id}
                </span>
              </div>
            </div>
          );
        },
        size: 290,
        // ...commonColumnProps,
      },
      {
        accessorKey: 'contact',
        id: 'contact',
        header: ({ column }) => (
          <div className="pl-3">
            <DataGridColumnHeader title="Contacto" column={column} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[#111B37]">
              {row.original.phone}
            </span>
            <span className="text-sm font-normal text-[#4B5675]">
              {row.original.email}
            </span>
          </div>
        ),
        size: 290,
        // ...commonColumnProps,
      },
      {
        accessorKey: 'units',
        id: 'units',
        header: createCenteredHeader('Unidades'),
        cell: ({ row }) => (
          <CenteredWrapper>
            <span className="text-sm font-medium text-[#111B37]">
              {row.original.units}
            </span>
          </CenteredWrapper>
        ),
        size: 130,
        // ...commonColumnProps,
      },
      {
        accessorKey: 'resident',
        id: 'resident',
        header: createCenteredHeader('Residente'),
        cell: ({ row }) => {
          const isInquilino = row.original.resident === 'Inquilino';
          return (
            <CenteredWrapper>
              <div
                className={`px-1.5 py-1 rounded-full border w-24 text-center ${
                  isInquilino
                    ? 'bg-[#F0ECFF] border-[#4921EA]/20'
                    : 'bg-[#E1FCE9] border-[#0BC33F]/20'
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isInquilino ? 'text-[#4921EA]' : 'text-[#0BC33F]'
                  }`}
                >
                  {row.original.resident}
                </span>
              </div>
            </CenteredWrapper>
          );
        },
        size: 130,
        // ...commonColumnProps,
      },
      {
        accessorKey: 'admin',
        id: 'admin',
        header: createCenteredHeader('Administrador'),
        cell: ({ row }) => {
          const isAdmin = row.original.admin === 'Admin';
          return (
            <CenteredWrapper>
              <div
                className={`px-1.5 py-1 rounded-full border w-20 text-center ${
                  isAdmin
                    ? 'bg-[#E7F2FF] border-[#1379F0]/20'
                    : 'bg-transparent border-transparent'
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isAdmin ? 'text-[#1379F0]' : 'text-[#111B37]'
                  }`}
                >
                  {row.original.admin}
                </span>
              </div>
            </CenteredWrapper>
          );
        },
        size: 130,
        // ...commonColumnProps,
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        header: () => (
          <CenteredWrapper>
            <span className="text-sm font-normal text-[#4B5675]">Acciones</span>
          </CenteredWrapper>
        ),
        cell: () => (
          <CenteredWrapper>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <MoreVertical className="h-6 w-6 text-[#78829D]" />
            </Button>
          </CenteredWrapper>
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
    data: users,
    pageCount: Math.ceil((users?.length || 0) / pagination.pageSize),
    getRowId: (row: IUser) => row.id,
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
        title="Usuarios"
        description="Gestiona los usuarios de la comunidad, asigna roles y unidades"
        actions={
          <>
            <Button
              variant="secondary"
              size="md"
              className="bg-white text-[#4B5675] border border-[#E2E4ED] shadow-sm h-[34px] px-3 py-2"
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
              Nuevo Usuario
            </Button>
          </>
        }
      />

      <DataGrid table={table} recordCount={users?.length || 0}>
        <Card>
          <CardHeader className="py-3">
            <CardTitle>Mostrando 10 de 100 usuarios</CardTitle>
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
                <Input type="text" placeholder="Buscar Usuario" />
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

      <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}